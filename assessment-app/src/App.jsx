import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MasterAssessment from './components/MasterAssessment';
import Leaderboard from './components/Leaderboard';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment" element={<MasterAssessment />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
