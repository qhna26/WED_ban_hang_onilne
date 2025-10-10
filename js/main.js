document.addEventListener("DOMContentLoaded", () => {
  const contentArea = document.getElementById("content-area");

  // Mặc định mở trang home
  loadPage("pages/home.html");

  // Khi click link
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
    } catch (err) {
      console.error("Không thể tải trang:", err);
      contentArea.innerHTML = "<p>Lỗi tải trang.</p>";
    }
  }
});
