// checkRole.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("userRole");

  // Hiển thị vai trò nếu có đăng nhập
  const roleInNav = document.getElementById("userRoleInNav");
  if (roleInNav) {
    if (role === "ADMIN") roleInNav.textContent = "Admin";
    else if (role === "STAFF") roleInNav.textContent = "Nhân viên";
    else if (role === "CUSTOMER") roleInNav.textContent = "Khách hàng";
    else roleInNav.textContent = "Khách (chưa đăng nhập)";
  }

  // Xác định trang hiện tại
  const currentPage = window.location.pathname;

  // ✅ 1. Người CHƯA ĐĂNG NHẬP:
  // - Cho phép vào trang khách hàng
  // - Nhưng cấm truy cập vào admin hoặc staff
  if (!role) {
    if (
      currentPage.includes("tk.admin.html") ||
      currentPage.includes("tk.staff.html")
    ) {
      alert("Bạn cần đăng nhập để truy cập trang này!");
      window.location.href = "login.html";
      return;
    }
    // Nếu là khách thì không chuyển hướng, cho ở lại trang customer
    return;
  }

  // ✅ 2. Người ĐÃ ĐĂNG NHẬP:
  // - Điều hướng đến đúng trang của họ
  redirectByRole(role);
});

// Hàm điều hướng theo vai trò
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

// Đăng xuất
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
