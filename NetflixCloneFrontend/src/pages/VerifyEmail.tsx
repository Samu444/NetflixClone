import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Login.css";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    try {
      const response = await fetch("http://localhost:5145/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Verification failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <nav className="login-navbar">
        <Link to="/" className="login-logo">NETFLIX</Link>
      </nav>

      <div className="login-body">
        <div className="login-box">
          <h1>Verify Your Email</h1>
          {!success ? (
            <>
              <p style={{ color: "#b3b3b3", marginBottom: "16px" }}>
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
              {error && <p className="login-error">{error}</p>}
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
              <button onClick={handleVerify}>Verify</button>
            </>
          ) : (
            <p style={{ color: "#4ade80", fontSize: "1.1rem" }}>
              ✅ Email verified! Redirecting you to sign in...
            </p>
          )}
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

export default VerifyEmail;