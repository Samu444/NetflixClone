import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import type { Movie } from "../types/Movie";

function Home() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch("http://localhost:5145/api/movies/popular")
      .then((res) => res.json())
      .then((data) => setPopular(data.results));

    fetch("http://localhost:5145/api/movies/toprated")
      .then((res) => res.json())
      .then((data) => setTopRated(data.results));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">NETFLIX</Link>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">TV Shows</a></li>
            <li><a href="#">Movies</a></li>
            <li><a href="#">New & Popular</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">👤 {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-info">
          <h1>Trending Now</h1>
          <p>Watch the latest and most popular movies and TV shows, updated daily.</p>
          <div className="hero-buttons">
            <button className="hero-play-btn">▶ Play</button>
            <button className="hero-info-btn">ℹ More Info</button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <main className="main-content">
        <MovieRow title="Trending Now" movies={popular} />
        <MovieRow title="Top Rated" movies={topRated} />
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-links">
          <a href="#">FAQ</a>
          <a href="#">Help Centre</a>
          <a href="#">Account</a>
          <a href="#">Media Centre</a>
          <a href="#">Investor Relations</a>
          <a href="#">Jobs</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Corporate Information</a>
          <a href="#">Contact Us</a>
          <a href="#">Speed Test</a>
        </div>
        <div className="home-footer-bottom">
          <p>Netflix Clone © 2026</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;