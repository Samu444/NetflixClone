import type { Movie } from '../types/Movie'
import StarRating from './StarRating'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
  onSelect: (movie: Movie) => void
}

function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      <img
        src={movie.posterPath ? `https://image.tmdb.org/t/p/w300${movie.posterPath}` : ""}
        alt={movie.title}
      />
      <p className="movie-title">{movie.title}</p>
      {movie.genres && movie.genres.length > 0 && (
        <p className="movie-genre">{movie.genres.join(", ")}</p>
      )}
      {movie.voteAverage > 0 && (
        <StarRating rating={movie.voteAverage / 2} />
      )}
    </div>
  )
}

export default MovieCard