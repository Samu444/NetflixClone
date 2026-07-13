import type { Movie } from '../types/Movie'
import StarRating from './StarRating'
import { useNavigate } from 'react-router-dom'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
}

function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate()

  return (
    <div className="movie-card" onClick={() => navigate(`/watch/${movie.id}`)}>
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