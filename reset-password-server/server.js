// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// Cho phép gọi API từ Live Server (5500)
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Lưu OTP tạm thời (RAM)
let otpStore = {};

//Hàm đọc file template rồi chèn OTP vào
function getEmailTemplate(otp) {
  const htmlPath = path.join(__dirname, "../pages/template-email.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  html = html.replace("{{OTP}}", otp);
  return html;
}

// Gửi OTP qua Gmail
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ status: "error", message: "Thiếu email!" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  console.log(`OTP cho ${email}: ${otp}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // user: "quannhatb01680@gmail.com", 
      // pass: "ftec jmka lavx bvkf",      
          user: "cuongdqtb01697@gmail.com",
          pass: "bfca kctu zsdn aqyd",
    },
  });

  try {
    // Tạo nội dung HTML từ template
    const htmlContent = getEmailTemplate(otp);

    await transporter.sendMail({
      from: '"Shop Online" <quannhatb01680@gmail.com>',
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      html: htmlContent, 
    });

    res.json({ status: "ok", message: "Đã gửi OTP tới email!" });
  } catch (err) {
    console.error("Lỗi gửi email:", err);
    res.json({ status: "error", message: "Không gửi được email!" });
  }
});

//Xác minh OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.json({ status: "error", message: "Thiếu dữ liệu!" });

  if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
    delete otpStore[email];
    res.json({ status: "ok", message: "Xác thực OTP thành công!" });
  } else {
    res.json({ status: "error", message: "OTP sai hoặc đã hết hạn!" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server OTP đang chạy tại: http://127.0.0.1:${PORT}`);
});
