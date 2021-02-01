ymaps.ready(function () {
  container = document.getElementById('yandexMap');

  var map = new ymaps.Map(container, {
    center: [44.558367, 38.095674],
    zoom: 15
  });

  map.behaviors.disable('scrollZoom');
});