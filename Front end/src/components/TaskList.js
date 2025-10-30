import React from 'react';

const API_URL = "http://localhost:5000/tasks";

function TaskList({ tasks, filters, setFilters, onTaskUpdated }) {
  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id, field, value) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    onTaskUpdated();
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label>
          Filter Status:
          <select name="status" value={filters.status} onChange={handleFilter}>
            <option value="">All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </label>
        <label style={{ marginLeft: 8 }}>
          Filter Priority:
          <select name="priority" value={filters.priority} onChange={handleFilter}>
            <option value="">All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>
      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>
                <select value={t.priority} onChange={e => handleUpdate(t.id, 'priority', e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </td>
              <td>{t.due_date}</td>
              <td>
                <select value={t.status} onChange={e => handleUpdate(t.id, 'status', e.target.value)}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </td>
              <td>
                {/* No delete/edit for simplicity; could extend if needed */}
                -
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
