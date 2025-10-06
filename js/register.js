document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");

  let step = 1; // bước 1: đăng ký, bước 2: nhập OTP
  let email = "";
  let password = "";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Bước 1: gọi API /register
    if (step === 1) {
      const username = document.getElementById("reg-username").value.trim();
      password = document.getElementById("reg-password").value.trim();
      email = document.getElementById("reg-email").value.trim();

      if (!username || !password || !email) {
        message.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (data.status === "ok") {
  message.textContent = `Mã OTP đã được gửi đến email: ${email}`;

  // Chỉ thêm input OTP nếu chưa tồn tại
  if (!document.getElementById("reg-otp")) {
    const otpLabel = document.createElement("label");
    otpLabel.setAttribute("for", "reg-otp");
    otpLabel.textContent = "Nhập mã OTP:";

    const otpInput = document.createElement("input");
    otpInput.type = "text";
    otpInput.id = "reg-otp";
    otpInput.placeholder = "Nhập mã OTP";
    otpInput.required = true;

    form.insertBefore(otpLabel, form.querySelector("button"));
    form.insertBefore(otpInput, form.querySelector("button"));
  }

  step = 2;

        } else {
          message.textContent = "Đăng ký thất bại: " + data.message;
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Lỗi kết nối server!";
      }
    }

    // Bước 2: gọi API /verify
    else if (step === 2) {
      const otp = document.getElementById("reg-otp").value.trim();
      if (!otp) {
        message.textContent = "Vui lòng nhập OTP!";
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (data.status === "ok") {
          message.textContent = " Xác thực thành công! Chuyển đến trang đăng nhập";
          message.style.color = "limegreen";
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        } else {
          message.textContent = " Sai OTP hoặc hết hạn.";
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Lỗi kết nối server!";
      }
    }
  });
});
