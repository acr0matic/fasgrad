const portfolio = document.querySelectorAll('.portfolio__card');

portfolio.forEach(item => {
  const title = item.querySelector('.portfolio__title');
  const characteristic = item.querySelector('.portfolio__characteristic');
  const description = item.querySelector('.portfolio__description');
  const action = item.querySelector('.portfolio__action');
  const icon = action.querySelector('.portfolio__icon');

  action.addEventListener('click', () => {
    title.classList.toggle('portfolio__hide');
    characteristic.classList.toggle('portfolio__hide');
    description.classList.toggle('portfolio__hide');

    icon.classList.toggle('portfolio__icon--active');
  });
});