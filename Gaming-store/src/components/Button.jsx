export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) {
  const baseClasses = 'font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 dark:focus:ring-orange-500',
    secondary: 'bg-transparent border-2 border-blue-600 dark:border-orange-500 text-blue-600 dark:text-orange-400 hover:bg-blue-600 dark:hover:bg-orange-500 hover:text-white focus:ring-blue-500 dark:focus:ring-orange-500',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
    warning: 'bg-amber-500 hover:bg-amber-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-black dark:text-white shadow-lg hover:shadow-xl focus:ring-amber-500 dark:focus:ring-orange-500',
    outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500 dark:focus:ring-gray-400',
  };
  
  const sizes = {
    small: 'px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg',
    medium: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg',
    large: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
