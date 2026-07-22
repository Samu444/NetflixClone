import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import MovieModal from "../components/MovieModal";
import type { Movie } from "../types/Movie";

function Movies() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch("http://localhost:5145/api/movies/popular")
      .then((res) => res.json())
      .then((data) => setPopular(data));

    fetch("http://localhost:5145/api/movies/toprated")
      .then((res) => res.json())
      .then((data) => setTopRated(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const featured = popular[0];

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">NETFLIX</Link>
          <ul className="nav-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/series">Series</Link></li>
            <li><Link to="/movies" className="nav-link-active">Movies</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="nav-profile">
            <button className="icon-btn profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              Account
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-name">{user.name}</div>
                <div className="profile-dropdown-email">{user.email}</div>
                <hr />
                <button className="profile-dropdown-signout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        className="hero-banner"
        style={
          featured && featured.backdropPath
            ? {
                backgroundImage: "linear-gradient(to bottom, #141414 0%, transparent 30%, transparent 70%, #141414 100%), linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 60%), url(https://image.tmdb.org/t/p/original" + featured.backdropPath + ")",
              }
            : undefined
        }
      >
        <div className="hero-info">
          <h1>{featured ? featured.title : "Movies"}</h1>
          <p>
            {featured
              ? (featured.overview.length > 180
                  ? featured.overview.slice(0, 180) + "..."
                  : featured.overview)
              : "Watch the latest and most popular movies, updated daily."}
          </p>
          <div className="hero-buttons">
            <button
              className="hero-play-btn"
              disabled={!featured}
              onClick={() => { if (featured) navigate("/watch/" + featured.id); }}
            >
              Play
            </button>
            <button
              className="hero-info-btn"
              disabled={!featured}
              onClick={() => { if (featured) setSelectedMovie(featured); }}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        <MovieRow title="Popular Movies" movies={popular} onSelect={setSelectedMovie} />
        <MovieRow title="Top Rated Movies" movies={topRated} onSelect={setSelectedMovie} />
      </main>

      <footer className="home-footer">
        <div className="home-footer-links">
          <a href="#">FAQ</a>
          <a href="#">Help Centre</a>
          <a href="#">Account</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
        </div>
        <div className="home-footer-bottom">
          <p>Netflix Clone (c) 2026</p>
        </div>
      </footer>

      {selectedMovie ? (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      ) : null}
    </div>
  );
}

export default Movies;