document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("forgotForm");
  const message = document.getElementById("forgotMessage");
  const submitBtn = form.querySelector("button");

  let step = 1;
  let email = "";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 🟡 BƯỚC 1: GỬI OTP
    if (step === 1) {
      email = document.getElementById("forgot-email").value.trim();
      if (!email) {
        showMessage("Vui lòng nhập email!", "red");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:4000/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (data.status === "ok") {
          showMessage(`✅ Mã OTP đã gửi đến: ${email}`, "limegreen");
          createOtpAndPasswordInputs();
          submitBtn.textContent = "Xác nhận & Đổi mật khẩu";
          step = 2;
        } else {
          showMessage("Gửi OTP thất bại: " + data.message, "red");
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
        showMessage("Không thể kết nối đến server!", "red");
      }
    }

    // 🟡 BƯỚC 2: XÁC NHẬN OTP & ĐỔI MẬT KHẨU
    else if (step === 2) {
      const otp = document.getElementById("otp-input").value.trim();
      const newPassword = document.getElementById("new-password").value.trim();
      const confirmPassword = document.getElementById("confirm-password").value.trim();

      if (!otp || !newPassword || !confirmPassword) {
        return showMessage("Vui lòng nhập đầy đủ thông tin!", "red");
      }

      if (newPassword !== confirmPassword) {
        return showMessage("Mật khẩu xác nhận không khớp!", "red");
      }

      try {
        const res = await fetch("http://127.0.0.1:4000/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (data.status === "ok") {
          // 🔑 Cập nhật mật khẩu trong localStorage
          let users = JSON.parse(localStorage.getItem("users") || "[]");
          const userIndex = users.findIndex(u => u.email === email);
          if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
          } else {
            // Nếu chưa có thì tạo tài khoản ẩn (cho hợp bài tập)
            users.push({ email, username: email.split("@")[0], password: newPassword });
            localStorage.setItem("users", JSON.stringify(users));
          }

          showMessage("✅ Đổi mật khẩu thành công! Chuyển hướng...", "limegreen");
          setTimeout(() => window.location.href = "login.html", 2000);
        } else {
          showMessage(data.message || "Mã OTP sai hoặc hết hạn!", "red");
        }
      } catch (err) {
        console.error("Lỗi xác minh:", err);
        showMessage("Không thể kết nối đến server!", "red");
      }
    }
  });

  // 🧰 Hàm hiển thị thông báo
  function showMessage(text, color = "red") {
    message.textContent = text;
    message.style.color = color;
  }

  // 🧰 Tạo các input OTP + mật khẩu mới
  function createOtpAndPasswordInputs() {
    if (document.getElementById("otp-input")) return; // tránh tạo lại

    // OTP
    const otpLabel = document.createElement("label");
    otpLabel.textContent = "Nhập mã OTP:";
    const otpInput = document.createElement("input");
    otpInput.type = "text";
    otpInput.id = "otp-input";
    otpInput.placeholder = "Nhập mã OTP";

    // Mật khẩu mới
    const passLabel = document.createElement("label");
    passLabel.textContent = "Nhập mật khẩu mới:";
    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.id = "new-password";
    passInput.placeholder = "Nhập mật khẩu mới";

    // Xác nhận mật khẩu
    const confirmLabel = document.createElement("label");
    confirmLabel.textContent = "Xác nhận mật khẩu:";
    const confirmInput = document.createElement("input");
    confirmInput.type = "password";
    confirmInput.id = "confirm-password";
    confirmInput.placeholder = "Nhập lại mật khẩu mới";

    // Checkbox hiện mật khẩu
    const showPassDiv = document.createElement("div");
    showPassDiv.className = "show-password";
    const showCheckbox = document.createElement("input");
    showCheckbox.type = "checkbox";
    showCheckbox.id = "showPassword";
    const showLabel = document.createElement("label");
    showLabel.setAttribute("for", "showPassword");
    showLabel.textContent = "Hiện mật khẩu";
    showPassDiv.appendChild(showCheckbox);
    showPassDiv.appendChild(showLabel);

    showCheckbox.addEventListener("change", function () {
      const type = this.checked ? "text" : "password";
      passInput.type = type;
      confirmInput.type = type;
    });

    // Chèn vào form
    form.insertBefore(otpLabel, submitBtn);
    form.insertBefore(otpInput, submitBtn);
    form.insertBefore(passLabel, submitBtn);
    form.insertBefore(passInput, submitBtn);
    form.insertBefore(confirmLabel, submitBtn);
    form.insertBefore(confirmInput, submitBtn);
    form.insertBefore(showPassDiv, submitBtn);
  }
});
