const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../authMiddleware');

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
        .populate('comments.user', 'username') // جلب اسم كاتب التعليق
        .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "خطأ في جلب المهام: " + err.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const { title, description, assignedTo, priority, deadline } = req.body;

        if (!title) {
            return res.status(400).json({ message: "عنوان المهمة مطلوب" });
        }

        let finalAssignedTo;
        if (req.user.role === 'admin') {
            finalAssignedTo = assignedTo || req.user.id;
        } else {
            finalAssignedTo = req.user.id;
        }

        const task = new Task({
            title,
            description,
            priority: priority || 'Medium',
            deadline, 
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

router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "التعليق لا يمكن أن يكون فارغاً" });

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "المهمة غير موجودة" });

        task.comments.push({
            text,
            user: req.user.id
        });

        await task.save();

        const updatedTask = await Task.findById(req.params.id)
            .populate('comments.user', 'username');

        res.status(201).json(updatedTask.comments);
    } catch (err) {
        res.status(500).json({ message: "خطأ في إضافة التعليق: " + err.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "المهمة غير موجودة" });

        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "غير مسموح لك بحذف هذه المهمة" });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "تم حذف المهمة بنجاح ✅" });
    } catch (err) {
        res.status(500).json({ message: "خطأ في الحذف: " + err.message });
    }
});

router.patch('/:id', protect, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        )
        .populate('assignedTo', 'username')
        .populate('comments.user', 'username');

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: "خطأ في التحديث" });
    }
});

module.exports = router;