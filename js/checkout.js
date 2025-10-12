document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("checkout-list");
  const totalEl = document.getElementById("checkout-total");
  const cartCount = document.getElementById("cart-count");
  const cartIcon = document.getElementById("cart-icon");
  const confirmBtn = document.getElementById("confirm-checkout");
  const cancelBtn = document.getElementById("cancel-checkout");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 👉 Cập nhật số lượng trên icon giỏ hàng
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.textContent = total;
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => cartIcon.classList.remove("cart-bounce"), 600);
  }

  updateCartCount();

  // 👉 Nếu giỏ hàng rỗng
  if (cart.length === 0) {
    listEl.innerHTML = "<p style='text-align:center; color:#ccc;'>🛒 Giỏ hàng của bạn trống!</p>";
    totalEl.textContent = "";
    confirmBtn.disabled = true;
    return;
  }

  // 👉 Hiển thị sản phẩm
  let totalPrice = 0;
  listEl.innerHTML = cart.map(item => {
    const price = parseInt(item.price) || 0;
    const qty = parseInt(item.qty) || 1;
    const sum = price * qty;
    totalPrice += sum;

    return `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>Giá: ${price.toLocaleString()} đ</p>
          <p>Số lượng: ${qty}</p>
        </div>
        <div class="item-total">${sum.toLocaleString()} đ</div>
      </div>
    `;
  }).join("");

  totalEl.textContent = `Tổng tiền: ${totalPrice.toLocaleString()} đ`;

  confirmBtn.addEventListener("click", () => {
    const order = {
      id: "DH" + Date.now(),
      items: cart,
      total: totalPrice,
      date: new Date().toLocaleString("vi-VN"),
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("✅ Thanh toán thành công! Đơn hàng của bạn đã được lưu trong lịch sử.");

    localStorage.removeItem("cart");
    window.location.href = "orders.html";
  });

  // 👉 Hủy thanh toán
  cancelBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
  
});
