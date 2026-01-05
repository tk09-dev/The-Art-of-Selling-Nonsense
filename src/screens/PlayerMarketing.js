import React, { useState, useEffect } from 'react';
import './PlayerMarketing.css';
import axios from 'axios';

export default function PlayerMarketing({ companyName, lobbyCode, setScreen, playerProduct }) {
    const storageKey = `playerCampaigns_${lobbyCode}_${companyName}`;
    const [campaigns, setCampaigns] = useState([]);

  const [newCampaign, setNewCampaign] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState([]);
  const [description, setDescription] = useState('');
  const [productPlacement, setProductPlacement] = useState([]);
  const [budget, setBudget] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState({});
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);


  
// Load campaigns for this lobby + company
useEffect(() => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    setCampaigns(JSON.parse(saved));
  }
  setHasLoadedFromStorage(true);
}, [storageKey]);

// Save campaigns for this lobby + company
useEffect(() => {
  if (!hasLoadedFromStorage) return; // ⛔ don't overwrite on first mount
  localStorage.setItem(storageKey, JSON.stringify(campaigns));
}, [campaigns, storageKey, hasLoadedFromStorage]);


  

  // Send campaigns to backend
  const sendCampaignsToBackend = async (campaignsToSend) => {
    try {
      await axios.post('http://localhost:5050/submit-marketing', {
        lobbyCode,
        companyName,
       strategy: {
       campaigns: campaignsToSend
  .filter(c => c.launched)
  .map(c => ({
  name: c.campaignName,
  productName: c.productName,
  campaignDescription: c.campaignDescription,
  channels: c.channels,
  placements: c.placement,
  budget: Number(c.budget),
  aiBoost: c.ai ? 1.1 : 1,
  intendedMessage: c.campaignDescription,
  reachEstimate: Math.round(Number(c.budget) * 0.05),
}))


}


      });
    } catch (err) {
      console.error('Failed to send marketing campaigns', err);
    }
  };

  const handleCreateCampaign = async () => {
    // Use the product from props (playerProduct) instead of fetching
    const currentProduct = playerProduct || { productName: 'Unnamed Product', description: '' };




const newCamp = {
  productName: currentProduct.productName,
  productDescription: currentProduct.description,

  campaignName,
  campaignDescription: description,   // ✅ THIS is what AI needs

  channels: campaignType,
  placement: productPlacement,
  budget: Number(budget),
  ai: useAI,
  launched: false
};


    let updatedCampaigns;

if (editingIndex !== null) {
  // ✏️ EDIT existing campaign
  updatedCampaigns = [...campaigns];
  updatedCampaigns[editingIndex] = {
    ...newCamp,
    launched: campaigns[editingIndex].launched // keep launch state
  };
} else {
  // ➕ CREATE new campaign
  updatedCampaigns = [...campaigns, newCamp];
}

setCampaigns(updatedCampaigns);
await sendCampaignsToBackend(updatedCampaigns);


    setNewCampaign(false);
    setCampaignName('');
    setCampaignType([]);
    setCampaignOptions({});
    setDescription('');
    setProductPlacement([]);
    setBudget('');
    setUseAI(false);
    setEditingIndex(null);
  };

  const toggleLaunch = async (idx, checked) => {
    const updated = [...campaigns];
    updated[idx].launched = checked;
    setCampaigns(updated);
    await sendCampaignsToBackend(updated);
  };

  return (
    <div className="marketing-screen">
      <header className="marketing-header">
        <button className="back-button" onClick={() => setScreen('playerMenu')}>Back to Main</button>
        <div className="company-name">{companyName}</div>
        <div className="current-category">Marketing</div>
        <div className="header-stats">
          Ongoing campaigns: {campaigns.length} | Total Budget: ${campaigns.reduce((a, c) => a + Number(c.budget || 0), 0)}
        </div>
      </header>

      <div className="campaign-overview">
        {campaigns.map((camp, idx) => (
          <div key={idx} className="campaign-box">
           <span
  style={{ cursor: 'pointer', textDecoration: 'underline' }}
  onClick={() => {
    setEditingIndex(idx);
    setNewCampaign(true);

    setCampaignName(camp.campaignName);
    setDescription(camp.campaignDescription);
    setCampaignType(camp.channels);
    setProductPlacement(camp.placement);
    setBudget(camp.budget);
    setUseAI(camp.ai);
  }}
>
  {camp.campaignName} ({camp.productName})
</span>

            <label style={{ marginLeft: '10px' }}>
              <input
                type="checkbox"
                checked={camp.launched || false}
                onChange={(e) => toggleLaunch(idx, e.target.checked)}
              />
              Use for this round
            </label>
          </div>
        ))}

        {!newCampaign && (
          <button className="create-new-button" onClick={() => setNewCampaign(true)}>
            Create New Campaign
          </button>
        )}
      </div>

      {newCampaign && (
        <div className="create-campaign">
          <div className="input-box">
            <label>Campaign Name</label>
            <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Enter campaign name..." />
          </div>

          <div className="type-selection">
            <label>Type of Campaign:</label>
            <div className="type-options">
              {['TV','Newspaper','TikTok','Instagram','Facebook','Radio','Movie','Poster','Advertising Screen'].map(type => (
                <label key={type}>
                  <input type="checkbox" value={type} checked={campaignType.includes(type)} onChange={(e) => {
                    if(e.target.checked) setCampaignType([...campaignType, type]);
                    else setCampaignType(campaignType.filter(t => t !== type));
                  }}/>
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="description-box">
            <label>Description</label>
            <textarea placeholder="Describe the campaign, placements, message, influencer info..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="product-placement">
            <label>Where to sell the product:</label>
            <div>
              {['Supermarket','Online','Store','Direct Sales'].map(place => (
                <label key={place}>
                  <input type="checkbox" value={place} checked={productPlacement.includes(place)} onChange={(e) => {
                    if(e.target.checked) setProductPlacement([...productPlacement, place]);
                    else setProductPlacement(productPlacement.filter(p => p !== place));
                  }}/>
                  {place}
                </label>
              ))}
            </div>
          </div>

          <div className="budget-box">
            <label>Budget ($ USD)</label>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} />
          </div>

          <label>
            <input type="checkbox" checked={useAI} onChange={e => setUseAI(e.target.checked)} />
            Let AI improve campaign (10% of budget)
          </label>

          <button className="submit-campaign" onClick={handleCreateCampaign}>
  {editingIndex !== null ? 'Save Changes' : 'Submit Campaign'}
</button>

        </div>
      )}
    </div>
  );
}