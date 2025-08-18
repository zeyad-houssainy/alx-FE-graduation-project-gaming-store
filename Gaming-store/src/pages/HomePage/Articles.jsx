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
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-['Oxanium'] mb-6 text-gray-900">
            LATEST NEWS <span className="text-blue-600">& ARTICLES</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Compete With 100 Players On A Remote Island For Winner Takes Showdown Known / Issue Where Certain Skin Strategic.
          </p>
          
          {/* Go to Blog Button */}
          <Link 
            to="/blog" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go to Blog
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article 
              key={article.id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Article Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Article Content */}
              <div className="p-6">
                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">👤</span>
                    <span className="uppercase font-semibold">{article.admin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📅</span>
                    <span className="uppercase font-semibold">{article.date}</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 font-['Oxanium'] uppercase leading-tight">
                  {article.title}
                </h3>
                
                {/* Summary */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {article.summary}
                </p>
                
                {/* Read More Button */}
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 flex items-center gap-2 group/btn">
                  READ MORE 
                  <span className="text-blue-600 group-hover/btn:translate-x-1 transition-transform duration-300">▸</span>
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
