const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json()); 

// 2. استدعاء الروابط (Routes) - رح ننشئهم هسا
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// 3. استخدام الروابط
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// رابط تجريبي للتأكد
app.get('/', (req, res) => {
    res.send('Server is running... ✅');
});

// 4. الاتصال بقاعدة البيانات
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully! 🚀'))
    .catch(err => console.log('Database Connection Error ❌:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});