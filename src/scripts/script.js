const headerContact = document.querySelectorAll('.header__contact');
headerContact.forEach(contact => {
  const copyBlock = contact.querySelector('.header__copy');
  const tooltip = contact.querySelector('.tooltip');

  let text = '';

  if (copyBlock) {
    const elem = copyBlock.querySelector('a');
    if (window.matchMedia('(min-width: 768px)').matches) {
      elem.addEventListener('click', (e) => e.preventDefault());

      text = elem.innerHTML;

      copyBlock.addEventListener('click', () => {
        tooltip.classList.add('tooltip--visible');
        new ClipboardJS(contact, {
          text: () => text
        });

        setTimeout(() => tooltip.classList.remove("tooltip--visible"), 1000);
      });
    }
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

const scrollParams = {
  speed: 500,
  speedAsDuration: true,
  offset: 0,
}

if (window.matchMedia('(max-width: 768px)').matches) scrollParams.offset = 105;
else scrollParams.offset = -15;

const scrollController = new SmoothScroll('a[href*="#"]', scrollParams);