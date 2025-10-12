document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "cart";
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("cart-total");
  const discountMsg = document.getElementById("discount-msg");

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }
  function saveCart(c) {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
  }

  function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById("cart-count");
    if (el) el.textContent = total;
  }

  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      cartItemsEl.innerHTML = "<p>🛒 Giỏ hàng trống</p>";
      subtotalEl.textContent = "0 đ";
      totalEl.textContent = "0 đ";
      updateCartCount();
      return;
    }

    cart.forEach((item, i) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>${item.price.toLocaleString()} đ</p>
          <p>SL: 
            <button class="minus" data-i="${i}">-</button>
            <span>${item.qty}</span>
            <button class="plus" data-i="${i}">+</button>
          </p>
          <button class="remove" data-i="${i}">🗑️</button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    attachEvents();
    updateTotal();
    updateCartCount();
  }

  function attachEvents() {
    document.querySelectorAll(".plus").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = btn.dataset.i;
        const cart = getCart();
        cart[i].qty++;
        saveCart(cart);
        renderCart();
      })
    );

    document.querySelectorAll(".minus").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = btn.dataset.i;
        let cart = getCart();
        if (cart[i].qty > 1) cart[i].qty--;
        else cart.splice(i, 1);
        saveCart(cart);
        renderCart();
      })
    );

    document.querySelectorAll(".remove").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = btn.dataset.i;
        let cart = getCart();
        cart.splice(i, 1);
        saveCart(cart);
        renderCart();
      })
    );
  }

  function updateTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    subtotalEl.textContent = subtotal.toLocaleString() + " đ";
    totalEl.textContent = subtotal.toLocaleString() + " đ";
  }

  // 🧹 Xóa giỏ hàng
  document.getElementById("clear-cart").addEventListener("click", () => {
    localStorage.removeItem(CART_KEY);
    renderCart();
  });

  // 💳 Thanh toán
  document.getElementById("checkout-btn").addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    alert("Thanh toán thành công!");
    localStorage.removeItem(CART_KEY);
    renderCart();
  });

  renderCart();
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exist = cart.find(item => item.name === product.name && item.size === product.size);
  if (exist) {
    exist.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}
