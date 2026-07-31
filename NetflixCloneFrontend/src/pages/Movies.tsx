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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const activeProfile = JSON.parse(localStorage.getItem("activeProfile") || "null");

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

  const searchResults = searchTerm.trim()
    ? Array.from(
        new Map(
          [...popular, ...topRated]
            .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((m) => [m.tmdbId, m])
        ).values()
      )
    : [];

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
          <div className="nav-search">
            <input
              type="text"
              placeholder="Titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => { if (!searchTerm) setSearchOpen(false); }}
              className={`nav-search-input${searchOpen ? " open" : ""}`}
            />
            <button
              className="nav-search-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {searchTerm.trim() && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((m) => (
                    <div
                      key={m.id}
                      className="search-result-item"
                      onClick={() => {
                        setSelectedMovie(m);
                        setSearchTerm("");
                        setSearchOpen(false);
                      }}
                    >
                      {m.posterPath && (
                        <img src={`https://image.tmdb.org/t/p/w92${m.posterPath}`} alt={m.title} />
                      )}
                      <span>{m.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="search-result-empty">No matches found.</div>
                )}
              </div>
            )}
          </div>

          <div className="nav-profile">
            <button
              className="icon-btn profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className="nav-profile-icon-wrapper">
                {activeProfile ? (
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(activeProfile.avatarSeed)}`}
                    alt={activeProfile.name}
                  />
                ) : (
                  <svg className="nav-profile-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
                  </svg>
                )}
              </span>
              <span className="nav-profile-name">{activeProfile ? activeProfile.name : user.name}</span>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <span className="profile-dropdown-icon-wrapper">
                    {activeProfile ? (
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(activeProfile.avatarSeed)}`}
                        alt={activeProfile.name}
                      />
                    ) : (
                      <svg className="nav-profile-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
                      </svg>
                    )}
                  </span>
                  <span className="profile-dropdown-name">{activeProfile ? activeProfile.name : user.name}</span>
                </div>
                <hr />
                <button
                  className="profile-dropdown-switch"
                  onClick={() => navigate("/whos-watching")}
                >
                  Switch Profiles
                </button>
                <button className="profile-dropdown-signout" onClick={handleLogout}>
                  Sign Out of Netflix
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
        <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
        onSelectSimilar={(m) => {
        setSelectedMovie(m);
      }}
        />
      ) : null}
    </div>
  );
}

export default Movies;