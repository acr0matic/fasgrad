ymaps.ready(function () {
  container = document.getElementById('yandexMap');
  console.log("🚀 ~ file: yMap.js ~ line 3 ~ container", container)

  var map = new ymaps.Map(container, {
    center: [44.558367, 38.095674],
    zoom: 15
  });

  map.behaviors.disable('scrollZoom');
});