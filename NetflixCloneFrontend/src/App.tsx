import './App.css'
import { useState, useEffect } from 'react'
import MovieRow from './components/MovieRow'
import type { Movie } from './types/Movie'

function App() {
  const [popular, setPopular] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])

  useEffect(() => {
    fetch('http://localhost:5145/api/movies/popular')
      .then(res => res.json())
      .then(data => setPopular(data.results))

    fetch('http://localhost:5145/api/movies/toprated')
      .then(res => res.json())
      .then(data => setTopRated(data.results))
  }, [])

  return (
    <div className="app">
      <header className="navbar">
        <span className="logo">NETFLIX</span>
      </header>

      <main className="main-content">
        <MovieRow title="Trending Now" movies={popular} />
        <MovieRow title="Top Rated" movies={topRated} />
      </main>

    </div>
  )
}

export default App