const jwt = require('jsonwebtoken');

//Kiểm tra token và giải mã thông tin
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Ví dụ: "Bearer eyJhbGciOiJIUzI1Ni..."

  
  // Lấy phần sau "Bearer"
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  // console.log('token at auth: ',token)

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY|| 'secret123', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//Phân quyền
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log('roleId at auth: ',req.user.roleId)
    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
    }
    next();
  };
};

module.exports = { 
  authenticateToken : authenticateToken, 
  authorizeRoles : authorizeRoles
};


