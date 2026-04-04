const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Server is running... ✅');
});

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully! 🚀'))
    .catch(err => console.log('Database Connection Error ❌:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});