
const role = sessionStorage.getItem("userRole");

if (!role) {
  console.log("Bạn đang truy cập với tư cách KHÁCH (chưa đăng nhập)");
  requireLoginForProtectedActions();
} else if (role === "CUSTOMER") {
  console.log("Bạn đã đăng nhập với vai trò KHÁCH HÀNG");
} else {
  console.log("Bạn đăng nhập với vai trò khác: " + role);
}

function requireLoginForProtectedActions() {
  const protectedElements = document.querySelectorAll(".requires-login");

  protectedElements.forEach(el => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Vui lòng đăng nhập để sử dụng chức năng này!");
      window.location.href = "login.html";
    });
  });
}

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
