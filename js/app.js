document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("content-container");

  // Bắt tất cả link trong nav
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const url = link.getAttribute("href");

      // Nếu là trang chủ => trở lại hero mặc định
      if (url === "home.html" || url === "customer.html") {
        animatePageOut(() => {
          container.innerHTML = `
            <div class="hero active">
              <h1>Chào mừng bạn đến với TTN SPORT</h1>
              <p>Trang web thể thao năng động – nơi bạn tìm thấy mọi thứ!</p>
            </div>`;
          animatePageIn();
        });
      } else {
        // Load nội dung trang mới
        fetch(`partials/${url}`)
          .then(res => res.text())
          .then(html => {
            animatePageOut(() => {
              container.innerHTML = html;
              animatePageIn();
            });
          })
          .catch(() => alert("Không thể tải nội dung!"));
      }
    });
  });

  // ======= Hiệu ứng chuyển trang =======
  function animatePageOut(callback) {
    container.classList.add("slide-out");
    setTimeout(() => {
      callback();
    }, 500);
  }

  function animatePageIn() {
    container.classList.remove("slide-out");
    container.classList.add("slide-in");
    setTimeout(() => {
      container.classList.remove("slide-in");
    }, 500);
  }
});
