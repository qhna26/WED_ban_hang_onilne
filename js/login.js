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
