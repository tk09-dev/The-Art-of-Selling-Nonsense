import React, { useState, useEffect } from 'react';
import './PlayerFinances.css';

export default function PlayerFinances({ companyName, setScreen }) {
  const [stats, setStats] = useState({
    profit: 2500,
    growth: 15,
    topRegion: 'Region A',
    soldProducts: 1200,
    news: ['Product launched in Region A', 'Ad campaign viral']
  });

  const categories = [
    'Sold Products',
    'Sold Products per Region',
    'Sold Products per Generation',
    'Sold Products per Region & Generation',
    'Utilisation of Production',
    'Production Cost per Unit',
    'Revenue per Unit',
    'Shipping Cost per Unit (Fast/Normal)',
    'Customer Satisfaction',
    'Advertising Reach per Campaign/Source',
    'Demand in Last Year'
  ];

  // Dummy data for table
  const tableData = categories.map((cat, idx) => ({
    category: cat,
    value: Math.floor(Math.random() * 1000)
  }));

  return (
    <div className="finances-screen">
      <header className="finances-header">
        <div className="company-name">{companyName}</div>
        <div className="header-stats">
          {stats.profit} USD | Growth: {stats.growth}% | Top Region: {stats.topRegion} | News: {stats.news.join(' • ')}
        </div>
        <div className="current-category">Finances</div>
      </header>

      <div className="finances-content">
        <div className="menu-left">
          {/* Back button moved here */}
          <button className="back-button" onClick={() => setScreen('playerMenu')}>
            Back to Main
          </button>
        </div>

        <table className="finances-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.category}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="graphs">
          <div className="graph budget-growth">Budget & Growth Graph Placeholder</div>
          <div className="graph sales-growth">Sales Growth Graph Placeholder</div>
        </div>
      </div>
    </div>
  );
}
