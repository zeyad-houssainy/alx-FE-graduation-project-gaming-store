import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const UnderConstruction = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center">
          <div className="text-6xl sm:text-8xl mb-4">🚧</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Under Construction</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto text-sm sm:text-base">
            This page is under construction and will be available soon.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
          >
            Return Home
          </Link>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default UnderConstruction;
