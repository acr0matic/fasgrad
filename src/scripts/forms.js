const forms = document.querySelectorAll('form');

forms.forEach(form => {
  const formMessage = form.querySelector('.form__info');

  const fields = form.querySelectorAll('input, textarea');
  const requiredFields = form.querySelectorAll('[data-required]');

  const caclulator = form.querySelector('input[name=include_calc]');

  let formData;

  phone = form.querySelector('input[type=tel]');

  IMask(phone, {
    mask: '+{7} (000) 000-00-00',
    prepare: (appended, masked) => (appended === '8' && masked.value === '') ? '' : appended
  });

  requiredFields.forEach(field => {
    field.addEventListener('click', () => {
      field.parentNode.classList.remove('input__error')
      formMessage.classList.remove('form__info--show');
      formMessage.classList.remove('form__info--error');
    });
  });

  form.onsubmit = async (e) => {
    e.preventDefault();

    if (InputValidation(requiredFields)) {
      formData = new FormData(form);

      if (caclulator && caclulator.checked) {
        formData.append('include_calc', 'true');
        formData.append('data', JSON.stringify(CalculatorData));
      }

      try {
        let response = await fetch('php/mail.php', {
          method: 'POST',
          body: formData,
        });

        // let result = await response.json();
        // console.log(result)

        MicroModal.close('modal-callback');
        MicroModal.show('modal-accept', modalParams);

        ClearForm(fields);
      }

      catch {
        console.error('Ошибка на стороне сервера');
      }
    }

    else {
      formMessage.innerHTML = 'Вы ошиблись при вводе! Попробуйте снова.'

      formMessage.classList.remove('form__info--accept');
      formMessage.classList.add('form__info--show', 'form__info--error');
    }
  };
});

function InputValidation(inputs) {
  let isValide = false;

  inputs.forEach(field => {
    if (!field.value) field.parentNode.classList.add('input__error')
  });

  var BreakException = {};
  inputs.forEach(field => {
    try {
      isValide = field.parentNode.classList.contains('input__error') ? false : true;

      if (!isValide) throw BreakException;
    }

    catch (e) {
      if (e !== BreakException) throw e;
    }
  });

  return isValide;
}

function ClearForm(fields) {
  console.log("🚀 ~ file: forms.js ~ line 91 ~ ClearForm ~ fields", fields)
  fields.forEach(field => {
    field.value = '';

    if (field.tagName === 'UL') {
      const defaultItem = field.querySelector('li[style="display: none;"]');
      const selectedItem = field.querySelector('.select__item--selected');

      defaultItem.style.display = 'block';
      selectedItem.classList.remove('select__item--selected');
    }
  });
}