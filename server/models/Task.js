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
        enum: ['Todo', 'Done'], // تحديد الخيارات المتاحة فقط
        default: 'Todo' 
    },
    // 🔥 التعديل المهم: ربط المهمة بمستخدم حقيقي عن طريق الـ ID
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // بيحكي للمونجو: "روح دور على هاد الـ ID في جدول الـ User"
        required: true 
    },
    // مين المدير اللي أنشأ هاي المهمة
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