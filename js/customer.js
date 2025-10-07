const role = sessionStorage.getItem("userRole");
if(role !== "STAFF" && role !== "CUSTOMER"){
  alert("Bạn chưa đăng nhập!");
  window.location.href = "login.html";
}

function logout(){
  sessionStorage.clear();
  window.location.href = "login.html";
}
