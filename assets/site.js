const navigation = document.querySelector('#navigation');
const menu = document.querySelector('.menu-toggle');
const mobile = matchMedia('(max-width: 60rem)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.hidden = mobile.matches && !open;
}
menu.hidden = false;
setMenu(false);
menu.addEventListener('click', () => setMenu(navigation.hidden));
mobile.addEventListener('change', () => setMenu(false));
const dropdowns = [...navigation.querySelectorAll('details')];
for (const current of dropdowns) {
  current.addEventListener('toggle', () => {
    if (current.open) dropdowns.filter(item => item !== current).forEach(item => { item.open = false; });
  });
}
document.addEventListener('click', event => {
  if (!navigation.contains(event.target)) dropdowns.forEach(item => { item.open = false; });
});
navigation.addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  dropdowns.forEach(item => { item.open = false; });
  if (mobile.matches) setMenu(false);
});
navigation.addEventListener('focusout', event => {
  if (event.relatedTarget && !navigation.contains(event.relatedTarget)) {
    dropdowns.forEach(item => { item.open = false; });
  }
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const current = dropdowns.find(item => item.open);
  if (current) {
    current.open = false;
    current.querySelector('summary').focus();
  } else if (mobile.matches && !navigation.hidden) {
    setMenu(false);
    menu.focus();
  }
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const serviceToolbar = document.querySelector('.service-toolbar');
if (serviceToolbar) {
  const filters = [...serviceToolbar.querySelectorAll('[data-service-filter]')];
  const cards = [...document.querySelectorAll('[data-service-category]')];
  const count = serviceToolbar.querySelector('.service-count');
  serviceToolbar.hidden = false;
  for (const filter of filters) {
    filter.addEventListener('click', () => {
      const category = filter.dataset.serviceFilter;
      let visible = 0;
      for (const card of cards) {
        card.hidden = category !== 'all' && card.dataset.serviceCategory !== category;
        if (!card.hidden) visible++;
      }
      filters.forEach(button=>button.setAttribute('aria-pressed', String(button===filter)));
      count.textContent = `${visible} services`;
    });
  }
}
const headerScrollMarker = document.querySelector('.header-scroll-marker');
if (headerScrollMarker) {
  const header = document.querySelector('.header');
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', entry.boundingClientRect.bottom <= 0);
  }).observe(headerScrollMarker);
}

function initializeCarouselLoop(carousel, rail, originals, advance) {
  function copies() {
    return originals.map(card => {
      const copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.removeAttribute('id');
      if (copy.matches('a')) copy.tabIndex = -1;
      copy.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
      return copy;
    });
  }
  const trailing = copies();
  rail.prepend(...copies());
  rail.append(...trailing);

  const first = rail.firstElementChild;
  const start = () => originals[0].offsetLeft - first.offsetLeft;
  rail.scrollTo({left: start(), behavior: 'instant'});

  // Recenter on the identical card in the middle set after a snap settles.
  function wrap() {
    const beginning = start();
    const end = trailing[0].offsetLeft - first.offsetLeft;
    const cycle = end - beginning;
    if (cycle <= 0) return;
    if (rail.scrollLeft < beginning - 1) rail.scrollBy({left: cycle, behavior: 'instant'});
    if (rail.scrollLeft >= end - 1) rail.scrollBy({left: -cycle, behavior: 'instant'});
  }
  if ('onscrollend' in rail) {
    rail.addEventListener('scrollend', wrap);
  } else {
    let settleTimer;
    rail.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(wrap, 150);
    }, {passive:true});
  }

  let visible = false;
  let interacting = false;
  const hover = matchMedia('(hover: hover)');
  new IntersectionObserver(([entry]) => { visible = entry.intersectionRatio >= .5; }, {threshold:.5}).observe(carousel);
  rail.addEventListener('pointerdown', () => { interacting = true; }, {passive:true});
  for (const event of ['pointerup', 'pointercancel']) {
    window.addEventListener(event, () => { interacting = false; }, {passive:true});
  }
  setInterval(() => {
    if (!visible || interacting || document.hidden || reducedMotion.matches) return;
    if (carousel.matches(':focus-within') || (hover.matches && carousel.matches(':hover'))) return;
    advance(1);
  }, 4200);
}

for (const carousel of document.querySelectorAll('[data-carousel]')) {
  const rail = carousel.querySelector('[data-track]');
  const buttons = [...carousel.querySelectorAll('[data-step]')];
  const originals = [...rail.children];
  const looping = carousel.hasAttribute('data-loop') && originals.length > 3;
  function updateControls() {
    buttons[0].disabled = rail.scrollLeft < 2;
    buttons[1].disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  }
  function advance(direction) {
    const [first, second] = rail.children;
    if (!second) return;
    rail.scrollBy({left: (second.offsetLeft - first.offsetLeft) * direction, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
  buttons.forEach(button => button.addEventListener('click', () => advance(Number(button.dataset.step))));
  rail.addEventListener('keydown', event => {
    if (event.target !== rail || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    advance(event.key === 'ArrowLeft' ? -1 : 1);
  });
  if (looping) {
    initializeCarouselLoop(carousel, rail, originals, advance);
  } else {
    rail.addEventListener('scroll', updateControls, {passive: true});
    new ResizeObserver(updateControls).observe(rail);
    updateControls();
  }
}

const bookingBand = document.querySelector('.booking-band');
if (bookingBand) {
  let visible = false;
  let frame = 0;

  function updateBookingParallax() {
    frame = 0;
    if (!visible || reducedMotion.matches) return;
    const bounds = bookingBand.getBoundingClientRect();
    const viewport = document.documentElement.clientHeight;
    const progress = (viewport - 2 * bounds.top - bounds.height) / (viewport + bounds.height);
    bookingBand.style.setProperty('--booking-parallax', Math.max(-1, Math.min(1, progress)));
    bookingBand.classList.add('is-parallax');
  }

  function scheduleBookingParallax() {
    if (visible && !reducedMotion.matches && !frame) frame = requestAnimationFrame(updateBookingParallax);
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    scheduleBookingParallax();
  }).observe(bookingBand);
  window.addEventListener('scroll', scheduleBookingParallax, {passive: true});
  window.addEventListener('resize', scheduleBookingParallax);
  reducedMotion.addEventListener('change', scheduleBookingParallax);
}

if (!reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion.matches) entry.target.animate(
        [{opacity:.76, transform:'translateY(12px)'},{opacity:1, transform:'translateY(0)'}],
        {duration:420, easing:'cubic-bezier(.16,1,.3,1)'}
      );
      reveal.unobserve(entry.target);
    }
  }, {threshold:.25});
  document.querySelectorAll('.home .section-heading').forEach(node => reveal.observe(node));
}
