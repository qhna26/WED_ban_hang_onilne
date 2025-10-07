   if(sessionStorage.getItem("userRole") !== "ADMIN"){
  alert("Bạn chưa đăng nhập!");
  window.location.href = "login.html";
}

function logout(){
  sessionStorage.clear();
  window.location.href = "login.html";
}
