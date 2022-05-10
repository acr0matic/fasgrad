// Прелоадер
const preloader = document.getElementById('page-loader');
document.addEventListener("DOMContentLoaded", function () {
  window.setTimeout(function () {
    preloader.classList.add('page-loader--hide');
  }, 1500);
});



// Логика виджета соц.сетей
const widget = document.getElementById('widget');
const widgetIcons = document.querySelectorAll('.widget__link--hide')

widget.addEventListener('click', () =>
  widgetIcons.forEach(icon => icon.classList.toggle('widget__link--hide')));

['click', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, (e) => {
    if (!widget.contains(e.target)) widgetIcons.forEach(icon => icon.classList.add('widget__link--hide'));
  })
});
