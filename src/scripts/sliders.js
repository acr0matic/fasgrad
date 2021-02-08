const partners = new Swiper('.partners__slider', {
  // Optional parameters
  loop: true,
  slidesPerView: 2,
  spaceBetween: 80,

  autoplay: {
    delay: 1200,
  },

  breakpoints: {
    500: {
      slidesPerView: 3
    },

    991: {
      slidesPerView: 6
    }
  }
});

const serviceSlider = new Swiper('.service__slider', {
  slidesPerView: 'auto',
  spaceBetween: 25,
})

const portfolioSlider = new Swiper('.portfolio__slider', {
  slidesPerView: 'auto',
  spaceBetween: 25,
  simulateTouch: true,
  allowTouchMove: true,

  breakpoints: {
    996: {
      simulateTouch: false,
      allowTouchMove: false,
    },
  },

  navigation: {
    nextEl: '.portfolio-slider-next',
    prevEl: '.portfolio-slider-prev',
  },
})