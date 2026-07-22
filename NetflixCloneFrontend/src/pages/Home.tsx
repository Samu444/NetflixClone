import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MovieRow from "../components/MovieRow";
import MovieModal from "../components/MovieModal";
import type { Movie } from "../types/Movie";

function Home() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const topRatedRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(
    localStorage.getItem("user") ??
      '{"name":"Guest","email":""}'
  );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularResponse = await fetch(
          "http://localhost:5145/api/movies/popular"
        );
        const popularData = await popularResponse.json();
        setPopular(popularData);

        const topRatedResponse = await fetch(
          "http://localhost:5145/api/movies/toprated"
        );
        const topRatedData = await topRatedResponse.json();
        setTopRated(topRatedData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const featured = popular[0];

  // Remove duplicate movies from search
  const allMovies = [...popular, ...topRated].filter(
    (movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
  );

  const searchResults = searchTerm.trim()
    ? allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            NETFLIX
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/home" className="nav-link-active">
                Home
              </Link>
            </li>

            <li>
              <a href="/series">Series</a>
            </li>

            <li>
              <a href="home">Movies</a>
            </li>

            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  topRatedRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                New and Popular
              </a>
            </li>
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

            <button
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              Search
            </button>

            {searchTerm.trim() && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="search-result-item"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setSearchTerm("");
                        setSearchOpen(false);
                      }}
                    >
                      {movie.posterPath && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                          alt={movie.title}
                        />
                      )}

                      <span>{movie.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="search-result-empty">
                    No matches found.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="nav-profile">
            <button
              className="icon-btn profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              Account
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-name">
                  {user.name}
                </div>

                <div className="profile-dropdown-email">
                  {user.email}
                </div>

                <hr />

                <button
                  className="profile-dropdown-signout"
                  onClick={handleLogout}
                >
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
          featured?.backdropPath
            ? {
                backgroundImage: `linear-gradient(to bottom, #141414 0%, transparent 30%, transparent 70%, #141414 100%), linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 60%), url(https://image.tmdb.org/t/p/original${featured.backdropPath})`,
              }
            : undefined
        }
      >
        <div className="hero-info">
          <h1>{featured ? featured.title : "Trending Now"}</h1>

          <p>
            {featured
              ? featured.overview.length > 180
                ? featured.overview.slice(0, 180) + "..."
                : featured.overview
              : "Watch the latest and most popular movies and TV shows, updated daily."}
          </p>

          <div className="hero-buttons">
            <button
              className="hero-play-btn"
              disabled={!featured}
              onClick={() => {
                if (featured) navigate(`/watch/${featured.id}`);
              }}
            >
              ▶ Play
            </button>

            <button
              className="hero-info-btn"
              disabled={!featured}
              onClick={() => {
                if (featured) setSelectedMovie(featured);
              }}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        <MovieRow
          title="Trending Now"
          movies={popular}
          onSelect={setSelectedMovie}
        />

        <div ref={topRatedRef}>
          <MovieRow
            title="Top Rated"
            movies={topRated}
            onSelect={setSelectedMovie}
          />
        </div>
      </main>

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

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default Home;