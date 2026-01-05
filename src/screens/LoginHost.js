import React, { useState } from 'react';
import api from '../api';

export default function LoginHost({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
     const res = await api.post('http://localhost:5050/create-lobby', {
  username,
  password
});

      if (res.data.lobbyCode) {
        onLogin(res.data.lobbyCode);
      } else {
        alert('Login failed');
      }
    } catch (err) {
  if (err.response?.status === 401) {
    alert('Wrong password');
  } else {
    alert('Backend error');
  }
}

  };

  return (
    <div style={{ backgroundColor: '#d3d3d3', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ margin: '5px' }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ margin: '5px' }} />
      <button onClick={handleLogin} style={{ marginTop: '10px' }}>Create Lobby</button>
    </div>
  );
}
