document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");
  const clearCartBtn = document.getElementById("clearCart");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Giỏ hàng trống.</p>";
      document.querySelector(".cart-actions").style.display = "none";
      return;
    }

    document.querySelector(".cart-actions").style.display = "block";
    let total = 0;
    let html = `
      <table>
        <tr>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Tổng</th>
          <th>Thao tác</th>
        </tr>`;

    cart.forEach((item, index) => {
      const line = item.price * item.quantity;
      total += line;
      html += `
        <tr>
          <td>${item.name}</td>
          <td>
            <button class="minus" data-index="${index}">–</button>
            ${item.quantity}
            <button class="plus" data-index="${index}">+</button>
          </td>
          <td>${item.price.toLocaleString()} VND</td>
          <td>${line.toLocaleString()} VND</td>
          <td><button class="remove" data-index="${index}">Xóa</button></td>
        </tr>`;
    });

    html += `</table><p style="text-align:center"><strong>Tổng cộng: ${total.toLocaleString()} VND</strong></p>`;
    cartContainer.innerHTML = html;

    document.querySelectorAll(".minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (cart[i].quantity > 1) cart[i].quantity--;
        else cart.splice(i, 1);
        saveCart(); renderCart();
      });
    });
    document.querySelectorAll(".plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart[i].quantity++;
        saveCart(); renderCart();
      });
    });
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (confirm(`Xóa ${cart[i].name}?`)) {
          cart.splice(i, 1);
          saveCart(); renderCart();
        }
      });
    });
  }

  clearCartBtn.addEventListener("click", () => {
    if (confirm("Hủy toàn bộ giỏ hàng?")) {
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    }
  });

  renderCart();
});
