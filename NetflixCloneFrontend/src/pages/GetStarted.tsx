import "./GetStarted.css";
import { useNavigate, Link } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="get-started">

      {/* Navbar */}
      <nav className="gs-navbar">
        <span className="logo">NETFLIX</span>
        <Link to="/login" className="sign-in-btn">Sign In</Link>
      </nav>

      {/* Hero */}
      <div className="hero-content">
        <h2>Unlimited movies, TV shows and more.</h2>
        <h3>Watch anywhere. Cancel anytime.</h3>
        <p>Ready to watch? Enter your email to create or restart your membership.</p>
        <div className="email-form">
          <input type="email" placeholder="Email address" />
          <button onClick={() => navigate("/register")}>Get Started &gt;</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="gs-footer">
        <p>Questions? Contact us.</p>
        <div className="gs-footer-links">
          <a href="#">FAQ</a>
          <a href="#">Help Centre</a>
          <a href="#">Account</a>
          <a href="#">Media Centre</a>
          <a href="#">Investor Relations</a>
          <a href="#">Jobs</a>
          <a href="#">Ways to Watch</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Corporate Information</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="gs-footer-bottom">
          <p>Netflix Clone © 2026</p>
        </div>
      </footer>

    </div>
  );
}

export default GetStarted;