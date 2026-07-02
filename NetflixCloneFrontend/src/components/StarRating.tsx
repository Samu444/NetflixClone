interface StarRatingProps {
  rating: number
  max?: number
}

function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = rating >= i + 1
        const partial = !filled && rating > i

        return (
          <span
            key={i}
            className={`star ${filled ? 'star--filled' : partial ? 'star--partial' : 'star--empty'}`}
          >
            ★
          </span>
        )
      })}
      <span className="star-value">{rating.toFixed(1)}</span>
    </div>
  )
}

export default StarRating