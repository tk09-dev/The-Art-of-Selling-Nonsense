import React, { useState } from 'react';
import LoginHost from './screens/LoginHost';
import JoinLobby from './screens/JoinLobby';

function App() {
  const [screen, setScreen] = useState('choose');
  const [lobbyCode, setLobbyCode] = useState('');

  const handleHostLogin = (code) => {
    setLobbyCode(code);
    setScreen('hostLobby');
  };

  const handleJoinLobby = (lobby) => {
    setLobbyCode(lobby.lobbyCode || lobbyCode);
    setScreen('playerLobby');
  };

  if (screen === 'choose') {
    return (
      <div style={{ backgroundColor: '#d3d3d3', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => setScreen('loginHost')} style={{ margin: '10px' }}>Log in as Host</button>
        <button onClick={() => setScreen('joinLobby')} style={{ margin: '10px' }}>Join Lobby</button>
      </div>
    );
  }

  if (screen === 'loginHost') return <LoginHost onLogin={handleHostLogin} />;
  if (screen === 'joinLobby') return <JoinLobby onJoin={handleJoinLobby} />;
  if (screen === 'hostLobby') return <div style={{ padding: '20px' }}>Host Lobby: {lobbyCode}</div>;
  if (screen === 'playerLobby') return <div style={{ padding: '20px' }}>Player Lobby: {lobbyCode}</div>;

  return null;
}

export default App;
