import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Invalid email or password.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      navigate("/home");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">

      {/* Navbar */}
      <nav className="login-navbar">
        <Link to="/" className="login-logo">NETFLIX</Link>
      </nav>

      {/* Login Box */}
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Sign In</button>
          <p className="login-footer-text">
            New to Netflix? <Link to="/">Sign up now</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
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