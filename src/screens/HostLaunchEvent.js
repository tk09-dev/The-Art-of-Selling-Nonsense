import React, { useState, useEffect } from 'react';
import './HostLaunchEvent.css';

export default function HostLaunchEvent({ lobbyCode, setScreen }) {
  const storageKey = `hostLaunchEvents_${lobbyCode}`;
  const [companyOptions, setCompanyOptions] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);


  // stored events
  const [events, setEvents] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // creation state
  const [newEvent, setNewEvent] = useState(false);

  // form fields
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [demandImpact, setDemandImpact] = useState('');
  const [costImpact, setCostImpact] = useState('');
  const [effectRound, setEffectRound] = useState(1);

  const [regions, setRegions] = useState([]);
  const [companies, setCompanies] = useState([]);

  // static options (frontend only for now)
  const REGION_OPTIONS = [
    'Western Europe',
    'Nordics',
    'Anglosphere',
    'Southern Europe',
    'Eastern Europe',
    'East Asia',
    'China',
    'South & Southeast Asia',
    'Middle East',
    'Latin America'
  ];

  
useEffect(() => {
  fetch('https://the-art-of-selling-nonsense-backend.onrender.com/apply-launch-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lobbyCode,
      events
    })
  }).catch(err => console.warn('Failed to sync launch events', err));
}, [events, lobbyCode]);


useEffect(() => {
  const loadLobbyData = async () => {
    try {
      const res = await fetch(`https://the-art-of-selling-nonsense-backend.onrender.com/lobby-state/${lobbyCode}`);
      const data = await res.json();

      if (data.players) {
        setCompanyOptions(data.players.map(p => p.companyName));
      }

      if (data.currentRound !== undefined) {
        setCurrentRound(data.currentRound);
        setEffectRound(data.currentRound + 1); // sensible default
      }
    } catch (err) {
      console.error('Failed to load lobby data', err);
    }
  };

  loadLobbyData();
}, [lobbyCode]);



  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setEvents(JSON.parse(saved));
    }
    setHasLoaded(true);
  }, [storageKey]);

  // save to localStorage
  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(events));
  }, [events, hasLoaded, storageKey]);

  // create event
  const handleCreateEvent = () => {
    const evt = {
      id: Date.now(),
      title,
      text,

      // AI-only data
      effects: {
        demandImpact: Number(demandImpact),
        costImpact: Number(costImpact)
      },
      targetRegions: regions,
      targetCompanies: companies,
      effectRound: Number(effectRound),

      // News toggle
      inNews: false
    };






    setEvents([...events, evt]);

    // reset form
    setNewEvent(false);
    setTitle('');
    setText('');
    setDemandImpact('');
    setCostImpact('');
    setRegions([]);
    setCompanies([]);
    setEffectRound(1);
  };

  const toggleInNews = (idx, checked) => {
    const updated = [...events];
    updated[idx].inNews = checked;
    setEvents(updated);
  };

  return (
    <div className="host-launch-event-screen">
      <header className="launch-header">
  <button className="back-button" onClick={() => setScreen('hostMainMenu')}>
    Back
  </button>

  <div className="current-category">Launch / News Events</div>

  <div className="round-info">
    Current round: {currentRound ?? '—'}
  </div>
</header>


      {/* EXISTING EVENTS */}
      <div className="event-list">
        {events.map((evt, idx) => (
          <div key={evt.id} className="event-item">
            <strong>{evt.title}</strong>
            <p>{evt.text}</p>

            <small>
              Effects round: {evt.effectRound} <br />
              Demand: {evt.effects.demandImpact}% • Cost: {evt.effects.costImpact}%
            </small>

            <div style={{ marginTop: '8px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={evt.inNews}
                  onChange={e => toggleInNews(idx, e.target.checked)}
                />
                In the news
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW */}
      {!newEvent && (
        <div className="launch-controls">
          <button className="launch-button" onClick={() => setNewEvent(true)}>
            Create New Event
          </button>
        </div>
      )}

      {newEvent && (
        <div className="launch-controls">
          <h3>Create Launch / News Event</h3>

          <input
            type="text"
            placeholder="Event title (shown in news)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            placeholder="News text / article (shown to players)"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <h4>AI Effects</h4>

          <input
            type="number"
            placeholder="Demand impact (%)"
            value={demandImpact}
            onChange={e => setDemandImpact(e.target.value)}
          />

          <input
            type="number"
            placeholder="Cost impact (%)"
            value={costImpact}
            onChange={e => setCostImpact(e.target.value)}
          />

          <input
            type="number"
            placeholder="Apply effects in round..."
            value={effectRound}
            onChange={e => setEffectRound(e.target.value)}
          />

          <h4>Target Regions</h4>
          {REGION_OPTIONS.map(r => (
            <label key={r} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={regions.includes(r)}
                onChange={e => {
                  if (e.target.checked) setRegions([...regions, r]);
                  else setRegions(regions.filter(x => x !== r));
                }}
              />
              {r}
            </label>
          ))}

          <h4>Target Companies</h4>

{companyOptions.length === 0 && (
  <p style={{ opacity: 0.6 }}>No companies loaded yet</p>
)}

{companyOptions.map(c => (
  <label key={c} style={{ display: 'block' }}>
    <input
      type="checkbox"
      checked={companies.includes(c)}
      onChange={e => {
        if (e.target.checked) setCompanies([...companies, c]);
        else setCompanies(companies.filter(x => x !== c));
      }}
    />
    {c}
  </label>
))}


          <button className="launch-button" onClick={handleCreateEvent}>
            Save Event
          </button>
        </div>
      )}
    </div>
  );
}
