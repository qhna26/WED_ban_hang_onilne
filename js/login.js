// js/login.js

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

<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMessage");

  if (!loginForm) return; // nếu không có form thì bỏ qua

  loginForm.addEventListener("submit", function(e){
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(users[username] && users[username].password === password){
      // ✅ Lưu thông tin người dùng
      sessionStorage.setItem("userRole", users[username].role);
      sessionStorage.setItem("username", username);

      // ✅ Kiểm tra role để quyết định hành động
      const role = users[username].role;

      if (role === "ADMIN") {
        window.location.href = "tk.admin.html";
      } else if (role === "STAFF") {
        window.location.href = "tk.staff.html";
      } else if (role === "CUSTOMER") {
        // ✅ Trường hợp khách hàng → chỉ đóng popup, reload trang
        loginMsg.style.color = "green";
        loginMsg.textContent = "Đăng nhập thành công!";

        setTimeout(() => {
          const modal = document.getElementById('loginModal');
          if (modal) modal.style.display = 'none';

          // Ví dụ: cập nhật tên role trên thanh nav
          const roleText = document.getElementById('userRoleInNav');
          if (roleText) roleText.textContent = "Khách hàng: " + username;

          location.reload(); // hoặc update UI nếu bạn muốn không tải lại
        }, 800);
      }

    } else {
      loginMsg.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
      loginMsg.style.color = "red";
    }
  });
=======
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
>>>>>>> 28d379cc39c9fb42d60589d7051c206f5543ce15
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
