// Код popup Товар добавлен в корзину

var buy = document.querySelectorAll(".buy-tool");
var productAddedCart = document.querySelector(".notice-item-added-to-cart");
var buttonClose = productAddedCart.querySelector(".button-close");
var popupOpacityAddedCart = document.querySelector(".opacity-added-cart");


for(var i = 0; i < buy.length; i++) {
  var buyClick = buy[i];
    buyClick.addEventListener("click", function(evt) {
      evt.preventDefault();
      productAddedCart.classList.add("notice-item-added-to-cart-show");
      if("notice-item-added-to-cart-show") {
        popupOpacityAddedCart.classList.add("opacity-added-cart-show");
      } else {
        popupOpacityAddedCart.classList.remove("opacity-added-cart-show");
      }
    });
  }

buttonClose.addEventListener("click", function(evt) {
  evt.preventDefault();
  productAddedCart.classList.remove("notice-item-added-to-cart-show");
  popupOpacityAddedCart.classList.remove("opacity-added-cart-show");
});

window.addEventListener("keydown", function(evt) {
  if(evt.keyCode === 27) {
    if(productAddedCart.classList.contains("notice-item-added-to-cart-show") || popupOpacityAddedCart.classList.contains("opacity-added-cart-show")) {
     evt.preventDefault();
      productAddedCart.classList.remove("notice-item-added-to-cart-show");
      popupOpacityAddedCart.classList.remove("opacity-added-cart-show");
    }
  }
});
//Код popup form

/*ищем подходящий селектор во всем документе*/

var buttonOpenForm = document.querySelector(".open-form-feedback");
var popupForm = document.querySelector(".popup-form");
var popupOpacity = document.querySelector(".popup-opacity");

/*ищем подходящий селектор в форме*/

var popupClose = popupForm.querySelector(".button-close");
var formFeedback = popupForm.querySelector('.form-feedback');
var nameField = popupForm.querySelector(".name-field");
var emailField = popupForm.querySelector(".email-field");


/*Не все браузеры поддерживают localStorage поэтому проверим работоспособность.*/

var isStorageSupport = true;
var storage = "";

try {
  storage = localStorage.getItem("name");
} catch (err) {
  isStorageSupport = false;
}

/*Обработчик событй для отображения формы */

  buttonOpenForm.addEventListener("click", function(evt) {

 /*Стандартное действие по умолчанию у ссылки переход на другую страницу.
 Такое поведение нам не нужно, поэтому отключим его.*/

    evt.preventDefault();
    popupForm.classList.add("popup-form-show");
    if("popup-form-show") {
      popupOpacity.classList.add("popup-opacity-show");
    } else {
      popupOpacity.classList.remove("popup-opacity-show");
    }
    if(storage) {
      nameField.value = storage;
      emailField.focus();
     } else {

    /*Установим фокус при открытии модального окна в поле ввода логина. */
      nameField.focus();
    }
  });

  /*Обработчик событий для закрытия формы*/

  popupClose.addEventListener("click", function(evt) {
    evt.preventDefault();
    popupForm.classList.remove("popup-form-show");
    popupForm.classList.remove("popup-form-error");
    popupOpacity.classList.remove("popup-opacity-show");
  });

  /*Повесим обработчик отправки данных на форму и отменим его. */

  formFeedback.addEventListener("submit", function(evt) {
    if(!nameField.value || !emailField.value) {
      evt.preventDefault();
      popupForm.classList.remove("popup-form-error");
      popupForm.offsetWidth = popupForm.offsetWidth;
      popupForm.classList.add("popup-form-error");
    } else {
      if (isStorageSupport) {
        localStorage.setItem("name", nameField.value);
      }
    }
  });

  /*Добавим обработчик события, который будет отлавливать
  нажатие кнопки Esc и в случае, если модальное окно открыто, закрывать его.*/

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      if (popupForm.classList.contains("popup-form-show") || popupOpacity.classList.contains("popup-opacity-show")) {
        evt.preventDefault();
        popupForm.classList.remove("popup-form-show");
        popupForm.classList.remove("popup-form-error");
        popupOpacity.classList.remove("popup-opacity-show");
      }
    }
  });


// Popup Map

var mapsLink = document.querySelector(".maps-link");
var popupMap = document.querySelector(".maps-popup");
var buttonCloseMap = popupMap.querySelector(".button-close");
var popupOpacityMap = document.querySelector(".popup-opacity-map");


mapsLink.addEventListener("click", function(evt) {
  evt.preventDefault();
  popupMap.classList.add("maps-popup-show");
    if("maps-popup-show") {
      popupOpacityMap.classList.add("popup-opacity-map-show");
    } else {
      popupOpacityMap.classList.remove("popup-opacity-map-show");
    }
});

buttonCloseMap.addEventListener("click", function(evt) {
  evt.preventDefault();
  popupMap.classList.remove("maps-popup-show");
  popupOpacityMap.classList.remove("popup-opacity-map-show");
});

window.addEventListener("keydown", function(evt) {
  if(evt.keyCode === 27) {
    if(popupMap.classList.contains("maps-popup-show") || popupOpacityMap.classList.contains("popup-opacity-map-show")) {
     evt.preventDefault();
      popupMap.classList.remove("maps-popup-show");
      popupOpacityMap.classList.remove("popup-opacity-map-show");
    }
  }
});




