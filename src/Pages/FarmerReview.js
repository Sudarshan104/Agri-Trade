import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";
import "./FarmerReviews.css";

export default function FarmerReviews() {
  const user = getUser();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    API.get(`/reviews/farmer/${user.id}`)
      .then(res => setReviews(res.data || []))
      .catch(() => setReviews([]));
  }, [user?.id]);

  return (
    <div className="farmer-reviews-page">
      <h2 className="page-title">⭐ Product Reviews</h2>
      <p className="page-subtitle">
        Feedback shared by retailers on your products
      </p>

      {reviews.length === 0 ? (
        <p className="empty-text">No reviews received yet</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <h3 className="product-name">{r.product?.name}</h3>

              <p className="rating">⭐ {r.rating} / 5</p>

              <p className="comment">“{r.comment}”</p>

              <p className="reviewer">
                By <strong>{r.retailer?.name}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
