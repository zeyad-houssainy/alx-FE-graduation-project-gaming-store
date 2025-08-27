import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import Deals from './pages/Deals';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import UnderConstruction from './pages/UnderConstruction';
import LogIn from './pages/LogIn/LogIn';
import SignUp from './pages/SignUp/SignUp';
import MyProfile from './pages/MyProfile/MyProfile';
import CheckoutSuccess from './pages/CheckoutSuccess';
import SlidingCartSummary from './components/SlidingCartSummary';
import SearchTest from './pages/SearchTest';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/live" element={<UnderConstruction />} />
        <Route path="/features" element={<UnderConstruction />} />
        <Route path="/blog" element={<UnderConstruction />} />
        <Route path="/contact" element={<UnderConstruction />} />
        <Route path="/search-test" element={<SearchTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SlidingCartSummary />
    </Router>
  );
}
