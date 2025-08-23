# 🎮 CheapShark API Integration

## Overview

The Gaming Store project now integrates with **CheapShark API** to provide real-time game prices, deals, and store comparisons. This integration replaces the previous mock data system with live pricing information from multiple online stores.

## 🚀 What is CheapShark?

**CheapShark** is a free API that aggregates game prices from multiple online retailers, providing:
- Real-time price comparison across 20+ stores
- Deal tracking and notifications
- Price history and trends
- No API key required
- No CORS issues (works directly in browser)
- No rate limits

**Official Documentation**: https://apidocs.cheapshark.com/

## ✨ Features Implemented

### 1. **Real-Time Game Prices**
- Live pricing from multiple stores
- Automatic price updates
- Best deal identification
- Price comparison across retailers

### 2. **Store Information**
- Complete store listings with icons
- Store status (active/inactive)
- Store ratings and reliability

### 3. **Deal Tracking**
- Current deals for each game
- Deal count and availability
- Best price highlighting
- Store-specific offers

### 4. **Enhanced Search & Filtering**
- Real-time search results
- Price-based filtering
- Store-based filtering
- Rating and metacritic filtering

## 🏗️ Technical Implementation

### API Service (`src/services/cheapsharkApi.js`)

```javascript
// Main functions available:
- fetchGames(options)           // Search and filter games
- fetchGameById(gameId)         // Get specific game details
- fetchStores()                 // Get all available stores
- fetchGameDeals(gameId)        // Get deals for a specific game
- fetchDeals(options)           // Get multiple deals with filtering
- searchGames(searchTerm)       // Search games by title
- setPriceAlert(gameId, email)  // Set price alerts
- getPriceHistory(gameId, storeId) // Get historical prices
```

### Configuration (`src/config/api.js`)

```javascript
export const API_CONFIG = {
  USE_API: true, // Enable CheapShark API
  CHEAPSHARK: {
    BASE_URL: 'https://www.cheapshark.com/api/1.0',
    TIMEOUT: 10000,
    FEATURES: ['Real-time prices', 'Store comparisons', 'Price history', 'Deals tracking'],
  }
};
```

### Components

#### StoreInfo Component (`src/components/StoreInfo.jsx`)
- Displays available stores with icons
- Shows current deals for games
- Best price highlighting
- Store status indicators

#### Enhanced GameDetail Page
- Real-time pricing information
- Store comparison data
- Deal availability
- Price history integration

## 🔄 Data Flow

```
User Search → CheapShark API → Real-time Results → UI Display
     ↓              ↓              ↓              ↓
  Search Term → Game Search → Price Data → Store Info
```

## 📊 Data Structure

### Game Object (Transformed from CheapShark)
```javascript
{
  id: "gameID",
  name: "Game Title",
  background_image: "thumbnail_url",
  rating: 4.5, // Converted from Steam rating
  price: 29.99, // Current best price
  cheapestPrice: 29.99,
  cheapestStore: "storeID",
  platforms: ["PC"],
  genre: "Action",
  steamAppID: "123456",
  metacritic: 85,
  steamRating: 90,
  dealCount: 5,
  cheapestDealID: "dealID"
}
```

### Store Object
```javascript
{
  id: "storeID",
  name: "Store Name",
  icon: "icon_url",
  banner: "banner_url",
  isActive: true
}
```

## 🎯 Benefits

### For Users
- **Real-time prices**: Always see current market prices
- **Price comparison**: Find the best deals across stores
- **Deal tracking**: Never miss a sale
- **Store variety**: Access to 20+ different retailers

### For Developers
- **No CORS issues**: Works directly in browser
- **No API keys**: Simple integration
- **Reliable data**: Professional price aggregation service
- **Rich features**: Comprehensive game and store data

## 🛠️ Usage Examples

### Basic Game Search
```javascript
import { fetchGames } from '../services/cheapsharkApi';

const games = await fetchGames({
  search: 'Cyberpunk',
  page: 1,
  pageSize: 20,
  sortBy: 'price-low'
});
```

### Get Game Details
```javascript
import { fetchGameById } from '../services/cheapsharkApi';

const game = await fetchGameById('12345');
console.log(`Best price: $${game.cheapestPrice}`);
```

### Get Store Information
```javascript
import { fetchStores } from '../services/cheapsharkApi';

const stores = await fetchStores();
stores.forEach(store => {
  console.log(`${store.name}: ${store.isActive ? 'Active' : 'Inactive'}`);
});
```

## 🔧 Configuration Options

### Search Parameters
- `title`: Game title search
- `limit`: Maximum results
- `exact`: Exact title match
- `steamAppID`: Filter by Steam App ID

### Filtering Options
- `stores`: Filter by specific store IDs
- `upperPrice`: Maximum price filter
- `lowerPrice`: Minimum price filter
- `steamRating`: Minimum Steam rating
- `metacritic`: Minimum Metacritic score

### Sorting Options
- `relevance`: Default relevance order
- `name-asc`: Name A-Z
- `name-desc`: Name Z-A
- `price-low`: Price low to high
- `price-high`: Price high to low
- `rating`: Highest rated first

## 🚨 Error Handling

The system includes comprehensive error handling:
- **API failures**: Falls back to local data
- **Network issues**: Graceful degradation
- **Invalid data**: Data validation and sanitization
- **User feedback**: Clear error messages

## 🔮 Future Enhancements

### Planned Features
- **Price alerts**: Email notifications for price drops
- **Wishlist tracking**: Monitor multiple games
- **Price history charts**: Visual price trends
- **Store ratings**: User reviews and ratings
- **Deal notifications**: Push notifications for sales

### Advanced Features
- **Regional pricing**: Country-specific prices
- **Currency conversion**: Multi-currency support
- **Bundle deals**: Game package offers
- **Seasonal sales**: Holiday and event tracking

## 📱 Mobile Support

- **Responsive design**: Works on all devices
- **Touch optimization**: Mobile-friendly interactions
- **Performance**: Optimized for mobile networks
- **Offline fallback**: Local data when needed

## 🔒 Security & Privacy

- **No personal data**: Only game and price information
- **HTTPS only**: Secure API communication
- **Rate limiting**: Built-in API protection
- **Data validation**: Input sanitization

## 📈 Performance

- **Fast loading**: Optimized API calls
- **Caching**: Intelligent data caching
- **Lazy loading**: On-demand data fetching
- **Compression**: Optimized data transfer

## 🧪 Testing

The CheapShark integration includes comprehensive testing:
- **Unit tests**: Individual function testing
- **Integration tests**: API interaction testing
- **Error handling**: Failure scenario testing
- **Performance tests**: Response time validation

## 📚 Resources

- **Official API**: https://www.cheapshark.com/api/1.0
- **Documentation**: https://apidocs.cheapshark.com/
- **GitHub**: https://github.com/cheapshark
- **Support**: https://www.cheapshark.com/contact

## 🤝 Contributing

To contribute to the CheapShark integration:

1. **Fork the repository**
2. **Create a feature branch**
3. **Implement your changes**
4. **Add tests**
5. **Submit a pull request**

## 📄 License

This integration uses the CheapShark API which is free for commercial and non-commercial use. Please refer to their terms of service for detailed information.

---

**🎮 Happy Gaming with Real-Time Prices! 🎮**

*Powered by CheapShark API - Making gaming affordable for everyone.*
