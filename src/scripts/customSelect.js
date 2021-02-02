const select = document.querySelectorAll('.select');

select.forEach(selectItem => {
  const defaultItem = selectItem.querySelector('.select__item--default');
  const hiddenItems = selectItem.querySelectorAll('.select__item--hide');
  const selectArrow = selectItem.querySelector('.select__arrow');

  selectItem.addEventListener('click', () => {
    selectItem.classList.toggle('select--open');
    selectArrow.classList.toggle('select__arrow--rotate');

    hiddenItems.forEach(item => {
      item.addEventListener('click', () => {
        defaultItem.style.display = 'none';
        ResetSelect(selectItem);
        item.classList.add('select__item--selected');
      });

      item.classList.toggle('select__item--hide');
    });

    // закрыть, если клик не по селекту
    window.addEventListener('click', (e) => {
      if (!selectItem.contains(e.target)) {
        selectItem.classList.remove('select--open');
        selectArrow.classList.remove('select__arrow--rotate');

        hiddenItems.forEach(item => {
          item.classList.add('select__item--hide');
        });
      }
    });
  });
});

function ResetSelect(select) {
  const selected = select.querySelector('.select__item--selected');
  if (selected) selected.classList.remove('select__item--selected');
}

