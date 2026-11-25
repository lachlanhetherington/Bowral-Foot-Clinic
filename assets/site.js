const navigation = document.querySelector('#navigation');
const menu = document.querySelector('.menu-toggle');
const mobile = matchMedia('(max-width: 51rem)');

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
const headerScrollMarker = document.querySelector('.header-scroll-marker');
if (headerScrollMarker) {
  const header = document.querySelector('.header');
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', entry.boundingClientRect.bottom <= 0);
  }).observe(headerScrollMarker);
}

for (const carousel of document.querySelectorAll('[data-carousel]')) {
  const rail = carousel.querySelector('[data-track]');
  const buttons = [...carousel.querySelectorAll('.rail-controls button')];
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
  rail.addEventListener('scroll', updateControls, {passive: true});
  new ResizeObserver(updateControls).observe(rail);
  updateControls();
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
  document.querySelectorAll('.home .section-heading, .home .booking-band .wrap').forEach(node => reveal.observe(node));
}
