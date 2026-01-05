import React, { useState, useEffect } from 'react';
import './HostMainMenu.css';
import HostLeaderboard from './HostLeaderboard';
import axios from 'axios';

export default function HostMainMenu({ lobbyCode, setScreen }) {
  const [leadingCompanies, setLeadingCompanies] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [refuseReason, setRefuseReason] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
        if (res.data.pendingProducts && res.data.pendingProducts.length > 0) {
          setPendingProduct(res.data.pendingProducts[0]);
        } else {
          setPendingProduct(null);
        }
        setLeadingCompanies(res.data.leaderboard);
      } catch (err) {
        console.error('Failed to poll lobby', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lobbyCode]);

  const handleApprove = async () => {
  if (!pendingProduct) return;

  const approvingCompany = pendingProduct.companyName;
  setPendingProduct(null); // UI lock immediately

  try {
    await axios.post('http://localhost:5050/approve-product', {
      lobbyCode,
      companyName: approvingCompany
    });
    setRefuseReason('');
  } catch (err) {
    console.error(err);
  }
};


  const handleRefuse = async () => {
  if (!pendingProduct || !refuseReason) return;

  const refusingCompany = pendingProduct.companyName;
  setPendingProduct(null); // UI lock

  try {
    await axios.post('http://localhost:5050/refuse-product', {
      lobbyCode,
      companyName: refusingCompany,
      reason: refuseReason
    });
    setRefuseReason('');
  } catch (err) {
    console.error(err);
  }
};


  const handleEndRound = async () => {
  try {
    // Only call end-round, the backend will handle AI calculation
    await axios.post('http://localhost:5050/end-round', { lobbyCode });
    // Move to next round screen
    setScreen('hostNextRound');
  } catch (err) {
    console.error('Failed to end round', err);
  }
};

  return (
    <div className="host-menu-screen">
      <h1 className="host-title">THE ART OF SELLING NONSENSE</h1>

      <div className="host-menu-content">
        <div className="host-menu-left">
          <button className="menu-button" onClick={() => setScreen('hostViewStats')}>View Stats</button>

          <button
  className="menu-button"
  onClick={() => setScreen('hostLaunchEvent', { lobbyCode })}
>
  Launch Event
</button>


          <button className="menu-button" onClick={() => setScreen('hostNews')}>News</button>
          <button className="menu-button" onClick={() => setScreen('hostMarketing')}>View Marketing Strategies</button>
          <button className="menu-button" onClick={() => setScreen('hostStatsRegions')}>View Stats per Region</button>
        </div>

        <div className="host-menu-main-box" onClick={() => setShowLeaderboard(true)}>
          <h3>Leaderboard</h3>
          <ul>
            {leadingCompanies.map((comp, idx) => (
              <li key={idx}>{comp.name} - ${comp.revenue}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="end-round-container">
        <button
          className="end-round-button"
          onClick={handleEndRound}
        >
          End Round
        </button>
      </div>

      {showLeaderboard && (
        <HostLeaderboard
          companies={leadingCompanies}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {pendingProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Product idea of {pendingProduct.companyName}</h2>
            <div><strong>Name:</strong> {pendingProduct.productName}</div>
            <div style={{ height: '150px' }}><strong>Description:</strong> {pendingProduct.description}</div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ backgroundColor: 'red' }} onClick={handleRefuse}>Refuse Idea</button>
              <button style={{ backgroundColor: 'green' }} onClick={handleApprove}>Approve Idea</button>
            </div>
            <input
              placeholder="Reason for refusal"
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}