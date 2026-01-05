import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import JoinLobby from './screens/JoinLobby';
import LoginHost from './screens/LoginHost';
import HostLobby from './screens/HostLobby';
import HostMainMenu from './screens/HostMainMenu';
import ProductCreation from './screens/ProductCreation';
import WorldMap from './screens/WorldMap';
import PlayerMenu from './screens/PlayerMenu';
import PlayerFinances from './screens/PlayerFinances';
import PlayerProduction from './screens/PlayerProduction';
import PlayerMarketing from './screens/PlayerMarketing';
import PlayerOtherCompanies from './screens/PlayerOtherCompanies';
import PlayerNews from './screens/PlayerNews';
import PlayerProductReviews from './screens/PlayerProductReviews';
import RoundCalculatingOverlay from './screens/RoundCalculatingOverlay';


// --- NEW: Host Screens ---
import HostViewStats from './screens/HostViewStats';
import HostLaunchEvent from './screens/HostLaunchEvent';
import HostNews from './screens/HostNews';
import HostMarketing from './screens/HostMarketing';
import HostStatsRegions from './screens/HostStatsRegions';
import HostNextRoundScreen from './screens/HostNextRoundScreen';
import PlayerNextRoundScreen from './screens/PlayerNextRoundScreen';
import HostEndGameScreen from './screens/HostEndGameScreen';
import PlayerEndGameScreen from './screens/PlayerEndGameScreen';


import axios from 'axios';

function App() {
  const [screen, setScreen] = useState('choose');
  const [lobbyCode, setLobbyCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [teams, setTeams] = useState([]);
  const [productApproved, setProductApproved] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [playerCompany, setPlayerCompany] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [showBreakingPopup, setShowBreakingPopup] = useState(false);
  const breakingRoundRef = useRef(null);
  const breakingEventRef = useRef(null);
  const [news, setNews] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [calculating, setCalculating] = useState(false);






  /* -------------------------
     JOIN LOBBY FLOW
  -------------------------- */
  const handleSubmitLobbyCode = (code) => {
    setLobbyCode(code);
    setScreen('enterCompany');
  };

  const handleSubmitCompany = async () => {
    try {
      await axios.post('http://localhost:5050/join-lobby', {
        lobbyCode,
        companyName
      });
      setScreen('waiting');
    } catch (err) {
      alert('Lobby code not found or backend not reachable');
    }
  };

  /* -------------------------
     HOST FLOW
  -------------------------- */
  const handleHostLogin = (code) => {
  setLobbyCode(code);
  setTeams([]);
  setIsHost(true); // ✅ ADD THIS
  setScreen('hostLobby');
};


  const handleHostStartGame = () => {
    setScreen('hostMainMenu');
  };

  /* -------------------------
     POLL BACKEND FOR PLAYERS GAME START
  -------------------------- */
  useEffect(() => {
    let interval;
    if (screen === 'waiting') {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:5050/lobby/${lobbyCode}`);
          if (res.data.gameStarted) {
            clearInterval(interval);
            setScreen('productCreation');
          }
        } catch (err) {
          console.error('Failed to fetch lobby state');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, lobbyCode]);


 /* -------------------------
    NEW POLLING FROM AI 
  -------------------------- */
useEffect(() => {
  if (!lobbyCode) return;

  const interval = setInterval(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5050/lobby/${lobbyCode}`
      );

      setCalculating(res.data.calculating);

      // When calculation ends → move on
      if (!res.data.calculating && res.data.roundEnded && calculating) {
  setScreen(isHost ? 'hostNextRound' : 'playerNextRound');
}

    } catch (err) {
      console.error('Polling calculation state failed');
    }
  }, 1000);

  return () => clearInterval(interval);
}, [lobbyCode, isHost]);


  /* -------------------------
     SCREENS
  -------------------------- */
function BreakingOverlay({ show, event, onClose }) {
  if (!show || !event) return null;

  return (
    <div className="breaking-overlay">
      <div className="breaking-popup">
        <div className="breaking-header">🚨 Breaking News</div>
        <h2>{event.title}</h2>
        <p className="breaking-body">{event.description}</p>
        <button className="breaking-confirm" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}

// --- GLOBAL BREAKING NEWS (PLAYERS ONLY) ---
useEffect(() => {
  if (!lobbyCode || !screen.startsWith('player')) return;

  async function fetchNews() {
    try {
      const res = await fetch(`http://localhost:5050/news-events/${lobbyCode}`);
      const data = await res.json();

      setNews(data.news || []);
      setCurrentRound(data.currentRound ?? 0);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  }

  fetchNews();
  const interval = setInterval(fetchNews, 3000);
  return () => clearInterval(interval);
}, [lobbyCode, screen]);

useEffect(() => {
  if (!news.length) return;

  const breakingEvent = news.find(
    n =>
      n.round === currentRound &&
      breakingRoundRef.current !== currentRound
  );

  if (breakingEvent) {
    breakingEventRef.current = breakingEvent;
    setShowBreakingPopup(true);
    breakingRoundRef.current = currentRound;
  }
}, [news, currentRound]);



 

// 🔄 ROUND CALCULATION OVERLAY (HOST + PLAYERS)
if (calculating) {
  return <RoundCalculatingOverlay />;
}







if (screen === 'playerEndGame') {
  return (
    <PlayerEndGameScreen
      lobbyCode={lobbyCode}
      playerName={playerName}
      onExit={() => setScreen('home')}
    />
  );
}


 if (screen === 'choose') {
    return (
      <div style={styles.light}>
        <button onClick={() => setScreen('joinLobby')}>Join Lobby</button>
        <button onClick={() => setScreen('loginHost')}>Log in as Host</button>
      </div>
    );
  }

  if (screen === 'joinLobby') {
    return <JoinLobby onSubmitCode={handleSubmitLobbyCode} />;
  }

  if (screen === 'enterCompany') {
    return (
      <div style={styles.dark}>
        <h1 style={styles.title}>THE ART OF SELLING NONSENSE</h1>
        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={styles.input}
        />
        <button style={styles.goldButton} onClick={handleSubmitCompany}>
          Ready
        </button>
      </div>
    );
  }

  if (screen === 'waiting') {
    return (
      <div style={styles.dark}>
        <h1 style={styles.title}>THE ART OF SELLING NONSENSE</h1>
        <div style={styles.companyBox}>{companyName}</div>
        <marquee style={{ marginTop: '40px' }}>
          You joined the lobby successfully — think about an unnecessary product.
          If you have no idea, ask AI or Google for help.
        </marquee>
      </div>
    );
  }

  if (screen === 'loginHost') {
    return <LoginHost onLogin={handleHostLogin} />;
  }

  if (screen === 'hostLobby') {
    return <HostLobby lobbyCode={lobbyCode} teams={teams} onStartGame={handleHostStartGame} />;
  }

  if (screen === 'hostMainMenu') {
    return <HostMainMenu lobbyCode={lobbyCode} setScreen={setScreen} />;
  }

  if (screen === 'productCreation') {
    return (
      <ProductCreation
        lobbyCode={lobbyCode}
        companyName={companyName}
        onRequestStart={() => setScreen('worldMap')}
      />
    );
  }

  // SHOW WORLD MAP
  if (screen === 'worldMap' || productApproved) {
    return (
      <>
        <WorldMap
          lobbyCode={lobbyCode}
          onSelectRegion={(regionKey) => {
            setSelectedRegion(regionKey);
            setPlayerCompany(companyName);
            document.getElementById('confirm-region').scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <div id="confirm-region" style={{ textAlign: 'center', padding: '50px 0' }}>
          {selectedRegion && (
            <>
              <h2 style={{ color: 'white' }}>You selected region {selectedRegion}</h2>
              <button
                style={styles.goldButton}
                onClick={() => setScreen('playerMenu')}
              >
                Continue with Region {selectedRegion}
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  // PLAYER MENU SCREEN
  if (screen === 'playerMenu') {
  return (
    <>
      <BreakingOverlay
        show={showBreakingPopup}
        event={breakingEventRef.current}
        onClose={() => setShowBreakingPopup(false)}
      />

      <PlayerMenu
        companyName={playerCompany}
        setScreen={setScreen}
        lobbyCode={lobbyCode}
      />
    </>
  );
}


  // PLAYER SCREENS
  if (screen === 'playerFinances') {
  return (
    <>
      <BreakingOverlay
        show={showBreakingPopup}
        event={breakingEventRef.current}
        onClose={() => setShowBreakingPopup(false)}
      />

      <PlayerFinances companyName={playerCompany} setScreen={setScreen} />
    </>
  );
}

  if (screen === 'playerProduction'){
    return (

<>
      <BreakingOverlay
        show={showBreakingPopup}
        event={breakingEventRef.current}
        onClose={() => setShowBreakingPopup(false)}
      />

      <PlayerProduction
        companyName={playerCompany}
        setScreen={setScreen}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        lobbyCode={lobbyCode}
      />
    </>
    );
} 

if (screen === 'playerMarketing') 
  return (
    <>
      <BreakingOverlay
        show={showBreakingPopup}
        event={breakingEventRef.current}
        onClose={() => setShowBreakingPopup(false)}
      />

      <PlayerMarketing
        companyName={playerCompany}
        lobbyCode={lobbyCode}
        playerProduct={{
          productName: playerCompany,
        }}
        setScreen={setScreen}
      />
    </>
  );




if (screen === 'playerOtherCompanies'){
  return (
    <>
      <BreakingOverlay
        show={showBreakingPopup}
        event={breakingEventRef.current}
        onClose={() => setShowBreakingPopup(false)}
      />





    <PlayerOtherCompanies
      lobbyCode={lobbyCode}
      setScreen={setScreen}
    />
  </>
  );

 } 


 if (screen === 'playerNews')
  return <PlayerNews setScreen={setScreen} lobbyCode={lobbyCode} />;

 
 if (screen === 'playerProductReviews')
  return (
    <PlayerProductReviews
      lobbyCode={lobbyCode}
      companyName={playerCompany}
      setScreen={setScreen}
    />
  );






  // --- NEW: HOST SCREENS ---
  if (screen === 'hostViewStats') return <HostViewStats setScreen={setScreen} />;
  if (screen === 'hostLaunchEvent')
  return <HostLaunchEvent lobbyCode={lobbyCode} setScreen={setScreen} />;

  if (screen === 'hostNews')
  return <HostNews setScreen={setScreen} lobbyCode={lobbyCode} />;

  if (screen === 'hostMarketing') return <HostMarketing setScreen={setScreen} />;
  if (screen === 'hostStatsRegions') return <HostStatsRegions setScreen={setScreen} />;

  // --- NEXT ROUND SCREENS ---
  if (screen === 'hostNextRound') {
  return (
    <HostNextRoundScreen
      lobbyCode={lobbyCode}
      leadingCompanies={[]}
      onNextRound={() => setScreen('hostMainMenu')}
      onEndGame={() => setScreen('hostEndGame')}
    />
  );
}

if (screen === 'hostEndGame') {
  return (
    <HostEndGameScreen
      lobbyCode={lobbyCode}
      onClose={() => setScreen('home')}
    />
  );
}



  if (screen === 'playerNextRound') {
    return (
      <PlayerNextRoundScreen
        lobbyCode={lobbyCode}
        leadingCompanies={[]}
        setScreen={setScreen} // <-- crucial fix
      />
    );
  }

  return null;
}

/* -------------------------
   STYLES
-------------------------- */
const styles = {
  light: {
    background: '#e0e0e0',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px'
  },
  dark: {
    background: '#1e2a38',
    height: '100vh',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginBottom: '30px'
  },
  input: {
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '6px',
    border: 'none'
  },
  goldButton: {
    background: '#e6c483',
    border: 'none',
    padding: '12px 26px',
    borderRadius: '20px',
    cursor: 'pointer'
  },
  companyBox: {
    background: '#e6c483',
    color: 'black',
    padding: '10px 20px',
    borderRadius: '20px'
  }
};

export default App;