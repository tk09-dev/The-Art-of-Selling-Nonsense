import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerOtherCompanies.css';

export default function PlayerOtherCompanies({ lobbyCode, setScreen }) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
        setCompanies(res.data.leaderboard || []);
      } catch (err) {
        console.error('Failed to load companies', err);
      }
    }

    fetchCompanies();
  }, [lobbyCode]);

  return (
    <div className="other-companies-screen">
      <h2>🏢 Other Companies</h2>

      <div className="companies-list">
        {companies.map((comp) => (
          <div key={comp.name} className="company-card">
            <div className="company-header">
              <strong>{comp.name}</strong>
            </div>

            <div className="company-stats">
              <div>Revenue (round): ${comp.revenue?.toLocaleString() ?? 0}</div>
              <div>Profit (round): ${comp.profit?.toLocaleString() ?? 0}</div>
              <div>Total Revenue: ${comp.totalRevenue?.toLocaleString() ?? 0}</div>
              <div>Satisfaction: {comp.satisfaction ?? 0}</div>
              <div>Demand: {comp.demand ?? 0}</div>
              <div>Sustainability: {comp.sustainability_score ?? 0}</div>
            </div>

            <div className="company-product">
              <div className="product-name">
                {comp.productName || 'No product launched'}
              </div>
              {comp.productDescription && (
                <div className="product-description">
                  {comp.productDescription}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={() => setScreen('playerMenu')}>
        ← Back to Main Menu
      </button>
    </div>
  );
}
