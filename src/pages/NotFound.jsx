import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 sm:pt-24 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        {/* 404 Icon */}
        <div className="text-6xl sm:text-8xl lg:text-9xl font-black text-blue-600 dark:text-orange-400 mb-6 sm:mb-8 font-bold">
          404
        </div>
        
        {/* Gaming Icon */}
        <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 animate-bounce">🎮</div>
        
        {/* Error Message */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
          Page Not Found
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          Looks like you've wandered into uncharted territory! This level doesn't exist in our gaming universe.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button onClick={() => navigate('/')} size="large" className="w-full sm:w-auto">
            Return to Home
          </Button>
          
          <Button 
            onClick={() => navigate('/games')} 
            variant="secondary" 
            size="large"
            className="w-full sm:w-auto"
          >
            Explore Games
          </Button>
        </div>
        
        {/* Fun Gaming Facts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 font-bold">
            🎯 Gaming Trivia While You're Here
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="space-y-2">
              <p><strong>🎮 First Video Game:</strong> Pong (1972)</p>
              <p><strong>🏆 Best Selling:</strong> Minecraft (200+ million)</p>
            </div>
            <div className="space-y-2">
              <p><strong>💰 Highest Grossing:</strong> GTA V ($6+ billion)</p>
              <p><strong>⏱️ Longest Game:</strong> The Longing (400+ days)</p>
            </div>
          </div>
        </div>
        
        {/* Back to Previous Page */}
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 dark:text-orange-400 hover:text-blue-700 dark:hover:text-orange-300 font-medium underline"
          >
            ← Go back to previous page
          </button>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
