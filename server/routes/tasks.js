const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../authMiddleware');

// 1. جلب المهام (المدير يشوف الكل، والموظف يشوف مهامه بس)
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { createdBy: req.user.id },
                { assignedTo: req.user.id }
            ]
        })
        .populate('assignedTo', 'username')
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "خطأ في جلب المهام: " + err.message });
    }
});

// 2. إضافة مهمة جديدة (توزيع للمدير، وإضافة شخصية للموظف) 🔥
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, assignedTo, priority } = req.body;

        if (!title) {
            return res.status(400).json({ message: "عنوان المهمة مطلوب" });
        }

        // --- منطق الصلاحيات الجديد ---
        let finalAssignedTo;

        if (req.user.role === 'admin') {
            // المدير لازم يحدد موظف، وإذا ما حدد بنعتبرها لنفسه
            finalAssignedTo = assignedTo || req.user.id;
        } else {
            // الموظف العادي: دائماً تُسند المهمة لنفسه حتى لو حاول يبعث ID ثاني
            finalAssignedTo = req.user.id;
        }

        const task = new Task({
            title,
            description,
            priority: priority || 'Medium',
            assignedTo: finalAssignedTo,
            createdBy: req.user.id
        });

        const newTask = await task.save();
        const populatedTask = await Task.findById(newTask._id)
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');
        
        res.status(201).json(populatedTask);
    } catch (err) {
        res.status(400).json({ message: "خطأ في الإضافة: " + err.message });
    }
});

// 3. حذف مهمة (المدير يحذف أي شي عمله، والموظف يحذف مهامه الشخصية فقط)
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) return res.status(404).json({ message: "المهمة غير موجودة" });

        // التحقق: هل المستخدم هو من أنشأ المهمة؟
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "غير مسموح لك بحذف هذه المهمة" });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "تم حذف المهمة بنجاح ✅" });
    } catch (err) {
        res.status(500).json({ message: "خطأ في الحذف: " + err.message });
    }
});

// 4. تحديث حالة المهمة
router.patch('/:id', protect, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        ).populate('assignedTo', 'username');

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: "خطأ في التحديث" });
    }
});

module.exports = router;