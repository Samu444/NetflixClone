import type { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";
import "./MovieModal.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  isSeries?: boolean;
}

function MovieModal({ movie, onClose, isSeries = false }: MovieModalProps) {

  const navigate = useNavigate();

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div
          className="modal-backdrop"
          style={
            movie.backdropPath
              ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdropPath})` }
              : undefined
          }
        >
          <div className="modal-backdrop-fade" />
        </div>

        <div className="modal-content">
          <h1 className="modal-title">{movie.title}</h1>

          <div className="modal-badges">
            {year && <span className="modal-badge">{year}</span>}
            <span className="modal-badge">{isSeries ? "Series" : "Movie"}</span>
            {movie.voteAverage > 0 && (
              <span className="modal-badge">⭐ {movie.voteAverage.toFixed(1)}</span>
            )}
            {movie.genres?.slice(0, 2).map((g) => (
              <span className="modal-badge" key={g}>{g}</span>
            ))}
          </div>

          <p className="modal-overview">{movie.overview}</p>

          <button
            className="modal-play-btn"
            onClick={() => navigate(isSeries ? `/watch/series/${movie.id}` : `/watch/${movie.id}`)}
          >
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;