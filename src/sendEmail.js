// const nodemailer = require("nodemailer");

// // Tạo transporter (Gmail, Outlook, hoặc SMTP tùy chọn)
// const transporter = nodemailer.createTransport({
//   service: "gmail", // hoặc dùng 'hotmail', hoặc cấu hình SMTP thủ công
//   auth: {
//     user: "dohoangquan1112002@gmail.com", // Email gửi
//     pass: "ixlt edis iqpy jllb",    // App password (không dùng mật khẩu tài khoản Google thông thường)
//   },
// });

// // Cấu hình nội dung email
// const mailOptions = {
//   from: "dohoangquan1112002@gmail.com",
//   to: "dohoangquan110102@gmail.com", // Có thể là nhiều email cách nhau bằng dấu phẩy
//   subject: "Thử gửi mail bằng Node.js",
//   text: "Xin chào! Đây là email test được gửi từ Node.js bằng Nodemailer.",
// };


// // Gửi email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Gửi email thất bại:", error);
//   } else {
//     console.log("Email đã được gửi:", info.response);
//   }
// });
