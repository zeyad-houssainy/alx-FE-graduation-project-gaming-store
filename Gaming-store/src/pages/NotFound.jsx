import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 text-center">
        {/* 404 Icon */}
        <div className="text-9xl font-black text-blue-600 mb-8 font-['Oxanium']">
          404
        </div>
        
        {/* Gaming Icon */}
        <div className="text-8xl mb-8 animate-bounce">🎮</div>
        
        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-black font-['Oxanium'] mb-6 text-gray-900">
          GAME OVER!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Looks like you've wandered into uncharted territory! This level doesn't exist in our gaming universe.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button onClick={() => navigate('/')} size="large">
            Return to Home
          </Button>
          
          <Button 
            onClick={() => navigate('/games')} 
            variant="secondary" 
            size="large"
          >
            Explore Games
          </Button>
        </div>
        
        {/* Fun Gaming Facts */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Oxanium']">
            🎯 Gaming Trivia While You're Here
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>🎮 First Video Game:</strong> Pong (1972)</p>
              <p><strong>🏆 Best Selling:</strong> Minecraft (200+ million)</p>
            </div>
            <div>
              <p><strong>💰 Highest Grossing:</strong> GTA V ($6+ billion)</p>
              <p><strong>⏱️ Longest Game:</strong> The Longing (400+ days)</p>
            </div>
          </div>
        </div>
        
        {/* Back to Previous Page */}
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            ← Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
}
