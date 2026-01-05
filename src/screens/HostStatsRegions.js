import React, { useState } from 'react';
import './HostStatsRegions.css';

export default function HostStatsRegions({ setScreen }) {
  const [stats, setStats] = useState({
    totalProfit: 120000,
    growth: 18,
    topRegion: 'Region A',
    news: [
      'Company A launched a successful product',
      'Company B marketing campaign went viral',
      'Regional event increased sales in Region C'
    ]
  });

  // Example region stats data
  const [regions, setRegions] = useState([
    {
      name: 'Region A',
      consumption: 12000,
      wages: 15.5,
      investments: 5000,
      production: 10000,
      events: ['Festival increases sales', 'Energy price surge'],
    },
    {
      name: 'Region B',
      consumption: 9000,
      wages: 13.2,
      investments: 3000,
      production: 7500,
      events: ['Weather disruption', 'Local marketing campaign'],
    },
    {
      name: 'Region C',
      consumption: 15000,
      wages: 17.0,
      investments: 7000,
      production: 13000,
      events: ['Economic boom', 'Regional promotion'],
    }
  ]);

  // Vectorized keys for optimized mapping
  const generateKey = (regionName, metric) => `${regionName}-${metric}`;

  return (
    <div className="host-stats-screen">
      <header className="host-stats-header">
        <button className="back-button" onClick={() => setScreen('hostMainMenu')}>
          Back to Main
        </button>
        <div className="header-stats">
          Total Profit: ${stats.totalProfit} | Growth: {stats.growth}% | Top Region: {stats.topRegion} | News: {stats.news.join(' • ')}
        </div>
        <div className="current-category">View Stats per Region</div>
      </header>

      <div className="region-tables">
        {regions.map((region, idx) => (
          <div className="region-table-container" key={region.name}>
            <h2>{region.name}</h2>
            <table className="region-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr key={generateKey(region.name, 'consumption')}>
                  <td>Consumption</td>
                  <td>{region.consumption}</td>
                </tr>
                <tr key={generateKey(region.name, 'wages')}>
                  <td>Average Wage</td>
                  <td>${region.wages}</td>
                </tr>
                <tr key={generateKey(region.name, 'investments')}>
                  <td>Investments</td>
                  <td>${region.investments}</td>
                </tr>
                <tr key={generateKey(region.name, 'production')}>
                  <td>Production</td>
                  <td>{region.production}</td>
                </tr>
                <tr key={generateKey(region.name, 'events')}>
                  <td>Events</td>
                  <td>{region.events.join(' • ')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
