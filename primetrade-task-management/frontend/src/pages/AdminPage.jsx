import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { taskAPI, adminAPI } from '../services/api';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'tasks') {
        const res = await taskAPI.getAllTasks(page);
        const pageData = res.data.data;
        setTasks(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      } else if (activeTab === 'users') {
        const [usersRes, statsRes] = await Promise.all([adminAPI.getUsers(), adminAPI.getStats()]);
        setUsers(usersRes.data.data);
        setStats(statsRes.data.data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      fetchData();
    } catch { setError('Delete failed'); }
  };

  const handleSave = async (formData) => {
    if (editingTask) await taskAPI.update(editingTask.id, formData);
    setShowModal(false);
    setEditingTask(null);
    fetchData();
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🛡️ Admin Panel</h1>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); setPage(0); }}>
            📋 All Tasks
          </button>
          <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setPage(0); }}>
            👥 Users
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? <div className="spinner" /> : (
          <>
            {activeTab === 'tasks' && (
              <>
                <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
                  {totalElements} total tasks across all users
                </p>
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No tasks found</h3>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {tasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => { setEditingTask(t); setShowModal(true); }}
                        onDelete={handleDelete}
                        showOwner={true}
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
              </>
            )}

            {activeTab === 'users' && (
              <>
                {stats && (
                  <div className="stats-grid" style={{ marginBottom: '24px' }}>
                    <div className="card stat-card">
                      <div className="stat-number">{stats.totalUsers}</div>
                      <div className="stat-label">Total Users</div>
                    </div>
                    <div className="card stat-card">
                      <div className="stat-number" style={{ color: '#5b21b6' }}>{stats.adminCount}</div>
                      <div className="stat-label">Admins</div>
                    </div>
                    <div className="card stat-card">
                      <div className="stat-number" style={{ color: '#1e40af' }}>{stats.userCount}</div>
                      <div className="stat-label">Regular Users</div>
                    </div>
                  </div>
                )}
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>Username</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>Role</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{user.id}</td>
                          <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>{user.username}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{user.email}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge badge-${user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                              {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
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
