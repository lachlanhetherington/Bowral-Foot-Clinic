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
  if (event.target.closest('a') && mobile.matches) setMenu(false);
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

const rail = document.querySelector('.rail');
if (rail) {
  const buttons = [...document.querySelectorAll('.rail-controls button')];
  function updateControls() {
    buttons[0].disabled = rail.scrollLeft < 2;
    buttons[1].disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const tiles = [...rail.children];
    const step = tiles[1].offsetLeft - tiles[0].offsetLeft;
    rail.scrollBy({left: step * Number(button.dataset.step), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }));
  rail.addEventListener('scroll', updateControls, {passive: true});
  new ResizeObserver(updateControls).observe(rail);
  updateControls();
}
