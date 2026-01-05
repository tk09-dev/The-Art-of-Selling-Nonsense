import React from 'react';

export default function PlayerLobby({ lobbyCode, companyName }) {
  return (
    <div style={{ backgroundColor: '#1e2a38', color: '#ffffff', height: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Horizon, sans-serif' }}>BUSINESS SIMULATION</h1>
      <div style={{ position: 'absolute', top: '20px', left: '20px', fontFamily: 'Poppins', fontSize: '18px', backgroundColor: '#e6c483', padding: '5px 10px', borderRadius: '10px' }}>
        {companyName}
      </div>
      <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '20px' }}>
        You joined the lobby {lobbyCode} successfully - wait for the start
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <button style={{ backgroundColor: 'red', color: '#fff', borderRadius: '15px', padding: '10px 20px' }}>Leave Game</button>
      </div>
    </div>
  );
}
