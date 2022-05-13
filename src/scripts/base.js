const path = '../src';

const modalParams = {
  awaitCloseAnimation: true,
  disableScroll: true,
  disableFocus: false,
};

const scrollParams = {
  speed: 500,
  speedAsDuration: true,
  offset: 0,
}

if (window.matchMedia('(max-width: 768px)').matches) scrollParams.offset = 105;
else scrollParams.offset = -15;