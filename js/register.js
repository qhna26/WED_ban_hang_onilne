document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('togglePassword');
  const pass = document.getElementById('password');
  const confirmPass = document.getElementById('confirmPassword');
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const otpSection = document.getElementById('otpSection');
  const registerForm = document.getElementById('registerForm');
  const msg = document.getElementById('registerMessage');
  const resetAccountsBtn = document.getElementById('resetAccountsBtn');

  let tempUser = null;

  // 👁 Hiện / ẩn mật khẩu
  toggle.addEventListener('change', () => {
    const type = toggle.checked ? 'text' : 'password';
    pass.type = type;
    confirmPass.type = type;
  });

  // 📨 Gửi OTP
  sendOtpBtn.addEventListener('click', async () => {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = pass.value.trim();
    const confirmPassword = confirmPass.value.trim();

    if (!fullname || !email || !password || !confirmPassword) {
      showMessage('Vui lòng nhập đầy đủ thông tin!', 'red');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('Mật khẩu xác nhận không khớp!', 'red');
      return;
    }

    // ❌ Kiểm tra trùng tài khoản
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existed = users.some(u => u.email === email);
    if (existed) {
      showMessage('Email này đã được đăng ký!', 'red');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:4000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        tempUser = { fullname, email, password };
        showMessage('✅ OTP đã được gửi đến email. Vui lòng kiểm tra hộp thư.', 'green');
        otpSection.style.display = 'block';
      } else {
        showMessage('Gửi OTP thất bại: ' + data.message, 'red');
      }
    } catch (err) {
      console.error(err);
      showMessage('Không thể kết nối tới server gửi OTP!', 'red');
    }
  });

  // 📝 Xác nhận OTP & lưu tài khoản
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otpInput').value.trim();
    if (!tempUser) {
      showMessage('Bạn cần gửi OTP trước!', 'red');
      return;
    }
    if (!otp) {
      showMessage('Vui lòng nhập OTP!', 'red');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:4000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempUser.email, otp }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(tempUser);
        localStorage.setItem('users', JSON.stringify(users));
        showMessage('🎉 Đăng ký thành công! Đang chuyển hướng...', 'green');
        setTimeout(() => window.location.href = 'login.html', 1500);
      } else {
        showMessage(data.message, 'red');
      }
    } catch (err) {
      console.error(err);
      showMessage('Không thể xác thực OTP!', 'red');
    }
  });

  // 🧹 Xóa tài khoản test
  resetAccountsBtn.addEventListener('click', () => {
    localStorage.removeItem('users');
    alert('Đã xóa toàn bộ tài khoản test ✅');
  });

  function showMessage(text, color) {
    msg.textContent = text;
    msg.style.color = color;
  }
});
