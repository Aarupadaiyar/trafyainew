import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section active">
      <header className="section-header">
        <h1>Welcome to Trafy Assessments</h1>
        <p>Complete your Assessment to rank on the leaderboard.</p>
      </header>
      <div className="bento-wrap assessment-bento">
        <div className="bento">
           <div className="bento__cell">
             <span className="bento__label">Status</span>
             <span className="bento__value" style={{color: '#4F8CFF'}}>Pending</span>
           </div>
           <div className="bento__cell">
             <span className="bento__label">Questions</span>
             <span className="bento__value">45 MCQ + 2 DSA</span>
           </div>
           <div className="bento__cell">
             <span className="bento__label">Time Limit</span>
             <span className="bento__value">90 Mins</span>
           </div>
        </div>
        <button className="btn btn--primary btn--lg mt-4" onClick={() => navigate('/assessment')}>
          Start Assessment
        </button>
      </div>
    </section>
  );
}
