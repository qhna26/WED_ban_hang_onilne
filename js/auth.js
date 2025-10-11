// ======================= 1. POPUP ĐĂNG NHẬP =======================
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

const popupOverlay = document.getElementById("loginPopup");
const popupLoginBtn = document.getElementById("popupLoginBtn");
const popupCloseBtn = document.getElementById("popupCloseBtn");

if (popupLoginBtn) {
  popupLoginBtn.addEventListener("click", () => {
    window.location.href = "pages/login.html";
  });
}
if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", () => {
    if (popupOverlay) popupOverlay.style.display = "none";
  });
}



// ======================= 2. HÀM QUẢN LÝ TÀI KHOẢN =======================

// 👉 Lấy danh sách tài khoản từ localStorage
function getAccounts() {
  const data = localStorage.getItem("accounts");
  return data ? JSON.parse(data) : [];
}

// 👉 Lưu danh sách tài khoản vào localStorage
function saveAccounts(accounts) {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

// 👉 Đăng ký tài khoản mới
function registerAccount(username, email, password) {
  const accounts = getAccounts();

  if (accounts.some(acc => acc.username === username)) {
    return { status: "error", message: "Tên đăng nhập đã tồn tại!" };
  }
  if (accounts.some(acc => acc.email === email)) {
    return { status: "error", message: "Email đã được sử dụng!" };
  }

  const newAcc = { username, email, password, role: "CUSTOMER" };
  accounts.push(newAcc);
  saveAccounts(accounts);

  return { status: "ok", message: "Đăng ký thành công!" };
}

// 👉 Đăng nhập bằng username hoặc email
function loginAccount(identifier, password) {
  const accounts = getAccounts();
  const found = accounts.find(acc => 
    (acc.username === identifier || acc.email === identifier) && acc.password === password
  );

  if (found) {
    sessionStorage.setItem("username", found.username);
    sessionStorage.setItem("userRole", found.role);
    return { status: "ok", user: found };
  } else {
    return { status: "error", message: "Sai tên đăng nhập/email hoặc mật khẩu!" };
  }
}



// ======================= 3. CẬP NHẬT ROLE TRÊN NAV =======================
(function updateRole() {
  const role = sessionStorage.getItem("userRole");
  const roleInNav = document.getElementById("userRoleInNav");
  if (roleInNav && role) {
    if (role === "ADMIN") roleInNav.textContent = "Admin";
    else if (role === "STAFF") roleInNav.textContent = "Nhân viên";
    else if (role === "CUSTOMER") roleInNav.textContent = "Khách hàng";
  }
})();



// ======================= 4. EVENT DELEGATION CHO NÚT MUA =======================
document.body.addEventListener("click", (e) => {
  const btn = e.target.closest(".requires-login");

  if (btn) {
    e.preventDefault();
    const role = sessionStorage.getItem("userRole");

    if (!role) {
      const currentPopup = document.getElementById("loginPopup");
      if (currentPopup) {
        currentPopup.style.display = "flex";
      }
    } else {
      // Đã đăng nhập → chuyển đến trang thanh toán
      window.location.href = "checkout.html";
    }
  }
});



// ======================= 5. HÀM LOGOUT =======================
function logout() {
  sessionStorage.clear();
  window.location.href = "pages/login.html";
}

window.logout = logout; // để gọi từ nút trên navbar
