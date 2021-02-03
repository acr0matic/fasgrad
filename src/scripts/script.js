const headerContact = document.querySelectorAll('.header__contact');
headerContact.forEach(contact => {
  const copyBlock = contact.querySelector('.header__copy');
  const tooltip = contact.querySelector('.tooltip');
  const text = contact.querySelector('span').innerHTML;

  copyBlock.addEventListener('click', () => {
    tooltip.classList.add('tooltip--visible');
    new ClipboardJS(contact, {
      text: () => text
    });

    setTimeout(() => tooltip.classList.remove("tooltip--visible"), 1000);
  });
});


const modalParams = {
  awaitCloseAnimation: true,
  disableScroll: true,
  disableFocus: false,
};

MicroModal.init(modalParams);

const forms = document.querySelectorAll('form');
forms.forEach(form => {
  phone = form.querySelector('input[type=tel]');

  IMask(phone, {
    mask: '+{7} (000) 000-00-00',
    prepare: (appended, masked) => (appended === '8' && masked.value === '') ? '' : appended
  });
});
