// js/login.js

const users = {
  admin: { password: "admin123", role: "ADMIN" },
  nhanvien: { password: "nhanvien123", role: "STAFF" },
  khachhang: { password: "khachhang123", role: "CUSTOMER" }
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMessage");

  if (!loginForm) return; // nếu không có form thì bỏ qua

  loginForm.addEventListener("submit", function(e){
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // ✅ 1. Kiểm tra trong danh sách mặc định
    if(users[username] && users[username].password === password){
      handleLoginSuccess(username, users[username].role);
      return;
    }

    // ✅ 2. Kiểm tra trong localStorage (tài khoản người dùng đã đăng ký)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = storedUsers.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (foundUser) {
      handleLoginSuccess(foundUser.username, "CUSTOMER");
      return;
    }

    // ❌ Nếu không khớp gì hết → báo lỗi
    loginMsg.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
    loginMsg.style.color = "red";
  });


  function handleLoginSuccess(username, role){
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("username", username);
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const userData = storedUsers.find(u => u.username === username || u.email === username);

  const userEmail = userData ? userData.email : "";
  localStorage.setItem("currentUser", JSON.stringify({ name: username, email: userEmail }));

    if (role === "ADMIN") {
      window.location.href = "../tk.admin.html";
    } else if (role === "STAFF") {
      window.location.href = "../tk.staff.html";
    } else if (role === "CUSTOMER") {
      loginMsg.style.color = "green";
      loginMsg.textContent = "Đăng nhập thành công!";
      setTimeout(() => {
        const modal = document.getElementById('loginModal');
        if (modal) modal.style.display = 'none';
        const roleText = document.getElementById('userRoleInNav');
        if (roleText) roleText.textContent = "Khách hàng: " + username;
        window.location.href = "../tk.customer.html";
      }, 800);
    }
  }
});


// ❌ Chặn chuột phải
document.addEventListener('contextmenu', e => e.preventDefault());

// ❌ Chặn phím tắt mở source
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' || 
    (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key.toUpperCase())) || 
    (e.ctrlKey && e.key.toUpperCase() === 'U')
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
});
