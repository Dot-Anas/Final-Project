const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// الإعدادات
app.use(cors());
app.use(express.json()); 

// الـ Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api', (req, res) => {
    res.send('Server is running... ✅');
});

// الاتصال بقاعدة البيانات
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully! 🚀'))
    .catch(err => console.log('Database Connection Error ❌:', err));

// هذا الجزء مهم جداً: لا تشغل app.listen إذا كنا على Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

// تصدير الـ app لـ Vercel
module.exports = app;