document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("cart-total");
  const discountEl = document.getElementById("discount");
  const cartCountEl = document.getElementById("cart-count");
  const discountMsg = document.getElementById("discount-msg");

  let discountValue = 0; // %

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalQty;
  }

  function updateCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discountAmount = subtotal * (discountValue / 100);
    const total = subtotal - discountAmount;

    subtotalEl.textContent = subtotal.toLocaleString() + " đ";
    discountEl.textContent = discountAmount > 0 ? "-" + discountAmount.toLocaleString() + " đ" : "0 đ";
    totalEl.textContent = total.toLocaleString() + " đ";
  }

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p>🛒 Giỏ hàng trống</p>`;
      updateCartCount();
      updateCartTotal();
      return;
    }

    cart.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>${item.color ? "Màu: " + item.color + " | " : ""} Size: ${item.size || "M"}</p>
          <p>${item.price.toLocaleString()} đ</p>
        </div>
        <div class="item-qty">
          <button class="decrease">-</button>
          <span>${item.qty}</span>
          <button class="increase">+</button>
        </div>
        <button class="remove-item">🗑️</button>
      `;

      div.querySelector(".decrease").addEventListener("click", () => {
        if (item.qty > 1) item.qty--;
        else cart.splice(cart.indexOf(item), 1);
        saveCart(cart);
        renderCart();
      });

      div.querySelector(".increase").addEventListener("click", () => {
        item.qty++;
        saveCart(cart);
        renderCart();
      });

      div.querySelector(".remove-item").addEventListener("click", () => {
        cart.splice(cart.indexOf(item), 1);
        saveCart(cart);
        renderCart();
      });

      cartItemsContainer.appendChild(div);
    });

    updateCartCount();
    updateCartTotal();
  }

  // 🔖 Áp dụng mã giảm giá
  document.getElementById("apply-discount").addEventListener("click", () => {
    const code = document.getElementById("discount-code").value.trim().toUpperCase();
    const validCodes = {
      "GIAM10": 10,
      "SALE20": 20,
      "VIP30": 30
    };

    if (validCodes[code]) {
      discountValue = validCodes[code];
      discountMsg.textContent = `✅ Áp dụng mã thành công! Giảm ${discountValue}%`;
    } else if (code === "") {
      discountMsg.textContent = "⚠️ Vui lòng nhập mã giảm giá.";
      discountValue = 0;
    } else {
      discountMsg.textContent = "❌ Mã không hợp lệ.";
      discountValue = 0;
    }

    updateCartTotal();
  });

  // 🧹 Xóa giỏ hàng
  document.getElementById("clear-cart").addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
  });

  // 💳 Thanh toán
  document.getElementById("checkout-btn").addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    window.location.href = "checkout.html";
  });

  // 👤 Hiển thị thông tin khách hàng
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("cust-name").textContent = currentUser.name || "Không rõ";
    document.getElementById("cust-email").textContent = currentUser.email || "Không rõ";
  }

  // 🚀 Khởi chạy
  renderCart();

  // 📤 Đăng xuất
  window.logout = function() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  };
});
