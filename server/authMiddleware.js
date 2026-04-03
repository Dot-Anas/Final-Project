const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. هل التوكن موجود في الهيدرز؟
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      // 2. فك التشفير باستخدام كلمة السر اللي في الـ .env
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      
      // 3. إضافة بيانات المستخدم للطلب عشان السيرفر يعرف مين اللي عم يطلب
      req.user = decoded;
      next(); // كمل طريقك، التوكن صح
    } catch (error) {
      res.status(401).json({ message: "التوكن منتهي أو خطأ" });
    }
  } else {
    res.status(401).json({ message: "غير مسموح، التوكن مفقود" });
  }
};

module.exports = { protect };