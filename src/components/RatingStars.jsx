export default function RatingStars({ rating, maxRating = 5, size = 'medium', showText = true }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  // Create full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={`full-${i}`}
        className="text-amber-500 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        <svg
          className="text-gray-300 dark:text-gray-600 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg
          className="text-amber-500 fill-current absolute inset-0"
          viewBox="0 0 24 24"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    );
  }
  
  // Add empty stars
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg
        key={`empty-${i}`}
        className="text-gray-300 dark:text-gray-600 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {stars.map((star, index) => (
          <div key={index} className={sizeClasses[size]}>
            {star}
          </div>
        ))}
      </div>
      {showText && (
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
}
