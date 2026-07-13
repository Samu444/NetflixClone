import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Movie } from "../types/Movie";
import "../App.css";

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5145/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch(() => setError("Failed to load movie."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="watch-page">
      <header className="navbar">
        <span className="logo">NETFLIX</span>
        <button className="logout-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>
      </header>

      <div className="watch-content">
        {loading && <p className="watch-status">Loading trailer...</p>}
        {error && <p className="watch-status">{error}</p>}
        {!loading && movie && !movie.trailerKey && (
          <p className="watch-status">No trailer available for this movie.</p>
        )}
        {movie?.trailerKey && (
          <iframe
            className="watch-iframe"
            src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
            title="Movie Trailer"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        )}
      </div>
    </div>
  );
}

export default Watch;