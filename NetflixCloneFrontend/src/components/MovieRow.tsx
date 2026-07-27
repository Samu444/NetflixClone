import type { Movie } from '../types/Movie'
import MovieCard from './MovieCard'
import './MovieRow.css'

interface MovieRowProps {
  title: string
  movies: Movie[]
  onSelect: (movie: Movie) => void
}

function MovieRow({ title, movies, onSelect }: MovieRowProps) {
  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-cards">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default MovieRow