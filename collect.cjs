const fs = require('node:fs/promises');
const { chromium } = require(process.env.BOWRAL_PLAYWRIGHT);

const groups = {
  general: ['','about','our-team','book-online'],
  services: ['biomechanics','childrens-podiatry','custom-orthotics','dry-needling','foot-mobilisations','general-foot-care','neural-therapy','shockwave-therapy','shockwave-therapy-2','sports-podiatry','strapping'],
  conditions: ['childrens-foot-problems','diabetic-foot-care','foot-ankle-injuries','heel-pain','knee-hip-back-pain','toenail-problems'],
  locations: ['podiatrist-southern-highlands','podiatrists-moss-vale','podiatrists-wollondilly']
};

async function collect(page, url) {
  const response = await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 45000});
  if (!response.ok()) throw new Error(url + ': ' + response.status());
  return page.evaluate(() => {
    const root = document.querySelector('[data-elementor-type="wp-page"], main, article') || document.body;
    const widgets = [...root.querySelectorAll('.elementor-widget')].filter(el => !el.parentElement.closest('.elementor-widget') || el.closest('details'));
    const media = el => [...el.querySelectorAll('img')].map(i => ({url:i.currentSrc || i.src, alt:i.alt})).filter(i => /^https?:/.test(i.url));
    const blocks = widgets.filter(el => !el.closest('.ti-widget') && !el.parentElement.closest('.elementor-widget-n-accordion')).map(el => {
      const widget = el.firstElementChild?.classList.contains('elementor-widget-container') ? el.firstElementChild : el;
      return {type:el.dataset.widget_type?.split('.')[0], text:widget.textContent.trim(), html:widget.innerHTML, media:media(widget)};
    });
    const backgrounds = [...new Set([...root.querySelectorAll('.elementor-element')].flatMap(el => [getComputedStyle(el).backgroundImage, getComputedStyle(el,'::before').backgroundImage]).flatMap(s => [...s.matchAll(/url\("([^"]+)"\)/g)].map(m=>m[1])))];
    const schema = document.querySelector('.rank-math-schema')?.textContent;
    if (!blocks.length) blocks.push({type:'fallback',html:(root.querySelector('.entry-content')||root).innerHTML});
    return {pageTitle:document.title, description:document.querySelector('meta[name="description"]')?.content ?? null,
      canonical:document.querySelector('link[rel="canonical"]')?.href, schema, blocks, backgrounds,
      headings:[...root.querySelectorAll('h1,h2,h3')].map(e=>e.textContent.trim()),
      links:[...root.querySelectorAll('a[href]')].map(a=>({title:a.textContent.trim(),url:a.href})),
      images:media(document), font:getComputedStyle(root.querySelector('h1')||root).fontFamily,
      reviews:[...root.querySelectorAll('.ti-review-item')].map(el => ({name:el.querySelector('.ti-name')?.textContent.trim(),text:el.querySelector('.ti-review-content')?.textContent.trim()})),
      rating:root.querySelector('.ti-rating-text')?.textContent.trim()};
  });
}

async function main() {
  const browser = await chromium.launch({channel:'chrome'});
  try {
    const tasks = Object.entries(groups).flatMap(([group, slugs]) => slugs.map(slug=>({group,slug,url:'https://thebowralfootclinic.com.au/'+(slug?slug+'/':'')})));
    tasks.push(...['','team/','locations/podiatrist-bowral/','team/arega-sarkisian/','team/dr-elissa-all/','team/dr-mohemed-al-heyoury/','team/dr-yousef-najjarine/'].map(slug=>({group:'reference',slug,url:'https://dr-abbie.com/'+slug})));
    const results = [];
    await Promise.all(Array.from({length:5}, async () => {
      const page = await browser.newPage({viewport:{width:1440,height:1000}});
      while(tasks.length) {
        const task = tasks.shift();
        try { results.push({...task,...await collect(page,task.url)}); }
        catch (error) { results.push({...task,error:String(error)}); }
      }
    }));
    await fs.writeFile('../Incoming/source-audit.json', JSON.stringify(results,null,2));
    console.log(results.map(p=>[p.group,p.slug,p.blocks?.length,p.error||p.headings?.slice(0,2)].join(' ')).join('\n'));
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
