import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HostRoundReview.css';

export default function HostRoundReview({ lobbyCode, setHostReviewComplete }) {
  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        const res = await axios.get(
          `https://the-art-of-selling-nonsense-backend.onrender.com/round-review/${lobbyCode}`
        );
        console.log('ROUND REVIEW RESPONSE:', res.data);
setCompanies(res.data.companies || []);

      } catch (err) {
        console.error('Failed to load round review data', err);
      }
    };

    fetchRoundData();
  }, [lobbyCode]);

  const updateCompany = (idx, updates) => {
    const updated = [...companies];
    updated[idx] = { ...updated[idx], ...updates };
    setCompanies(updated);
  };

  const updateProduction = (companyIdx, updates) => {
    const updated = [...companies];
    updated[companyIdx].production = {
      ...updated[companyIdx].production,
      ...updates
    };
    setCompanies(updated);
  };

  const updateMarketing = (companyIdx, campaignIdx, updates) => {
    const updated = [...companies];
    const campaigns = updated[companyIdx].marketing.campaigns;
    campaigns[campaignIdx] = {
      ...campaigns[campaignIdx],
      ...updates
    };
    setCompanies(updated);
  };

  const handleSubmitToAI = async () => {
    setSubmitting(true);
    try {
      await axios.post('https://the-art-of-selling-nonsense-backend.onrender.com/submit-round-review', {
        lobbyCode,
        companies
      });

      setHostReviewComplete(true);
    } catch (err) {
      console.error('Failed to submit host review', err);
    }
    setSubmitting(false);
  };

  return (
    <div className="host-review-screen">
      <h1>Round Review</h1>
      <p>Review each company before AI calculation</p>

{companies.length === 0 && (
  <div style={{ marginTop: '30px', opacity: 0.7 }}>
    Waiting for companies to submit round data…
  </div>
)}


      {companies.map((c, idx) => (
        <div key={c.companyName || idx} className="company-review-box">
          <h2>{c.companyName}</h2>

          {/* PRODUCT */}
          <div className="review-section">
            <strong>Product</strong>
            <div>Name: {c.product?.productName}</div>
            <div>Description: {c.product?.description}</div>
          </div>

          {/* PRODUCTION */}
          <div className="review-section">
            <strong>Production</strong>

            <div>Quantity: {c.production?.quantity}</div>
            <div>Price / Unit: ${c.production?.pricePerUnit}</div>
            <div>Region: {c.production?.region}</div>
            <div>Sustainability: {c.production?.sustainability}</div>

            <label className="checkbox-inline">
  <input
    type="checkbox"
    checked={c.production?.approved ?? true}
    onChange={(e) =>
      updateProduction(idx, { approved: e.target.checked })
    }
  />
  Approved
</label>


            <textarea
              placeholder="Host comment on production (realism, scaling, cost...)"
              value={c.production?.hostComment || ''}
              onChange={(e) =>
                updateProduction(idx, { hostComment: e.target.value })
              }
              disabled={c.production?.approved === false}
            />
          </div>

          {/* MARKETING */}
          <div className="review-section">
            <strong>Marketing</strong>

            {c.marketing?.campaigns?.map((m, i) => (
              <div key={i} className="campaign-line">
                <div><strong>{m.name}</strong></div>
                <div>Budget: ${m.budget}</div>
                <div>{m.campaignDescription}</div>

               <label className="checkbox-inline">
  <input
    type="checkbox"
    checked={m.approved ?? true}
    onChange={(e) =>
      updateMarketing(idx, i, { approved: e.target.checked })
    }
  />
  Approved
</label>


                <textarea
                  placeholder="Host comment on this campaign"
                  value={m.hostComment || ''}
                  onChange={(e) =>
                    updateMarketing(idx, i, { hostComment: e.target.value })
                  }
                  disabled={m.approved === false}
                />
              </div>
            ))}
          </div>

          {/* OVERALL CONTROLS */}
          <div className="review-controls">
            <label>
              Status:
              <select
                value={c.status || 'approved'}
                onChange={(e) =>
                  updateCompany(idx, { status: e.target.value })
                }
              >
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <label>
              Strategy Quality:
              <select
                value={c.quality || 'neutral'}
                onChange={(e) =>
                  updateCompany(idx, { quality: e.target.value })
                }
                disabled={c.status === 'rejected'}
              >
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="neutral">Neutral</option>
                <option value="bad">Bad</option>
                <option value="very_bad">Very Bad</option>
              </select>
            </label>

            <textarea
              placeholder="Overall host note to AI"
              value={c.hostComment || ''}
              disabled={c.status === 'rejected'}
              onChange={(e) =>
                updateCompany(idx, { hostComment: e.target.value })
              }
            />
          </div>
        </div>
      ))}

      <button
        className="submit-review-button"
        onClick={handleSubmitToAI}
        disabled={submitting}
      >
        {submitting ? 'Submitting…' : 'Send to AI & Calculate'}
      </button>
    </div>
  );
}
