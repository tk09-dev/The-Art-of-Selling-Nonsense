import React, { useState } from 'react';

export default function HostProductApproval({ productRequest, onApprove, onRefuse }) {
  const [refuseReason, setRefuseReason] = useState('');
  const [showRefuseBox, setShowRefuseBox] = useState(false);

  if (!productRequest) return null; // Only show when a product is requested

  return (
    <div style={{
      position: 'fixed',
      top: '10%',
      left: '10%',
      width: '80%',
      height: 'auto',
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      zIndex: 1000,
      overflowY: 'auto',
      maxHeight: '80vh',
    }}>
      <h2>Product Idea of {productRequest.companyName}</h2>

      {/* Product Name */}
      <div style={{ backgroundColor: '#1e2a38', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
        {productRequest.productName}
      </div>

      {/* Product Description */}
      <div style={{ backgroundColor: '#1e2a38', color: 'white', padding: '15px', borderRadius: '8px', minHeight: '100px' }}>
        {productRequest.description}
      </div>

      {/* Refuse reason box */}
      {showRefuseBox && (
        <textarea
          style={{
            backgroundColor: '#1e2a38',
            color: 'white',
            width: '100%',
            minHeight: '80px',
            marginTop: '10px',
            padding: '10px',
            borderRadius: '8px'
          }}
          placeholder="Reason for refusal"
          value={refuseReason}
          onChange={(e) => setRefuseReason(e.target.value)}
        />
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        {!showRefuseBox ? (
          <>
            <button
              style={{ backgroundColor: 'red', color: 'white', borderRadius: '12px', padding: '10px 20px' }}
              onClick={() => setShowRefuseBox(true)}
            >
              Refuse Idea
            </button>
            <button
              style={{ backgroundColor: 'green', color: 'white', borderRadius: '12px', padding: '10px 20px' }}
              onClick={() => onApprove(productRequest.companyName)}
            >
              Approve Idea
            </button>
          </>
        ) : (
          <button
            style={{ backgroundColor: '#e6c483', color: 'black', borderRadius: '12px', padding: '10px 20px', marginLeft: 'auto' }}
            onClick={() => onRefuse(productRequest.companyName, refuseReason)}
          >
            Send to {productRequest.companyName}
          </button>
        )}
      </div>
    </div>
  );
}
