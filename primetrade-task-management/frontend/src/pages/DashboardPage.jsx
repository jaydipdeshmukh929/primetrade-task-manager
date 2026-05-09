import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await taskAPI.getMyTasks(page);
      const pageData = res.data.data;
      setTasks(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (formData) => {
    if (editingTask) {
      await taskAPI.update(editingTask.id, formData);
    } else {
      await taskAPI.create(formData);
    }
    setShowModal(false);
    setEditingTask(null);
    setPage(0);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
    try {
      await taskAPI.delete(id);
      setDeleteConfirm(null);
      fetchTasks();
    } catch { setError('Failed to delete task'); }
  };

  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              {totalElements} total tasks
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowModal(true); }}>
            + New Task
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-number">{totalElements}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: '#6b7280' }}>{statusCounts.TODO || 0}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: '#1d4ed8' }}>{statusCounts.IN_PROGRESS || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: '#065f46' }}>{statusCounts.DONE || 0}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {deleteConfirm && (
          <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Are you sure you want to delete this task?</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteConfirm)}>Confirm</button>
              <button className="btn btn-outline btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="spinner" />
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Click "New Task" to create your first task</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showOwner={false}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={i === page ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
