const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.BOWRAL_PLAYWRIGHT);
const { photography, care } = require('./interior-data.cjs');
const source = require('../Incoming/source-audit.json');
const pages = source.filter(page => page.group !== 'reference');
const home = pages.find(page => !page.slug);
const teamPage = pages.find(page => page.slug === 'our-team');
const booking = 'https://book.nookal.com/bookings/book/9E0edcA3-35A8-9fFF-0C33-59ECb896F885/location/BVMNW';
const maps = 'https://www.google.com/maps/search/?api=1&query=The+Bowral+Foot+Clinic+2-4+Boolwey+Street+Bowral';
const reviewsListing = 'https://maps.app.goo.gl/jzYV5WmTtV9CG5HYA';
const googleRating = '5.0';
const phoneNumber = '(02) 4005 2668';
const phoneUrl = 'tel:+61240052668';
const phone = `<a href="${phoneUrl}">${phoneNumber}</a>`;
const assetCache = new Map();
const treatmentImages = new Map();
const carouselImages = new Map();
const interiorImages = new Map();
const bowralPhotos = {
  kneeAssessment: 'DR.ABBIECLINICSHOOT-014-1.jpg',
  mohemed: 'DR.ABBIECLINICSHOOT-096.jpg',
  elissa: 'DR.ABBIECLINICSHOOT-108.jpg',
  biomechanics: 'DR.ABBIECLINICSHOOT-123-1.jpg',
  generalCare: 'DSC05041-scaled-1.jpg'
};
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
  return file ? `<img src="${file}" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">` : '';
}

function renderBlock(block) {
  if (block.type === 'image') return `<figure>${image(block.file,block.media[0]?.alt)}</figure>`;
  if (block.type === 'button') return book();
  if (block.type === 'shortcode') return block.reviews ? reviews() : '';
  return block.clean || '';
}

const featuredReviews = [
  {
    name: 'Fofe Vrettos',
    avatar: 'assets/reviewer-fofe-vrettos.png',
    quote: "Can't recommend highly enough. Honest, keeps to appointment times, great with kids and adults alike, very reasonably priced. Wouldn't go anywhere else.",
    reply: 'Hi Fofe, thank you so much for your wonderful feedback! We’re delighted to hear you value our honesty, punctuality, and care for both kids and adults. Your recommendation means a lot to us, and we’re grateful for your trust in our clinic.',
  },
  {
    name: 'Rachel Harman',
    avatar: 'assets/reviewer-rachel-harman.png',
    quote: 'Consistantly a great friendly and professional service.',
    reply: 'Hi Rachel, thank you for your lovely feedback! We’re so glad to hear you’ve consistently experienced friendly and professional care at our clinic. Your continued trust means a lot to us, and we look forward to seeing you again soon.',
  },
];

function reviews(id) {
  return `<section class="section tint reviews"${id ? ` id="${id}"` : ''}><div class="wrap">
    <div class="section-heading">
      <h2>Google reviews</h2>
      <div class="review-summary" role="img" aria-label="${googleRating} out of 5 on Google"><strong>${googleRating}</strong><span class="rating-stars" aria-hidden="true">★★★★★</span><img src="assets/google-wordmark.webp" alt="" width="78" height="27" decoding="async"></div>
      <p>Selected reviews from our Google Maps listing.</p>
    </div>
    <ul class="review-grid">${featuredReviews.map(({name, avatar, quote, reply})=>`
      <li class="review-card">
        <div class="review-byline"><span class="review-avatar">${image(avatar)}</span><div>
          <h3>${esc(name)}</h3>
          <span class="rating-stars" role="img" aria-label="5 out of 5 stars">★★★★★</span>
        </div></div>
        <blockquote><p>${esc(quote)}</p></blockquote>
        <details class="review-reply"><summary>Response from the owner</summary><p>${esc(reply)}</p></details>
      </li>`).join('')}
    </ul>
    <div class="section-action"><a class="outline-button" href="${reviewsListing}">View all reviews on Google <span aria-hidden="true">↗</span></a></div>
  </div></section>`;
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
const menuDescriptions = {
  'biomechanics':'Lower limb, gait and posture assessments',
  'custom-orthotics':'Orthotics prescribed for your feet',
  'childrens-podiatry':'Foot and lower limb care for children',
  'shockwave-therapy':'A treatment option for persistent pain',
  'dry-needling':'A technique used in soft tissue care',
  'foot-mobilisations':'Hands-on work for foot joint movement',
  'sports-podiatry':'Care for sports and overuse injuries',
  'general-foot-care':'Nails, corns, calluses and routine care',
  'strapping':'Support for feet and ankles',
  'neural-therapy':'Explore this injection therapy service',
  'shockwave-therapy-2':'Learn about prolotherapy at Bowral',
  'toenail-problems/#partial-nail-avulsion':'An option for ingrown toenails',
  'toenail-problems/#onyfix':'Nail correction treatment',
  'general-foot-care/#wart-removal':'Care for plantar warts',
  'childrens-foot-problems':'Flat feet, gait and growing pains',
  'diabetic-foot-care':'Foot checks and wound care',
  'foot-ankle-injuries':'Foot and ankle pain or injury',
  'heel-pain':'Plantar fasciitis and other causes',
  'knee-hip-back-pain':'Lower limb assessments for recurring pain',
  'toenail-problems':'Ingrown, fungal or injured nails',
  '#visit':'Shop 3, 2-4 Boolwey Street',
  'podiatrist-southern-highlands':'Podiatry for Southern Highlands residents',
  'podiatrists-moss-vale':'Podiatry near Moss Vale',
  'podiatrists-wollondilly':'Podiatry for Wollondilly residents'
};

const megaMenuIcons = {
  'biomechanics': 'walk',
  'custom-orthotics': 'shoe',
  'childrens-podiatry': 'baby-carriage',
  'shockwave-therapy': 'wave-sine',
  'dry-needling': 'needle',
  'foot-mobilisations': 'rotate-2',
  'sports-podiatry': 'run',
  'general-foot-care': 'first-aid-kit',
  'strapping': 'bandage',
  'neural-therapy': 'vaccine',
  'shockwave-therapy-2': 'vaccine-bottle',
  'toenail-problems/#partial-nail-avulsion': 'scissors',
  'toenail-problems/#onyfix': 'ruler-2',
  'general-foot-care/#wart-removal': 'virus',
  'childrens-foot-problems': 'mood-kid',
  'diabetic-foot-care': 'droplet',
  'foot-ankle-injuries': 'bone',
  'heel-pain': 'shoe',
  'knee-hip-back-pain': 'body-scan',
  'toenail-problems': 'scissors',
  '#visit': 'map-pin',
  'podiatrist-southern-highlands': 'map-2',
  'podiatrists-moss-vale': 'compass',
  'podiatrists-wollondilly': 'building-community',
};

function megaMenuIcon(slug) {
  const icon = megaMenuIcons[slug];
  if (!icon) throw new Error('Missing mega menu icon for '+slug);
  return `<span class="mega-icon" aria-hidden="true"><svg width="20" height="20" focusable="false"><use href="assets/mega-menu-icons.svg#${icon}"></use></svg></span>`;
}

function navGroup(label, options) {
  const {title, description, cta, items, feature, menuClass = ''} = options;
  return `<details class="nav-group"><summary>${label}</summary><div class="dropdown mega-menu${menuClass ? ' ' + menuClass : ''}">
    <div class="mega-intro"><strong>${esc(title)}</strong><p>${esc(description)}</p>${link(cta.slug,cta.label+' →')}</div>
    <ul class="mega-links">${items.map(item=>`<li><a href="${href(item.slug)}">${megaMenuIcon(item.slug)}<span><strong>${esc(item.label || titleFor(item))}</strong><small>${esc(menuDescriptions[item.slug])}</small></span></a></li>`).join('')}</ul>
    <a class="mega-feature" href="${href(feature.slug)}">${image(feature.file)}<span><strong>${esc(feature.title)}</strong><span>${esc(feature.label)} <span aria-hidden="true">→</span></span></span></a>
  </div></details>`;
}

function header(logo) {
  const assessment = home.blocks[24].file;
  const serviceOrder = ['biomechanics','custom-orthotics','childrens-podiatry','shockwave-therapy','dry-needling','foot-mobilisations','sports-podiatry','general-foot-care','strapping','neural-therapy','shockwave-therapy-2'];
  return `<a class="skip" href="#content">Skip to content</a>
  <header class="header"><div class="wrap header-inner">
  <a class="logo" href="/">${image(logo,'Bowral Foot Clinic home',true)}</a>
  <button class="menu-toggle" aria-expanded="false" aria-controls="navigation" hidden>Menu</button>
  <nav id="navigation" aria-label="Main navigation">
  ${navGroup('Services', {
    title:'Find the right treatment', description:'Browse the treatments available at The Bowral Foot Clinic.',
    cta:{slug:'#services',label:'All treatments'},
    items:[...serviceOrder.map(slug=>pages.find(page=>page.slug===slug)),...additions],
    feature:{slug:'biomechanics',file:assessment,title:'Start with a biomechanical assessment',label:'How it works'}
  })}
  ${navGroup('Conditions', {
    title:'What we treat', description:'Explore common foot, ankle and lower limb concerns.',
    cta:{slug:'#conditions',label:'All conditions'}, items:group('conditions'),
    feature:{slug:'heel-pain',file:treatmentImages.get('shockwave-therapy'),title:'Dealing with heel pain?',label:'Explore heel pain'}
  })}
  ${navGroup('Locations', {
    menuClass:'locations-menu',
    title:'Visit us in Bowral', description:'Our Boolwey Street clinic serves Bowral and the Southern Highlands.',
    cta:{slug:'#visit',label:'Address & hours'}, items:[{slug:'#visit',label:'Bowral'},...group('locations')],
    feature:{slug:'our-team',file:home.blocks[5].file,title:'Meet the Bowral practitioners',label:'Meet the team'}
  })}
  ${link('our-team','Meet the Team')}${link('about','About')}</nav>
  <div class="header-actions">${phone}${book()}</div></div></header>`;
}

const clinicAddress = '<address>Shop 3, 2-4 Boolwey St<br>Bowral NSW 2576</address>';
const clinicEmail = '<a href="mailto:bowralfootclinic@gmail.com">bowralfootclinic@gmail.com</a>';
const clinicHours = '<dl><div><dt>Monday to Friday</dt><dd>8:30 am to 5:30 pm</dd></div><div><dt>Saturday</dt><dd>8:30 am to 12 pm</dd></div><div><dt>Sunday</dt><dd>Closed</dd></div></dl>';

function visit() {
  return `<div class="visit-data"><div><h3>Address</h3>${clinicAddress}<a class="text-link" href="${maps}">Get directions ↗</a></div>
  <div><h3>Opening hours</h3>${clinicHours}</div>
  <div><h3>Contact</h3>${phone}<br>${clinicEmail}</div></div>`;
}

function homepageVisit() {
  const street = pages.find(page=>page.slug==='general-foot-care').blocks.find(block=>block.file==='assets/0.webp');
  return `<section class="section tint" id="visit" aria-labelledby="visit-title"><div class="wrap">
    <h2 id="visit-title">Visit us in Bowral</h2>
    <div class="visit-layout">
      <div class="visit-details">
        <div class="visit-address">
          ${megaMenuIcon('#visit')}
          <div><h3>The Bowral Foot Clinic</h3>${clinicAddress}
            <a class="visit-directions" href="${maps}">Get directions <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="visit-hours"><h3>Opening hours</h3>${clinicHours}</div>
        <div class="visit-contact">
          <a href="${phoneUrl}" aria-label="Call the clinic on ${phoneNumber}">${phoneNumber}</a>
          ${clinicEmail}
        </div>
      </div>
      <figure class="visit-photo">
        ${image(street.file,'The Bowral Foot Clinic storefront in the Boolwey 2000 shopping complex')}
        <figcaption><strong>Look for Boolwey 2000</strong><span>You’ll find the clinic entrance at Shop 3.</span></figcaption>
      </figure>
    </div>
    <div class="visit-nearby">
      <h3>Coming from nearby?</h3>
      <ul>${group('locations').map(page=>`<li><a href="${href(page.slug)}">${megaMenuIcon(page.slug)}<span>${esc(titleFor(page))}</span><span aria-hidden="true">→</span></a></li>`).join('')}</ul>
    </div>
  </div></section>`;
}

function footer(logo) {
  return `<footer class="footer" id="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand"><a class="logo" href="/">${image(logo,'Bowral Foot Clinic home')}</a>${book()}</div>
      <nav class="footer-links" aria-label="Footer navigation">
        <h2>Explore</h2>
        ${link('our-team','Meet the Team')}
        ${link('about','About the clinic')}
        ${link('book-online','Booking information')}
        <a href="https://dr-abbie.com/">Dr. Abbie Clinics</a>
      </nav>
      <div class="footer-visit">
        <h2>Visit and contact</h2>
        ${clinicAddress}
        <a href="${maps}">Get directions <span aria-hidden="true">↗</span></a>
        ${phone}
        ${clinicEmail}
      </div>
      <div class="footer-hours"><h2>Opening hours</h2>${clinicHours}</div>
    </div>
    <div class="footer-bottom">
      <small>© ${new Date().getFullYear()} The Bowral Foot Clinic</small>
      <a class="footer-terms" href="https://dr-abbie.com/dr-abbie-clinics-terms-and-conditions/" aria-label="Terms and Conditions at Dr. Abbie Clinics">Terms <span aria-hidden="true">↗</span></a>
    </div>
  </div></footer>`;
}

function practitioners(team, full=false) {
  const cards = team.map(person=>`<article class="person" id="${person.id}">
    ${image(person.file, person.name) || '<div class="initials" aria-hidden="true">AS</div>'}
    <div class="person-info"><h3>${esc(person.name)}</h3><p>${esc(person.role)}</p>
    ${full ? `<details><summary>Read bio</summary>${person.bio.join('')}</details>` : `<a class="text-link" href="/our-team/#${person.id}">View profile ↗</a>`}</div></article>`).join('');
  if (full) return `<div class="team-grid">${cards}</div>`;
  return `<div class="team-carousel" data-carousel data-loop><div class="team-track" data-track tabindex="0" aria-label="Browse practitioners">${cards}</div>${railButtons('practitioners')}</div>`;
}

function railButtons(label) {
  return `<div class="rail-controls">
    <button type="button" data-step="-1" aria-label="Previous ${label}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button type="button" data-step="1" aria-label="Next ${label}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>`;
}

function treatmentRail() {
  const featured = ['biomechanics','custom-orthotics','shockwave-therapy'].map(slug=>pages.find(page=>page.slug===slug));
  const followUp = ['general-foot-care','sports-podiatry'].map(slug=>pages.find(page=>page.slug===slug));
  const tiles = [...featured,...additions,...followUp].map(item=>({
    slug:item.slug, label:item.label || titleFor(item),
    file:carouselImages.get(item.slug) || treatmentImages.get(item.slug)
  }));
  if (tiles.some(tile=>!tile.file) || new Set(tiles.map(tile=>tile.file)).size!==tiles.length) {
    throw new Error('Every treatment carousel card needs a distinct photograph.');
  }
  return `<div class="treatments" data-carousel data-loop><div class="rail-heading"><h2>Our treatments</h2>${railButtons('treatments')}</div>
  <div class="rail" data-track tabindex="0" aria-label="Browse treatments">${tiles.map(tile=>`<a class="tile" href="${href(tile.slug)}">${image(tile.file)}<span>${esc(tile.label)}</span></a>`).join('')}</div></div>`;
}

function homepageServices() {
  const categories = [
    {key:'assessment',label:'Assessment & movement',slugs:['biomechanics','childrens-podiatry','custom-orthotics','sports-podiatry']},
    {key:'recovery',label:'Treatment & recovery',slugs:['shockwave-therapy','dry-needling','foot-mobilisations','strapping','neural-therapy','shockwave-therapy-2']},
    {key:'nails',label:'Skin & nail care',slugs:['general-foot-care',...additions.map(item=>item.slug)]}
  ];
  const services = [...group('services'),...additions];
  const cards = categories.flatMap(category=>category.slugs.map(slug=>{
    const item = services.find(service=>service.slug===slug);
    const photo = carouselImages.get(slug) || interiorImages.get(slug);
    return `<a class="service-card" data-service-category="${category.key}" href="${href(slug)}">
      ${image(photo)}<span class="service-card-copy">${megaMenuIcon(slug)}<span><strong>${esc(item.label || titleFor(item))}</strong><small>${esc(menuDescriptions[slug])}</small></span><span class="condition-chevron" aria-hidden="true"></span></span></a>`;
  }));
  return `<section class="section services-section" id="services" aria-labelledby="services-title"><div class="wrap">
    <header class="services-heading"><h2 id="services-title">Range of services</h2><p>Explore podiatry services available at our Bowral clinic.</p></header>
    <div class="service-toolbar" hidden>
      <div class="service-filters" role="group" aria-label="Filter services">${[{key:'all',label:'All services'},...categories].map(filter=>`<button type="button" data-service-filter="${filter.key}" aria-controls="service-results" aria-pressed="${filter.key==='all'}">${esc(filter.label)}</button>`).join('')}</div>
      <p class="service-count" role="status">${cards.length} services</p>
    </div>
    <div class="service-grid" id="service-results">${cards.join('')}</div>
    <details class="more-care service-more"><summary>See our full range of care</summary><div class="source-list">${home.blocks[27].clean}${home.blocks[28].clean}</div></details>
  </div></section>`;
}

function homepageConditions() {
  const conditions = group('conditions');
  const featured = conditions.find(item=>item.slug==='heel-pain');
  return `<section class="section home-conditions" id="conditions" aria-labelledby="conditions-title"><div class="wrap">
    <header class="conditions-heading"><h2 id="conditions-title">Problems we treat</h2><p>Find information about common foot, ankle and lower limb concerns.</p></header>
    <div class="conditions-layout">
      <a class="condition-feature" href="${href(featured.slug)}">
        ${image(interiorImages.get(featured.slug))}
        <span class="condition-feature-copy"><strong>${esc(titleFor(featured))}</strong><span>${esc(menuDescriptions[featured.slug])}</span><span class="condition-feature-action">Explore heel pain <span aria-hidden="true">→</span></span></span>
      </a>
      <div class="conditions-directory">
        <ul class="condition-links">${conditions.filter(item=>item!==featured).map(item=>`<li><a href="${href(item.slug)}">${megaMenuIcon(item.slug)}<span class="condition-link-copy"><strong>${esc(titleFor(item))}</strong><span>${esc(menuDescriptions[item.slug])}</span></span><span class="condition-chevron" aria-hidden="true"></span></a></li>`).join('')}</ul>
        <details class="condition-more"><summary>See more conditions</summary><div class="source-list">${home.blocks[22].clean}${home.blocks[23].clean}</div></details>
      </div>
    </div></div></section>`;
}

function homepageClinicStory() {
  return `<section class="clinic-story" id="about-clinic" aria-labelledby="clinic-story-title">
    <div class="clinic-story-copy">
      <h2 id="clinic-story-title">Local foot care for every age</h2>
      <p>From our first practice on Mona Road to our clinic on Boolwey Street, we’ve cared for adults and children across Bowral and the Southern Highlands.</p>
      <p>We provide routine foot care and assess how your feet and legs move. Our focus is prevention and identifying problems early.</p>
      <a class="outline-button" href="/about/">About the clinic <span aria-hidden="true">→</span></a>
      <a class="clinic-story-address" href="/#visit">${megaMenuIcon('#visit')}<span><strong>Visit us on Boolwey Street</strong><small>Shop 3, 2-4 Boolwey Street, Bowral</small></span></a>
    </div>
    <figure class="clinic-story-photo">
      ${image(interiorImages.get('book-online'),'Dr. Abbie Clinics practitioners talking at reception')}
      <figcaption>The Dr. Abbie Clinics team</figcaption>
    </figure>
  </section>`;
}

function homepageNetwork() {
  const partners = [
    { name: 'Custom Foot', url: 'https://www.customfoot.com.au/', logo: home.blocks[42].file },
    { name: 'Forster-Tuncurry Sports Podiatry', url: 'https://ftspodiatry.com.au/', logo: home.blocks[43].file },
    { name: 'Dr. Abbie Clinics', url: 'https://dr-abbie.com/', logo: home.blocks[44].file },
  ];
  return `<section class="section network" id="clinic-network" aria-labelledby="network-title"><div class="wrap network-layout">
    <h2 id="network-title">Our clinic network</h2>
    <ul class="partners">${partners.map(({name, url, logo})=>`<li><a href="${url}">
      <span class="partner-logo">${image(logo)}</span>
      <span class="partner-name"><strong>${esc(name)}</strong><small>${new URL(url).hostname.replace(/^www\./, '')}</small></span>
      <span class="partner-arrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" focusable="false"><path d="M4.5 13.5l9-9m-7 0h7v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </a></li>`).join('')}</ul>
  </div></section>`;
}

function homepage(hero,team,googleWordmark) {
  const b=home.blocks;
  return `<section class="hero"><span class="header-scroll-marker" aria-hidden="true"></span>${image(hero,'',true)}<div class="wrap hero-inner"><div class="hero-copy">
  <a class="rating" href="${reviewsListing}" aria-label="5 out of 5 stars on Google. Read reviews"><span aria-hidden="true">5 Stars</span><span class="rating-stars" aria-hidden="true">★★★★★</span><img src="${googleWordmark}" alt="" width="78" height="27" decoding="async"></a>
  <h1>Welcome to<br><strong>Bowral Foot Clinic</strong></h1>
  ${b[1].clean}<div class="actions">${book()}<a class="button secondary" href="#visit">Find our clinic</a></div></div>${treatmentRail()}</div></section>
  <section class="section"><div class="wrap"><div class="section-heading"><h2>Meet the Team</h2><p>${esc(b[14].text)}</p></div>${practitioners(team)}<div class="section-action"><a class="outline-button" href="/our-team/">Meet all practitioners →</a></div></div></section>
  ${reviews('google-reviews')}
  ${homepageConditions()}
  ${homepageClinicStory()}
  ${homepageServices()}
  <section class="section"><div class="wrap faq"><h2>Before you book with us</h2><div>${b[30].clean}</div></div></section>
  <section class="booking-band" id="book-appointment"><div class="wrap"><h2>Book your next appointment</h2><p>Visit The Bowral Foot Clinic on Boolwey Street.</p>${book()}</div></section>
  ${homepageVisit()}
  ${homepageNetwork()}`;
}

function clinicSection(tinted=true) {
  return `<section class="section${tinted?' tint':''}"><div class="wrap"><h2>Plan your visit to Bowral</h2>${visit()}</div></section>`;
}

function relatedCare(slugs) {
  const items = slugs.map(slug => pages.find(p=>p.slug===slug));
  return `<section class="section tint related-care"><div class="wrap"><h2>Explore related care</h2><div class="care-grid">${items.map(item=>`<a class="care-card" href="${href(item.slug)}"><span class="care-card-body"><strong>${esc(titleFor(item))}</strong><span>${esc(menuDescriptions[item.slug] || 'Meet the practitioners at our Bowral clinic.')}</span><span class="text-link">Learn more <span aria-hidden="true">→</span></span></span></a>`).join('')}</div></div></section>`;
}

function appointmentSidebar(page) {
  return `<aside class="appointment-sidebar"><h2>Book an appointment</h2><p>${page.group==='conditions'?'Tell us what’s bothering you when you book.':'If you’re unsure which appointment to choose, call the clinic.'}</p>${book()}<p class="sidebar-phone">${phone}</p><a class="text-link" href="/#visit">Clinic address and hours <span aria-hidden="true">→</span></a></aside>`;
}

function heroPractitioners(team) {
  const ordered = [...team.slice(1),team[0]];
  return `<div class="page-practitioners" data-carousel>
    <div class="rail-heading"><h2>Our practitioners</h2>${railButtons('practitioners')}</div>
    <div class="rail" data-track tabindex="0" aria-label="Browse Bowral practitioners">
    ${ordered.map(person=>{
      const portrait = person.file
        ? `<picture><source media="(min-width: 51.01rem)" srcset="${person.file}"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" decoding="async" fetchpriority="low"></picture>`
        : '<span class="tile-initials" aria-hidden="true">AS</span>';
      return `<a class="tile practitioner-tile" href="/our-team/#${person.id}">${portrait}<span class="tile-person"><strong>${esc(person.name)}</strong><small>${esc(person.role)}</small></span></a>`;
    }).join('')}</div></div>`;
}

function heroDetails(page) {
  const first = page.group==='conditions' ? 'Foot and lower limb care'
    : page.slug==='our-team' ? 'Four Bowral practitioners'
    : page.group==='locations' ? 'Appointments at our Bowral clinic'
    : 'Podiatry in Bowral';
  return `<ul class="page-hero-details"><li>${esc(first)}</li><li>Online booking with Nookal</li><li><a href="${maps}">Shop 3, 2-4 Boolwey Street</a></li><li>Open Saturday mornings</li></ul>`;
}

function interior(page,team) {
  const blocks = [...page.blocks];
  const clinicPhoto = home.blocks[5].file;
  const title = page.slug==='our-team' ? 'Meet the Team' : page.group==='locations' ? `Podiatry near ${titleFor(page)}` : page.headings[0];
  if (blocks[0].type==='heading') blocks.shift();
  const leadingBlock = blocks[0]?.type==='text-editor' ? blocks.shift() : null;
  const introductions = {
    about:'Foot and lower limb care for Bowral and the Southern Highlands.',
    'our-team':'Meet the practitioners providing podiatry and general foot care at our Boolwey Street clinic.',
    'book-online':'Choose an appointment at The Bowral Foot Clinic through Nookal.',
    'heel-pain':'Heel pain can make your first steps in the morning or after sitting uncomfortable. Explore common causes and book an assessment at our Bowral clinic.'
  };
  const useExistingLead = page.group!=='locations' && leadingBlock && leadingBlock.text.split(/\s+/).length<=42;
  const lead = page.group==='locations'
    ? `<p>Visiting from ${esc(titleFor(page))}? Appointments are held at The Bowral Foot Clinic on Boolwey Street.</p>`
    : useExistingLead ? leadingBlock.clean : `<p>${esc(introductions[page.slug] || menuDescriptions[page.slug]+'.')}</p>`;
  if (leadingBlock && !useExistingLead) blocks.unshift(leadingBlock);
  const photo = interiorImages.get(page.slug) || clinicPhoto;
  const parent = {services:['#services','Services'],conditions:['#conditions','Conditions'],locations:['#visit','Locations']}[page.group];
  const breadcrumb = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span>
    ${parent ? link(...parent)+' <span aria-hidden="true">/</span> ' : ''}<span aria-current="page">${esc(titleFor(page))}</span></nav>`;
  const banner = `<section class="page-hero"><span class="header-scroll-marker" aria-hidden="true"></span>${image(photo,'',true)}
    <div class="wrap page-hero-inner"><div class="page-hero-copy">${breadcrumb}<h1>${esc(title)}</h1>${lead}
    <div class="actions">${book()}<a class="button secondary" href="tel:+61240052668">Call (02) 4005 2668</a></div>${heroDetails(page)}</div>
    ${heroPractitioners(team)}</div></section>`;
  let content;
  if (page.slug==='our-team') {
    content = `<section class="section"><div class="wrap"><h2>Our Bowral practitioners</h2><p>Select a practitioner below to read their bio. For general foot care only, you can book with Arega Sarkisian.</p>${practitioners(team,true)}</div></section>${clinicSection()}`;
  } else if (page.slug==='book-online') {
    content = `<section class="section"><div class="wrap interior-layout"><article class="prose"><h2>Book online with Nookal</h2><ol class="booking-steps">
    <li><strong>Select an appointment</strong><p>Choose an appointment type and practitioner at the Bowral location.</p></li><li><strong>Choose a time</strong><p>Pick an available time and enter your details to confirm the booking.</p></li>
    <li><strong>Check your confirmation</strong><p>Use the appointment confirmation to check the time and location. If you have a referral or relevant records, bring them along.</p></li></ol></article>${appointmentSidebar(page)}</div></section>${clinicSection()}`;
  } else if (page.slug==='about') {
    content = `<section class="section"><div class="wrap split"><article class="prose"><h2>About the clinic</h2><p>${esc(home.blocks[4].text)}</p><a class="text-link" href="/our-team/">Meet the Team ↗</a></article>${renderBlock(home.blocks[25])}</div></section>
    <section class="section about-frontage"><div class="wrap"><h2>The clinic on Boolwey Street</h2><figure>${image(home.blocks[37].file,'Podiatry signage above the Bowral Foot Clinic entrance')}<figcaption>Shop 3, 2-4 Boolwey Street, Bowral. <a class="text-link" href="${maps}">Get directions ↗</a></figcaption></figure></div></section>
    ${relatedCare(['general-foot-care','biomechanics','childrens-podiatry'])}${clinicSection()}`;
  }
  else {
    const extras = {'toenail-problems':[['partial-nail-avulsion','Partial nail avulsion (PNA)','Ask our podiatrists about this procedure for ingrown toenails.'],['onyfix','Onyfix nail correction','Ask at your appointment whether Onyfix nail correction is suitable for you.']],
      'general-foot-care':[['wart-removal','Wart removal','Book an appointment to discuss treatment options for plantar warts.']]};
    const detail = blocks.filter(b=>b.type!=='button' && !['icon','shortcode'].includes(b.type) && b.file!==photo && b.file!=='assets/0.webp').map(renderBlock).join('').trim();
    const questions = page.slug==='neural-therapy' || page.slug==='shockwave-therapy-2'
      ? '<section><h2>Questions to bring to your appointment</h2><ul><li>What would make this treatment appropriate for me?</li><li>What alternatives should I consider?</li><li>What should I know about costs and follow-up?</li></ul></section>' : '';
    content = `${page.group==='locations'?clinicSection(false):''}<section class="section"><div class="wrap interior-layout"><article class="prose">${detail}
      ${page.slug==='custom-orthotics'?'<p>Custom orthotics are prescribed in Bowral and made at the Kirrawee head office.</p>':''}
      ${(extras[page.slug]||[]).map(([id,label,copy])=>`<section id="${id}"><h2>${label}</h2><p>${copy}</p></section>`).join('')}${questions}</article>${appointmentSidebar(page)}</div></section>
      ${relatedCare(care[page.slug] || ['general-foot-care','biomechanics','our-team'])}${page.group==='locations'?reviews():''}`;
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
    const favicon=await asset('https://i0.wp.com/thebowralfootclinic.com.au/wp-content/uploads/2025/07/cropped-Agency-Canva-Templates-1.png?fit=192%2C192&ssl=1');
    const reference=source.find(p=>p.group==='reference' && !p.slug);
    const drAbbieImage = filename => 'https://dr-abbie.com/wp-content/dr-abbie-assets/img/'+filename;
    const googleWordmark = await asset(drAbbieImage('google-wordmark.webp'));
    for (const [slug,filename] of [
      ['toenail-problems/#partial-nail-avulsion','hero-ingrown.webp'],
      ['general-foot-care/#wart-removal','hero-foot-care.webp'],
      ['general-foot-care','hero-clinic.webp'],
      ['sports-podiatry','tx-sports.webp']
    ]) carouselImages.set(slug,await asset(drAbbieImage(filename)));
    for (const [slug,filename] of [['biomechanics','svc-biomechanics.webp'],['custom-orthotics','svc-orthotics.webp'],['shockwave-therapy','svc-shockwave.webp']]) {
      treatmentImages.set(slug,await asset(reference.images.find(i=>i.url.endsWith('/'+filename))?.url));
    }
    await Promise.all(Object.entries(photography).map(async ([slug,filename])=>{
      const photo = reference.images.find(i=>i.url.endsWith('/'+filename));
      if (!photo) throw new Error('Missing reference photograph: '+filename);
      interiorImages.set(slug,await asset(photo.url));
    }));
    for (const page of pages) await normalize(tab,page);
    const clinicPhotos = new Map(await Promise.all(Object.entries(bowralPhotos).map(async ([role,filename])=>{
      const url = 'https://i0.wp.com/thebowralfootclinic.com.au/wp-content/uploads/2025/07/'+filename+'?w=1150&ssl=1';
      return [role,await asset(url)];
    })));
    carouselImages.set('toenail-problems/#onyfix',clinicPhotos.get('generalCare'));
    interiorImages.set('knee-hip-back-pain',clinicPhotos.get('kneeAssessment'));
    interiorImages.set('biomechanics',clinicPhotos.get('biomechanics'));
    interiorImages.set('general-foot-care',clinicPhotos.get('generalCare'));
    for (const slug of ['strapping','dry-needling']) {
      const original = pages.find(page=>page.slug===slug).blocks.find(block=>block.file);
      interiorImages.set(slug,original.file);
    }
    const team=[];
    for (const id of ['arega-sarkisian','dr-elissa-all','dr-mohemed-al-heyoury','dr-yousef-najjarine']) {
      const profile=source.find(p=>p.slug==='team/'+id+'/');
      const start=profile.blocks.findIndex(b=>b.type==='heading'&&b.text.startsWith('Meet'));
      const end=profile.blocks.findIndex((b,i)=>i>start&&b.text==='Book');
      const portrait=profile.blocks.find(b=>b.type==='image'&&b.media[0]);
      const bio={blocks:profile.blocks.slice(start+1,end).filter(b=>b.type==='text-editor'||b.type==='heading')};
      await normalize(tab,bio);
      const localPhoto = {'dr-elissa-all':clinicPhotos.get('elissa'),'dr-mohemed-al-heyoury':clinicPhotos.get('mohemed')}[id];
      team.push({id,name:profile.headings[0],role:id==='arega-sarkisian'?'General treatment podiatrist (general foot care only)':'Podiatrist',file:id==='arega-sarkisian'?'':localPhoto || await asset(portrait?.media[0].url),bio:bio.blocks.map(renderBlock)});
    }
    // Keep the shared stylesheet and script in sync with newly generated pages.
    const [styleVersion, scriptVersion] = await Promise.all(['site.css', 'site.js'].map(async file => {
      const content = await fs.readFile(path.join('assets', file));
      return createHash('sha256').update(content).digest('hex').slice(0, 12);
    }));
    for (const page of pages) {
      const body = page.slug ? interior(page,team) : homepage(home.blocks[5].file,team,googleWordmark);
      const base=page.slug?'../':'./';
      const document=`<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.pageTitle)}</title>
${page.description===null?'':`<meta name="description" content="${esc(page.description)}">`}
<link rel="canonical" href="${esc(page.canonical)}">
<link rel="icon" type="image/png" sizes="192x192" href="${base}${favicon}">
<link rel="preload" href="${base}assets/poppins-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/poppins-semibold.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.classList.add('has-js');</script>
<link rel="stylesheet" href="${base}assets/site.css?v=${styleVersion}">
<script src="${base}assets/site.js?v=${scriptVersion}" defer></script>
</head>
<body class="photo-header${page.slug?'':' home'}">${header(logo)}<main id="content">${body}</main>${footer(logo)}</body>
</html>`.replace(/(?:src|srcset)="assets\/[^"]+"/g,attribute=>attribute.replaceAll('assets/',base+'assets/')).replaceAll('href="assets/mega-menu-icons.svg#','href="'+base+'assets/mega-menu-icons.svg#').split('\n').map(line=>line.trimEnd()).join('\n')+'\n';
      if(page.slug) await fs.mkdir(page.slug,{recursive:true});
      await fs.writeFile(path.join(page.slug,'index.html'),document);
    }
    console.log('Generated '+pages.length+' static pages.');
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
