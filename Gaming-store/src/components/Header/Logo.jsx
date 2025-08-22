import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      {/* Simple Logo Icon */}
      <div className="w-8 h-8 bg-blue-600 dark:bg-orange-500 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          GAMING
        </span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          STORE
        </span>
      </div>
    </Link>
  );
}
