// auth.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("userRole");

  // Cập nhật vai trò nếu có đăng nhập
  const roleInNav = document.getElementById("userRoleInNav");
  if (roleInNav && role) {
    if (role === "ADMIN") roleInNav.textContent = "Admin";
    else if (role === "STAFF") roleInNav.textContent = "Nhân viên";
    else if (role === "CUSTOMER") roleInNav.textContent = "Khách hàng";
  }

  // Tạo popup thông báo đăng nhập (ẩn mặc định)
  const popup = document.createElement("div");
  popup.innerHTML = `
    <div id="loginPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>🔒 Bạn cần đăng nhập để tiếp tục mua hàng</h2>
        <p>Hãy đăng nhập để hoàn tất việc mua sản phẩm.</p>
        <div class="popup-buttons">
          <button id="popupLoginBtn">Đăng nhập ngay</button>
          <button id="popupCloseBtn">Đóng</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Gắn sự kiện đóng và chuyển trang cho popup
  const popupOverlay = document.getElementById("loginPopup");
  const popupLoginBtn = document.getElementById("popupLoginBtn");
  const popupCloseBtn = document.getElementById("popupCloseBtn");

  popupLoginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  popupCloseBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Gắn sự kiện cho các nút "Mua ngay"
  const buyButtons = document.querySelectorAll(".requires-login");
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!role) {
        popupOverlay.style.display = "flex"; // hiện popup
      } else {
        window.location.href = "checkout.html"; // đã đăng nhập thì chuyển trang
      }
    });
  });
});

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
