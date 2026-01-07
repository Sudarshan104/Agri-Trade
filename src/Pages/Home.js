import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <h2 className="logo">🌾 AgriTrade</h2>

        {/* NAV BUTTONS */}
        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      </nav>

      {/* ===== HERO IMAGE SECTION ===== */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Farmer–Retailer Trading Platform</h1>
          <p>
            A digital platform enabling direct trade between farmers and
            retailers with transparency, efficiency, and fair pricing.
          </p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="section about">
        <h2>About the Platform</h2>
        <p>
          This web-based system connects farmers and retailers directly,
          eliminating middlemen and improving efficiency in agricultural
          transactions. It ensures better income for farmers and fair pricing
          for retailers.
        </p>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">🌾 Direct Farmer–Retailer Trading</div>
          <div className="feature-item">📦 Product & Inventory Management</div>
          <div className="feature-item">📊 Transparent Pricing</div>
          <div className="feature-item">🔐 Secure Role-Based Login</div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section how-it-works">
        <h2>How It Works</h2>
        <ul>
          <li>1️⃣ Farmer registers and adds products</li>
          <li>2️⃣ Retailer browses products and places orders</li>
          <li>3️⃣ Order confirmation and processing</li>
          <li>4️⃣ Delivery and payment</li>
        </ul>
      </section>

      {/* ===== STATS (DUMMY) ===== */}
      <section className="section stats">
        <div>
          <h3>1,200+</h3>
          <p>Farmers Registered</p>
        </div>
        <div>
          <h3>800+</h3>
          <p>Retailers Connected</p>
        </div>
        <div>
          <h3>5,000+</h3>
          <p>Successful Trades</p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        © 2026 AgriTrade Platform | All Rights Reserved
      </footer>

    </div>
  );
}
