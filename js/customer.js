const role = sessionStorage.getItem("userRole");
if (role !== "CUSTOMER") {
  alert("Bạn chưa đăng nhập với vai trò Khách hàng!");
  window.location.href = "login.html";
}



function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
