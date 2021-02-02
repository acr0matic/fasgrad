const CalculatorData = {
  "Цвет"            : "Не указан",
  "3D-Визуализация" : "Нет",
  "Утепление"       : "Нет",
  "Ветрозащита"     : "Нет",
};

const Calculator = (() => {
  let calculator,
    calculatorSelect,
    calculatorInput,
    calculatorColor,
    calculatorTotal,
    calculatorAdvanced,
    calculatorFinal;

  let calculatorData, currentMaterial;

  const inputPattern = {
    mask: /^[1-9]\d{0,3}$/
  }

  return {
    Init: () => {
      calculator = document.getElementById('calculator');
      calculatorInput = calculator.querySelector('.input__field');
      calculatorSelect = calculator.querySelector('.select');
      calculatorSelectItems = calculatorSelect.querySelectorAll('.select__item');
      calculatorTotal = calculator.querySelector('.calculator-total');
      calculatorService = calculatorTotal.querySelectorAll('.calculator-total__service');

      calculatorColor = calculator.querySelector('.calculator-paint');
      calculatorCurrentColor = calculatorColor.querySelector('.calculator-paint__current .calculator-paint__color');
      calculatorPalette = calculatorColor.querySelectorAll('.calculator-paint__color');

      calculatorAdvanced = calculator.querySelector('.calculator-advanced');
      calculatorFinal = calculator.querySelector('.calculator-final');
      calculatorOptions = calculatorAdvanced.querySelectorAll('input[type="checkbox"');
      calculatorOptionExtra = calculatorAdvanced.querySelector('.calculator-advanced__extra');

      IMask(calculatorInput, inputPattern);

      Calculator.SetListeners();
      Calculator.SetTooltip();

      fetch('../src/data/calculator.json')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          calculatorData = data;

          Calculator.ChangePrice(calculatorInput.value);
          Calculator.ChangeFinal();
        });
    },

    SetListeners: () => {
      calculatorInput.addEventListener('input', () => {
        Calculator.ChangePrice(calculatorInput.value);
        Calculator.ChangeFinal();
      });

      calculatorInput.addEventListener('blur', () => Calculator.ChangePrice(calculatorInput.value));
      calculatorSelect.addEventListener('click', () => Calculator.SelectMaterial());

      calculatorOptions.forEach(checkbox => {
        const type = checkbox.getAttribute('data-calculator');

        if (type === 'visualization') {
          checkbox.addEventListener('change', () => {
            Calculator.WriteTotal(type);

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
          });
        }

        if (type === 'wind') {
          checkbox.addEventListener('change', () => {
            Calculator.WriteTotal(type)

            if (checkbox.checked) CalculatorData['Ветрозащита'] = 'Да';
            else CalculatorData['Ветрозащита'] = 'Нет';
          });
        }
      });
    },

    SelectMaterial: () => {
      const selected = calculatorSelect.querySelector('.select__item--selected');

      if (selected) {
        Calculator.SetMaterial(selected.getAttribute('data-material'))
        Calculator.WriteTotal('size');

        Calculator.SetPalette();
      }

      Calculator.ChangePrice(calculatorInput.value);
      Calculator.ChangeFinal();
    },

    SetTooltip: () => {
      const finalIcon = calculatorFinal.querySelector('.calculator-final__icon');
      const finalTooltip = calculatorFinal.querySelector('.tooltip');

      const advancedIcon = calculatorAdvanced.querySelector('.calculator-advanced__icon');
      const advancedTooltip = calculatorAdvanced.querySelector('.tooltip');

      function Hover(trigger, element) {
        trigger.addEventListener('mouseover', () => element.classList.add('tooltip--visible'));
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
        if (type === 'warming') price.innerHTML = Calculator.FormatNumber(size.innerHTML * calculatorData.option.warming);
        if (type === 'wind') price.innerHTML = Calculator.FormatNumber(size.innerHTML * calculatorData.option.wind);
      });
    },

    ChangeFinal: () => {
      const totalPrice = calculatorTotal.querySelectorAll('[data-calculator=size] .calculator-total__price, .calculator-total__service--checked .calculator-total__price');
      const price = calculatorFinal.querySelector('.calculator-final__cost--new');
      const oldPrice = calculatorFinal.querySelector('.calculator-final__cost--old');

      let cost = 0;

      totalPrice.forEach(price => cost += parseInt(price.innerHTML.replace(/(&nbsp;)|\s/g, '')));

      if (Calculator.GetDiscount() !== 1) {
        oldPrice.classList.remove('calculator-final__cost--hide')
        oldPrice.innerHTML = Calculator.FormatNumber(cost);
        price.innerHTML = Calculator.FormatNumber((cost - (cost / 100) * Calculator.GetDiscount()));
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

      if (discount === 1) discountBlock.classList.add('calculator-final__discount--hide');
      else {
        discountBlock.classList.remove('calculator-final__discount--hide');
        percent.innerHTML = discount;
      }
    },

    GetDiscount: () => {
      const inputValue = calculatorInput.value;
      let multiplier, discount;

      if (inputValue >= 150) {
        multiplier = Math.floor(inputValue / 150);
        discount = 5 * multiplier;

        if (discount > 95) discount = 95;
      }

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

Calculator.Init();
// Calculator.Log();
