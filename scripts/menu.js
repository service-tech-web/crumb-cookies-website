/* Mobile hamburger menu: self-contained, works even if other scripts fail */
if (!window.__menuReady) {
  window.__menuReady = true;
  const nav = document.getElementById('nav');
  const header = document.querySelector('header');
  const burger = document.querySelector('.burger');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('no-scroll', open);
    const lenis = window.__lenis;
    if (lenis) open ? lenis.stop() : lenis.start();
  }

  // capture phase so the menu closes (and smooth scroll restarts) before a link scrolls the page
  document.addEventListener('click', (e) => {
    if (e.target.closest('.burger')) setMenu(!nav.classList.contains('open'));
    else if (e.target.closest('#nav a')) setMenu(false);
  }, true);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });
}
