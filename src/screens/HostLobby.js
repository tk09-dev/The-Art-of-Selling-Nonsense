import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HostLobby({ lobbyCode, onStartGame }) {
  const [teams, setTeams] = useState([]);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [refuseReason, setRefuseReason] = useState('');

  // Poll backend every second for current teams and pending products
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`https://the-art-of-selling-nonsense-backend.onrender.com/lobby/${lobbyCode}`);
        const lobby = res.data;
        setTeams(lobby.players || []);

        // Take first pending product from array
        if (lobby.pendingProducts && lobby.pendingProducts.length > 0) {
          setPendingProduct(lobby.pendingProducts[0]);
        } else {
          setPendingProduct(null);
        }
      } catch (err) {
        console.error('Failed to fetch lobby');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lobbyCode]);

  const handleApprove = async () => {
    if (!pendingProduct) return;
    try {
      await axios.post('https://the-art-of-selling-nonsense-backend.onrender.com/approve-product', {
        lobbyCode,
        companyName: pendingProduct.companyName
      });
      setPendingProduct(null);
      setRefuseReason('');
    } catch (err) {
      console.error('Failed to approve product');
    }
  };

  const handleRefuse = async () => {
    if (!pendingProduct || !refuseReason) return;
    try {
      await axios.post('https://the-art-of-selling-nonsense-backend.onrender.com/refuse-product', {
        lobbyCode,
        companyName: pendingProduct.companyName,
        reason: refuseReason
      });
      setPendingProduct(null);
      setRefuseReason('');
    } catch (err) {
      console.error('Failed to refuse product');
    }
  };

  return (
    <div className="host-lobby">
      {/* Title + stock charts */}
      <div className="host-header">
        <h1 className="horizon-title">The Art of Selling Nonsense</h1>
        <div className="stock-animation">
          <div className="line up"></div>
          <div className="line down"></div>
          <div className="line up"></div>
        </div>
      </div>

      {/* Lobby code */}
      <h2 className="lobby-code">Lobby Code: {lobbyCode}</h2>

      {/* Teams */}
      <div className="teams-grid">
        {teams.length === 0 && <div className="waiting-text">Waiting for players...</div>}
        {teams.map((team, index) => (
          <div className="team-card" key={index}>{team.name}</div>
        ))}
      </div>

      {/* Start Game button */}
      <button
        className="primary-button"
        disabled={teams.length === 0}
        onClick={async () => {
          try {
            await axios.post('https://the-art-of-selling-nonsense-backend.onrender.com/start-game', { lobbyCode });
            onStartGame();
          } catch (err) {
            console.error('Failed to start game');
          }
        }}
      >
        Start Game
      </button>

      {/* ---------------------------
          Host Product Approval Modal
      ---------------------------- */}
      {pendingProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Product idea of {pendingProduct.companyName}</h2>
            <div className="modal-field navy-box">
              <strong>Name:</strong> {pendingProduct.productName}
            </div>
            <div className="modal-field navy-box" style={{ height: '150px' }}>
              <strong>Description:</strong> {pendingProduct.description}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                style={{ backgroundColor: 'red', color: 'white', borderRadius: '12px', padding: '10px 20px' }}
                onClick={handleRefuse}
              >
                Refuse Idea
              </button>

              <button
                style={{ backgroundColor: 'green', color: 'white', borderRadius: '12px', padding: '10px 20px' }}
                onClick={handleApprove}
              >
                Approve Idea
              </button>
            </div>

            {/* Refuse reason input */}
            <input
              placeholder="Reason for refusal"
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              style={{ marginTop: '15px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
