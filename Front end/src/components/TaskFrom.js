import React, { useState } from 'react';

const API_URL = "http://localhost:5000/tasks";

const defaultFields = {
  title: '',
  description: '',
  priority: 'Medium',
  due_date: '',
  status: 'Open'
};

function TaskForm({ onTaskAdded }) {
  const [fields, setFields] = useState(defaultFields);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.title || !fields.due_date) {
      alert('Title and Due Date are required');
      return;
    }
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    setFields(defaultFields);
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <input name="title" placeholder="Title" value={fields.title} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={fields.description} onChange={handleChange} />
      <select name="priority" value={fields.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input type="date" name="due_date" value={fields.due_date} onChange={handleChange} required />
      <select name="status" value={fields.status} onChange={handleChange}>
        <option>Open</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
