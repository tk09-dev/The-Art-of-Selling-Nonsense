import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerProductReviews.css';

export default function PlayerProductReviews({
  lobbyCode,
  companyName,
  setScreen
}) {
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(0);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `https://the-art-of-selling-nonsense-backend.onrender.com/reviews/${lobbyCode}/${companyName}`
      );

      const { currentRound, reviewsByRound } = res.data;
      const roundReviews =
  reviewsByRound[currentRound - 1] ||
  reviewsByRound[currentRound] ||
  [];


      setReviews(roundReviews);

      const avg =
        roundReviews.length > 0
          ? (
              roundReviews.reduce((sum, r) => sum + r.sentiment, 0) /
              roundReviews.length
            ).toFixed(2)
          : 0;

      setOverallRating(avg);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  fetchReviews();
}, [lobbyCode, companyName]);




      
 const headerStats = `Total Reviews: ${reviews.length} • Avg Marketing Sentiment: ${overallRating} • Latest by ${reviews.length ? reviews[reviews.length - 1].name : "N/A"}`;


  return (
    <div className="reviews-screen">
      <header className="reviews-header">
        <button className="back-button" onClick={() => setScreen('playerMenu')}>
          Back to Main
        </button>
        <div className="header-stats">{headerStats}</div>
        <div className="current-category">Product Reviews</div>
      </header>

      <div className="overall-rating-box">
  <span>Avg Marketing Sentiment: {overallRating}</span>
</div>


      <div className="reviews-list">
        {reviews.map((review, idx) => (
          <div className="review-bubble" key={idx}>
           <p className="comment">"{review.text}"</p>
<div className="review-footer">
  <span>
    Marketing Sentiment: {review.sentiment > 0 ? '👍' : '👎'} ({Number(review.sentiment).toFixed(2)})

  </span>
  {' — '}
  <span>{review.name}</span>
</div>

              
            </div>
        ))}
      </div>
    </div>
  );
}
