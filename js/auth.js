// auth.js (ĐÃ SỬA VỚI EVENT DELEGATION)

// --- 1. LOGIC TẠO POPUP (Nên chạy độc lập và chỉ 1 lần) ---
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

// Lấy tham chiếu đến các phần tử của popup
const popupOverlay = document.getElementById("loginPopup");
const popupLoginBtn = document.getElementById("popupLoginBtn");
const popupCloseBtn = document.getElementById("popupCloseBtn");

// Gắn sự kiện cho các nút trong popup (Phần này chỉ cần chạy 1 lần)
if (popupLoginBtn) {
    popupLoginBtn.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}
if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", () => {
        if (popupOverlay) popupOverlay.style.display = "none";
    });
}


// --- 2. LOGIC CẬP NHẬT VAI TRÒ (Chạy khi script được tải) ---
(function updateRole() {
    const role = sessionStorage.getItem("userRole");
    const roleInNav = document.getElementById("userRoleInNav");
    if (roleInNav && role) {
      if (role === "ADMIN") roleInNav.textContent = "Admin";
      else if (role === "STAFF") roleInNav.textContent = "Nhân viên";
      else if (role === "CUSTOMER") roleInNav.textContent = "Khách hàng";
    }
})();


// --- 3. EVENT DELEGATION cho nút "Mua ngay" (.requires-login) ---
// Lắng nghe click trên toàn bộ body
document.body.addEventListener("click", (e) => {
    // Kiểm tra xem phần tử được click có class "requires-login" không
    const btn = e.target.closest(".requires-login");
    
    if (btn) {
        // Nếu click vào nút .requires-login, ngăn chặn hành động mặc định (nếu có)
        e.preventDefault(); 
        
        const role = sessionStorage.getItem("userRole");
        
        if (!role) {
            // Hiện popup
            const currentPopup = document.getElementById("loginPopup");
            if (currentPopup) {
                currentPopup.style.display = "flex";
            }
        } else {
            // Đã đăng nhập
            window.location.href = "checkout.html";
        }
    }
});


// --- 4. HÀM LOGOUT (Giữ nguyên) ---
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}