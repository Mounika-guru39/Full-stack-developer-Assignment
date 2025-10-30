const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, getInsights } = require('../models/task');

// POST /tasks → Add new task
router.post('/', (req, res) => {
  const { title, description, priority, due_date, status } = req.body;
  if (!title || !priority || !due_date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  createTask({ title, description, priority, due_date, status }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.id });
  });
});

// GET /tasks → List all tasks (with filters)
router.get('/', (req, res) => {
  const { status, priority } = req.query;
  getTasks({ status, priority }, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tasks);
  });
});

// PATCH /tasks/:id → Update status or priority
router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const { status, priority } = req.body;
  if (!status && !priority) {
    return res.status(400).json({ error: "Missing fields to update" });
  }
  updateTask(id, { status, priority }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: result.changes });
  });
});

// GET /insights → Return summary
router.get('/insights', (req, res) => {
  getInsights((err, insights) => {
    if (err) return res.status(500).json({ error: err.message });
    // Simple AI-like summary
    let dominantPriority = insights.priorityStats.reduce((a, b) => a.count > b.count ? a : b, {priority: '', count: 0});
    let summary = `You have ${insights.openTasks} open tasks — most are ${dominantPriority.priority} priority.`
    if (insights.dueSoon > 0) {
      summary += ` ${insights.dueSoon} tasks are due soon.`
    }
    if (insights.busiestDay) {
      summary += ` Busiest day: ${insights.busiestDay} (${insights.busiestDayCount} tasks).`
    }
    res.json({ insights, summary });
  });
});

module.exports = router;ro
