const headerContact = document.querySelectorAll('.header__contact');
headerContact.forEach(contact => {
  const copyBlock = contact.querySelector('.header__copy');
  const tooltip = contact.querySelector('.tooltip');

  let text = '';

  if (copyBlock) {
    const element = copyBlock.querySelector('a');
    element.addEventListener('click', (e) => {
      if (window.matchMedia("(max-width: 996px)").matches) return;
      else e.preventDefault();
    });

    text = element.innerHTML;

    copyBlock.addEventListener('click', () => {
      tooltip.classList.add('tooltip--visible');
      new ClipboardJS(contact, {
        text: () => text
      });

      setTimeout(() => tooltip.classList.remove("tooltip--visible"), 1000);
    });
  }
});

const modalParams = {
  awaitCloseAnimation: true,
  disableScroll: true,
  disableFocus: false,
};

MicroModal.init(modalParams);

// Прелоадер
const preloader = document.getElementById('preloader');
document.addEventListener("DOMContentLoaded", function () {
  window.setTimeout(function () {
    preloader.classList.add('preloader--hide');
  }, 1500);
});

const social = document.getElementById('social');
const socialIcons = document.querySelectorAll('.social__link--hide')

social.addEventListener('click', () => {
  socialIcons.forEach(icon => {
    icon.classList.toggle('social__link--hide');
  });
});

['click', 'touchstart'].forEach(evt =>
  window.addEventListener(evt, (e) => {
    if (!social.contains(e.target))
      socialIcons.forEach(icon => icon.classList.add('social__link--hide'));
  })
);
