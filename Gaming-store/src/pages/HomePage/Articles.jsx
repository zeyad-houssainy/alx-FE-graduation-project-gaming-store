import React from 'react';
import { Link } from 'react-router-dom';

const Articles = () => {
  const articles = [
    {
      id: 1,
      title: "SHOOTER ACTION VIDEO",
      image: "/assets/images/blog-1.jpg",
      summary: "Compete With 100 Players On A Remote Island Thats Winner Takes Showdown Known Issue.",
      admin: "ADMIN",
      date: "SEPTEMBER 19, 2022"
    },
    {
      id: 2,
      title: "THE WALKING DEAD",
      image: "/assets/images/blog-2.jpg",
      summary: "Compete With 100 Players On A Remote Island Thats Winner Takes Showdown Known Issue.",
      admin: "ADMIN",
      date: "SEPTEMBER 19, 2022"
    },
    {
      id: 3,
      title: "DEFENSE OF THE ANCIENTS",
      image: "/assets/images/blog-3.jpg",
      summary: "Compete With 100 Players On A Remote Island Thats Winner Takes Showdown Known Issue.",
      admin: "ADMIN",
      date: "SEPTEMBER 19, 2022"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Oxanium'] mb-4 sm:mb-6 text-gray-900 dark:text-white">
            LATEST NEWS <span className="text-blue-600 dark:text-orange-400">& ARTICLES</span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-600 dark:bg-orange-400 mx-auto mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Compete With 100 Players On A Remote Island For Winner Takes Showdown Known / Issue Where Certain Skin Strategic.
          </p>
          
          {/* Go to Blog Button */}
          <Link 
            to="/blog" 
            className="inline-block bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Go to Blog
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <article 
              key={article.id}
              className="group bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Article Image */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Article Content */}
              <div className="p-4 sm:p-6">
                {/* Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-orange-400">👤</span>
                    <span className="uppercase font-semibold">{article.admin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-orange-400">📅</span>
                    <span className="uppercase font-semibold">{article.date}</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white font-['Oxanium'] uppercase leading-tight">
                  {article.title}
                </h3>
                
                {/* Summary */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                  {article.summary}
                </p>
                
                {/* Read More Button */}
                <button className="text-blue-600 dark:text-orange-400 font-semibold hover:text-blue-700 dark:hover:text-orange-300 transition-colors duration-300 flex items-center gap-2 group/btn text-sm sm:text-base p-2 -m-2 rounded-lg hover:bg-blue-50 dark:hover:bg-orange-50 dark:hover:bg-orange-900/20 touch-manipulation">
                  READ MORE 
                  <span className="text-blue-600 dark:text-orange-400 group-hover/btn:translate-x-1 transition-transform duration-300">▸</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
