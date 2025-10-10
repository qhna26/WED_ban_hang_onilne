document.addEventListener("DOMContentLoaded", () => {
  const orderSummary = document.getElementById("orderSummary");
  const confirmBtn = document.getElementById("confirmCheckout");
  const cancelBtn = document.getElementById("cancelCheckout");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Giỏ hàng trống, vui lòng quay lại mua hàng.</p>";
    confirmBtn.style.display = "none";
    cancelBtn.style.display = "none";
    return;
  }

  let total = 0;
  let details = "<h3>Chi tiết đơn hàng</h3><ul>";
  cart.forEach(i => {
    total += i.price * i.quantity;
    details += `<li>${i.name} x ${i.quantity} = ${(i.price * i.quantity).toLocaleString()} VND</li>`;
  });
  details += `</ul><p><strong>Tổng cộng: ${total.toLocaleString()} VND</strong></p>`;
  orderSummary.innerHTML = details;

  confirmBtn.addEventListener("click", () => {
    const email = loggedUser ? loggedUser.email : "example@gmail.com";
    const message =
      "Cảm ơn bạn đã mua hàng!\n\nĐơn hàng:\n" +
      cart.map(i => `- ${i.name} x ${i.quantity}`).join("\n") +
      `\n\nTổng cộng: ${total.toLocaleString()} VND`;

    window.location.href = `mailto:${email}?subject=Đơn hàng của bạn&body=${encodeURIComponent(message)}`;
    localStorage.removeItem("cart");
  });

  cancelBtn.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn hủy đơn hàng không?")) {
      localStorage.removeItem("cart");
      window.location.href = "product_detail.html";
    }
  });
});
