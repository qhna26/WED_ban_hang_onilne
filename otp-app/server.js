const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // chỉ để 1 lần ở đây

const users = {};

// Config Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "quannhatb01680@gmail.com",
    pass: "ftec jmka lavx bvkf", // App password Gmail
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: "fail", message: "Thiếu dữ liệu!" });
  }
  if (users[email] && users[email].active) {
    return res.json({ status: "fail", message: "Email đã tồn tại!" });
  }

  const otp = generateOtp();
  const expire = Date.now() + 5 * 60 * 1000;
  users[email] = { password, otp, expire, active: false };

  try {
    await transporter.sendMail({
      from: "Shop Online <quannhatb01680@gmail.com>",
      to: email,
      subject: "Mã OTP xác thực tài khoản",
      text: `Mã OTP của bạn là: ${otp}\nCó hiệu lực trong 5 phút.`,
    });

    res.json({ status: "ok", message: "Đã gửi OTP về email!" });
  } catch (err) {
    res.json({ status: "fail", message: "Không gửi được email!", error: err.message });
  }
});

// Verify
app.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  if (!users[email]) return res.json({ status: "fail", message: "Email chưa đăng ký!" });

  const user = users[email];
  if (Date.now() > user.expire) return res.json({ status: "fail", message: "Mã OTP đã hết hạn!" });

  if (user.otp === otp) {
    user.active = true;
    delete user.otp;
    res.json({ status: "ok", message: "Xác thực thành công!" });
  } else {
    res.json({ status: "fail", message: "Sai mã OTP!" });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!users[email]) return res.json({ status: "fail", message: "Email không tồn tại!" });

  const user = users[email];
  if (user.password !== password) return res.json({ status: "fail", message: "Sai mật khẩu!" });
  if (!user.active) return res.json({ status: "fail", message: "Tài khoản chưa xác thực email!" });

  res.json({ status: "ok", message: "Đăng nhập thành công!" });
});

app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});
