import React, { useState } from 'react';
import axios from 'axios';

export default function HostApprovalModal({ lobbyCode, product, onClose }) {
  const [refuseReason, setRefuseReason] = useState('');

  if (!product) return null;

  const handleApprove = async () => {
    try {
      await axios.post('http://localhost:5050/approve-product', {
        lobbyCode,
        companyName: product.companyName
      });
      onClose(); // Close modal after approval
    } catch (err) {
      alert('Error approving product');
    }
  };

  const handleRefuse = async () => {
    if (!refuseReason) {
      alert('Please enter a reason for refusal');
      return;
    }

    try {
      await axios.post('http://localhost:5050/refuse-product', {
        lobbyCode,
        companyName: product.companyName,
        reason: refuseReason
      });
      onClose(); // Close modal after refusal
    } catch (err) {
      alert('Error refusing product');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '80%',
        borderRadius: '15px',
        padding: '30px',
        maxHeight: '80%',
        overflowY: 'auto'
      }}>
        <h2>Product idea of {product.companyName}</h2>

        <div style={{
          backgroundColor: '#1e2a38',
          color: 'white',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '8px'
        }}>
          {product.productName}
        </div>

        <div style={{
          backgroundColor: '#1e2a38',
          color: 'white',
          padding: '15px',
          minHeight: '150px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {product.description}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <input
              placeholder="Reason for refusal"
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '300px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleRefuse}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Refuse Idea
            </button>
            <button
              onClick={handleApprove}
              style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Approve Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
