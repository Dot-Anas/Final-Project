const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // 🔥 إضافة الصلاحيات (الرتبة)
  role: { 
    type: String, 
    enum: ['admin', 'worker'], // مسموح فقط بـ مدير أو موظف
    default: 'worker'          // أي حساب جديد بكون موظف تلقائياً
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);