import React from 'react';
import './PlayerWaitingScreen.css';

export default function PlayerWaitingScreen() {
  return (
    <div className="waiting-screen">
      <h1>⏳ Round in Progress</h1>
      <p>The host is reviewing all strategies.</p>
      <p>Please wait…</p>
    </div>
  );
}
