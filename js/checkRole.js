// checkRole.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("userRole"); 
  const username = sessionStorage.getItem("username"); 
  const currentPage = window.location.pathname;

  const roleInNav = document.getElementById("userRoleInNav");
  const logoutItem = document.getElementById("logoutItem");

  if (roleInNav) {
    if (username) {
      if (role === "ADMIN" || role === "STAFF") {
        roleInNav.textContent = `${username} (${role === "ADMIN" ? "Admin" : "Nhân viên"})`;
      } else {
        roleInNav.textContent = username; 
      }
    } else {
      roleInNav.textContent = "Khách (chưa đăng nhập)";
    }
  }

  if (logoutItem) {
    logoutItem.style.display = username ? "inline-block" : "none";
  }

  if (!role) {
    if (
      currentPage.includes("tk.admin.html") ||
      currentPage.includes("tk.staff.html")
    ) {
      alert("Bạn cần đăng nhập để truy cập trang này!");
      window.location.href = "login.html";
      return;
    }
    return;
  }

  redirectByRole(role);
});

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
