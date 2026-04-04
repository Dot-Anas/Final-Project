const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../authMiddleware'); 

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "الرجاء تعبئة جميع الحقول" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "هذا البريد الإلكتروني مسجل بالفعل" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "تم إنشاء المستخدم بنجاح ✅" });

    } catch (err) {
        res.status(500).json({ message: "حدث خطأ في التسجيل", error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود ❌" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "كلمة السر غير صحيحة 🔑" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.status(200).json({
            message: "تم تسجيل الدخول بنجاح ✅",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role 
            }
        });
    } catch (err) {
        res.status(500).json({ message: "حدث خطأ أثناء الدخول", error: err.message });
    }
});

router.get('/users', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "غير مسموح لك برؤية قائمة الموظفين" });
        }

        const users = await User.find({}).select('username _id role');
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "فشل في جلب قائمة المستخدمين" });
    }
});

module.exports = router;