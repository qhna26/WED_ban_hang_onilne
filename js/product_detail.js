document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");

  // ✅ Danh sách sản phẩm mẫu
  const products = [
    { id: 1, name: "Áo thun", price: 120000, image: "img/ao.jpg" },
    { id: 2, name: "Quần jean", price: 350000, image: "img/quan.jpg" },
    { id: 3, name: "Giày thể thao", price: 650000, image: "img/giay.jpg" },
    { id: 4, name: "Mũ lưỡi trai", price: 90000, image: "img/mu.jpg" }
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ✅ Hàm lưu giỏ hàng
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ✅ Hàm thêm vào giỏ
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  // ✅ Hiển thị sản phẩm
  productList.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()} VND</p>
      <button class="addToCartBtn" data-id="${p.id}">Thêm vào giỏ</button>
    </div>
  `).join("");

  // ✅ Gắn sự kiện click
  document.querySelectorAll(".addToCartBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
});
