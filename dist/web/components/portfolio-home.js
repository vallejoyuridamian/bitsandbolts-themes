document.querySelectorAll('[data-portfolio-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  carousel.querySelectorAll('[data-carousel-direction]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = Number.parseInt(button.dataset.carouselDirection || '0', 10);
      track?.scrollBy({ left: direction * Math.max(track.clientWidth * 0.72, 240), behavior: 'smooth' });
    });
  });
});
