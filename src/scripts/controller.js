fetch(`${path}/data/production.json`)
.then((response) => response.json())
.then((data) => {
  Calculator.Init(data);
  Service.Init(data);

  let index = 0;
  let materialsName = [];
  const materials = data.material;

  for (const key in materials) {
    const material = materials[key];
    materialsName.push([material.name, index++]);
  }

  autocomplete(document.getElementById("search"), materialsName);
  scrollTo();
});