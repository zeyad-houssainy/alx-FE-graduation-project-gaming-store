# 🎮 Gaming Store - React Gaming Marketplace

A modern, responsive gaming marketplace built with React that allows users to discover, browse, and purchase games with a beautiful dark/light theme interface.

## 🌐 Live Demo

**[View Live Demo](https://alx-fe-graduation-project-gaming-st.vercel.app/)**

![Light Theme Demo](public/assets/screenshots/homepage-light-theme.jpg)
![Dark Theme Demo](public/assets/screenshots/homepage-dark-theme.jpg)

## ✨ Key Features

### 🎮 **Core Functionality**
- **Game Discovery**: Browse extensive game collection with search and filters
- **Shopping Cart**: Add games to cart with real-time updates
- **User Authentication**: Secure login/registration system
- **Responsive Design**: Works perfectly on all devices
- **Theme Toggle**: Switch between light and dark modes

### 🛒 **Shopping Experience**
- **Advanced Search**: Real-time search with genre, platform, and price filters
- **Game Catalog**: Browse games from RAWG API with infinite scrolling
- **Deals Section**: Special offers from CheapShark API organized by store
- **Wishlist**: Save favorite games for later
- **Cart Management**: Add/remove items, quantity control, sliding cart summary
- **Checkout Process**: Complete checkout with address and payment forms

### 👤 **User Management**
- **Profile System**: Complete user profiles with avatar upload
- **Address Book**: Manage multiple shipping addresses
- **Payment Methods**: Save and manage payment options
- **Order History**: Track all previous purchases
- **Favorites**: Personal collection of saved games

### 🎨 **User Interface**
- **Dark/Light Theme**: Persistent theme switching with smooth transitions
- **Mobile First**: Responsive design with mobile navigation menu
- **Game Media**: Screenshots and videos with lightbox gallery
- **Platform Icons**: Visual indicators for different gaming platforms
- **Live Search**: Real-time search suggestions
- **News Ticker**: Top header news section

### 🔧 **Technical Features**
- **Modern React**: Built with React 18 and functional components
- **State Management**: React Context API + Zustand for global state
- **HTTP Client**: Axios for API communication
- **Routing**: React Router for smooth navigation
- **Styling**: Tailwind CSS for modern, responsive design
- **API Integration**: 
  - **RAWG API** - For fetching comprehensive game data (used in Shop page)
  - **CheapShark API** - For fetching game deals and discounts (used in Deals page)

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zeyad-houssainy/alx-FE-graduation-project-gaming-store.git
   cd alx-FE-graduation-project-gaming-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Keys**
   
   **RAWG API Setup:**
   - Go to [RAWG API Documentation](https://rawg.io/apidocs)
   - Create an account and get your API key
   - Update your API configuration with the new key
   
   **API Configuration:**
   ```javascript
   // In your API config file
   Site/App URL: http://localhost:5000/games
   API Key: Your-API-Key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to view the application

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API, Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **APIs**: 
  - **RAWG API** - Game data and information
  - **CheapShark API** - Game deals and pricing
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier

## 🔌 API Integrations

### **RAWG API** 🎮
- **Purpose**: Fetch comprehensive game data including titles, descriptions, ratings, genres, and platforms
- **Implementation**: Used in the **Shop page** (`/games`) to display the main game catalog
- **Features**: Game search, filtering by genre/platform, detailed game information

### **CheapShark API** 💰
- **Purpose**: Fetch game deals, discounts, and pricing information from multiple retailers
- **Implementation**: Used in the **Deals page** (`/deals`) to showcase special offers and price drops
- **Features**: Deal tracking, price comparison, discount notifications

## ⚠️ Troubleshooting

### **Games Not Showing?**
If games are not displaying in your application, it might be due to an expired RAWG API access token. Here's how to fix it:

1. **Check API Key Status**
   - Visit [RAWG API Documentation](https://rawg.io/apidocs)
   - Sign in to your account or create a new one
   - Generate a new API key

2. **Update Configuration**
   - Replace your old API key with the new one in your project files:
     - **RAWG API**: Update in `src/services/rawgApi.js`
     - **CheapShark API**: Update in `src/services/cheapsharkApi.js`
   - Ensure your app URL is correctly set to `http://localhost:5000/games`
   - Restart your development server

3. **API Limits**
   - Free tier: 20,000 requests per month
   - Business tier: 50,000 requests per month
   - Enterprise tier: 1,000,000 requests per month

4. **Common Issues**
   - **Expired Token**: API keys can expire, requiring renewal
   - **Rate Limiting**: Exceeding monthly request limits
   - **Invalid URL**: Ensure your app URL matches exactly
   - **Network Issues**: Check your internet connection and firewall settings

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/          # Authentication components
│   ├── Header/        # Navigation components
│   ├── Footer/        # Footer component
│   └── Store/         # Store-related components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Main page components
├── services/           # API services
└── stores/             # State management stores
```

## 🎯 Features to Implement

### 🔴 **High Priority** ✅ **COMPLETED**
- [x] **Game Search & Filtering**: Advanced search with genre, platform, price filters
- [x] **Shopping Cart**: Add/remove games, quantity management
- [x] **User Authentication**: Login, registration, profile management
- [x] **Game Details**: Comprehensive game information pages
- [x] **Responsive Design**: Mobile-first approach
- [x] **API Integration**: 
  - **RAWG API** integration for game data (Shop page)
  - **CheapShark API** integration for deals (Deals page)

### 🟡 **Medium Priority** ✅ **COMPLETED**
- [x] **Wishlist**: Save games for later (Add to favorites feature implemented)
- [x] **Checkout Process**: Payment integration with form validation
- [x] **Order History**: Track previous purchases
- [x] **User Profile Management**: Complete profile with avatar upload
- [x] **Address Management**: Multiple addresses support
- [x] **Payment Methods**: Save and manage payment options
- [ ] **Game Reviews**: User ratings and comments
- [ ] **Admin Panel**: Manage games and users

### 🟢 **Low Priority** ✅ **PARTIALLY COMPLETED**
- [x] **Theme System**: Dark/light mode toggle with persistence
- [x] **Mobile Navigation**: Responsive mobile menu
- [x] **Game Media Gallery**: Screenshots and videos with lightbox
- [x] **Platform Icons**: Visual platform indicators
- [x] **Live Search**: Real-time search functionality
- [x] **Infinite Scrolling**: Load more games as you scroll
- [x] **Cart Summary**: Sliding cart sidebar
- [x] **News Section**: Top header news ticker
- [ ] **Social Features**: Share games, follow friends
- [ ] **Game Recommendations**: AI-powered suggestions
- [ ] **Multi-language Support**: Internationalization
- [ ] **Push Notifications**: Price alerts, new releases
- [ ] **Offline Support**: PWA capabilities

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier


## 📸 Screenshots

### Game Store Section
![Game Store](public/assets/screenshots/game-store-section.jpg)

### Game Details
![Game Details](public/assets/screenshots/game-details.jpg)

## 📞 Contact

- **Project Link**: [https://github.com/zeyad-houssainy/alx-FE-graduation-project-gaming-store](https://github.com/zeyad-houssainy/alx-FE-graduation-project-gaming-store)
- **Live Demo**: [https://alx-fe-graduation-project-gaming-st.vercel.app/](https://alx-fe-graduation-project-gaming-st.vercel.app/)

---

⭐ **Star this repository if you find it helpful!**