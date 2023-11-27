let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");
let basket = JSON.parse(localStorage.getItem("data")) || [];
let toTopButton = document.getElementById("toTopBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    toTopButton.style.display = "block";
  } else {
    toTopButton.style.display = "none";
  }
}

function toTopFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
      <div class="cart-item">
        <img width="200" src=${search.img} alt="" />
        <div class="details">
          <div class="title-price-x">
            <h4 class="title-price">${search.name}</h4>
            <i onclick="removeItem(${id})" class="bi bi-x-lg remove-item-button"></i>
          </div>
          <p class="cart-item-price">${search.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
          
          <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
          </div>

          <p class="totalPrice">${(item * search.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}<p>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Giỏ hàng đang trống</h2>
    <a href="index.html">
      <button class="HomeBtn">Về trang chủ</button>
    </a>
    `;
  }
};

generateCartItems();

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

let removeItem = (id) => {
  let selectedItem = id;
  
  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];

        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);

    label.innerHTML = `
    <h2>Tổng hóa đơn : ${amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</h2>
    <button class="checkout">Thanh toán</button>
    <button onclick="clearCart()" class="removeAll">Xóa hết</button>
    `;
  } else return;
};

TotalAmount();
