// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateThemeIcon();
    }

    createThemeToggle() {
        const themeButton = document.createElement('button');
        themeButton.className = 'theme-toggle';
        themeButton.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        themeButton.setAttribute('aria-label', 'Toggle theme');
        themeButton.addEventListener('click', () => this.toggleTheme());

        // Add to navigation menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const themeItem = document.createElement('li');
            themeItem.appendChild(themeButton);
            navMenu.insertBefore(themeItem, navMenu.children[navMenu.children.length - 2]);
        }

        // Create mobile navigation toggle
        this.createMobileNavToggle();
    }

    createMobileNavToggle() {
        const nav = document.querySelector('.nav');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!nav || !navMenu) return;

        // Create toggle button
        const navToggle = document.createElement('button');
        navToggle.className = 'nav-toggle';
        navToggle.innerHTML = '☰';
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Add toggle button to navigation
        nav.appendChild(navToggle);
        
        // Add event listeners
        navToggle.addEventListener('click', () => this.toggleMobileNav());
        
        // Close menu when clicking nav links on mobile
        const navLinks = navMenu.querySelectorAll('a, button');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileNav();
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileNav();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMobileNav();
            }
        });
    }

    toggleMobileNav() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileNav();
        } else {
            navMenu.classList.add('active');
            navToggle.innerHTML = '✕';
            navToggle.style.position = 'fixed';
            navToggle.style.top = '1rem';
            navToggle.style.right = '1rem';
            navToggle.style.zIndex = '1001';
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileNav() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.innerHTML = '☰';
            navToggle.style.position = '';
            navToggle.style.top = '';
            navToggle.style.right = '';
            navToggle.style.zIndex = '';
        }
        document.body.style.overflow = '';
    }

    updateThemeIcon() {
        const themeButton = document.querySelector('.theme-toggle');
        if (themeButton) {
            themeButton.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Chat Widget Management
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <button class="chat-toggle" aria-label="Open chat">
                💬
            </button>
            <div class="chat-window">
                <div class="chat-header">
                    <h3>💬 Live Support</h3>
                    <button class="chat-close" aria-label="Close chat">×</button>
                </div>
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input-container">
                    <form class="chat-input-form" id="chatForm">
                        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." required>
                        <button type="submit" class="chat-send">Send</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(chatWidget);
    }

    setupEventListeners() {
        const chatToggle = document.querySelector('.chat-toggle');
        const chatClose = document.querySelector('.chat-close');
        const chatForm = document.getElementById('chatForm');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            const chatWidget = document.querySelector('.chat-widget');
            if (this.isOpen && !chatWidget.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        const chatToggle = document.querySelector('.chat-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatToggle.innerHTML = '×';
            document.getElementById('chatInput').focus();
        } else {
            chatWindow.classList.remove('open');
            chatToggle.innerHTML = '💬';
        }
    }

    closeChat() {
        this.isOpen = false;
        document.querySelector('.chat-window').classList.remove('open');
        document.querySelector('.chat-toggle').innerHTML = '💬';
    }

    addWelcomeMessage() {
        this.addMessage('Hi! 👋 Welcome to NexusGames! How can I help you today?', 'bot');
    }

    addMessage(message, sender = 'user') {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        this.messages.push({ message, sender, timestamp: new Date() });
    }

    showTyping() {
        const chatMessages = document.getElementById('chatMessages');
        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message bot typing-indicator';
        typingElement.id = 'typingIndicator';
        
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    Support is typing
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Simulate response delay
        setTimeout(() => {
            this.hideTyping();
            this.generateResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';

        if (message.includes('price') || message.includes('cost')) {
            response = 'Our games are competitively priced! You can find current pricing on each game\'s detail page. We also have special offers in our Offers section! 💰';
        } else if (message.includes('return') || message.includes('refund')) {
            response = 'We have a 14-day return policy for digital games. You can find more details in our Return Policy page. Would you like me to help you with a specific return? 🔄';
        } else if (message.includes('shipping') || message.includes('delivery')) {
            response = 'All our games are digital downloads, so no shipping required! Your games will be available immediately after purchase in your account library. 📱';
        } else if (message.includes('account') || message.includes('login')) {
            response = 'Having trouble with your account? You can reset your password on the login page, or I can help you troubleshoot login issues. What specific problem are you experiencing? 👤';
        } else if (message.includes('payment') || message.includes('pay')) {
            response = 'We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted and secure! 💳';
        } else if (message.includes('console') || message.includes('xbox') || message.includes('playstation')) {
            response = 'We have games for Xbox Series X|S, Xbox One, PlayStation 5, and PlayStation 4! Each game page shows compatible platforms. Which console are you interested in? 🎮';
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            response = 'Hello! Great to see you here! I\'m here to help with any questions about our games, orders, or account issues. What can I assist you with today? 😊';
        } else if (message.includes('thank') || message.includes('thanks')) {
            response = 'You\'re very welcome! Is there anything else I can help you with today? I\'m here whenever you need assistance! 🙂';
        } else {
            const responses = [
                'I\'d be happy to help! Could you provide more details about what you\'re looking for? 🤔',
                'That\'s a great question! Let me connect you with our support team for the best assistance. Meanwhile, you can check our FAQ section. 📚',
                'For specific inquiries like this, I recommend contacting our support team at support@nexusgames.com. They\'ll give you the most accurate information! 📧',
                'I want to make sure I give you the right information. Could you rephrase your question or be more specific? 💭'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }

        this.addMessage(response, 'bot');
    }
}

// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveToStorage();
        this.updateCartDisplay();
        this.showNotification(`${product.title} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToStorage();
            this.updateCartDisplay();
        }
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 1001;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Sample products data
const products = [
    {
        id: 1,
        title: "Cyberpunk 2077",
        price: 59.99,
        originalPrice: 79.99,
        image: "https://placehold.co/400x250/334155/f8fafc?text=Cyberpunk+2077",
        category: "RPG",
        platform: "PC, Xbox, PlayStation",
        rating: 4.2,
        description: "An open-world, action-adventure story set in Night City."
    },
    {
        id: 2,
        title: "The Witcher 3",
        price: 39.99,
        originalPrice: 59.99,
        image: "https://placehold.co/400x250/334155/f8fafc?text=The+Witcher+3",
        category: "RPG",
        platform: "PC, Xbox, PlayStation",
        rating: 4.9,
        description: "A story-driven open world RPG set in a visually stunning fantasy universe."
    },
    {
        id: 3,
        title: "Call of Duty: MW3",
        price: 69.99,
        image: "https://placehold.co/400x250/334155/f8fafc?text=COD+MW3",
        category: "FPS",
        platform: "PC, Xbox, PlayStation",
        rating: 4.1,
        description: "The ultimate multiplayer and zombie experience."
    },
    {
        id: 4,
        title: "Spider-Man: Miles Morales",
        price: 49.99,
        image: "https://placehold.co/400x250/334155/f8fafc?text=Spider-Man",
        category: "Action",
        platform: "PlayStation, PC",
        rating: 4.7,
        description: "Experience the rise of Miles Morales as he masters new powers."
    },
    {
        id: 5,
        title: "FIFA 24",
        price: 69.99,
        image: "https://placehold.co/400x250/334155/f8fafc?text=FIFA+24",
        category: "Sports",
        platform: "PC, Xbox, PlayStation",
        rating: 4.0,
        description: "The world's game like you've never experienced."
    },
    {
        id: 6,
        title: "Elden Ring",
        price: 59.99,
        image: "https://placehold.co/400x250/334155/f8fafc?text=Elden+Ring",
        category: "RPG",
        platform: "PC, Xbox, PlayStation",
        rating: 4.8,
        description: "A fantasy action-RPG adventure set within a world full of mystery."
    }
];

// Utility Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function generateStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(`<span class="star ${i <= rating ? '' : 'empty'}">★</span>`);
    }
    return stars.join('');
}

function createProductCard(product) {
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="card">
            ${discountPercentage > 0 ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
            <img src="${product.image}" alt="${product.title}">
            <div class="card-content">
                <h3 class="card-title">${product.title}</h3>
                <div class="rating">${generateStars(Math.floor(product.rating))}</div>
                <p class="card-text">${product.category} • ${product.platform}</p>
                <p class="card-text">${product.description}</p>
                <div class="card-footer">
                    <div>
                        <span class="price">${formatPrice(product.price)}</span>
                        ${product.originalPrice ? `<span style="text-decoration: line-through; color: #6b7280; margin-left: 0.5rem;">${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
    }
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateRequired(value) {
    return value.trim().length > 0;
}

// Search functionality
function searchProducts(query) {
    return products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.platform.toLowerCase().includes(query.toLowerCase())
    );
}

// Filter functionality
function filterProducts(category, platform, priceRange) {
    return products.filter(product => {
        const categoryMatch = !category || product.category.toLowerCase() === category.toLowerCase();
        const platformMatch = !platform || product.platform.toLowerCase().includes(platform.toLowerCase());
        const priceMatch = !priceRange || (product.price >= priceRange.min && product.price <= priceRange.max);
        return categoryMatch && platformMatch && priceMatch;
    });
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Initialize modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Initialize close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Initialize forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission based on form type
            const formData = new FormData(this);
            console.log('Form submitted:', Object.fromEntries(formData));
            // You can add specific form handling here
        });
    });

    // Initialize quantity controls
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-increase')) {
            const input = e.target.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            const productId = parseInt(e.target.dataset.productId);
            cart.updateQuantity(productId, parseInt(input.value));
        }
        
        if (e.target.classList.contains('qty-decrease')) {
            const input = e.target.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                const productId = parseInt(e.target.dataset.productId);
                cart.updateQuantity(productId, parseInt(input.value));
            }
        }
    });

    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            const results = searchProducts(query);
            displaySearchResults(results);
        });
    }
});

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No products found.</p>';
        } else {
            resultsContainer.innerHTML = results.map(product => createProductCard(product)).join('');
        }
    }
}

// Smooth scroll for anchor links
function smoothScroll(target) {
    document.getElementById(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Newsletter subscription
function subscribeNewsletter(email) {
    if (validateEmail(email)) {
        // Simulate API call
        console.log('Newsletter subscription:', email);
        cart.showNotification('Successfully subscribed to newsletter!');
        return true;
    } else {
        cart.showNotification('Please enter a valid email address.');
        return false;
    }
}

// Export functions for global use
window.cart = cart;
window.addToCart = addToCart;
window.openModal = openModal;
window.closeModal = closeModal;
window.products = products;
window.smoothScroll = smoothScroll;
window.subscribeNewsletter = subscribeNewsletter;

// Initialize theme manager and chat widget
const themeManager = new ThemeManager();
const chatWidget = new ChatWidget();

// Initialize authentication state
updateAuthState();

// Make them globally accessible
window.themeManager = themeManager;
window.chatWidget = chatWidget;

// Authentication state management
function updateAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = currentUser !== null;
    
    const profileLink = document.querySelector('.profile-link');
    const logoutBtn = document.querySelector('.logout-btn');
    const loginLink = document.querySelector('.login-link');

    if (isLoggedIn) {
        if (profileLink) profileLink.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (loginLink) loginLink.classList.add('hidden');
    } else {
        if (profileLink) profileLink.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (loginLink) loginLink.classList.remove('hidden');
    }
}

// Global logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userLibrary');
    localStorage.removeItem('userOrders');
    localStorage.removeItem('userWishlist');
    
    // Show notification
    if (window.cart && window.cart.showNotification) {
        window.cart.showNotification('Logged out successfully!');
    }
    
    // Update auth state
    updateAuthState();
    
    // Redirect to home page if on profile page
    if (window.location.pathname.includes('profile.html')) {
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Listen for login events
window.addEventListener('userLoggedIn', updateAuthState);
window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
        updateAuthState();
    }
});
