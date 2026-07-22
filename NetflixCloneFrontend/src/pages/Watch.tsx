import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Movie } from "../types/Movie";
import "../App.css";

function Watch() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSeries = location.pathname.startsWith("/watch/series/");

  useEffect(() => {
    setLoading(true);
    setError("");
    setMovie(null);

    const endpoint = isSeries
      ? `http://localhost:5145/api/series/${id}`
      : `http://localhost:5145/api/movies/${id}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch(() => setError(isSeries ? "Failed to load series." : "Failed to load movie."))
      .finally(() => setLoading(false));
  }, [id, isSeries]);

  return (
    <div className="watch-page">
      <header className="navbar">
        <span className="logo">NETFLIX</span>
        <button className="logout-btn" onClick={() => navigate(isSeries ? "/series" : "/home")}>
          ← Back
        </button>
      </header>

      <div className="watch-content">
        {loading && <p className="watch-status">Loading trailer...</p>}
        {error && <p className="watch-status">{error}</p>}
        {!loading && movie && !movie.trailerKey && (
          <p className="watch-status">No trailer available.</p>
        )}
        {movie?.trailerKey && (
          <iframe
            className="watch-iframe"
            src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
            title={isSeries ? "Series Trailer" : "Movie Trailer"}
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        )}
      </div>
    </div>
  );
}

export default Watch;