import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function LandingPage() {
  return (
    <div>
      <header className="landing-header">
        <h1>Perfect Fit</h1>
        <div className="landing-nav">
          <Link to="/login">Login</Link>
          <Link to="/register" className="btn">Get Started</Link>
        </div>
      </header>

      <main className="landing-main">
        <h2>Your Personal Online <span>Stitching</span> Partner</h2>
        <p>Connect with trusted tailors nearby, explore design inspirations, and place your custom orders with ease.</p>

        <Link to="/register" className="btn-large">Join Now</Link>

        <img src="https://cdn.dribbble.com/users/252114/screenshots/16124159/media/43c35791e747c45c211f019b153a7a10.png" alt="Stitching"/>
      </main>

      <section className="landing-features">
        <div className="feature-box">
          <h3>Nearby Tailors</h3>
          <p>Find skilled tailors close to your location.</p>
        </div>
        <div className="feature-box">
          <h3>Custom Orders</h3>
          <p>Upload or choose your design and get it stitched your way.</p>
        </div>
        <div className="feature-box">
          <h3>Track & Rate</h3>
          <p>Track your orders and rate tailors after completion.</p>
        </div>
      </section>

      <footer className="landing-footer">
        &copy; 2025 Perfect Fit. Crafted with ❤️ for stitching services.
      </footer>
    </div>
  );
}
