import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/leaderboard');
      setLeaderboard(response.data);
    } catch (e) {
      console.error('Failed to fetch leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const socket = io('http://localhost:3000');
    socket.on('leaderboard_update', () => {
      fetchLeaderboard();
    });
    return () => socket.disconnect();
  }, []);

  return (
    <section className="dashboard-section active">
      <header className="section-header">
        <h1>Global Leaderboard</h1>
        <p>Live rankings updated in real-time.</p>
      </header>
      <div className="leaderboard-table-wrapper">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center'}}>No candidates have completed the assessment yet.</td></tr>
              ) : (
                leaderboard.map((entry, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr key={entry.user_id}>
                      <td><span className={`rank rank-${rank <= 3 ? rank : 'other'}`}>{rank}</span></td>
                      <td>{entry.display_name || 'Anonymous Candidate'}</td>
                      <td>{entry.total_score}</td>
                      <td><span className="status-badge status-completed">Completed</span></td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
