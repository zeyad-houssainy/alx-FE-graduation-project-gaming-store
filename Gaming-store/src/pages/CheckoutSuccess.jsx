import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-black font-['Oxanium'] text-gray-900 dark:text-white mb-2">Payment Successful</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Your order has been placed successfully. A confirmation email has been sent.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/games')} size="large" className="w-full sm:w-auto">Explore More Games</Button>
            <Button onClick={() => navigate('/')} variant="secondary" size="large" className="w-full sm:w-auto">Go to Home</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


