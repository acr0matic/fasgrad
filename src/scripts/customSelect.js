function ResetSelect(select) {
  const selected = select.querySelector('.select__item--selected');
  if (selected) selected.classList.remove('select__item--selected');
}

function InitSelect(select) {
  const defaultItem = select.querySelector('.select__item--default');
  const hiddenItems = select.querySelectorAll('.select__item--hide');
  const selectArrow = select.querySelector('.select__arrow');

  select.addEventListener('click', () => {
    select.classList.toggle('select--open');
    selectArrow.classList.toggle('select__arrow--rotate');

    hiddenItems.forEach(item => {
      item.addEventListener('click', () => {
        defaultItem.style.display = 'none';
        ResetSelect(select);
        item.classList.add('select__item--selected');
      });

      item.classList.toggle('select__item--hide');
    });

    // закрыть, если клик не по селекту
    window.addEventListener('click', (e) => {
      if (!select.contains(e.target)) {
        select.classList.remove('select--open');
        selectArrow.classList.remove('select__arrow--rotate');

        hiddenItems.forEach(item => {
          item.classList.add('select__item--hide');
        });
      }
    });
  });
}