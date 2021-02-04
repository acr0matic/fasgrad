const Service = (() => {
  let serviceWrapper, serviceCards;

  return {
    Init: (data) => {
      serviceWrapper = document.getElementById("service");
      serviceCards = serviceWrapper.querySelectorAll('.service-card');

      Service.SetListeners();
    },

    SetListeners: () => {
      serviceCards.forEach(card => {
        const icon = card.querySelector('.service-card__icon');
        const tooltip = card.querySelector('.service-card__tooltip');
        const tooltipBounding = tooltip.getBoundingClientRect();

        icon.addEventListener('mouseover', () => {
          if (tooltipBounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
            tooltip.classList.add('service-card__tooltip--left');
          }

          tooltip.classList.add('tooltip--visible');
        });
        icon.addEventListener('mouseout', () => tooltip.classList.remove('tooltip--visible'));
      });
    }
  }
})();