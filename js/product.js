// ======================= product.js =======================

// --- Lọc sản phẩm theo danh mục ---
function initProductFilter() {
  const categoryItems = document.querySelectorAll(".category-item");
  const promoCards = document.querySelectorAll(".promo-card");
  const headers = document.querySelectorAll(".category-grid h2, section h2");

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const filterValue = item.getAttribute("data-filter");

      categoryItems.forEach((btn) => btn.classList.remove("active"));
      item.classList.add("active");

      promoCards.forEach((card) => {
        if (card.classList.contains(filterValue)) {
          card.removeAttribute("hidden");
          card.classList.add("show");
        } else {
          card.setAttribute("hidden", "");
          card.classList.remove("show");
        }
      });
    });
  });

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      categoryItems.forEach((btn) => btn.classList.remove("active"));
      promoCards.forEach((card) => {
        card.removeAttribute("hidden");
        card.classList.add("show");
      });
    });
  });
}

// --- Mở chi tiết sản phẩm ---
function initProductClick() {
  const products = document.querySelectorAll(".promo-card");
  if (products.length === 0) return;

  products.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return; // bỏ qua khi bấm nút Thêm vào giỏ hàng

      const product = {
        id: index + 1,
        name: card.querySelector("h3")?.textContent || "Sản phẩm",
        price:
          parseInt(
            card.querySelector("strong")?.textContent?.replace(/[^\d]/g, "")
          ) || 0,
        image: card.querySelector("img")?.getAttribute("src") || "",
        desc: "Sản phẩm chất lượng cao, giảm giá hấp dẫn!"
      };

      localStorage.setItem("selectedProduct", JSON.stringify(product));

      // Load product_detail.html vào khu vực content
      fetch("pages/product_detail.html")
        .then((res) => res.text())
        .then((html) => {
          const contentArea = document.getElementById("content-area");
          if (!contentArea) return;
          contentArea.innerHTML = html;
          setTimeout(initProductDetail, 100); // đảm bảo DOM đã render xong
        });
    });
  });
}

// ==================== GIỎ HÀNG ====================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = total;
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(
    (item) =>
      item.name === product.name &&
      item.size === product.size &&
      item.color === product.color
  );

  if (existing) existing.qty += product.qty;
  else cart.push(product);

  saveCart(cart);
  updateCartCount();
}

// ==================== TRANG CHI TIẾT SẢN PHẨM ====================

function initProductDetail() {
  console.log("🔹 initProductDetail chạy...");

  const data = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!data) {
    console.warn("❌ Không có sản phẩm được chọn!");
    return;
  }

  // Gán dữ liệu vào HTML
  document.getElementById("product-img").src = data.image;
  document.getElementById("product-name").textContent = data.name;
  document.getElementById("product-price").textContent = parseInt(data.price).toLocaleString() + " đ";
  document.getElementById("product-desc").textContent = data.desc || "Sản phẩm chất lượng cao!";

  const qtyInput = document.getElementById("product-qty");
  const sizeSelect = document.getElementById("product-size");
  const addBtn = document.getElementById("add-to-cart");
  const buyBtn = document.getElementById("buy-now");

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const item = {
        name: data.name,
        price: parseInt(data.price),
        img: data.image,
        size: sizeSelect.value,
        quantity: parseInt(qtyInput.value) || 1
      };

      addToCart(item); // ✅ dùng hàm từ cart.js
      updateCartCount();
    });
  }

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const item = {
        name: data.name,
        price: parseInt(data.price),
        img: data.image,
        size: sizeSelect.value,
        quantity: parseInt(qtyInput.value) || 1
      };
      addToCart(item);
      updateCartCount();
      loadPage("cart.html");
    });
  }

  updateCartCount();
}



// ==================== SỰ KIỆN TỪ DANH SÁCH SẢN PHẨM ====================

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".promo-card button");
  if (btn) {
    const card = btn.closest(".promo-card");
    const product = {
      id: Date.now(),
      name: card.querySelector("h3")?.textContent || "Sản phẩm",
      price:
        parseInt(
          card.querySelector("strong")?.textContent?.replace(/[^\d]/g, "")
        ) || 0,
      image: card.querySelector("img")?.getAttribute("src") || "",
      desc: "Sản phẩm chất lượng cao",
      size: "M",
      color: "Mặc định",
      qty: 1
    };
    addToCart(product);
    console.log("🛒 Đã thêm:", product.name);
  }
});

// ==================== KHỞI ĐỘNG ====================
document.addEventListener("DOMContentLoaded", () => {
  initProductFilter();
  initProductClick();
  updateCartCount();
});
