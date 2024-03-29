const Service = (() => {
  let serviceWrapper, serviceCards;

  return {
    Init: (data) => {
      serviceWrapper = document.getElementById("service");

      Service.GenerateCards(data);
      Service.SetListeners();
    },

    SetListeners: () => {
      serviceCards = serviceWrapper.querySelectorAll('.service-card');

      serviceCards.forEach(card => {
        const colors = card.querySelectorAll('.service-card__color');
        const icon = card.querySelector('.service-card__icon');
        const button = card.querySelector('.service-card__button');
        const cardMaterial = card.getAttribute('data-material');

        const tooltip = card.querySelector('.service-card__tooltip');
        const tooltipBounding = tooltip.getBoundingClientRect();

        button.addEventListener('click', () => {
          const href = button.getAttribute('href');
          if (href === "#calculator") {
            const select = Calculator.GetList();
            const material = select.querySelector(`[data-material=${cardMaterial}]`)

            const defaultItem = select.querySelector('.select__item--default');

            ResetSelect(select);

            material.classList.add('select__item--selected');
            defaultItem.style.display = 'none';

            Calculator.SelectMaterial();
            Calculator.SetPalette();
          }
        });

        if (window.matchMedia("(max-width: 996px)").matches) {
          icon.addEventListener('touchstart', () => {
            if (tooltipBounding.right > (window.innerWidth || document.documentElement.clientWidth))
              tooltip.classList.add('service-card__tooltip--left');

            tooltip.classList.add('tooltip--visible');
          });

          window.addEventListener('touchstart', (e) => {
            if (!icon.contains(e.target) && !tooltip.contains(e.target))
              tooltip.classList.remove('tooltip--visible');
          })
        }

        else {
          icon.addEventListener('mouseover', () => {
            if (tooltipBounding.right > (window.innerWidth || document.documentElement.clientWidth))
              tooltip.classList.add('service-card__tooltip--left');

            tooltip.classList.add('tooltip--visible');
          });

          icon.addEventListener('mouseout', () => tooltip.classList.remove('tooltip--visible'));
        }

        // colors.forEach(color => {
        //   color.addEventListener('click', (e) => {
        //     if (e.target.classList.contains('service-card__color--selected')) {
        //       Service.ChangePicture(card, color);
        //     }

        //     else {
        //       Service.ResetColor(colors);
        //       Service.ChangePicture(card, color);
        //     }
        //   });
        // });
      });
    },

    GenerateCards: (data) => {
      const container = serviceWrapper.querySelector('.service .row');
      const materials = data.material;

      container.innerHTML = '';

      if (!window.matchMedia("(max-width: 996px)").matches) {
        for (const key in materials) {
          const material = materials[key];
          container.innerHTML +=
            '<div class="col-12 col-lg-6 col-xl-4 mb-5">'
            + ServiceTemplate(material, key) +
            '</div>';
        }
      }

      else {
        container.innerHTML += '<div class="swiper-container service__slider"> <div class="swiper-wrapper"></div></div>';
        const wrapper = container.querySelector('.swiper-wrapper');

        for (const key in materials) {
          const material = materials[key];

          wrapper.innerHTML +=
            ' <div class="swiper-slide">'
            + ServiceTemplate(material, key) +
            '</div>';
        }

        serviceSlider.init();
      }

      lazyLoadInstance.update();
    },

    ChangePicture: (card, color) => {
      const colorPicture = color.getAttribute('data-picture');
      const servicePicture = card.querySelector('.service-card__image');
      const colorDefault = servicePicture.getAttribute('data-color-default')

      if (color.classList.contains('service-card__color--selected')) {
        servicePicture.setAttribute('src', colorDefault);
        color.classList.toggle('service-card__color--selected');
      }

      else {
        servicePicture.setAttribute('src', colorPicture);
        color.classList.toggle('service-card__color--selected');
      }
    },

    ResetColor: (colors) => {
      colors.forEach(color => {
        color.classList.remove('service-card__color--selected');
      });
    }
  }
})();


function ServiceTemplate(data, key) {
  let advantages = '';
  let colors = '';
  let price = ''
  let link = ''

  data.advantage.forEach(element => advantages += `<li class="list__item">${element}</li>`);

  if (data.color === 'Отсутсвуют') colors = `<div class="pt-1">Зависит от материала</div>`;
  else {
    data.color.forEach(colorName => colors +=
      `<div
        data-color="${colorName[0]}"
        style="background-color: ${colorName[1]};"
        data-picture="${colorName[2]}"
        class="service-card__color"></div>`
    );
  }

  if (data.price === 'Не указана') price = `<span class="service-card__cost service-card__cost--empty">Не указана</span>`;
  else price = `<span class="service-card__cost">${data.price}</span>`;

  if (key === "carving" || key === "warming") link = "#callback";
  else link = "#calculator";

  return `
<div class="service__card service-card" data-material=${key}>
  <div class="service-card__picture lazy">
    <img data-src="${data.picture}" data-color-default="${data.picture}" alt="" class="service-card__image lazy__item">
    <img src="img/misc/preloader.svg" alt="" class="preloader">
  </div>
  <div class="service-card__wrapper">
    <div class="service-card__header">
      <h3 class="service-card__title me-2">${data.name}</h3>
      <div class="service-card__info">
        <svg class="service-card__icon" width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12.906 24.917C6.27859 24.917 0.906006 19.5444 0.906006 12.917C0.906006 6.28958 6.27859 0.916992 12.906 0.916992C19.5334 0.916992 24.906 6.28958 24.906 12.917C24.906 19.5444 19.5334 24.917 12.906 24.917ZM12.906 22.7352C18.3284 22.7352 22.7242 18.3394 22.7242 12.917C22.7242 7.49456 18.3284 3.09881 12.906 3.09881C7.48357 3.09881 3.08782 7.49456 3.08782 12.917C3.08782 18.3394 7.48357 22.7352 12.906 22.7352ZM12.9064 18.3697C12.3037 18.3697 11.8151 17.8813 11.8151 17.2788C11.8151 16.6763 12.3037 16.1879 12.9064 16.1879C13.5091 16.1879 13.9976 16.6763 13.9976 17.2788C13.9976 17.8813 13.5091 18.3697 12.9064 18.3697ZM13.9969 15.0988H11.8151C11.8151 13.2425 12.4965 12.4475 14.0545 11.6685C14.951 11.2203 15.0878 11.0606 15.0878 10.1897C15.0878 9.16035 14.2993 8.55336 12.906 8.55336C11.701 8.55336 10.7242 9.53019 10.7242 10.7352H8.54237C8.54237 8.3252 10.496 6.37154 12.906 6.37154C15.398 6.37154 17.2696 7.81222 17.2696 10.1897C17.2696 12.0461 16.5883 12.841 15.0302 13.62C14.1337 14.0683 13.9969 14.2279 13.9969 15.0988Z"
            fill="#A5A5A5">
          </path>
        </svg>
        <div class="service-card__tooltip tooltip tooltip-service">
          ${data.description}
        </div>
        <!-- /.service-card__tooltip -->
      </div>
      <!-- /.service-card__info -->
    </div>
    <!-- /.service-card__header -->

    <div class="row mb-5">
      <div class="col-6">
        <div class="service-card__section">
          <h4 class="service-card__subtitle mb-4">Цвета</h4>
          <div class="service-card__palette">
            ${colors}
          </div>
          <!-- /.service-card__palette -->
        </div>
        <!-- /.service-card__section -->
      </div>
      <!-- /.col-6 -->

      <div class="col-6">
        <div class="service-card__section">
          <h4 class="service-card__subtitle mb-4">Преимущества</h4>
          <ul class="service-card__list list">
            ${advantages}
          </ul>
          <!-- /.service-card__palette -->
        </div>
        <!-- /.service-card__section -->
      </div>
      <!-- /.col-6 -->
    </div>
    <!-- /.row -->

    <div class="service-card__price pt-3">
      <span class="service-card__subtitle me-3">Стоимость</span>
      ${price}
    </div>
    <!-- /.service-card__price -->
  </div>
  <!-- /.service-card__wrapper -->

  <a href="${link}" class="service-card__button">Заказать</a>
</div>
<!-- /.service__card service-card -->
</div>
`
}