

// Инициализация модальных окон
MicroModal.init(modalParams);
document.querySelectorAll('[data-micromodal-trigger]').forEach(modal =>
  modal.addEventListener('click', () => currentModal = modal.dataset.micromodalTrigger));



// Инициализация ленивой подгрузки
const lazyLoadInstance = new LazyLoad({
  elements_selector: '.lazy__item',

  callback_loaded: (trigger) => {
    const container = trigger.closest('.lazy');
    const loader = container.querySelector('.preloader');

    if (loader) loader.classList.add('preloader--hide');
  },
});

const scrollController = new SmoothScroll('a[href*="#"]', scrollParams);
