import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenTool, Trophy, History } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/trafy-logo.png" alt="Trafy Logo" className="sidebar__logo" style={{ height: '32px' }} />
      </div>
      <nav className="sidebar__nav">
        <NavLink to="/" className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard className="icon" />
          Overview
        </NavLink>
        <NavLink to="/assessment" className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}>
          <PenTool className="icon" />
          Assessment
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}>
          <Trophy className="icon" />
          Leaderboard
        </NavLink>
        <NavLink to="/results" className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}>
          <History className="icon" />
          Results
        </NavLink>
      </nav>
      <div className="sidebar__footer">
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-status">Candidate</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
