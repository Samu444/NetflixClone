import { useState, useEffect } from "react";
import type { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";
import "./MovieModal.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  isSeries?: boolean;
}

function formatRuntime(minutes?: number): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function MovieModal({ movie, onClose, isSeries = false }: MovieModalProps) {
  const navigate = useNavigate();
  const [similar, setSimilar] = useState<Movie[]>([]);

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";
  const duration = isSeries
    ? (movie.numberOfSeasons ? `${movie.numberOfSeasons} Season${movie.numberOfSeasons > 1 ? "s" : ""}` : "")
    : formatRuntime(movie.runtime);

  useEffect(() => {
    const base = isSeries ? "/api/series" : "/api/movies";
    const endpoint = movie.category === "top_rated" ? "toprated" : "popular";

    fetch(`http://localhost:5145${base}/${endpoint}`)
      .then((res) => res.json())
      .then((data: Movie[]) => {
        const filtered = data.filter((m) => m.id !== movie.id).slice(0, 6);
        setSimilar(filtered);
      })
      .catch(() => setSimilar([]));
  }, [movie.id, movie.category, isSeries]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div
          className="modal-hero"
          style={
            movie.backdropPath
              ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdropPath})` }
              : undefined
          }
        >
          <div className="modal-hero-fade" />

          <div className="modal-hero-content">
            <h1 className="modal-title">{movie.title}</h1>

            <div className="modal-actions">
              <button
                className="modal-play-btn"
                onClick={() => navigate(isSeries ? `/watch/series/${movie.id}` : `/watch/${movie.id}`)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>

              <button className="modal-icon-btn" aria-label="Add to My List">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>

              <button className="modal-icon-btn" aria-label="Like">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M7 22h-4a2 2 0 0 1 -2 -2v-7a2 2 0 0 1 2 -2h4m0 11h11a2 2 0 0 0 2 -1.7l1.4 -9a2 2 0 0 0 -2 -2.3h-6.31l.95 -4.57a1 1 0 0 0 -.5 -1.1a2 2 0 0 0 -2.3 .5l-5.14 6.16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="modal-main-col">
            <div className="modal-meta-row">
              {year && <span className="modal-year">{year}</span>}
              {duration && <span className="modal-duration">{duration}</span>}
              <span className="modal-type-badge">{isSeries ? "Series" : "Movie"}</span>
              {movie.voteAverage > 0 && (
                <span className="modal-rating">⭐ {movie.voteAverage.toFixed(1)}</span>
              )}
              {movie.contentRating && (
                <span className="modal-content-rating">{movie.contentRating}</span>
              )}
              <span className="modal-flag-badge">HD</span>
              <span className="modal-flag-badge">CC</span>
            </div>

            <p className="modal-overview">{movie.overview}</p>
          </div>

          <div className="modal-side-col">
            {movie.cast && movie.cast.length > 0 && (
              <p className="modal-side-line">
                <span className="modal-side-label">Cast: </span>
                {movie.cast.slice(0, 3).join(", ")}
                {movie.cast.length > 3 && <span className="modal-side-more"> more</span>}
              </p>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <p className="modal-side-line">
                <span className="modal-side-label">Genres: </span>
                {movie.genres.join(", ")}
              </p>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="modal-similar">
            <h2 className="modal-similar-title">More Like This</h2>
            <div className="modal-similar-grid">
              {similar.map((m) => (
                <div className="modal-similar-card" key={m.id}>
                  <div
                    className="modal-similar-thumb"
                    style={
                      m.backdropPath
                        ? { backgroundImage: `url(https://image.tmdb.org/t/p/w300${m.backdropPath})` }
                        : undefined
                    }
                  />
                  <p className="modal-similar-name">{m.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieModal;