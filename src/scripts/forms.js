const forms = document.querySelectorAll('form');
let selectedValue;

forms.forEach(form => {
  const formMessage = form.querySelector('.form__info');
  const formType = form.getAttribute('data-form');

  const fields = form.querySelectorAll('input, textarea');
  const requiredFields = form.querySelectorAll('[data-required]');

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
      formData.append('user_select', selectedValue);
      formData.append('form_type', formType);

      try {
        let response = await fetch('php/mail.php', {
          method: 'POST',
          body: formData,
        });

        // let result = await response.json();
        // console.log(result)

        MicroModal.show('modal-accept', modalParams);

        ClearForm(requiredFields);
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