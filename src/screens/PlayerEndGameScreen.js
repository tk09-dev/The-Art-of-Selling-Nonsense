import React, { useEffect, useState } from 'react';
import './NextRoundScreen.css';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function PlayerEndGameScreen({ lobbyCode, playerName, onExit }) {
  const [players, setPlayers] = useState([]);
  const [myPlayer, setMyPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinalResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
        const list = res.data.players || [];

        setPlayers(
          [...list].sort(
            (a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)
          )
        );

        const me = list.find(p => p.name === playerName);
        setMyPlayer(me || null);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load end game data', err);
        setLoading(false);
      }
    };

    fetchFinalResults();
  }, [lobbyCode, playerName]);

  return (
    <div className="next-round-screen">
      <h1>🏁 Game Over</h1>

      {loading ? (
        <div className="loading-spinner">Loading final results...</div>
      ) : (
        <>
          <h2>Final Leaderboard</h2>

          <ul className="leaderboard-list">
            {players.map((p, idx) => (
              <li
                key={p.name}
                style={{
                  border: p.name === playerName ? '3px solid #4caf50' : '1px solid #ccc',
                  background: p.name === playerName ? '#eaffea' : '#fff',
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

          {myPlayer?.roundHistory && (
            <div style={{ width: '100%', height: 300, marginTop: 40 }}>
              <h3>Your Revenue per Round</h3>

              <ResponsiveContainer>
                <BarChart data={myPlayer.roundHistory}>
                  <XAxis dataKey="round" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      <button style={{ marginTop: 30 }} onClick={onExit}>
        Exit Game
      </button>
    </div>
  );
}

