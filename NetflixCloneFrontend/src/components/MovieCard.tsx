import type { Movie } from '../types/Movie'
import StarRating from './StarRating'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />
      <p className="movie-title">{movie.title}</p>
      {movie.genre && (
        <p className="movie-genre">{movie.genre}</p>
      )}
      {movie.vote_average && (
        <StarRating rating={movie.vote_average / 2} />
      )}
    </div>
  )
}

export default MovieCard