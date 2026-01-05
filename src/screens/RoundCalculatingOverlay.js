import './RoundCalculatingOverlay.css';

export default function RoundCalculatingOverlay() {
  return (
    <div className="calc-overlay">
      <div className="calc-box">
        <div className="spinner" />
        <h2>Calculating Round Results</h2>
        <p>AI analysts are crunching numbers…</p>
      </div>
    </div>
  );
}
