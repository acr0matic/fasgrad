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