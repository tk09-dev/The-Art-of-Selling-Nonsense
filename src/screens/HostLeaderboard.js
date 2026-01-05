import React, { useState, useEffect } from 'react';
import './HostLeaderboard.css';

export default function HostLeaderboard({ companies, onClose }) {
  const [selectedStat, setSelectedStat] = useState('Revenue');

  // Define all the leaderboard categories
  const stats = [
  'Revenue',
  'Total Revenue',
  'Profit',
  'Total Profit',
  'Units Sold',
  'Total Units Sold',
  'Revenue per Unit',
  'Highest Satisfaction',
  'Highest Demand',
  'Most Sustainable Product'
];

const statKeyMap = {
  'Revenue': 'revenue',
  'Total Revenue': 'totalRevenue',

  'Profit': 'profit',
  'Total Profit': 'totalProfit',

  'Units Sold': 'units_sold',
  'Total Units Sold': 'totalUnitsSold',

  'Revenue per Unit': 'revenue_per_unit',
  'Highest Satisfaction': 'satisfaction',
  'Highest Demand': 'demand',
  'Most Sustainable Product': 'sustainability_score'
};

  // Compute the leaderboard based on the selected stat
const sortedCompanies = [...companies].sort((a, b) => {
  const statKey = statKeyMap[selectedStat];
  return (b[statKey] || 0) - (a[statKey] || 0);
});
 


  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-header">
        <h2>
  Leaderboard – {selectedStat}
  <span style={{ fontSize: '0.8em', marginLeft: 10, opacity: 0.7 }}>
    {selectedStat.startsWith('Total') ? '(Game Total)' : '(This Round)'}
  </span>
</h2>

        <button className="close-button" onClick={onClose}>Close</button>
      </div>

      <div className="leaderboard-stats-buttons">
        {stats.map((stat) => (
          <button
            key={stat}
            className={`stat-button ${selectedStat === stat ? 'active' : ''}`}
            onClick={() => setSelectedStat(stat)}
          >
            {stat}
          </button>
        ))}
      </div>

      <ul className="leaderboard-list">
        {sortedCompanies.map((comp, idx) => {
          const statKey = statKeyMap[selectedStat];
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'k';
  return value.toString();
};
          return (
            <li
  key={comp.name}
  style={{
    fontWeight: idx === 0 ? 'bold' : 'normal',
    background: idx === 0 ? '#fff4cc' : 'transparent'
  }}
>
              <span className="rank">{idx + 1}.</span>
              <span className="company-name">{comp.name}</span>
              <span className="stat-value">
  {formatNumber(comp[statKey])}
</span>

            </li>
          );
        })}
      </ul>
    </div>
  );
}
