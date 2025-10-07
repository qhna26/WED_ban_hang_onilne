document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("forgotForm");
  const message = document.getElementById("forgotMessage");
  const submitBtn = form.querySelector("button");


  let step = 1;
  let email = "";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 🧩 BƯỚC 1: GỬI OTP
    if (step === 1) {
      email = document.getElementById("forgot-email").value.trim();
      if (!email) {
        message.textContent = "Vui lòng nhập email!";
        message.style.color = "red";
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
          message.textContent = `Mã OTP đã được gửi đến email: ${email}`;
          message.style.color = "limegreen";

          // 🧩 TẠO GIAO DIỆN NHẬP OTP + MẬT KHẨU MỚI + XÁC NHẬN LẠI
          if (!document.getElementById("otp-input")) {
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
            confirmLabel.textContent = "Xác nhận lại mật khẩu:";
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

            // Sự kiện hiện/ẩn mật khẩu
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

          // 🔁 Đổi nút “Gửi OTP” → “Xác nhận”
          submitBtn.textContent = "Xác nhận";
          step = 2;
        } else {
          message.textContent = "Gửi OTP thất bại: " + data.message;
          message.style.color = "red";
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
        message.textContent = "Không thể kết nối đến server!";
        message.style.color = "red";
      }
    }

    // 🧩 BƯỚC 2: XÁC NHẬN OTP + ĐỔI MẬT KHẨU
    else if (step === 2) {
      const otp = document.getElementById("otp-input").value.trim();
      const newPassword = document.getElementById("new-password").value.trim();
      const confirmPassword =
        document.getElementById("confirm-password").value.trim();

      if (!otp || !newPassword || !confirmPassword) {
        message.textContent = "Vui lòng nhập đầy đủ thông tin!";
        message.style.color = "red";
        return;
      }

      if (newPassword !== confirmPassword) {
        message.textContent = "Mật khẩu xác nhận không khớp!";
        message.style.color = "red";
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:4000/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (data.status === "ok") {
          localStorage.setItem(`password_${email}`, newPassword);
          message.textContent = "✅ Đổi mật khẩu thành công! Chuyển hướng...";
          message.style.color = "limegreen";
          setTimeout(() => (window.location.href = "login.html"), 2000);
        } else {
          message.textContent = data.message;
          message.style.color = "red";
        }
      } catch (err) {
        console.error("Lỗi xác minh:", err);
        message.textContent = "Không thể kết nối đến server!";
        message.style.color = "red";
      }
    }
  });
});
