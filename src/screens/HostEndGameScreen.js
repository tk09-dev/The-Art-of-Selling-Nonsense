import React, { useState, useEffect } from 'react';
import './HostEndGameScreen.css';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function HostEndGameScreen({ lobbyCode, onClose }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

const sortedPlayers = [...players].sort(
  (a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)
);

  useEffect(() => {
    const fetchFinalResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
        setPlayers(res.data.leaderboard || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch final results', err);
        setLoading(false);
      }
    };

    fetchFinalResults();
  }, [lobbyCode]);

  const chartData = players.map(p => ({
    name: p.name,
    revenue: p.totalRevenue || 0
  }));

  return (
    <div className="next-round-screen">
      <h1>🏁 Game Over</h1>
      <h2>Final Results</h2>

      {loading ? (
        <div className="loading-spinner">Loading final results...</div>
      ) : (
        <>
          <ul className="leaderboard-list">
  {sortedPlayers.map((p, idx) => (
    <li
      key={p.name}
      style={{
        border: idx === 0 ? '3px solid gold' : '1px solid #ccc',
        background: idx === 0 ? '#fffbe6' : '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
      }}
    >
      <strong>
        {idx === 0 ? '🏆 ' : ''}
        {idx + 1}. {p.name}
      </strong>

      <div>Total Revenue: ${p.totalRevenue?.toLocaleString() || 0}</div>
      <div>Total Profit: ${p.totalProfit?.toLocaleString() || 0}</div>
      <div>Total Units Sold: {p.totalUnitsSold || 0}</div>
      <div>Satisfaction: {p.satisfaction}</div>
      <div>Sustainability Score: {p.sustainabilityScore || 0}</div>
    </li>
  ))}
</ul>


          <div style={{ width: '100%', height: 350, marginTop: 40 }}>
            <h3>Total Revenue by Company</h3>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <button style={{ marginTop: 30 }} onClick={onClose}>
        Exit Game
      </button>
    </div>
  );
}
