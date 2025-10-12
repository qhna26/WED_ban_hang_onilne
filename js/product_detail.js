document.addEventListener('DOMContentLoaded', () => {
  const product = JSON.parse(localStorage.getItem('selectedProduct'));
  if (!product) return;

  document.getElementById('product-img').src = product.image;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = Number(product.price).toLocaleString() + 'đ';
  document.getElementById('product-desc').textContent = product.desc || 'Không có mô tả.';

  // 🎨 Màu sắc mẫu
  const colorOptions = ['#000', '#f00', '#00f', '#0f0', '#ff0'];
  const container = document.getElementById('color-options');
  colorOptions.forEach(color => {
    const c = document.createElement('div');
    c.className = 'color-circle';
    c.style.backgroundColor = color;
    c.addEventListener('click', () => {
      document.querySelectorAll('.color-circle').forEach(x => x.classList.remove('selected'));
      c.classList.add('selected');
      localStorage.setItem('selectedColor', color);
    });
    container.appendChild(c);
  });

  // 🛒 Thêm vào giỏ hàng
  document.getElementById('add-to-cart').addEventListener('click', () => {
    const qty = parseInt(document.getElementById('product-qty').value) || 1;
    const color = localStorage.getItem('selectedColor') || 'Mặc định';
    const size = document.getElementById('product-size').value;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(i => i.id === product.id && i.color === color && i.size === size);
    if (exist) exist.qty += qty;
    else cart.push({ ...product, qty, color, size });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('🛒 Đã thêm vào giỏ hàng!');
  });

  // 🛍 Mua ngay
  document.getElementById('buy-now').addEventListener('click', () => {
    document.getElementById('add-to-cart').click();
    window.location.href = 'pages/checkout.html';
  });

  updateCartCount();
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = total;
}


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-to-cart");
  const qtyInput = document.getElementById("product-qty");

  const product = JSON.parse(localStorage.getItem("selectedProduct")) || {};

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value) || 1;
      const newItem = {
        id: product.id,
        name: product.name,
        price: parseInt(product.price),
        image: product.image,
        desc: product.desc,
        size: document.getElementById("product-size").value,
        color: "Mặc định",
        qty
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exist = cart.find(
        i => i.id === newItem.id && i.size === newItem.size
      );
      if (exist) exist.qty += qty;
      else cart.push(newItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  }
});
