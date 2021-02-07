const CalculatorData = {
  "Цвет": "Не указан",
  "3D-Визуализация": "Нет",
  "Утепление": "Нет",
  "Ветрозащита": "Нет",
};

let totalPrice;

const Calculator = (() => {
  let calculator,
    calculatorMaterial,
    calculatorSelect,
    calculatorInput,
    calculatorColor,
    calculatorTotal,
    calculatorAdvanced,
    calculatorFinal,
    inputMask;

  let calculatorData, materialData, currentMaterial;

  const inputPattern = {
    mask: /^[1-9]\d{0,3}$/
  }

  return {
    Init: (data) => {
      calculator = document.getElementById('calculator');
      calculatorInput = calculator.querySelector('.input__field');
      calculatorSelect = calculator.querySelector('.select');
      calculatorSelectItems = calculatorSelect.querySelectorAll('.select__item');
      calculatorTotal = calculator.querySelector('.calculator-total');
      calculatorService = calculatorTotal.querySelectorAll('.calculator-total__service');
      calculatorMaterial = calculatorTotal.querySelector('.calculator-total__material');

      calculatorColor = calculator.querySelector('.calculator-paint');
      calculatorCurrentColor = calculatorColor.querySelector('.calculator-paint__current .calculator-paint__color');
      calculatorPalette = calculatorColor.querySelectorAll('.calculator-paint__color');

      calculatorAdvanced = calculator.querySelector('.calculator-advanced');
      calculatorFinal = calculator.querySelector('.calculator-final');
      calculatorOptions = calculatorAdvanced.querySelectorAll('input[type=checkbox]');
      calculatorOptionExtra = calculatorAdvanced.querySelector('.calculator-advanced__extra');

      materialData = data;

      totalPrice = {
        "base": 0,
        "visualization": materialData.option.visualization,
        "wind": 0,
        "warming": 0,
        "final": 0,
      }

      inputMask = IMask(calculatorInput, inputPattern);

      Calculator.SetList(data);
      Calculator.SetListeners();
      Calculator.SetTooltip();

      calculatorData = data;

      Calculator.Activate();
      Calculator.ChangePrice(calculatorInput.value);
      Calculator.ChangeFinal();
    },

    SetList: (data) => {
      const list = calculatorSelect.querySelector('.select__list');
      const materials = data.material;
      list.innerHTML = '<li class="select__item select__item--default">Выберите услугу</li>';

      for (const key in materials) {
        const material = materials[key];

        if (key !== "carving" && key !== "warming")
          list.innerHTML += `<li data-material="${key}" data-name="${material.name}" class="select__item select__item--hide">${material.name}</li>`
      }

      InitSelect(calculatorSelect);
    },

    GetList: () => {
      return calculatorSelect;
    },

    SetListeners: () => {
      calculatorInput.addEventListener('blur', () => {
        if (!calculatorInput.value) calculatorInput.value = 1;
        inputMask.updateValue();
      });

      calculatorInput.addEventListener('input', () => {
        Calculator.Activate(calculatorInput.value);
        Calculator.ChangePrice(calculatorInput.value);
        Calculator.ChangeFinal();
      });

      calculatorInput.addEventListener('blur', () => Calculator.ChangePrice(calculatorInput.value));
      calculatorSelect.addEventListener('click', () => Calculator.SelectMaterial());

      calculatorOptions.forEach(checkbox => {
        const type = checkbox.getAttribute('data-calculator');

        if (type === 'visualization') {
          checkbox.addEventListener('change', () => {
            if (checkbox.checked) CalculatorData['3D-Визуализация'] = 'Да';
            else CalculatorData['3D-Визуализация'] = 'Нет';
          });
        }

        if (type === 'warming') {
          checkbox.addEventListener('change', () => {
            const option = calculatorOptionExtra.querySelector('input');
            if (option.checked) {
              Calculator.WriteTotal('wind');
              option.checked = false;
              CalculatorData['Ветрозащита'] = 'Нет';
            }

            if (checkbox.checked) CalculatorData['Утепление'] = 'Да';
            else CalculatorData['Утепление'] = 'Нет';

            calculatorOptionExtra.classList.toggle('calculator-advanced__extra--visible')

            Calculator.WriteTotal(type);

            Calculator.ChangePrice(calculatorInput.value);
            Calculator.ChangeFinal();
          });
        }

        if (type === 'wind') {
          checkbox.addEventListener('change', () => {
            Calculator.WriteTotal(type)

            if (checkbox.checked) CalculatorData['Ветрозащита'] = 'Да';
            else CalculatorData['Ветрозащита'] = 'Нет';

            Calculator.ChangePrice(calculatorInput.value);
            Calculator.ChangeFinal();
          });
        }
      });
    },

    Activate: () => {
      calculatorOptions.forEach(option => {
        if (currentMaterial) {
          calculatorInput.parentElement.classList.remove('input--disabled')
          calculatorInput.removeAttribute("disabled");
          option.parentElement.classList.remove('checkbox--disabled');
          option.removeAttribute("disabled");
        }

        else {
          calculatorInput.parentElement.classList.add('input--disabled');
          calculatorInput.setAttribute("disabled", "disabled");
          option.parentElement.classList.add('checkbox--disabled');
          option.setAttribute("disabled", "disabled");
        }
      });
    },

    SelectMaterial: () => {
      const selected = calculatorSelect.querySelector('.select__item--selected');

      if (selected) {
        let material = selected.getAttribute('data-material')
        calculatorMaterial.innerHTML = selected.getAttribute('data-name');

        calculatorCurrent = material;
        Calculator.SetMaterial(material)
        Calculator.WriteTotal('size');

        Calculator.SetPalette();
        Calculator.Activate();
      }

      Calculator.ChangePrice(calculatorInput.value);
      Calculator.ChangeFinal();
    },

    SetTooltip: () => {
      const finalIcon = calculatorFinal.querySelector('.calculator-final__icon');
      const finalTooltip = calculatorFinal.querySelector('.tooltip');

      const advancedIcon = calculatorAdvanced.querySelector('.calculator-advanced__icon');
      const advancedTooltip = calculatorAdvanced.querySelector('.tooltip');

      const tooltipBounding = advancedTooltip.getBoundingClientRect();

      function Hover(trigger, element) {
        trigger.addEventListener('mouseover', () => {
          if (tooltipBounding.right > (window.innerWidth || document.documentElement.clientWidth))
            element.classList.add('service-card__tooltip--left');

          element.classList.add('tooltip--visible');
        });

        trigger.addEventListener('mouseout', () => element.classList.remove('tooltip--visible'));
      }

      Hover(finalIcon, finalTooltip);
      Hover(advancedIcon, advancedTooltip);
    },

    SetPalette: () => {
      calculatorColor.classList.add('calculator-paint--visible');
      const palette = calculatorColor.querySelector('.calculator-paint__palette');
      const colors = calculatorData.material[currentMaterial].color;

      let newPalette;

      palette.innerHTML = '';

      colors.forEach(color => {
        let colorName = color[0], colorCode = color[1];

        palette.innerHTML += `<div class="calculator-paint__color" data-color="${colorName}" style="background-color: ${colorCode};"></div>`

        currentColor = palette.querySelector('.calculator-paint__color');
      });

      newPalette = palette.querySelectorAll('.calculator-paint__color');
      newPalette.forEach(color => color.addEventListener('click', () => Calculator.SetColor(color)));
    },

    SetColor: (color) => {
      colorName = color.getAttribute('data-color');

      calculatorCurrentColor.style.backgroundColor = color.style.backgroundColor;
      calculatorCurrentColor.style.border = 'none';

      CalculatorData['color'] = colorName;
    },

    WriteTotal: (option) => {
      const total = calculatorTotal.querySelector(`[data-calculator=${option}]`);

      if (option !== 'size') {
        total.classList.toggle('calculator-total__service--visible');
        total.classList.toggle('calculator-total__service--checked');
      }

      else total.classList.add('calculator-total__service--visible');

      Calculator.ChangeFinal();
    },

    ChangePrice: (value) => {
      const materials = materialData.material;
      const material = materials[currentMaterial];

      sizeData = value;

      if (currentMaterial) {
        totalPrice.base = value * material.price + ((value * 1.1) * 250);
        totalPrice.wind = ((value * 1.05) * 480) + value * 200;
        totalPrice.warming = ((value * 1.1) * 46) + value * 130;

        if (currentMaterial === 'stoneware')
          totalPrice.final = value * 1.05 * material.work_price;

        else if (currentMaterial === 'composite')
          totalPrice.final = value * 1.3 * material.work_price;

        else
          totalPrice.final = value * 1.1 * material.work_price;
      }

      calculatorService.forEach(service => {
        const size = service.querySelector('.calculator-total__size');
        const price = service.querySelector('.calculator-total__price');
        const type = service.getAttribute('data-calculator');

        let materialPrice;

        if (size) {
          if (value) size.innerHTML = value;
          else size.innerHTML = 1;
        }

        if (calculatorData.material[currentMaterial])
          materialPrice = calculatorData.material[currentMaterial].price;
        else materialPrice = 0;

        if (type === 'size') price.innerHTML = Calculator.FormatNumber(size.innerHTML * materialPrice);
        if (type === 'visualization') price.innerHTML = Calculator.FormatNumber(calculatorData.option.visualization);
        if (type === 'warming') price.innerHTML = Calculator.FormatNumber(totalPrice.warming);
        if (type === 'wind') price.innerHTML = Calculator.FormatNumber(totalPrice.wind);
      });
    },

    ChangeFinal: () => {
      const price = calculatorFinal.querySelector('.calculator-final__cost--new');
      const oldPrice = calculatorFinal.querySelector('.calculator-final__cost--old');

      const discount = Calculator.GetDiscount();
      let cost, costFinal;

      if (currentMaterial) {
        let total = totalPrice.base + totalPrice.final;

        if (CalculatorData["3D-Визуализация"] === "Да")
          total += totalPrice.visualization;

        if (totalPrice.warming !== 0 && CalculatorData["Утепление"] === "Да")
          total += totalPrice.warming;

        if (totalPrice.wind !== 0 && CalculatorData["Ветрозащита"] === "Да")
          total += totalPrice.wind;

        cost = total * 1.02;

        if (discount !== 1)
          costFinal = Math.ceil(cost * ((100 - discount) / 100));
        else
          costFinal = cost
      }

      else cost = 0;

      if (discount !== 1 && currentMaterial) {
        oldPrice.classList.remove('calculator-final__cost--hide')
        oldPrice.innerHTML = Calculator.FormatNumber(cost);
        price.innerHTML = Calculator.FormatNumber(costFinal);
      }

      else {
        oldPrice.classList.add('calculator-final__cost--hide')
        price.innerHTML = Calculator.FormatNumber(cost);
      };

      Calculator.ChangeDiscount(Calculator.GetDiscount());
    },

    ChangeDiscount: (discount) => {
      const discountBlock = calculatorFinal.querySelector('.calculator-final__discount');
      const percent = discountBlock.querySelector('.calculator-final__percent');

      if (discount === 1 || !currentMaterial) discountBlock.classList.add('calculator-final__discount--hide');
      else {
        discountBlock.classList.remove('calculator-final__discount--hide');
        percent.innerHTML = discount;
      }
    },

    GetDiscount: () => {
      const inputValue = calculatorInput.value;
      let discount;

      if (inputValue > 1000) discount = 8;
      else if (inputValue > 500) discount = 5;
      else discount = 1;

      return discount;
    },

    Log: () => {
      console.log(calculator);
      console.log(calculatorInput);
      console.log(calculatorSelect);
      console.log(calculatorColor);
      console.log(calculatorTotal);
      console.log(calculatorAdvanced);
      console.log(calculatorFinal);
    },

    FormatNumber: (number) => Math.floor(parseInt(number)).toLocaleString(),
    SetMaterial: (material) => currentMaterial = material,
  }
})();
