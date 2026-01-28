import React, { useState } from 'react';
import api from '../api';

function JoinLobby({ onSubmitCode }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    try {
      await api.post('/check-lobby', { lobbyCode: code });
      onSubmitCode(code);
    } catch (err) {
      setError('Lobby code not found');
    }
  };

  return (
    <div style={{
      background: '#e0e0e0',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h2>JOIN LOBBY</h2>

      <input
        placeholder="Lobby Code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        style={{ padding: '10px', marginBottom: '10px' }}
      />

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <button onClick={submit}>
        Join Lobby
      </button>

{/* Guide button */}
<button
  onClick={() => window.open(process.env.PUBLIC_URL + '/pdfs/pdf3.pdf', '_blank', 'noopener,noreferrer')}
  style={{ marginTop: '10px' }}
>
  Guide
</button>

    </div>
  );
}

export default JoinLobby;