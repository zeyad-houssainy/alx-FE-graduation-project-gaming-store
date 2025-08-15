import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGameStore from '../store/gameStore';

const Header = () => {
  const location = useLocation();
  const { 
    isNavOpen, 
    toggleNav, 
    closeNav, 
    toggleSearch, 
    cartBadgeCount 
  } = useGameStore();

  // Close nav when route changes
  useEffect(() => {
    closeNav();
  }, [location.pathname, closeNav]);

  // Handle scroll to close nav
  useEffect(() => {
    const handleScroll = () => {
      if (isNavOpen) {
        closeNav();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNavOpen, closeNav]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeNav();
  };

  return (
    <header className="header m-0">
      {/* Header Top */}
      <div className="header-top">
        <div className="container">
          <div className="countdown-text">
            Exclusive Black Friday ! Offer <span className="span skewBg">10</span> Days
          </div>

          <div className="social-wrapper">
            <p className="social-title">Follow us on :</p>

            <ul className="social-list">
              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
              </li>
              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-twitter"></ion-icon>
                </a>
              </li>
              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-pinterest"></ion-icon>
                </a>
              </li>
              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-linkedin"></ion-icon>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Header Bottom */}
      <div className="header-bottom skewBg" data-header>
        <div className="container">
          <Link to="/" className="logo">Gamics</Link>

          <nav className={`navbar ${isNavOpen ? 'active' : ''}`} data-navbar>
            <ul className="navbar-list">
              <li className="navbar-item">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="navbar-link skewBg"
                >
                  Home
                </button>
              </li>
              <li className="navbar-item">
                <button 
                  onClick={() => scrollToSection('live')} 
                  className="navbar-link skewBg"
                >
                  Live
                </button>
              </li>
              <li className="navbar-item">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="navbar-link skewBg"
                >
                  Features
                </button>
              </li>
              <li className="navbar-item">
                <button 
                  onClick={() => scrollToSection('shop')} 
                  className="navbar-link skewBg"
                >
                  Shop
                </button>
              </li>
              <li className="navbar-item">
                <button 
                  onClick={() => scrollToSection('blog')} 
                  className="navbar-link skewBg"
                >
                  Blog
                </button>
              </li>
              <li className="navbar-item">
                <Link to="/contact" className="navbar-link skewBg">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="cart-btn" aria-label="cart">
              <ion-icon name="cart"></ion-icon>
              <span className="cart-badge">{cartBadgeCount}</span>
            </button>

            <button 
              className="search-btn" 
              aria-label="open search" 
              onClick={toggleSearch}
            >
              <ion-icon name="search-outline"></ion-icon>
            </button>

            <button 
              className="nav-toggle-btn" 
              aria-label="toggle menu" 
              onClick={toggleNav}
            >
              <ion-icon name="menu-outline" className="menu"></ion-icon>
              <ion-icon name="close-outline" className="close"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
