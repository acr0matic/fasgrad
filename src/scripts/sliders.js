const partners = new Swiper('.partners__slider', {
  // Optional parameters
  loop: true,
  slidesPerView: 6,
  spaceBetween: 80,

  autoplay: {
    delay: 2000,
  }
});

const portfolioSlider = new Swiper('.portfolio__slider', {
  slidesPerView: 'auto',
  spaceBetween: 25,
  simulateTouch: false,
  allowTouchMove: false,


  navigation: {
    nextEl: '.portfolio-slider-next',
    prevEl: '.portfolio-slider-prev',
  },
})