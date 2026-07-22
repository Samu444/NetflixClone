import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import MovieModal from "../components/MovieModal";
import type { Series } from "../types/Series";
import type { Movie } from "../types/Movie";

function SeriesPage () {
  const [popular, setPopular] = useState<Series[]>([]);
  const [topRated, setTopRated] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch("http://localhost:5145/api/series/popular")
      .then((res) => res.json())
      .then((data) => setPopular(data));

    fetch("http://localhost:5145/api/series/toprated")
      .then((res) => res.json())
      .then((data) => setTopRated(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const featured = popular[0];

  // Adapts a Series object into the shape MovieCard/MovieRow/MovieModal expect
  const toMovieShape = (s: Series): Movie => ({
    id: s.id,
    tmdbId: s.tmdbId,
    title: s.title,
    overview: s.overview,
    posterPath: s.posterPath,
    backdropPath: s.backdropPath,
    releaseDate: s.firstAirDate,
    voteAverage: s.voteAverage,
    genres: s.genres,
    trailerKey: s.trailerKey,
    category: s.category,
  });

  const popularAsMovies = popular.map(toMovieShape);
  const topRatedAsMovies = topRated.map(toMovieShape);

  const handleSelect = (m: Movie) => {
    const match = [...popular, ...topRated].find((s) => s.id === m.id);
    if (match) setSelectedSeries(match);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">NETFLIX</Link>
          <ul className="nav-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/series" className="nav-link-active">Series</Link></li>
            <li><Link to="/home">Movies</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="nav-profile">
            <button
              className="icon-btn profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
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
          <h1>{featured ? featured.title : "Series"}</h1>
          <p>
            {featured
              ? (featured.overview.length > 180
                  ? featured.overview.slice(0, 180) + "..."
                  : featured.overview)
              : "Discover trending and top rated series."}
          </p>
          <div className="hero-buttons">
            <button
              className="hero-play-btn"
              disabled={!featured}
              onClick={() => { if (featured) navigate("/watch/series/" + featured.id); }}
            >
              Play
            </button>
            <button
              className="hero-info-btn"
              disabled={!featured}
              onClick={() => { if (featured) setSelectedSeries(featured); }}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        {popular.length === 0 && topRated.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ color: "#b3b3b3" }}>No series available yet.</p>
          </div>
        ) : (
          <>
            <MovieRow title="Trending Series" movies={popularAsMovies} onSelect={handleSelect} />
            <MovieRow title="Top Rated Series" movies={topRatedAsMovies} onSelect={handleSelect} />
          </>
        )}
      </main>

      <footer className="home-footer">
        <div className="home-footer-links">
          <a href="#">FAQ</a>
          <a href="#">Help Centre</a>
          <a href="#">Account</a>
          <a href="#">Media Centre</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
        </div>
        <div className="home-footer-bottom">
          <p>Netflix Clone (c) 2026</p>
        </div>
      </footer>

      {selectedSeries ? (
        <MovieModal
          movie={toMovieShape(selectedSeries)}
          onClose={() => setSelectedSeries(null)}
          isSeries={true}
        />
      ) : null}
    </div>
  );
}

export default SeriesPage;