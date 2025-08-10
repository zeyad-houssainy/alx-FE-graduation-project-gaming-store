// Profile Management
class ProfileManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.userLibrary = JSON.parse(localStorage.getItem('userLibrary')) || [];
        this.userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        this.userWishlist = JSON.parse(localStorage.getItem('userWishlist')) || [];
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupProfileTabs();
        this.loadProfileData();
        this.setupEventListeners();
    }

    checkLoginStatus() {
        const isLoggedIn = this.currentUser !== null;
        const profileLink = document.querySelector('.profile-link');
        const logoutBtn = document.querySelector('.logout-btn');
        const loginLink = document.querySelector('.login-link');

        if (isLoggedIn) {
            if (profileLink) profileLink.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (loginLink) loginLink.classList.add('hidden');
        } else {
            // Redirect to login if not logged in and on profile page
            if (window.location.pathname.includes('profile.html')) {
                window.location.href = 'login.html';
            }
        }
    }

    setupProfileTabs() {
        const tabs = document.querySelectorAll('.profile-tab');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding pane
                tab.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    loadProfileData() {
        if (!this.currentUser) return;

        // Load personal info
        document.getElementById('profileName').textContent = this.currentUser.fullName;
        document.getElementById('profileEmail').textContent = this.currentUser.email;
        document.getElementById('memberSince').textContent = this.formatDate(this.currentUser.memberSince);
        document.getElementById('avatarText').textContent = this.currentUser.fullName.charAt(0).toUpperCase();

        // Load stats
        document.getElementById('gamesOwned').textContent = this.userLibrary.length;
        document.getElementById('totalSpent').textContent = `$${this.calculateTotalSpent()}`;
        document.getElementById('achievementCount').textContent = this.calculateAchievements();

        // Load form data
        if (this.currentUser.firstName) {
            document.getElementById('firstName').value = this.currentUser.firstName;
            document.getElementById('lastName').value = this.currentUser.lastName;
        }
        document.getElementById('email').value = this.currentUser.email;
        if (this.currentUser.phone) document.getElementById('phone').value = this.currentUser.phone;
        if (this.currentUser.dateOfBirth) document.getElementById('dateOfBirth').value = this.currentUser.dateOfBirth;
        if (this.currentUser.platform) document.getElementById('platform').value = this.currentUser.platform;

        // Load library, orders, and wishlist
        this.loadGameLibrary();
        this.loadOrderHistory();
        this.loadWishlist();
    }

    loadGameLibrary() {
        const libraryContainer = document.getElementById('gameLibrary');
        if (!libraryContainer) return;

        if (this.userLibrary.length === 0) {
            libraryContainer.innerHTML = `
                <div class="empty-state">
                    <div class="text-6xl mb-3">🎮</div>
                    <h3>No games in your library yet</h3>
                    <p class="text-gray-400">Purchase some games from our store to build your collection!</p>
                    <a href="store.html" class="btn btn-primary mt-4">Browse Store</a>
                </div>
            `;
            return;
        }

        libraryContainer.innerHTML = this.userLibrary.map(game => `
            <div class="library-item">
                <img src="${game.image}" alt="${game.title}" class="library-item-image">
                <div class="library-item-info">
                    <h4>${game.title}</h4>
                    <p class="library-item-platform">${game.platform}</p>
                    <p class="library-item-date">Purchased: ${this.formatDate(game.purchaseDate)}</p>
                </div>
                <div class="library-item-actions">
                    <button class="btn btn-primary btn-sm">Play</button>
                    <button class="btn btn-secondary btn-sm">Details</button>
                </div>
            </div>
        `).join('');
    }

    loadOrderHistory() {
        const orderContainer = document.getElementById('orderHistory');
        if (!orderContainer) return;

        if (this.userOrders.length === 0) {
            orderContainer.innerHTML = `
                <div class="empty-state">
                    <div class="text-6xl mb-3">📦</div>
                    <h3>No orders yet</h3>
                    <p class="text-gray-400">Your order history will appear here after your first purchase.</p>
                    <a href="store.html" class="btn btn-primary mt-4">Start Shopping</a>
                </div>
            `;
            return;
        }

        orderContainer.innerHTML = this.userOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <h4>Order #${order.id}</h4>
                    <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${this.formatDate(order.date)}</p>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Items:</strong> ${order.items.length} game(s)</p>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            <span>${item.title}</span>
                            <span>$${item.price}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    loadWishlist() {
        const wishlistContainer = document.getElementById('wishlistItems');
        if (!wishlistContainer) return;

        if (this.userWishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-state">
                    <div class="text-6xl mb-3">❤️</div>
                    <h3>Your wishlist is empty</h3>
                    <p class="text-gray-400">Add games to your wishlist to keep track of titles you want.</p>
                    <a href="store.html" class="btn btn-primary mt-4">Browse Games</a>
                </div>
            `;
            return;
        }

        wishlistContainer.innerHTML = this.userWishlist.map(game => `
            <div class="wishlist-item">
                <img src="${game.image}" alt="${game.title}" class="wishlist-item-image">
                <div class="wishlist-item-info">
                    <h4>${game.title}</h4>
                    <p class="wishlist-item-platform">${game.platform}</p>
                    <p class="wishlist-item-price">$${game.price}</p>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${game.id})">Add to Cart</button>
                    <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${game.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Personal info form
        const personalForm = document.getElementById('personalInfoForm');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => this.savePersonalInfo(e));
        }

        // Change password form
        const passwordForm = document.getElementById('changePasswordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.changePassword(e));
        }

        // Library filters
        const libraryFilter = document.getElementById('libraryFilter');
        const librarySearch = document.getElementById('librarySearch');
        
        if (libraryFilter) {
            libraryFilter.addEventListener('change', () => this.filterLibrary());
        }
        
        if (librarySearch) {
            librarySearch.addEventListener('input', () => this.filterLibrary());
        }
    }

    savePersonalInfo(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            platform: document.getElementById('platform').value
        };

        // Update current user data
        this.currentUser = {
            ...this.currentUser,
            ...formData,
            fullName: `${formData.firstName} ${formData.lastName}`
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Update profile display
        document.getElementById('profileName').textContent = this.currentUser.fullName;
        document.getElementById('avatarText').textContent = this.currentUser.fullName.charAt(0).toUpperCase();

        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
    }

    changePassword(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match!', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long!', 'error');
            return;
        }

        // In a real app, you would verify the current password
        // For demo purposes, we'll just update it
        this.currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Clear form and close modal
        document.getElementById('changePasswordForm').reset();
        closeModal('changePasswordModal');
        
        this.showNotification('Password changed successfully!', 'success');
    }

    filterLibrary() {
        const filter = document.getElementById('libraryFilter').value;
        const search = document.getElementById('librarySearch').value.toLowerCase();
        
        let filteredLibrary = [...this.userLibrary];

        // Apply platform filter
        if (filter !== 'all') {
            filteredLibrary = filteredLibrary.filter(game => 
                game.platform.toLowerCase().includes(filter.toLowerCase())
            );
        }

        // Apply search filter
        if (search) {
            filteredLibrary = filteredLibrary.filter(game =>
                game.title.toLowerCase().includes(search)
            );
        }

        // Update display
        const libraryContainer = document.getElementById('gameLibrary');
        if (filteredLibrary.length === 0) {
            libraryContainer.innerHTML = `
                <div class="empty-state">
                    <div class="text-6xl mb-3">🔍</div>
                    <h3>No games found</h3>
                    <p class="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
            `;
        } else {
            libraryContainer.innerHTML = filteredLibrary.map(game => `
                <div class="library-item">
                    <img src="${game.image}" alt="${game.title}" class="library-item-image">
                    <div class="library-item-info">
                        <h4>${game.title}</h4>
                        <p class="library-item-platform">${game.platform}</p>
                        <p class="library-item-date">Purchased: ${this.formatDate(game.purchaseDate)}</p>
                    </div>
                    <div class="library-item-actions">
                        <button class="btn btn-primary btn-sm">Play</button>
                        <button class="btn btn-secondary btn-sm">Details</button>
                    </div>
                </div>
            `).join('');
        }
    }

    calculateTotalSpent() {
        return this.userOrders.reduce((total, order) => total + parseFloat(order.total), 0).toFixed(2);
    }

    calculateAchievements() {
        // Mock achievement calculation based on games owned and spending
        return Math.floor(this.userLibrary.length * 7.5 + parseFloat(this.calculateTotalSpent()) / 10);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    showNotification(message, type = 'info') {
        // Reuse the cart notification system
        if (window.cart && window.cart.showNotification) {
            window.cart.showNotification(message);
        } else {
            alert(message);
        }
    }
}

// Authentication functions
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userLibrary');
    localStorage.removeItem('userOrders');
    localStorage.removeItem('userWishlist');
    
    // Show notification
    if (window.cart && window.cart.showNotification) {
        window.cart.showNotification('Logged out successfully!');
    }
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

function removeFromWishlist(gameId) {
    if (window.profileManager) {
        window.profileManager.userWishlist = window.profileManager.userWishlist.filter(game => game.id !== gameId);
        localStorage.setItem('userWishlist', JSON.stringify(window.profileManager.userWishlist));
        window.profileManager.loadWishlist();
        window.profileManager.showNotification('Removed from wishlist');
    }
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            // Clear all user data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userLibrary');
            localStorage.removeItem('userOrders');
            localStorage.removeItem('userWishlist');
            localStorage.removeItem('cart');
            
            alert('Account deleted successfully.');
            window.location.href = '../index.html';
        }
    }
}

// Initialize profile manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Initialize some demo data if user is logged in but has no data
function initializeDemoData() {
    if (!localStorage.getItem('currentUser')) {
        // Create demo user for testing
        const demoUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            dateOfBirth: '1990-05-15',
            platform: 'playstation',
            memberSince: '2024-01-15',
            password: 'demo123'
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
    }

    if (!localStorage.getItem('userLibrary')) {
        const demoLibrary = [
            {
                id: 1,
                title: 'Cyberpunk 2077',
                platform: 'PlayStation 5',
                image: 'https://via.placeholder.com/200x250?text=Cyberpunk+2077',
                purchaseDate: '2024-01-20'
            },
            {
                id: 2,
                title: 'Spider-Man: Miles Morales',
                platform: 'PlayStation 5',
                image: 'https://via.placeholder.com/200x250?text=Spider-Man',
                purchaseDate: '2024-02-15'
            }
        ];
        localStorage.setItem('userLibrary', JSON.stringify(demoLibrary));
    }

    if (!localStorage.getItem('userOrders')) {
        const demoOrders = [
            {
                id: 'ORD-001',
                date: '2024-02-15',
                total: '129.98',
                status: 'Completed',
                items: [
                    { title: 'Cyberpunk 2077', price: '59.99' },
                    { title: 'Spider-Man: Miles Morales', price: '69.99' }
                ]
            }
        ];
        localStorage.setItem('userOrders', JSON.stringify(demoOrders));
    }

    if (!localStorage.getItem('userWishlist')) {
        const demoWishlist = [
            {
                id: 3,
                title: 'The Last of Us Part II',
                platform: 'PlayStation 5',
                price: '39.99',
                image: 'https://via.placeholder.com/200x250?text=TLOU2'
            }
        ];
        localStorage.setItem('userWishlist', JSON.stringify(demoWishlist));
    }
}

// Call this for demo purposes
// initializeDemoData();
