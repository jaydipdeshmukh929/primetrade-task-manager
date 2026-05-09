import React from 'react';

const STATUS_LABEL = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const PRIORITY_LABEL = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

export default function TaskCard({ task, onEdit, onDelete, showOwner }) {
  const statusClass = `badge badge-${task.status.toLowerCase()}`;
  const priorityClass = `badge badge-${task.priority.toLowerCase()}`;

  return (
    <div className="card task-card">
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        <span className={statusClass}>{STATUS_LABEL[task.status]}</span>
      </div>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      <div className="task-card-meta">
        <span className={priorityClass}>{PRIORITY_LABEL[task.priority]}</span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      {showOwner && (
        <div className="task-card-owner">👤 {task.ownerUsername}</div>
      )}

      <div className="task-card-actions">
        <button className="btn btn-outline btn-sm" onClick={() => onEdit(task)}>✏️ Edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>🗑️ Delete</button>
      </div>
    </div>
  );
}
