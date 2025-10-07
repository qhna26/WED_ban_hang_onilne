const role = sessionStorage.getItem("userRole");
if (role !== "STAFF") {
  alert("Bạn chưa đăng nhập với vai trò Nhân Viên!");
  window.location.href = "login.html";
}

document.getElementById("roleDisplay").textContent = "Nhân Viên";

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
