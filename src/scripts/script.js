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