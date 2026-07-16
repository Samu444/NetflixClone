import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5145/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Something went wrong.");
        setLoading(false);
        return;
      }

      navigate("/reset-password", { state: { email } });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <nav className="login-navbar">
        <Link to="/" className="login-logo">NETFLIX</Link>
      </nav>

      <div className="login-body">
        <div className="login-box">
          <h1>Forgot Password</h1>
          <p style={{ color: "#b3b3b3", marginBottom: "16px" }}>
            Enter your email and we'll send you a code to reset your password.
          </p>
          {error && <p className="login-error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <p className="login-footer-text">
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <footer className="login-page-footer">
        <p>Questions? Contact us.</p>
        <div className="login-footer-links">
          <a href="#">FAQ</a>
          <a href="#">Help Centre</a>
        </div>
      </footer>
    </div>
  );
}

export default ForgotPassword;