import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductCreation({ lobbyCode, companyName, onRequestStart }) {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [requested, setRequested] = useState(false);
  const [status, setStatus] = useState(''); // waiting / approved / refused
  const [refuseReason, setRefuseReason] = useState('');
  const [alreadyMoved, setAlreadyMoved] = useState(false); // prevent multiple triggers

  // Handle sending request to backend
  const handleRequest = async () => {
    if (!productName || !productDesc) return;
    try {
      await axios.post('http://localhost:5050/submit-product', {
        lobbyCode,
        companyName,
        productName,
        description: productDesc
      });
      setRequested(true);
      setStatus('waiting');
    } catch (err) {
      alert('Failed to submit product, backend unreachable');
    }
  };

  // Poll backend to see if host approved/refused
useEffect(() => {
  if (!requested) return;

  const interval = setInterval(async () => {
    try {
      const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
      const lobby = res.data;
      const player = lobby.players.find(p => p.name === companyName);
      if (!player) return;

      // ❌ PRODUCT REFUSED
      if (player.productStatus === 'refused') {
        setStatus('refused');
        setRefuseReason(player.rejectionReason);
        setRequested(false);
        return;
      }

      // ✅ PRODUCT APPROVED
      if (player.productStatus === 'approved') {
        setStatus('approved');

        if (!alreadyMoved && onRequestStart) {
          onRequestStart();
          setAlreadyMoved(true);
        }
      }
    } catch (err) {
      console.error('Failed to poll lobby status');
    }
  }, 1000);

  return () => clearInterval(interval);
}, [requested, lobbyCode, companyName, onRequestStart, alreadyMoved]);
  

  return (
    <div style={{
      backgroundColor: '#1e2a38',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ fontFamily: 'Horizon, sans-serif', fontSize: '48px', marginBottom: '30px' }}>
        {companyName.toUpperCase()}
      </h1>

      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        style={{
          width: '60%',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '18px'
        }}
      />

      <textarea
        placeholder="Product Description"
        value={productDesc}
        onChange={(e) => setProductDesc(e.target.value)}
        style={{
          width: '60%',
          height: '300px',
          padding: '20px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          marginBottom: '20px',
          resize: 'none'
        }}
      />

      <div style={{
        width: '60%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'inline-block',
          animation: 'scrollText 20s linear infinite'
        }}>
          While waiting for approval, think about an unnecessary product idea. If you don’t have an idea, ask ChatGPT or Google for help.
        </div>
      </div>

      <button
        onClick={handleRequest}
        disabled={requested}
        style={{
          backgroundColor: requested ? 'green' : '#e6c483',
          color: requested ? 'white' : 'black',
          fontWeight: 'bold',
          padding: '15px 40px',
          borderRadius: '12px',
          border: 'none',
          cursor: requested ? 'not-allowed' : 'pointer',
          fontSize: '18px'
        }}
      >
        {requested ? 'Waiting for approval' : 'Request Start'}
      </button>

      {status === 'waiting' && (
        <div style={{ marginTop: '20px', color: '#f0f0f0' }}>Waiting for host approval...</div>
      )}
      {status === 'refused' && (
        <div style={{ marginTop: '20px', color: 'red' }}>Product refused: {refuseReason}</div>
      )}
      {status === 'approved' && (
        <div style={{ marginTop: '20px', color: 'green' }}>Product approved! Continue to the next step.</div>
      )}

      <style>
        {`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
}
