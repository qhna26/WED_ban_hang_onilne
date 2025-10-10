// checkRole.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("userRole"); // Vai trò (ADMIN, STAFF, CUSTOMER)
  const username = sessionStorage.getItem("username"); // Tên người dùng
  const currentPage = window.location.pathname;

  const roleInNav = document.getElementById("userRoleInNav");
  const logoutItem = document.getElementById("logoutItem");

  // ==== Cập nhật giao diện người dùng ====
  if (roleInNav) {
    if (username) {
      // Nếu đã đăng nhập
      if (role === "ADMIN" || role === "STAFF") {
        roleInNav.textContent = `${username} (${role === "ADMIN" ? "Admin" : "Nhân viên"})`;
      } else {
        roleInNav.textContent = username; // Nếu là khách hàng chỉ hiện tên
      }
    } else {
      roleInNav.textContent = "Khách (chưa đăng nhập)";
    }
  }

  // Hiển thị hoặc ẩn nút đăng xuất
  if (logoutItem) {
    logoutItem.style.display = username ? "inline-block" : "none";
  }

  // ==== Phân quyền truy cập ====
  if (!role) {
    // ❌ Chưa đăng nhập — không được vào admin/staff
    if (
      currentPage.includes("tk.admin.html") ||
      currentPage.includes("tk.staff.html")
    ) {
      alert("Bạn cần đăng nhập để truy cập trang này!");
      window.location.href = "login.html";
      return;
    }
    // Cho phép ở lại trang khách hàng
    return;
  }

  // ==== Người đã đăng nhập ====
  redirectByRole(role);
});

// ==== Hàm điều hướng theo vai trò ====
function redirectByRole(role) {
  const currentPage = window.location.pathname;

  if (role === "ADMIN" && !currentPage.includes("tk.admin.html")) {
    window.location.href = "tk.admin.html";
  } 
  else if (role === "STAFF" && !currentPage.includes("tk.staff.html")) {
    window.location.href = "tk.staff.html";
  } 
  else if (role === "CUSTOMER" && !currentPage.includes("tk.customer.html")) {
    window.location.href = "tk.customer.html";
  }
}

// ==== Đăng xuất ====
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// Khi bấm vào nút người dùng
document.addEventListener("DOMContentLoaded", () => {
  const userInfoBtn = document.getElementById("userInfoBtn");

  if (userInfoBtn) {
    userInfoBtn.addEventListener("click", () => {
      const username = sessionStorage.getItem("username");

      // Nếu chưa đăng nhập → chuyển sang trang login
      if (!username) {
        window.location.href = "login.html";
      }
    });
  }
});
