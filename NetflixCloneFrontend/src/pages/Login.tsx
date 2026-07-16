import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5145/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Invalid email or password.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <nav className="login-navbar">
        <Link to="/" className="login-logo">NETFLIX</Link>
      </nav>

      <div className="login-body">
        <div className="login-box">
          <h1>Sign In</h1>
          {error && <p className="login-error">{error}</p>}
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button onClick={handleLogin}>Sign In</button>

          <div className="forgot-password-row">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>

          <p className="login-footer-text">
            New to Netflix? <Link to="/register">Sign up now</Link>
          </p>
        </div>
      </div>

      <footer className="login-page-footer">
        <p>Questions? Contact us.</p>
        <div className="login-footer-links">
          <a href="#">FAQ</a>
          <a href="#">Help Centre</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Corporate Information</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;