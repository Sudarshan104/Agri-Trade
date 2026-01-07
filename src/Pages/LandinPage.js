import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-bg">
      <div className="landing-card">

        {/* TAG */}
        <span className="platform-tag">🌱 Agriculture Platform</span>

        {/* TITLE */}
        <h1 className="landing-title">
          Farmer–Retailer Trading Platform
        </h1>

        {/* SUBTITLE */}
        <p className="landing-subtitle">
          A modern digital marketplace enabling direct trade between farmers
          and retailers with transparency, efficiency, and trust.
        </p>

        {/* HERO IMAGE (ONLINE) */}
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1598514983181-8a24a2d4d0d6?auto=format&fit=crop&w=1600&q=80"
            alt="Digital Agriculture Platform"
            className="hero-image"
          />
        </div>

        {/* FOOT TEXT */}
        <p className="landing-footer-text">
          Eliminating middlemen • Ensuring fair pricing • Empowering farmers
        </p>

      </div>
    </div>
  );
}
