document.addEventListener("DOMContentLoaded", () => {
  const contentArea = document.getElementById("content-area");

  // ✅ Mặc định mở trang home
  loadPage("pages/home.html");

  // ✅ Khi click link
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      const pagePath = href.includes(".html") ? `pages/${href}` : `pages/${href}.html`;
      loadPage(pagePath);
    });
  });

  async function loadPage(url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      contentArea.innerHTML = html;

      // ✅ Sau khi tải xong nội dung, gọi hàm khởi tạo tương ứng
      if (url.includes("home.html")) {
        initProductClickEvents();  // ← Gán sự kiện click cho sản phẩm
      }

    } catch (err) {
      console.error("Không thể tải trang:", err);
      contentArea.innerHTML = "<p>Lỗi tải trang.</p>";
    }
  }

  // 🧠 Hàm gán sự kiện click cho các thẻ promo-card
  function initProductClickEvents() {
    const promoCards = contentArea.querySelectorAll(".promo-card");
    promoCards.forEach(card => {
      card.addEventListener("click", () => {
        const imgElement = card.querySelector("img");
        const nameElement = card.querySelector("h3");
        const priceElement = card.querySelector(".price strong");

        const product = {
          image: imgElement ? imgElement.getAttribute("src") : "",
          name: nameElement ? nameElement.textContent.trim() : "Không có tên",
          price: priceElement ? priceElement.textContent.trim() : "0",
          desc: "Sản phẩm khuyến mãi hấp dẫn 👌",
        };

        localStorage.setItem("selectedProduct", JSON.stringify(product));

        // 👉 Nếu bạn có trang chi tiết riêng:
        window.location.href = "pages/product_detail.html";
      });
    });
  }
});
