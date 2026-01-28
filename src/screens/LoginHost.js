import React, { useState } from 'react';
import api from '../api';

export default function LoginHost({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  
  const handleLogin = async () => {
    try {
      const res = await api.post('https://the-art-of-selling-nonsense-backend.onrender.com/create-lobby', {
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

  const pdfs = [
  { id: 1, title: 'Guide', link: process.env.PUBLIC_URL + '/pdfs/pdf1.pdf' },
  { id: 2, title: 'Sources', link: process.env.PUBLIC_URL + '/pdfs/pdf2.pdf' }
];




  return (
    <div style={{ backgroundColor: '#d3d3d3', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ margin: '5px' }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ margin: '5px' }}
      />
      <button onClick={handleLogin} style={{ marginTop: '10px' }}>Create Lobby</button>

      {/* Info Button */}
      <button
        onClick={() => setShowInfo(true)}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontWeight: 'bold',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        i
      </button>

      {/* Info Popup */}
      {showInfo && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '20px',
            width: '300px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          <button
  onClick={() => setShowInfo(false)}
  style={{
    position: 'absolute',
    top: '5px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
  ×
</button>


          <h3>imprint</h3>
<p style={{ fontSize: '14px', marginTop: '5px' }}>
  For questions, feedback, or other business inquiries, reach us at{' '}
  <a href="mailto:theartofsellingnonsense@gmx.de">theartofsellingnonsense@gmx.de</a>.
</p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {pdfs.map(pdf => (
  <button
    key={pdf.id}
    onClick={() => window.open(pdf.link, '_blank')}
    style={{ flex: 1, padding: '5px', cursor: 'pointer' }}
  >
    {pdf.title}
  </button>
))}

          </div>

          
        </div>
      )}
    </div>
  );
}