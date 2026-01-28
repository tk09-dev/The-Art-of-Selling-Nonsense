import React, { useState, useEffect } from 'react';
import './PlayerMenu.css';
import axios from 'axios';

const logos = ['LOGO 1','LOGO 2','LOGO 3','LOGO 4','LOGO 5','LOGO 6','LOGO 7','LOGO 8'];

export default function PlayerMenu({ companyName, setScreen, lobbyCode }) {
  const [selectedLogo, setSelectedLogo] = useState('');
  const [budget, setBudget] = useState(10000);
  const [profit, setProfit] = useState(2500);
  const [growth, setGrowth] = useState(15);
  const [aiFeedback, setAiFeedback] = useState('');
  const [fitsBudget, setFitsBudget] = useState(true);

  // Assign a random logo on mount
  useEffect(() => {
    const randomLogo = logos[Math.floor(Math.random() * logos.length)];
    setSelectedLogo(randomLogo);
  }, []);

  // Poll backend every second to get round results and detect if round has ended
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const resLobby = await axios.get(`https://the-art-of-selling-nonsense-backend.onrender.com/lobby/${lobbyCode}`);
        const playerData = resLobby.data.players.find(p => p.name === companyName);
        if (playerData) {
          setBudget(
  typeof playerData.budget === 'number'
    ? playerData.budget
    : NaN
);

setProfit(
  typeof playerData.profit === 'number'
    ? playerData.profit
    : NaN
);

          setAiFeedback(playerData.aiFeedback || '');
          setFitsBudget(playerData.fitsBudget || false);
        }

        const resRound = await axios.get(`https://the-art-of-selling-nonsense-backend.onrender.com
/round-state/${lobbyCode}`);
        if (resRound.data.roundEnded) {
          setScreen('playerNextRound');
        }
      } catch (err) {
        console.error('Failed to poll lobby/round state', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lobbyCode, companyName, setScreen]);

  return (
    <div className="player-menu-screen">
      <h1 className="company-title">{companyName}</h1>

      <div className="menu-content">
        <div className="menu-left">
          <button className="menu-button" onClick={() => setScreen('playerFinances')}>💰 Finances</button>
          <button className="menu-button" onClick={() => setScreen('playerProduction')}>🏭 Production</button>
          <button className="menu-button" onClick={() => setScreen('playerMarketing')}>📈 Marketing</button>
          <button className="menu-button" onClick={() => setScreen('playerOtherCompanies')}>🏢 Other Companies</button>
          <button className="menu-button" onClick={() => setScreen('playerNews')}>📰 News</button>
          <button className="menu-button" onClick={() => setScreen('playerProductReviews')}>⭐ Product Reviews</button>
        </div>

        <div className="menu-main-box">
          <div className="product-box">
            <span className="product-name">Product Name</span>
          </div>

          <div className="company-logo">
            <span>{selectedLogo}</span>
            <span className="small-company-name">{companyName}</span>
          </div>

          <div className="stats">
            <div>
              <strong>Budget:</strong>{" "}
              {Number.isNaN(budget) ? "—" : `$${budget.toLocaleString()}`}
            </div>

            <div>
              <strong>Profit:</strong>{" "}
              {Number.isNaN(profit) ? "—" : `$${profit.toLocaleString()}`}
            </div>

            <div><strong>Growth:</strong> {growth}%</div>
            <div><strong>Fits Budget:</strong> {fitsBudget ? '✅ Yes' : '❌ No'}</div>
            {aiFeedback && <div><strong>AI Feedback:</strong> {aiFeedback}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}