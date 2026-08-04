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
  const activeProfile = JSON.parse(localStorage.getItem("activeProfile") || "null");
  const isKidsProfile = Boolean(activeProfile?.isKids);

  useEffect(() => {
    if (isKidsProfile) {
      fetch("http://localhost:5145/api/movies/kids")
        .then((res) => res.json())
        .then((data) => {
          setPopularMovies(data);
          setTopRatedMovies(data);
        });

      fetch("http://localhost:5145/api/series/kids")
        .then((res) => res.json())
        .then((data) => {
          setPopularSeries(data);
          setTopRatedSeries(data);
        });
    } else {
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
    }
  }, [activeProfile?.id, isKidsProfile]);

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
    cast: s.cast,
    numberOfSeasons: s.numberOfSeasons,
    contentRating: s.contentRating,
    trailerKey: s.trailerKey,
    category: s.category,
  });

  const popularSeriesAsMovies = popularSeries.map(toMovieShape);
  const topRatedSeriesAsMovies = topRatedSeries.map(toMovieShape);

  const searchResults = searchTerm.trim()
    ? Array.from(
        new Map(
          [...popularMovies, ...topRatedMovies, ...popularSeriesAsMovies, ...topRatedSeriesAsMovies]
            .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((m) => [m.tmdbId, m])
        ).values()
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

  const movieRowTitle = isKidsProfile ? "Movies for Kids" : "Trending Movies";
  const seriesRowTitle = isKidsProfile ? "Series for Kids" : "Trending Series";
  const topMovieRowTitle = isKidsProfile ? "More Kids Movies" : "Top Rated Movies";
  const topSeriesRowTitle = isKidsProfile ? "More Kids Series" : "Top Rated Series";

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/home" className="logo">NETFLIX</Link>
          <ul className="nav-links">
            <li><Link to="/home" className="nav-link-active">Home</Link></li>
            <li><Link to="/series">Series</Link></li>
            <li><Link to="/movies">Movies</Link></li>
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
<button
  className="profile-dropdown-switch"
  onClick={() => navigate("/account")}
>
  Account
</button>
<button
  className="profile-dropdown-switch"
  onClick={() => alert("Help Centre coming soon!")}
>
  Help Centre
</button>
<hr />
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
        <MovieRow title={movieRowTitle} movies={popularMovies} onSelect={openMovieModal} />
        <div ref={seriesRowRef}>
          <MovieRow title={seriesRowTitle} movies={popularSeriesAsMovies} onSelect={openSeriesModal} />
        </div>
        <MovieRow title={topMovieRowTitle} movies={topRatedMovies} onSelect={openMovieModal} />
        <MovieRow title={topSeriesRowTitle} movies={topRatedSeriesAsMovies} onSelect={openSeriesModal} />
      </main>

      <footer className="home-footer">
  <div className="home-footer-bottom">
    <p>Netflix Clone © 2026</p>
  </div>
</footer>

      {selectedMovie ? (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isSeries={selectedIsSeries}
          onSelectSimilar={(m, isSeriesType) => {
           setSelectedMovie(m);
           setSelectedIsSeries(isSeriesType);
          }}
        />
      ) : null}
    </div>
  );
}

export default Home;
