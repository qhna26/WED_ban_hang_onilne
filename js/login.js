const users = {
  admin: {
    password: "admin123",
    role: "ADMIN",
    HoTen: "Quản trị viên",
    Email: "admin@shop.com"
  },
  nhanvien: {
    password: "nhanvien123",
    role: "STAFF",
    HoTen: "Nhân viên bán hàng",
    Email: "nhanvien@shop.com"
  },
  khachhang: {
    password: "khachhang123",
    role: "CUSTOMER",
    HoTen: "Khách hàng thân thiết",
    Email: "khachhang@shop.com"
  }
};

document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMessage");

  const user = users[username];

  if(user && user.password === password){
    // ✅ Lưu role vào sessionStorage
    sessionStorage.setItem("userRole", user.role);

    // ✅ Lưu thông tin người dùng vào localStorage
    localStorage.setItem('loggedUser', JSON.stringify({
      name: user.HoTen,
      email: user.Email
    }));

    // ✅ Chuyển hướng theo role
    if(user.role === "ADMIN"){
      window.location.href = "tk.admin.html";
    } else if(user.role === "STAFF"){
      window.location.href = "tk.staff.html";
    } else if(user.role === "CUSTOMER"){
      window.location.href = "product_detail.html"; // hoặc tk.customer.html nếu muốn
    }

  } else {
    msg.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
    msg.style.color = "red";
  }
});
