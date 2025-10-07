const users = {
  admin: { password: "admin123", role: "ADMIN" },
  nhanvien: { password: "nhanvien123", role: "STAFF" },
  khachhang: { password: "khachhang123", role: "CUSTOMER" }
};

document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMessage");

  if(users[username] && users[username].password === password){
    // Lưu role vào sessionStorage
    sessionStorage.setItem("userRole", users[username].role);

    // Chuyển hướng theo role
    if(users[username].role === "ADMIN"){
      window.location.href = "admin_home.html"; // admin
    } else {
      window.location.href = "home.html"; // Nhân viên & Khách Hàng
    }
  } else {
    msg.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
    msg.style.color = "red";
  }
});
