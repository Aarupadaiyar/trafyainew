import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mocking the user ID for now, since we haven't wired up full React Auth
  const userId = 'e82b7db3-6627-46dc-a070-5b1288c3a9d3'; 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/assessment/results/${userId}`);
        setResults(response.data);
      } catch (e) {
        console.error('Failed to fetch results:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <section className="dashboard-section active">
      <header className="section-header">
        <h1>Your Results</h1>
        <p>View your past assessment performances and feedback.</p>
      </header>
      <div className="leaderboard-table-wrapper">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Assessment</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center'}}>You have not completed any assessments yet.</td></tr>
              ) : (
                results.map((res, idx) => (
                  <tr key={idx}>
                    <td>{new Date(res.submitted_at).toLocaleDateString()}</td>
                    <td>Assessment Cohort '26</td>
                    <td>{res.total_score}</td>
                    <td>
                      <span className={`status-badge ${res.total_score > 700 ? 'status-completed' : ''}`} style={res.total_score <= 700 ? {background: 'rgba(255, 99, 132, 0.1)', color: '#FF6384'} : {}}>
                        {res.total_score > 700 ? 'Passed' : 'Needs Review'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
