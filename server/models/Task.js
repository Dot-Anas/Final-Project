const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['Todo', 'Done'], 
        default: 'Todo' 
    },
    // 📅 التاريخ النهائي لتسليم المهمة (Deadline)
    deadline: { 
        type: Date 
    },
    // 💬 مصفوفة التعليقات للنقاش داخل التاسك
    comments: [{
        text: { type: String, required: true },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        createdAt: { type: Date, default: Date.now }
    }],
    // ربط المهمة بالمستخدم المكلف بها
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // المدير اللي أنشأ المهمة
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Medium' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);