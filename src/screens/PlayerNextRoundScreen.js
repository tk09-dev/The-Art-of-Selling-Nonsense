import React, { useState, useEffect } from 'react';
import './NextRoundScreen.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


export default function PlayerNextRoundScreen({ lobbyCode, setScreen }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll backend for leaderboard updates and round start
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
        setLeaderboard(res.data.leaderboard || []);
        setLoading(false);

        // If host started next round, go back to player menu
        if (res.data.roundStarted) {
          setScreen('playerMenu');
        }
      } catch (err) {
        console.error('Failed to fetch lobby data', err);
        setLoading(false);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 1000); // poll every second
    return () => clearInterval(interval);
  }, [lobbyCode, setScreen]);

   const myCompany = leaderboard[0];
  
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
                <div>Units Sold: {comp.units_sold ?? '—'}</div>
                <div>Adjusted Demand: {comp.adjusted_demand ?? '—'}</div>
                <div>Revenue per Unit: {comp.revenue_per_unit ?? '—'}</div>
                <div>Satisfaction: {comp.satisfaction}</div>
                <div>Sustainability Score: {comp.sustainability_score || 0}</div>
              </li>
            ))}
          </ul>

          {myCompany && (
            <div style={{ width: '100%', height: 300, marginTop: 30 }}>
              <h3>Your Revenue Progress</h3>

              <ResponsiveContainer>
                <BarChart
                  data={[
                    { name: 'This Round', value: myCompany.revenue },
                    { name: 'Total', value: myCompany.totalRevenue }
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}


      {loading && <div className="waiting-text">Waiting for calculation to finish...</div>}
      {!loading && <div className="waiting-text">Waiting for the host to start the next round...</div>}
    </div>
  );
}