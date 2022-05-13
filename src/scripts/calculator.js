const CalculatorData = {
  "Материал": "Не указан",
  "Площадь": "Не указана",
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
        "work": 0,
        "scaffold": 0,
        "visualization": materialData.option.visualization,
        "wind": 0,
        "wind_work": 0,
        "warming": 0,
        "warming_work": 0,
        "material": 0,
        "final": 0,
      }

      inputMask = IMask(calculatorInput, inputPattern);

      Calculator.SetList(data);
      Calculator.SetListeners();
      Calculator.SetTooltip();

      calculatorData = data;
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
      calculatorSelectItems = calculatorSelect.querySelectorAll('.select__item');
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
        CalculatorData["Площадь"] = calculatorInput.value + ' м²';
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

            Calculator.WriteTotal(type);
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

        CalculatorData["Материал"] = selected.getAttribute('data-name');

        calculatorCurrent = material;
        Calculator.SetMaterial(material)
        Calculator.WriteTotal('material');

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
        if (window.matchMedia("(max-width: 996px)").matches) {
          trigger.addEventListener('touchstart', () => {
            if (tooltipBounding.right > (window.innerWidth || document.documentElement.clientWidth))
              element.classList.add('service-card__tooltip--left');

            element.classList.add('tooltip--visible');
          });

          window.addEventListener('touchstart', (e) => {
            if (!trigger.contains(e.target) && !element.contains(e.target))
              element.classList.remove('tooltip--visible');
          })
        }

        else {
          trigger.addEventListener('mouseover', () => {
            if (tooltipBounding.right > (window.innerWidth || document.documentElement.clientWidth))
              element.classList.add('service-card__tooltip--left');

            element.classList.add('tooltip--visible');
          });

          trigger.addEventListener('mouseout', () => element.classList.remove('tooltip--visible'));
        }
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

      CalculatorData['Цвет'] = colorName;
    },

    WriteTotal: (option) => {
      const total = calculatorTotal.querySelectorAll(`[data-calculator=${option}]`);

      total.forEach(item => {
        if (option !== 'material') {
          item.classList.toggle('calculator-total__service--visible');
          item.classList.toggle('calculator-total__service--checked');
        }

        else item.classList.add('calculator-total__service--visible');
      });


      Calculator.ChangeFinal();
    },

    ChangePrice: (value) => {
      const materials = materialData.material;
      const material = materials[currentMaterial];

      sizeData = value;

      if (currentMaterial) {
        totalPrice.work = value * material.work_price;
        // console.log("Цена за работу: " + totalPrice.work);

        totalPrice.scaffold = (value * 1.1) * 250;
        // console.log("Цена за строительные леса: " + totalPrice.scaffold);

        totalPrice.warming = ((value * 1.08) * 480) + value * 200;
        totalPrice.warming_work = value * 200;
        // console.log("Цена за утепление: " + totalPrice.warming);

        totalPrice.wind = ((value * 1.10) * 46) + value * 130;
        totalPrice.wind_work = value * 130;
        // console.log("Цена за ветрозащиту: " + totalPrice.wind);

        if (currentMaterial === 'stoneware') totalPrice.material = value * 1.05 * material.price;
        else if (currentMaterial === 'composite') totalPrice.material = value * 1.30 * material.price;
        else totalPrice.material = value * 1.10 * material.price;

        // console.log("Цена за материалы: " + totalPrice.material);

        if (CalculatorData['Утепление'] === 'Да' && CalculatorData['Ветрозащита'] === 'Да')
          totalPrice.final = totalPrice.work + totalPrice.warming + totalPrice.wind + totalPrice.material;

        else if (CalculatorData['Утепление'] === 'Да')
          totalPrice.final = totalPrice.work + totalPrice.warming + totalPrice.material;

        else
          totalPrice.final = totalPrice.work + totalPrice.material;

        if (value > 50) {
          totalPrice.final += totalPrice.scaffold;
          totalPrice.final *= 1.02;
        }

        // console.log("Итого без скидки: " + totalPrice.final);
      }

      calculatorService.forEach(service => {
        const category = service.closest('.calculator__group').dataset.type;

        const size = service.querySelector('.calculator-total__size');
        const price = service.querySelector('.calculator-total__price');

        const type = service.getAttribute('data-calculator');

        let materialPrice;

        if (size) {
          if (value) size.innerHTML = value;
          else size.innerHTML = 1;
        }

        if (category === 'price') {
          if (calculatorData.material[currentMaterial])
            materialPrice = calculatorData.material[currentMaterial].price;
          else materialPrice = 0;

          if (type === 'material') price.innerHTML = Calculator.FormatNumber(totalPrice.material);
          if (type === 'warming') price.innerHTML = Calculator.FormatNumber(totalPrice.warming);
          if (type === 'wind') price.innerHTML = Calculator.FormatNumber(totalPrice.wind);
        }

        else if (category === 'assembly') {
          if (type === 'material') price.innerHTML = Calculator.FormatNumber(totalPrice.work);
          if (type === 'warming') price.innerHTML = Calculator.FormatNumber(totalPrice.warming_work);
          if (type === 'wind') price.innerHTML = Calculator.FormatNumber(totalPrice.wind_work);
        }
      });
    },

    ChangeFinal: () => {
      const price = calculatorFinal.querySelector('.calculator-final__cost--new');
      const oldPrice = calculatorFinal.querySelector('.calculator-final__cost--old');

      const discount = Calculator.GetDiscount();
      let costFinal;

      if (currentMaterial) {
        if (discount !== 1) costFinal = Math.ceil(totalPrice.final * ((100 - discount) / 100));
        else costFinal = totalPrice.final;
      }

      if (discount !== 1 && currentMaterial) {
        oldPrice.classList.remove('calculator-final__cost--hide')
        oldPrice.innerHTML = Calculator.FormatNumber(totalPrice.final);
        price.innerHTML = Calculator.FormatNumber(costFinal);
      }

      else {
        oldPrice.classList.add('calculator-final__cost--hide')
        price.innerHTML = Calculator.FormatNumber(totalPrice.final);
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
