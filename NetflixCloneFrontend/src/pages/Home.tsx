import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MovieRow from "../components/MovieRow";
import MovieModal from "../components/MovieModal";
import type { Movie } from "../types/Movie";
import type { Series } from "../types/Series";

function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<Series[]>([]);
  const [topRatedSeries, setTopRatedSeries] = useState<Series[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedIsSeries, setSelectedIsSeries] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const seriesRowRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch("http://localhost:5145/api/movies/popular")
      .then((res) => res.json())
      .then((data) => setPopularMovies(data));

    fetch("http://localhost:5145/api/movies/toprated")
      .then((res) => res.json())
      .then((data) => setTopRatedMovies(data));

    fetch("http://localhost:5145/api/series/popular")
      .then((res) => res.json())
      .then((data) => setPopularSeries(data));

    fetch("http://localhost:5145/api/series/toprated")
      .then((res) => res.json())
      .then((data) => setTopRatedSeries(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const featured = popularMovies[0];

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

  const popularSeriesAsMovies = popularSeries.map(toMovieShape);
  const topRatedSeriesAsMovies = topRatedSeries.map(toMovieShape);

  const searchResults = searchTerm.trim()
    ? [...popularMovies, ...topRatedMovies, ...popularSeriesAsMovies, ...topRatedSeriesAsMovies].filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const openMovieModal = (m: Movie) => {
    setSelectedMovie(m);
    setSelectedIsSeries(false);
  };

  const openSeriesModal = (m: Movie) => {
    setSelectedMovie(m);
    setSelectedIsSeries(true);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">NETFLIX</Link>
          <ul className="nav-links">
            <li><Link to="/home" className="nav-link-active">Home</Link></li>
            <li><Link to="/series">Series</Link></li>
            <li><Link to="/movies">Movies</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="nav-search">
            {searchOpen && (
              <input
                type="text"
                autoFocus
                placeholder="Titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => {
                  if (!searchTerm) setSearchOpen(false);
                }}
                className="nav-search-input"
              />
            )}
            <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              Search
            </button>

            {searchTerm.trim() && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((m) => (
                    <div
                      key={m.id}
                      className="search-result-item"
                      onClick={() => {
                        openMovieModal(m);
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
          <h1>{featured ? featured.title : "Trending Now"}</h1>
          <p>
            {featured
              ? (featured.overview.length > 180
                  ? featured.overview.slice(0, 180) + "..."
                  : featured.overview)
              : "Watch the latest and most popular movies and series, updated daily."}
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
              onClick={() => { if (featured) openMovieModal(featured); }}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        <MovieRow title="Trending Movies" movies={popularMovies} onSelect={openMovieModal} />
        <div ref={seriesRowRef}>
          <MovieRow title="Trending Series" movies={popularSeriesAsMovies} onSelect={openSeriesModal} />
        </div>
        <MovieRow title="Top Rated Movies" movies={topRatedMovies} onSelect={openMovieModal} />
        <MovieRow title="Top Rated Series" movies={topRatedSeriesAsMovies} onSelect={openSeriesModal} />
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

      {selectedMovie ? (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isSeries={selectedIsSeries}
        />
      ) : null}
    </div>
  );
}

export default Home;