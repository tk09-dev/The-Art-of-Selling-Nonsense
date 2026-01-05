import React, { useState } from 'react';
import './HostMarketing.css';

export default function HostMarketing({ setScreen }) {
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

  const [companies, setCompanies] = useState([
    {
      name: 'Company A',
      strategies: [
        { name: 'TikTok Campaign', details: 'Influencer video, 1M reach, $5000 budget' },
        { name: 'TV Product Placement', details: 'Prime time show, high visibility' },
      ],
    },
    {
      name: 'Company B',
      strategies: [
        { name: 'Instagram Ads', details: 'Story ads, 500k reach, $3000 budget' },
      ],
    },
    {
      name: 'Company C',
      strategies: [
        { name: 'Newspaper Ads', details: 'Local papers, 100k reach, $2000 budget' },
      ],
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div className="host-marketing-screen">
      <header className="host-marketing-header">
        <button className="back-button" onClick={() => setScreen('hostMainMenu')}>
          Back to Main
        </button>
        <div className="header-stats">
          Total Profit: ${stats.totalProfit} | Growth: {stats.growth}% | Top Region: {stats.topRegion} | News: {stats.news.join(' • ')}
        </div>
        <div className="current-category">Marketing Strategies</div>
      </header>

      <div className="company-list">
        {companies.map((comp, idx) => (
          <div
            key={idx}
            className={`company-box ${selectedCompany === comp ? 'selected' : ''}`}
            onClick={() => setSelectedCompany(comp)}
          >
            {comp.name}
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="selected-company-strategies">
          <h2>{selectedCompany.name} Strategies</h2>
          <div className="strategy-boxes">
            {selectedCompany.strategies.map((strategy, idx) => (
              <div className="strategy-box" key={idx}>
                <strong>{strategy.name}</strong>
                <p>{strategy.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
