const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());
app.use(express.static("public"));

const users = {};

// Config Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cuongdqtb01697@gmail.com",
    pass: "bfca kctu zsdn aqyd",
  },
});

//Hàm tạo OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//Hàm đọc template email 
function getEmailTemplate(otp) {
  const htmlPath = path.join(__dirname, "../template-email.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  html = html.replace("{{OTP}}", otp);

  return html;
}


// API Register
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
    //Tạo nội dung HTML có CSS và OTP
    const htmlContent = getEmailTemplate(otp);

    await transporter.sendMail({
      from: "Shop Online <quannhatb01680@gmail.com>",
      to: email,
      subject: "Mã OTP xác thực tài khoản",
      html: htmlContent, 
    });

    res.json({ status: "ok", message: "Đã gửi OTP về email!" });
  } catch (err) {
    res.json({ status: "fail", message: "Không gửi được email!", error: err.message });
  }
});

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
