const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.BOWRAL_PLAYWRIGHT);
const source = require('../Incoming/source-audit.json');
const pages = source.filter(page => page.group !== 'reference');
const home = pages.find(page => !page.slug);
const teamPage = pages.find(page => page.slug === 'our-team');
const booking = 'https://book.nookal.com/bookings/book/9E0edcA3-35A8-9fFF-0C33-59ECb896F885/location/BVMNW';
const maps = 'https://www.google.com/maps/search/?api=1&query=The+Bowral+Foot+Clinic+2-4+Boolwey+Street+Bowral';
const phone = '<a href="tel:+61240052668">(02) 4005 2668</a>';
const assetCache = new Map();
const treatmentImages = new Map();
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const book = () => `<a class="button" href="${booking}">Book a Session <span aria-hidden="true">↗</span></a>`;
const titleFor = page => ({'our-team':'Meet the Team', 'biomechanics':'Biomechanics','podiatrist-southern-highlands':'Southern Highlands','podiatrists-moss-vale':'Moss Vale','podiatrists-wollondilly':'Wollondilly'}[page.slug] || page.headings[0]);
const group = name => pages.filter(page=>page.group===name).sort((a,b)=>titleFor(a).localeCompare(titleFor(b)));

async function asset(url) {
  if (!url) return '';
  const parts = new URL(url);
  const name = decodeURIComponent(parts.pathname.split('/').pop()).replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
  const file = 'assets/' + name;
  if (!assetCache.has(file)) assetCache.set(file,(async()=>{
    try { if ((await fs.stat(file)).size) return file; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const response = await fetch(url, {signal:AbortSignal.timeout(20000)});
    if (!response.ok || !/image|font|octet-stream/.test(response.headers.get('content-type')||'')) throw new Error('Could not download ' + url);
    await fs.writeFile(file, Buffer.from(await response.arrayBuffer()));
    return file;
  })());
  return assetCache.get(file);
}

function image(file, alt='', eager=false) {
  if (file==='assets/bowral-shopfront.webp') {
    return `<img src="${file}" srcset="assets/bowral-shopfront-mobile.webp 800w, ${file} 1600w" sizes="100vw" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  }
  return file ? `<img src="${file}" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">` : '';
}

function renderBlock(block) {
  if (block.type === 'image') return `<figure>${image(block.file,block.media[0]?.alt)}</figure>`;
  if (block.type === 'button') return book();
  if (block.type === 'shortcode') return block.reviews ? reviews() : '';
  return block.clean || '';
}

function reviews() {
  return `<section class="section tint reviews"><div class="wrap section-heading"><h2>What our patients say</h2><div class="review-panel"><span class="review-stars" aria-hidden="true">★★★★★</span><p>Find patient reviews and the clinic’s current rating on Google.</p><a class="text-link" href="${maps}">Read Google reviews <span aria-hidden="true">↗</span></a></div></div></section>`;
}

const additions = [
  {slug:'toenail-problems/#partial-nail-avulsion', label:'Partial nail avulsion (PNA)'},
  {slug:'toenail-problems/#onyfix', label:'Onyfix nail correction'},
  {slug:'general-foot-care/#wart-removal', label:'Wart removal'}
];
const href = slug => {
  const [route,hash] = slug.split('#');
  return '/' + (route ? route.replace(/\/$/,'') + '/' : '') + (hash ? '#'+hash : '');
};
const link = (slug,label) => `<a href="${href(slug)}">${esc(label)}</a>`;
function navGroup(label, links) {
  return `<details class="nav-group"><summary>${label}</summary><div class="dropdown">${links.join('')}</div></details>`;
}

function header(logo) {
  return `<a class="skip" href="#content">Skip to content</a>
  <header class="header"><div class="wrap header-inner">
  <a class="logo" href="/">${image(logo,'Bowral Foot Clinic home')}</a>
  <button class="menu-toggle" aria-expanded="false" aria-controls="navigation" hidden>Menu</button>
  <nav id="navigation" aria-label="Main navigation">
  ${navGroup('Services',[...group('services').map(p=>link(p.slug,titleFor(p))),...additions.map(p=>link(p.slug,p.label))])}
  ${navGroup('Conditions',group('conditions').map(p=>link(p.slug,titleFor(p))))}
  ${navGroup('Locations',[link('#visit','Bowral'),...group('locations').map(p=>link(p.slug,titleFor(p)))])}
  ${link('our-team','Meet the Team')}${link('about','About')}</nav>
  <div class="header-actions">${phone}${book()}</div></div></header>`;
}

function visit() {
  return `<div class="visit-data"><div><h3>Address</h3><address>Shop 3, 2-4 Boolwey St<br>Bowral NSW 2576</address><a class="text-link" href="${maps}">Get directions ↗</a></div>
  <div><h3>Opening hours</h3><dl><div><dt>Monday to Friday</dt><dd>8:30 am to 5:30 pm</dd></div><div><dt>Saturday</dt><dd>8:30 am to 12 pm</dd></div><div><dt>Sunday</dt><dd>Closed</dd></div></dl></div>
  <div><h3>Contact</h3>${phone}<br><a href="mailto:bowralfootclinic@gmail.com">bowralfootclinic@gmail.com</a></div></div>`;
}

function footer(logo) {
  return `<footer class="footer"><div class="wrap"><div class="footer-top"><a class="logo" href="/">${image(logo,'Bowral Foot Clinic home')}</a><nav class="footer-links" aria-label="Footer navigation">${link('our-team','Meet the Team')}${link('about','About')}${link('book-online','Book Online')}<a href="https://dr-abbie.com/">Dr. Abbie Clinics</a></nav>${book()}</div>
  ${visit()}<div class="footer-bottom"><small>© ${new Date().getFullYear()} The Bowral Foot Clinic</small></div></div></footer>`;
}

function practitioners(team, full=false) {
  const cards = team.map(person=>`<article class="person" id="${person.id}">
    ${image(person.file, person.name) || '<div class="initials" aria-hidden="true">AS</div>'}
    <div class="person-info"><h3>${esc(person.name)}</h3><p>${esc(person.role)}</p>
    ${full ? `<details><summary>Read bio</summary>${person.bio.join('')}</details>` : `<a class="text-link" href="/our-team/#${person.id}">View profile ↗</a>`}</div></article>`).join('');
  if (full) return `<div class="team-grid">${cards}</div>`;
  return `<div class="team-carousel" data-carousel><div class="team-track" data-track tabindex="0" aria-label="Browse practitioners">${cards}</div>${railButtons('practitioners')}</div>`;
}

function railButtons(label) {
  return `<div class="rail-controls"><button type="button" data-step="-1" aria-label="Previous ${label}">←</button><button type="button" data-step="1" aria-label="Next ${label}">→</button></div>`;
}

function treatmentRail() {
  const featured = ['biomechanics','custom-orthotics','shockwave-therapy','general-foot-care','sports-podiatry'];
  const tiles = [...featured.map(slug=>{
    const page=pages.find(p=>p.slug===slug);
    return {slug,label:titleFor(page),file:treatmentImages.get(slug) || page.blocks.find(b=>b.file)?.file};
  })];
  tiles.splice(3,0,...additions);
  return `<div class="treatments" data-carousel><div class="rail-heading"><h2>Our treatments</h2>${railButtons('treatments')}</div>
  <div class="rail" data-track tabindex="0" aria-label="Browse treatments">${tiles.map(tile=>`<a class="tile" href="${href(tile.slug)}">${image(tile.file)}<span>${esc(tile.label)}</span></a>`).join('')}</div></div>`;
}

function careCards(items, withImages=false) {
  return `<div class="care-grid${withImages?' care-grid-images':''}">${items.map(item=>{
    const title = item.label || titleFor(item);
    const media = withImages && (treatmentImages.get(item.slug) || item.blocks?.find(b=>b.file)?.file);
    return `<a class="care-card" href="${href(item.slug)}">${media ? image(media) : ''}<span class="care-card-body"><strong>${esc(title)}</strong><span class="text-link">Learn more <span aria-hidden="true">→</span></span></span></a>`;
  }).join('')}</div>`;
}

function homepage(hero,team) {
  const b=home.blocks;
  return `<section class="hero">${image(hero,'',true)}<div class="wrap hero-inner"><div class="hero-copy">
  <a class="rating" href="${maps}"><span aria-hidden="true">★★★★★</span> 5 stars on Google</a>
  <h1>Welcome to<br><strong>Bowral Foot Clinic</strong></h1>
  ${b[1].clean}<div class="actions">${book()}<a class="button secondary" href="#visit">Find our clinic</a></div></div>${treatmentRail()}</div></section>
  <section class="section"><div class="wrap"><div class="section-heading"><h2>Meet the Team</h2><p>${esc(b[14].text)}</p></div>${practitioners(team)}<div class="section-action"><a class="outline-button" href="/our-team/">Meet all practitioners →</a></div></div></section>
  ${reviews()}
  <section class="section"><div class="wrap"><div class="section-heading"><h2>Problems we treat</h2></div>${careCards(group('conditions'))}<details class="more-care"><summary>See more conditions</summary><div class="source-list">${b[22].clean}${b[23].clean}</div></details></div></section>
  <section class="section tint"><div class="wrap split"><div><h2>${esc(b[3].text)}</h2><p>${esc(b[4].text)}</p><a class="text-link" href="/about/">About the clinic ↗</a></div>${renderBlock(b[5])}</div></section>
  <section class="section tint services-section"><div class="wrap"><div class="section-heading"><h2>Range of services</h2><p>${esc(b[17].text)}</p></div>${careCards([...group('services'),...additions],true)}<details class="more-care"><summary>See our full range of care</summary><div class="source-list">${b[27].clean}${b[28].clean}</div></details></div></section>
  <section class="section"><div class="wrap faq"><h2>Before you book with us</h2><div>${b[30].clean}</div></div></section>
  <section class="booking-band"><div class="wrap"><h2>Book your next appointment</h2><p>Visit The Bowral Foot Clinic on Boolwey Street.</p>${book()}</div></section>
  <section class="section tint" id="visit"><div class="wrap"><h2>Visit us in Bowral</h2>${visit()}<div class="link-list">${group('locations').map(p=>link(p.slug,'Podiatrist near '+titleFor(p))).join('')}</div></div></section>
  <section class="section network"><div class="wrap"><div class="section-heading"><h2>Our clinic network</h2></div><div class="partners">${['https://www.customfoot.com.au/','https://ftspodiatry.com.au/','https://dr-abbie.com/'].map((url,i)=>`<a href="${url}">${image(b[42+i].file,b[45+i].text)}</a>`).join('')}</div></div></section>`;
}

function interior(page,hero,team) {
  const blocks = [...page.blocks];
  const title = page.slug==='our-team' ? 'Meet the Team' : page.headings[0];
  if (blocks[0].type==='heading') blocks.shift();
  const lead = blocks[0]?.type==='text-editor' ? blocks.shift().clean : '';
  const leadImage = blocks.findIndex(b=>b.type==='image' && b.file);
  const photo = leadImage!==-1 ? blocks.splice(leadImage,1)[0].file : hero;
  const banner = `<section class="page-hero"><div class="wrap split"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> ${esc(titleFor(page))}</nav><h1>${esc(title)}</h1>${lead}<div class="actions">${book()}</div></div>${image(photo,'',true)}</div></section>`;
  let content;
  if (page.slug==='our-team') content = `<section class="section"><div class="wrap"><p>${esc(home.blocks[4].text)}</p>${practitioners(team,true)}</div></section>`;
  else if (page.slug==='book-online') content = `<section class="section"><div class="wrap"><h2>Book online with Nookal</h2><p>Choose The Bowral Foot Clinic and select a practitioner and appointment time.</p>${book()}<p>For help booking, call ${phone}.</p></div></section>`;
  else if (page.slug==='about') content = `<section class="section"><article class="wrap prose"><h2>About the clinic</h2><p>${esc(home.blocks[4].text)}</p><a class="text-link" href="/our-team/">Meet the Team ↗</a></article></section>`;
  else {
    const extras = {'toenail-problems':[['partial-nail-avulsion','Partial nail avulsion (PNA)','Ask our podiatrists about this procedure for ingrown toenails.'],['onyfix','Onyfix nail correction','Ask at your appointment whether Onyfix nail correction is suitable for you.']],
      'general-foot-care':[['wart-removal','Wart removal','Book an appointment to discuss treatment options for plantar warts.']]};
    content = `<section class="section"><article class="wrap prose">${blocks.filter(b=>b.type!=='button').map(renderBlock).join('')}
      ${page.slug==='custom-orthotics'?'<p>Custom orthotics are prescribed in Bowral and made at the Kirrawee head office.</p>':''}
      ${(extras[page.slug]||[]).map(([id,label,copy])=>`<section id="${id}"><h2>${label}</h2><p>${copy}</p></section>`).join('')}</article></section>`;
  }
  return banner + content;
}

async function normalize(tab, page) {
  const payload = page.blocks.filter(b=>['heading','text-editor','icon-list','nested-accordion','fallback'].includes(b.type));
  const sanitized = await tab.evaluate(({payload,known,booking})=>payload.map(block=>{
    const wrapper=document.createElement('template');
    wrapper.innerHTML=block.html;
    const container=wrapper.content;
    container.querySelectorAll('script,style,iframe,object,embed,svg,button,form,.elementor-icon-list-icon').forEach(e=>e.remove());
    const safe = ['H1','H2','H3','H4','H5','H6','P','A','UL','OL','LI','STRONG','B','EM','I','BR','DETAILS','SUMMARY','BLOCKQUOTE','TABLE','THEAD','TBODY','TR','TH','TD','SUP','SUB'];
    for (const node of [...container.querySelectorAll('*')].reverse()) {
      if (!safe.includes(node.tagName)) { node.replaceWith(...node.childNodes); continue; }
      const target=node.getAttribute('href');
      for(const attr of [...node.attributes]) node.removeAttribute(attr.name);
      if (node.tagName==='A' && target) {
        try {
          const url=new URL(target,'https://thebowralfootclinic.com.au');
          if (/nookal\.com$/.test(url.hostname)||/\/book-online\/?$/.test(url.pathname)) node.href=booking;
          else if (url.hostname==='thebowralfootclinic.com.au' && url.pathname==='/team/') node.setAttribute('href','/our-team/');
          else if (/^(https?:|tel:|mailto:)$/.test(url.protocol)) node.setAttribute('href', url.hostname==='thebowralfootclinic.com.au' && known.includes(url.pathname) ? url.pathname+url.hash : url.href);
          else node.replaceWith(...node.childNodes);
        } catch {node.replaceWith(...node.childNodes);}
      }
      if (node.tagName==='H1') { const h2=document.createElement('h2'); h2.append(...node.childNodes); node.replaceWith(h2); }
    }
    return wrapper.innerHTML.replace(/Prospect Podiatry/gi,'The Bowral Foot Clinic').replace(/Our Location Accross NSW/gi,'Our locations across NSW')
      .replace(/Monday-Friday:\s*9:00am\s*[–-]\s*5:00pm<br>Weekend:\s*Closed/gi,'Monday to Friday: 8:30 am to 5:30 pm<br>Saturday: 8:30 am to 12 pm<br>Sunday: Closed')
      .replace(/(?:\(02\)|02)\s*4861\s*3123/g,'(02) 4005 2668')
      .replace(/[—–]/g,' - ').replace(/\u200b/g,'');
  }), {payload,known:pages.map(p=>p.slug?'/'+p.slug+'/':'/'),booking});
  payload.forEach((block,i)=>block.clean=sanitized[i]);
  await Promise.all(page.blocks.filter(b=>b.type==='image' && b.media[0]).map(async b=>{b.file=await asset(b.media[0].url);}));
  for (const b of page.blocks.filter(b=>b.type==='shortcode')) b.reviews=b.html.includes('ti-widget');
}

async function main() {
  if (pages.length!==24 || pages.some(p=>p.error || !p.blocks.length)) throw new Error('The 24-page audit is incomplete.');
  await fs.mkdir('assets',{recursive:true});
  const browser=await chromium.launch({channel:'chrome'});
  try {
    const tab=await browser.newPage();
    const logo=await asset(home.images.find(i=>i.alt==='Bowral Foot Clinic logo').url);
    const heroSource=await asset(home.backgrounds[0]);
    const hero='assets/bowral-shopfront.webp';
    for (const [file,width] of [[hero,1600],['assets/bowral-shopfront-mobile.webp',800]]) {
      try { await fs.access(file); }
      catch (error) {
        if (error.code!=='ENOENT') throw error;
        execFileSync('ffmpeg',['-v','error','-n','-i',heroSource,'-vf','scale='+width+':-2','-quality','79',file]);
      }
    }
    const reference=source.find(p=>p.group==='reference' && !p.slug);
    for (const [slug,filename] of [['biomechanics','svc-biomechanics.webp'],['custom-orthotics','svc-orthotics.webp'],['shockwave-therapy','svc-shockwave.webp']]) {
      treatmentImages.set(slug,await asset(reference.images.find(i=>i.url.endsWith('/'+filename))?.url));
    }
    for (const page of pages) await normalize(tab,page);
    const team=[];
    for (const id of ['arega-sarkisian','dr-elissa-all','dr-mohemed-al-heyoury','dr-yousef-najjarine']) {
      const profile=source.find(p=>p.slug==='team/'+id+'/');
      const start=profile.blocks.findIndex(b=>b.type==='heading'&&b.text.startsWith('Meet'));
      const end=profile.blocks.findIndex((b,i)=>i>start&&b.text==='Book');
      const portrait=profile.blocks.find(b=>b.type==='image'&&b.media[0]);
      const bio={blocks:profile.blocks.slice(start+1,end).filter(b=>b.type==='text-editor'||b.type==='heading')};
      await normalize(tab,bio);
      team.push({id,name:profile.headings[0],role:id==='arega-sarkisian'?'General treatment podiatrist (general foot care only)':'Podiatrist',file:id==='arega-sarkisian'?'':await asset(portrait?.media[0].url),bio:bio.blocks.map(renderBlock)});
    }
    for (const page of pages) {
      const body = page.slug ? interior(page,hero,team) : homepage(home.blocks[5].file,team);
      const base=page.slug?'../':'./';
      const document=`<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.pageTitle)}</title>
${page.description===null?'':`<meta name="description" content="${esc(page.description)}">`}
<link rel="canonical" href="${esc(page.canonical)}">
<link rel="icon" href="${base}${logo}">
<link rel="preload" href="${base}assets/poppins-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/poppins-semibold.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.classList.add('has-js');</script>
<link rel="stylesheet" href="${base}assets/site.css">
<script src="${base}assets/site.js" defer></script>
</head>
<body${page.slug?'':' class="home"'}>${header(logo)}<main id="content">${body}</main>${footer(logo)}</body>
</html>`.replace(/(?:src|srcset)="assets\/[^"]+"/g,attribute=>attribute.replaceAll('assets/',base+'assets/')).split('\n').map(line=>line.trimEnd()).join('\n')+'\n';
      if(page.slug) await fs.mkdir(page.slug,{recursive:true});
      await fs.writeFile(path.join(page.slug,'index.html'),document);
    }
    console.log('Generated '+pages.length+' static pages.');
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
