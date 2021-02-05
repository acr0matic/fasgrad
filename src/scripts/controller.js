fetch('../src/data/production.json')
.then((response) => response.json())
.then((data) => {
  Calculator.Init(data);
  Service.Init(data);

  scrollTo();
});

