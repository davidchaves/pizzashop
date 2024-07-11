import { pizzaJson } from "./pizzas.js";

const cart = [];
let modalKey = 0;
let modalQt = 1;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
	const pizzaItem = c(".models .pizza__item").cloneNode(true);

	pizzaItem.setAttribute("data-key", index);
	pizzaItem.querySelector(".pizza__item--img img").src = item.img;
	pizzaItem.querySelector(".pizza__item--price").innerHTML =
		`R$ ${item.price.toFixed(2)}`;
	pizzaItem.querySelector(".pizza__item--name").innerHTML = item.name;
	pizzaItem.querySelector(".pizza__item--desc").innerHTML = item.description;
	c(".pizza__area").append(pizzaItem);

	pizzaItem.querySelector("a").addEventListener("click", (e) => {
		e.preventDefault();
		const key = e.target.closest(".pizza__item").getAttribute("data-key");
		modalQt = 1;
		modalKey = key;

		c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
		c(".pizzaInfo__desc").innerHTML = pizzaJson[key].description;
		c(".pizzaBig img").src = pizzaJson[key].img;
		c(".pizzaInfo__actualPrice").innerHTML =
			`R$ ${pizzaJson[key].price.toFixed(2)}`;
		c(".pizzaInfo__size.selected").classList.remove("selected");
		cs(".pizzaInfo__size").forEach((size, sizeIndex) => {
			if (sizeIndex === 2) {
				size.classList.add("selected");
			}
			size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
		});

		c(".pizzaInfo__qt").innerHTML = modalQt;
		c(".pizzaWindowArea").style.display = "flex";
		c(".pizzaWindowArea").style.opacity = 0;
		setTimeout(() => {
			c(".pizzaWindowArea").style.opacity = 1;
		}, 200);
	});
});

/* Eventos do MODAL */
function closeModal() {
	c(".pizzaWindowArea").style.opacity = 0;
	setTimeout(() => {
		c(".pizzaWindowArea").style.display = "none";
	}, 500);
}

// biome-ignore lint/complexity/noForEach: <explanation>
cs(".pizzaInfo__cancelButton, .pizzaInfo__cancelMobileButton").forEach(
	(item) => {
		item.addEventListener("click", closeModal);
	},
);

c(".pizzaInfo__qtmenos").addEventListener("click", () => {
	if (modalQt > 1) {
		modalQt--;
		c(".pizzaInfo__qt").innerHTML = modalQt;
	}
});
c(".pizzaInfo__qtmais").addEventListener("click", () => {
	if (modalQt < 10) {
		modalQt++;
		c(".pizzaInfo__qt").innerHTML = modalQt;
	}
});
cs(".pizzaInfo__size").forEach((size, sizeIndex) => {
	size.addEventListener("click", (e) => {
		c(".pizzaInfo__size.selected").classList.remove("selected");
		size.classList.add("selected");
	});
});

c(".pizzaInfo__addButton").addEventListener("click", () => {
	const size = Number.parseInt(
		c(".pizzaInfo__size.selected").getAttribute("data-key"),
	);

	const identifier = `${pizzaJson[modalKey].id}@${size}`;

	const key = cart.findIndex((item) => item.identifier === identifier);
	if (key > -1) {
		cart[key].qt += modalQt;
	} else {
		cart.push({
			identifier,
			id: pizzaJson[modalKey].id,
			size,
			qt: modalQt,
		});
	}
	updateCart();
	closeModal();
});

c(".menu__openner").addEventListener("click", () => {
	if (cart.length > 0) {
		c("aside").style.left = "0";
	}
});
c(".menu__closer").addEventListener("click", () => {
	c("aside").style.left = "100vw";
});

function updateCart() {
	c(".menu__openner span").innerHTML = cart.length;

	if (cart.length > 0) {
		c("aside").classList.add("show");
		c(".cart").innerHTML = "";
		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for (const i in cart) {
			const pizzaItem = pizzaJson.find((item) => item.id === cart[i].id);
			subtotal += pizzaItem.price * cart[i].qt;

			const cartItem = c(".models .cart__item").cloneNode(true);

			let pizzaSizeName;
			switch (cart[i].size) {
				case 0:
					pizzaSizeName = "P";
					break;
				case 1:
					pizzaSizeName = "M";
					break;
				case 2:
					pizzaSizeName = "G";
					break;
			}
			const pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;

			cartItem.querySelector("img").src = pizzaItem.img;
			cartItem.querySelector(".cart__item--nome").innerHTML = pizzaName;
			cartItem.querySelector(".cart__item--qt").innerHTML = cart[i].qt;

			cartItem
				.querySelector(".cart__item--qtmenos")
				.addEventListener("click", () => {
					if (cart[i].qt > 1) {
						cart[i].qt--;
					} else {
						cart.splice(i, 1);
					}
					updateCart();
				});
			cartItem
				.querySelector(".cart__item--qtmais")
				.addEventListener("click", () => {
					cart[i].qt++;
					updateCart();
				});

			c(".cart").append(cartItem);
		}
		desconto = subtotal * 0.1;
		total = subtotal - desconto;

		c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
		c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
		c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
	} else {
		c("aside").classList.remove("show");
		c("aside").style.left = "100vw";
	}
}
