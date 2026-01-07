import { Link } from "react-router-dom";
import { getUser } from "../utils/Auth";
import "./RetailerHome.css";

export default function RetailerHome() {
  const user = getUser();

  return (
    <div className="retailer-home-container">
      <div className="retailer-home-card">
        <h2 className="welcome-text">
          Welcome, {user?.name} 👋
        </h2>

        <p className="role-text">
          Retailer Dashboard Home
        </p>

        <div className="retailer-actions">
          <Link to="/retailer/products">
            <button className="action-btn primary">
              View Products
            </button>
          </Link>

          <Link to="/retailer/orders">
            <button className="action-btn secondary">
              My Orders
            </button>
          </Link>
        </div>

        <p className="footer-text">
          Browse products • Place orders • Track deliveries
        </p>
      </div>
    </div>
  );
}
