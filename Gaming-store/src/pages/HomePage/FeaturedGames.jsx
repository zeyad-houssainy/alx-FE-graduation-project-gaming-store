import { Link } from 'react-router-dom';
import { useFetchGames } from '../../hooks/useFetchGames';
import GameCard from '../../components/GameCard';
import Loader from '../../components/Loader';

export default function FeaturedGames() {
    const { games, loading } = useFetchGames(1, 4);

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-bold mb-6 text-gray-900">
                            FEATURED <span className="text-blue-600 dark:text-orange-400">GAMES</span>
                        </h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Discover our collection of the latest and most exciting games available across all platforms
                        </p>
                    </div>
                    <Loader />
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-bold mb-6 text-gray-900">
                        FEATURED <span className="text-blue-600 dark:text-orange-400">GAMES</span>
                    </h2>
                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover our collection of the latest and most exciting games available across all platforms
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link to="/games">
                        <button className="group relative overflow-hidden bg-transparent border-2 border-blue-600 dark:border-orange-400 text-blue-600 dark:text-orange-400 font-bold px-8 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:text-white hover:shadow-lg transform hover:scale-105">
                            <span className="absolute inset-0 bg-blue-600 dark:bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            <span className="relative z-10">View All Games</span>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
