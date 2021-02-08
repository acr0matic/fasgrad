const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuButton = document.getElementById('mobile-button');
const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-menu__item');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('mobile-menu--open');
  mobileMenuButton.classList.toggle('is-active');
});

mobileMenuItems.forEach(item => {
  item.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu--open');
    mobileMenuButton.classList.toggle('is-active');
  });
});