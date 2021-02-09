const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuButton = document.getElementById('mobile-button');
const mobileMenuClose = mobileMenu.querySelector('.mobile-menu__close');
const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-menu__item');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('mobile-menu--open');
  mobileMenuButton.classList.toggle('is-active');
});

mobileMenuClose.addEventListener('click', () => {
  mobileMenu.classList.toggle('mobile-menu--open');
  mobileMenuButton.classList.toggle('is-active');
});

mobileMenuItems.forEach(item => {
  item.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu--open');
    mobileMenuButton.classList.toggle('is-active');
  });
});

window.addEventListener('touchstart', (e) => {
  if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
    mobileMenuButton.classList.remove('is-active');
    mobileMenu.classList.remove('mobile-menu--open');
  }
});