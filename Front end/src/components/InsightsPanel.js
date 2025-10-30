import React from 'react';

function InsightsPanel({ insights }) {
  return (
    <div style={{ margin: "2rem 0", padding: "1rem", background: "#f6f7f9", borderRadius: 8 }}>
      <h3>Insights</h3>
      <p><strong>{insights.summary}</strong></p>
      <ul>
        <li>Tasks by Priority:
          <ul>
            {insights.insights.priorityStats?.map(p => (
              <li key={p.priority}>{p.priority}: {p.count}</li>
            ))}
          </ul>
        </li>
        <li>Tasks due soon (next 3 days): {insights.insights.dueSoon}</li>
        <li>Busiest day: {insights.insights.busiestDay} ({insights.insights.busiestDayCount} tasks)</li>
      </ul>
    </div>
  );
}

export default InsightsPanel;In
