import React, { useState, useEffect, useRef } from 'react';
import './HostNews.css';


export default function PlayerNews({ setScreen, lobbyCode }) {
  const [news, setNews] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(true);
  






  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(
          `https://the-art-of-selling-nonsense-backend.onrender.com/news-events/${lobbyCode}`
        );
        const data = await response.json();

        setNews(data.news || []);
        setCurrentRound(data.currentRound ?? 0);
      } catch (err) {
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [lobbyCode]);

  return (
  <div className="host-news-screen">

    

    <button onClick={() => setScreen('playerMenu')}>
      Back
    </button>

    <h1>News — Round {currentRound}</h1>

    {loading && <p>Loading…</p>}

    {!loading && news.length === 0 && (
      <p>No news has been published.</p>
    )}

    {!loading &&
      news.map(item => (
        <div
          key={item.id}
          className={`news-article ${
            item.round === currentRound ? 'breaking' : ''
          }`}
        >
          <h2>{item.title}</h2>
          <p>{item.text}</p>
          <small>Round {item.round}</small>
        </div>
      ))}
  </div>
);
}
