import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">⚡ Primetrade Task Manager</div>
      {user && (
        <div className="navbar-user">
          <span>
            👤 {user.username}
            &nbsp;
            <span className={`badge badge-${user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
              {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
            </span>
          </span>
          {isAdmin && (
            <button onClick={() => navigate('/admin')}>Admin Panel</button>
          )}
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
