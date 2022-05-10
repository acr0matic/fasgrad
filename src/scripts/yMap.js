const mapContainer = document.getElementById('yandexMap');;

const CheckContainer = function () {
  const mapContainerOffset = mapContainer.offsetTop
  console.log(`${mapContainerOffset} ${window.scrollY}`);

  if (window.scrollY >= mapContainerOffset - 500) {
    console.log("reached");
    GenerateMap();
    window.removeEventListener('scroll', CheckContainer);
  }
}

window.addEventListener('scroll', CheckContainer);

function GenerateMap() {
  ymaps.ready(function () {
    var map = new ymaps.Map(mapContainer, {
      center: [56.331927, 44.023225],
      zoom: 8
    });

    map.behaviors.disable('scrollZoom');

    fetch(`${path}/data/map.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        for (const key in data) {
          const element = data[key];

          let iconSize = [50, 40];

          if (window.matchMedia("(max-width: 768px)").matches) iconSize = [35, 35];

          var place = new ymaps.Placemark(
            element.coordinates, {
            balloonContentBody: '',
          },
            {
              iconImageHref: `${path}/img/icons/geo--orange.svg`,
              iconImageSize: iconSize,
              iconLayout: 'default#image',
            }
          );

          map.geoObjects.add(place);
        }
      });
  });
}