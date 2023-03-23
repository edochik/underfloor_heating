// Slider

new Swiper('.hero__slider', {
	slidesPerView: 2,
	spaceBetween: 10,
	loop: true,
	speed: 1000,
	navigation: {
		prevEl: '.hero__slider-btn--prev',
		nextEl: '.hero__slider-btn--next',
	},
	autoplay: {
		delay: 700,
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
		},
		560: {
			spaceBetween: 8,
		}
	}
});


//Calculator

const calcForm = document.querySelector('.js-calc-form'); // находим саму форму
const totalSquare = document.querySelector('.js-square'); //находим текст с площадью
const totalPrice = document.querySelector('.js-total-price'); // находим текст с суммой
const calcResultWrapper = document.querySelector('.calc__result-wrapper'); // находим саму обертку с информацией.
const btnSubmit = document.querySelector('.js-submit');
const calcOrder = document.querySelector('.calc__order');

// в переменную заносим информацию по радио кнопкам с тарифами
const tariff = {
	economy: 550,
	comfort: 1400,
	premium: 2700,
}

//конструкция для того чтобы кнопка активировалась, после ввода данных в два инпута
calcForm.addEventListener('input', (event) => {
	btnSubmit.disabled = !(calcForm.width.value > 0 && calcForm.length.value > 0);
});

calcForm.addEventListener('submit', (event) => {
	event.preventDefault(); // Отменяем перезагрузку страницы
	if (calcForm.width.value > 0 && calcForm.length.value > 0) {
		const square = calcForm.width.value * calcForm.length.value;
		const sum = square * tariff[calcForm.tariff.value];

		calcResultWrapper.classList.add('calc__result-wrapper--show');
		calcOrder.classList.add('calc__order--show');
		totalSquare.textContent = `${square} кв м`;
		totalPrice.textContent = `${sum} руб`;
	}
})

// Модальное окно
const modalController = ({ modal, btnOpen, btnClose, time = 300 }) => {
	const buttonElems = document.querySelectorAll(btnOpen);
	const modalElem = document.querySelector(modal);

	modalElem.style.cssText = `
		display:flex;
		visibility: hidden;
		opacity: 0;
		transition: opacity ${time}ms ease-in-out;
	`;

	const closeModal = event => {
		const target = event.target;
		if (
			target === modalElem ||
			(btnClose && target.closest(btnClose)) ||
			event.code === 'Escape') {
			modalElem.style.opacity = 0;

			setTimeout(() => {
				modalElem.style.visibility = 'hidden';
			}, time);
			window.removeEventListener('keydown', closeModal);
		}
	}

	const openModal = () => {
		modalElem.style.visibility = 'visible';
		modalElem.style.opacity = 1;
		window.addEventListener('keydown', closeModal);
	}

	buttonElems.forEach(btn => {
		btn.addEventListener('click', openModal);
	})

	modalElem.addEventListener('click', closeModal);
};

modalController({
	modal: '.modal',
	btnOpen: '.j-order',
	btnClose: '.modal__close',
});

//--------Mask--с-помощью-библиотеке--inputmask
const phone = document.getElementById('phone');
const imPhone = new Inputmask('+7(999)999-99-99');

imPhone.mask(phone);

//-------just-validate----
const validator = new JustValidate('.modal__form', {
	errorLabelCssClass: 'modal__input-error',
	errorLabelStyle: {
		color: '#FFC700',
	}
});

validator.addField('#name', [
	{
		rule: 'required',
		errorMessage: 'Как вас зовут?'
	},
	{
		rule: 'minLength',
		value: 3,
		errorMessage: 'Не короче 3-х символов'
	},
	{
		rule: 'maxLength',
		value: 30,
		errorMessage: 'Слишком длинное имя'
	}
]);
validator.addField('#phone', [
	{
		rule: 'required',
		errorMessage: 'Укажите ваш телефон'
	},
	{
		validator: value => {
			const number = phone.inputmask.unmaskedvalue()
			// console.log('number: ', number);
			return number.length === 10;
		},
		errorMessage: 'Телефон не корректный'
	}
]);

validator.onSuccess((event) => {
	const form = event.currentTarget

	fetch('https://jsonplaceholder.typicode.com/posts', {
		method: 'POST',
		body: JSON.stringify({
			name: form.name.value,
			phone: form.phone.value
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
		.then((response) => response.json())
		.then((data) => {
			form.reset();
			alert(`Спасибо мы с вами свяжемся, ваша заявка под номером: ${data.id}`)
		});
})