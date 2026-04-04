const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      
      req.user = decoded;
      next(); 
    } catch (error) {
      res.status(401).json({ message: "التوكن منتهي أو خطأ" });
    }
  } else {
    res.status(401).json({ message: "غير مسموح، التوكن مفقود" });
  }
};

module.exports = { protect };