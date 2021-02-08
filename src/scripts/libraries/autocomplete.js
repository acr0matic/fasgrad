function autocomplete(inp, arr) {
  a = document.querySelector('.input-search__wrapper');
  var currentFocus;

  inp.addEventListener("input", function (e) {
    var b, i, val = this.value;
    closeAllLists();

    if (!val) { return false; }
    currentFocus = -1;


    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      let index = arr[i][1];

      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i][0].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        a.classList.add('input-search__wrapper--visible');
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.classList.add('input-search__item');
        b.innerHTML = "<strong>" + arr[i][0].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i][0].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i][0] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;

          serviceSlider.slideTo(index);
          closeAllLists();
        });
        a.appendChild(b);
      }
    }

  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    const array = a.querySelectorAll('div')

    a.classList.remove('input-search__wrapper--visible');
    array.forEach(item => a.removeChild(item))
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });

  inp.addEventListener('blur', () => {
    inp.classList.remove('input-search--active');
  });
}