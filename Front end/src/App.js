import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import InsightsPanel from './components/InsightsPanel';

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [insights, setInsights] = useState({ summary: '', insights: {} });

  const fetchTasks = async () => {
    let url = API_URL;
    const params = [];
    if (filters.status) params.push(`status=${filters.status}`);
    if (filters.priority) params.push(`priority=${filters.priority}`);
    if (params.length) url += '?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  const fetchInsights = async () => {
    const res = await fetch(API_URL + '/insights');
    const data = await res.json();
    setInsights(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchInsights();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>📝 Mini Task Tracker</h2>
      <TaskForm onTaskAdded={fetchTasks} />
      <TaskList
        tasks={tasks}
        filters={filters}
        setFilters={setFilters}
        onTaskUpdated={fetchTasks}
      />
      <InsightsPanel insights={insights} />
    </div>
  );
}

export default App;
