const headerContact = document.querySelectorAll('.header__contact');
headerContact.forEach(contact => {
  const copyBlock = contact.querySelector('.header__copy');
  const tooltip = contact.querySelector('.tooltip');

  let text = '';

  if (copyBlock) {
    text = copyBlock.querySelector('span').innerHTML;

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