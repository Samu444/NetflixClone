import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Login.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    try {
      const response = await fetch("http://localhost:5145/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Reset failed.");
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
          <h1>Reset Password</h1>
          {!success ? (
            <>
              <p style={{ color: "#b3b3b3", marginBottom: "16px" }}>
                Enter the code sent to <strong>{email}</strong> and your new password.
              </p>
              {error && <p className="login-error">{error}</p>}
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button onClick={handleReset}>Reset Password</button>
            </>
          ) : (
            <p style={{ color: "#4ade80", fontSize: "1.1rem" }}>
              ✅ Password reset! Redirecting you to sign in...
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

export default ResetPassword;