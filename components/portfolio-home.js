const navigation = document.querySelector('[data-portfolio-nav]');
const menuToggle = navigation?.querySelector('[data-portfolio-menu-toggle]');
const menuClose = navigation?.querySelector('[data-portfolio-menu-close]');
const menu = navigation?.querySelector('[data-portfolio-menu]');

function setMenuOpen(open) {
  if (!navigation || !menuToggle) return;
  navigation.dataset.open = String(open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(navigation?.dataset.open !== 'true');
});

menuClose?.addEventListener('click', () => setMenuOpen(false));

menu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

document.addEventListener('click', (event) => {
  if (
    navigation?.dataset.open === 'true'
    && !menu?.contains(event.target)
    && !menuToggle?.contains(event.target)
  ) setMenuOpen(false);
});

let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  if (!navigation) return;
  const currentScrollY = window.scrollY;
  navigation.dataset.hidden = String(currentScrollY > lastScrollY && currentScrollY > 64);
  lastScrollY = currentScrollY;
}, { passive: true });

document.querySelectorAll('[data-portfolio-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  carousel.querySelectorAll('[data-carousel-direction]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = Number.parseInt(button.dataset.carouselDirection || '0', 10);
      track?.scrollBy({ left: direction * Math.max(track.clientWidth * 0.72, 240), behavior: 'smooth' });
    });
  });
});

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
