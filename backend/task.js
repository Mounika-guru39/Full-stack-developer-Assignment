const db = require('../db');

// Helper functions to interact with the tasks table

function createTask({ title, description, priority, due_date, status }, cb) {
  const sql = `INSERT INTO tasks (title, description, priority, due_date, status)
               VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [title, description, priority, due_date, status], function (err) {
    cb(err, { id: this.lastID });
  });
}

function getTasks({ status, priority }, cb) {
  let sql = "SELECT * FROM tasks";
  const params = [];
  const filters = [];
  if (status) { filters.push("status = ?"); params.push(status); }
  if (priority) { filters.push("priority = ?"); params.push(priority); }
  if (filters.length) {
    sql += " WHERE " + filters.join(" AND ");
  }
  sql += " ORDER BY due_date ASC";
  db.all(sql, params, cb);
}

function updateTask(id, fields, cb) {
  let updates = [];
  let params = [];
  if (fields.status) { updates.push("status = ?"); params.push(fields.status); }
  if (fields.priority) { updates.push("priority = ?"); params.push(fields.priority); }
  if (!updates.length) return cb(new Error("No fields to update"));
  params.push(id);
  const sql = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`;
  db.run(sql, params, function (err) {
    cb(err, { changes: this.changes });
  });
}

function getInsights(cb) {
  // Custom SQL queries for insights
  db.all(
    `SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority`, [], (err, priorityStats) => {
      if (err) return cb(err);

      db.get(
        `SELECT COUNT(*) as dueSoon FROM tasks WHERE due_date <= date('now', '+3 day') AND status != 'Done'`, [], (err2, dueSoonStat) => {
          if (err2) return cb(err2);

          db.get(
            `SELECT due_date, COUNT(*) as count FROM tasks GROUP BY due_date ORDER BY count DESC LIMIT 1`, [], (err3, busiestDayStat) => {
              if (err3) return cb(err3);

              db.get(`SELECT COUNT(*) as openTasks FROM tasks WHERE status != 'Done'`, [], (err4, openTasksStat) => {
                if (err4) return cb(err4);

                cb(null, {
                  priorityStats,
                  dueSoon: dueSoonStat.dueSoon,
                  busiestDay: busiestDayStat ? busiestDayStat.due_date : null,
                  busiestDayCount: busiestDayStat ? busiestDayStat.count : 0,
                  openTasks: openTasksStat.openTasks,
                });
              });
            }
          );
        }
      );
    }
  );
}

module.exports = { createTask, getTasks, updateTask, getInsights };
