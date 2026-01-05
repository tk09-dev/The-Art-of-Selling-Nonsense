import React, { useState, useEffect } from 'react';
import './NextRoundScreen.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HostNextRoundScreen({ lobbyCode, onNextRound, onEndGame }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
        setLeaderboard(res.data.leaderboard || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 1000); // keep updating
    return () => clearInterval(interval);
  }, [lobbyCode]);

  const handleNextRound = async () => {
    try {
      await axios.post('http://localhost:5050/start-next-round', { lobbyCode });
      onNextRound(); // return to host main menu
    } catch (err) {
      console.error('Failed to start next round', err);
    }
  };

  return (
    <div className="next-round-screen">
      <h1>End of Round</h1>
      <h2>Leaderboard</h2>

      {loading ? (
        <div className="loading-spinner">Calculating...</div>
            ) : (
        <>
          <ul className="leaderboard-list">
            {leaderboard.map((comp, idx) => (
              <li key={comp.name}>
                <div><strong>{idx + 1}. {comp.name}</strong></div>
                <div>Revenue: ${comp.revenue.toLocaleString()}</div>
                <div>Profit: ${comp.profit.toLocaleString()}</div>
                <div>Units Sold: {comp.units_sold || 0}</div>
                <div>Adjusted Demand: {comp.adjusted_demand || 0}</div>
                <div>Revenue per Unit: ${comp.revenue_per_unit || 0}</div>
                <div>Satisfaction: {comp.satisfaction}</div>
                <div>Sustainability Score: {comp.sustainability_score || 0}</div>
              </li>
            ))}
          </ul>

          {/* HOST ROUND SUMMARY CHART */}
          <div style={{ width: '100%', height: 350, marginTop: 40 }}>
            <h3>Total Revenue by Company</h3>

            <ResponsiveContainer>
              <BarChart
                data={leaderboard.map(c => ({
                  name: c.name,
                  value: c.revenue
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}


      <div className="next-round-buttons">
        <button className="next-round-button" onClick={handleNextRound}>
          Start Next Round
        </button>
        <button className="end-game-button" onClick={onEndGame}>
          End Game
        </button>
      </div>
    </div>
  );
}