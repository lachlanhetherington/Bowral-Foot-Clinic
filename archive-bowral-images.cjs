const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.BOWRAL_PLAYWRIGHT);

const site = 'https://thebowralfootclinic.com.au';
const hostname = new URL(site).hostname;
const archive = path.resolve(__dirname, '../Incoming/Bowral image archive');
const inventory = new Map();

function xmlLinks(xml, tag) {
  return [...xml.matchAll(new RegExp('<'+tag+'>([^<]+)</'+tag+'>','g'))]
    .map(match=>match[1].trim().replaceAll('&amp;','&'));
}

function addImage(value, page, foundBy) {
  let url;
  try { url = new URL(value, page); } catch { return; }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  let pathname = url.pathname;
  if (/^i[0-9]+\.wp\.com$/.test(url.hostname) && pathname.startsWith('/'+hostname+'/')) {
    pathname = pathname.slice(hostname.length+1);
  } else if (url.hostname !== hostname) return;
  if (!/^\/wp-content\/uploads\/.+\.(png|webp|jpe?g|avif|gif|svg|ico)$/i.test(pathname)) return;

  const canonical = pathname.replace(/-\d+x\d+(?=\.[^.]+$)/i,'');
  if (!inventory.has(canonical)) inventory.set(canonical, {original:site+canonical, routes:new Set(), foundBy:new Set(), candidates:new Set()});
  const entry = inventory.get(canonical);
  entry.routes.add(new URL(page).pathname);
  entry.foundBy.add(foundBy);
  entry.candidates.add(url.href);
}

async function readSitemaps() {
  const response = await fetch(site+'/sitemap_index.xml');
  if (!response.ok) throw Error('Could not open the Bowral sitemap index.');
  const indexes = xmlLinks(await response.text(),'loc').filter(link=>new URL(link).origin===site);
  const pages = new Set();
  for (const index of indexes) {
    const child = await fetch(index);
    if (!child.ok) throw Error('Could not open '+index);
    const xml = await child.text();
    xmlLinks(xml,'loc').filter(link=>new URL(link).origin===site).forEach(link=>pages.add(link));
    for (const entry of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const [page] = xmlLinks(entry[1],'loc');
      if (page) xmlLinks(entry[1],'image:loc').forEach(image=>addImage(image,page,'sitemap'));
    }
  }
  return [...pages];
}

async function renderedAssets(page, url) {
  const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  if (!response?.ok()) throw Error('HTTP '+response?.status());
  return page.evaluate(() => {
    const found = [];
    for (const node of document.querySelectorAll('img, source')) {
      for (const attribute of ['src','data-src','data-lazy-src','data-original','data-bg']) {
        if (node.getAttribute(attribute)) found.push([node.getAttribute(attribute),'image']);
      }
      if (node.currentSrc) found.push([node.currentSrc,'image']);
      for (const attribute of ['srcset','data-srcset','data-lazy-srcset']) {
        const sources = node.getAttribute(attribute);
        if (sources) sources.split(/\s*,\s*(?=https?:|\/)/).forEach(src=>found.push([src.trim().split(/\s+/)[0],'responsive image']));
      }
    }
    for (const node of document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], meta[property="og:image"], meta[name="twitter:image"]')) {
      found.push([node.href || node.content,'branding metadata']);
    }
    for (const node of document.querySelectorAll('body, body *')) {
      for (const pseudo of [null,'::before','::after']) {
        const css = getComputedStyle(node,pseudo);
        for (const value of [css.backgroundImage, css.content]) {
          for (const [,url] of value.matchAll(/url\(["']?([^"')]+)["']?\)/g)) found.push([url,'background']);
        }
      }
    }
    return found;
  });
}

async function saveImage(entry) {
  const filename = new URL(entry.original).pathname.split('/').slice(3).join('/');
  const destination = path.join(archive,filename);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  const sources = [entry.original,...entry.candidates];
  for (const source of new Set(sources)) {
    try {
      const response = await fetch(source,{signal:AbortSignal.timeout(25000)});
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) continue;
      const data = Buffer.from(await response.arrayBuffer());
      if (!data.length) continue;
      await fs.writeFile(destination,data);
      return {file:filename, original:entry.original, downloadedFrom:source, bytes:data.length, routes:[...entry.routes].sort(), foundBy:[...entry.foundBy].sort()};
    } catch (error) {
      if (!['TypeError','TimeoutError'].includes(error.name)) throw error;
    }
  }
  throw Error('Could not download '+entry.original);
}

async function main() {
  const pages = await readSitemaps();
  const pending = pages.flatMap(url=>[1440,390].map(width=>({url,width})));
  const failures = [];
  const browser = await chromium.launch({channel:'chrome'});
  try {
    await Promise.all(Array.from({length:4},async()=>{
      const page = await browser.newPage();
      while (pending.length) {
        const {url,width} = pending.shift();
        try {
          await page.setViewportSize({width,height:900});
          const entries = await renderedAssets(page,url);
          entries.forEach(([image,reason])=>addImage(image,url,reason));
        } catch (error) { failures.push({url,width,error:error.message}); }
      }
    }));
  } finally { await browser.close(); }
  const rows = await Promise.all([...inventory.values()].map(saveImage));
  const manifest = {site, pages:pages.length, viewports:[1440,390], failures, assets:rows.sort((a,b)=>a.file.localeCompare(b.file))};
  await fs.writeFile(path.join(archive,'inventory.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({pages:manifest.pages, count:rows.length, bytes:rows.reduce((sum,row)=>sum+row.bytes,0), failures}));
  rows.forEach(row=>console.log(row.file,row.bytes,row.routes.length));
}

main().catch(error=>{console.error(error);process.exitCode=1;});
