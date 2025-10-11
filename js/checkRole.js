// checkRole.js

function initRoleAndUserFeatures() {
    const role = sessionStorage.getItem("userRole"); 
    const username = sessionStorage.getItem("username"); 
    const currentPage = window.location.pathname;

    const roleInNav = document.getElementById("userRoleInNav");
    const logoutItem = document.getElementById("logoutItem");
    const userInfoBtn = document.getElementById("userInfoBtn");

    // Cập nhật giao diện người dùng
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

    // Hiển thị hoặc ẩn nút đăng xuất
    if (logoutItem) {
        logoutItem.style.display = username ? "inline-block" : "none";
    }

    // Gắn sự kiện cho nút userInfoBtn (redirect thay vì popup)
    if (userInfoBtn) {
        userInfoBtn.onclick = () => { 
            if (!sessionStorage.getItem("username")) {
                window.location.href = "login.html"; // Redirect trong cùng tab
            }
        };
    }

    // Phân quyền truy cập
    if (!role) {
        if (
            currentPage.includes("tk.admin.html") ||
            currentPage.includes("tk.staff.html")
        ) {
            alert("Bạn cần đăng nhập để truy cập trang này!");
            window.location.href = "login.html";
            return;
        }
        if (currentPage.includes("customer.html")) {
            if (typeof loadPage === 'function') {
                loadPage("home.html");
            } else {
                window.location.href = "home.html";
            }
            return;
        }
        return;
    }

    redirectByRole(role);
}

// Gọi logic khi DOM load
document.addEventListener("DOMContentLoaded", initRoleAndUserFeatures);

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
    window.location.href = "customer.html"; // Hoặc loadPage nếu có
}