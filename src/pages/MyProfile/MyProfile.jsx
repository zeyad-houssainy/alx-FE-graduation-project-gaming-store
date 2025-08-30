import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const navigate = useNavigate();
  const { 
    user, 
    isLoggedIn,
    logout, 
    orders, 
    clearMockData, 
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentMethods,
    avatar,
    updateAvatar,
    favorites,
    removeFromFavorites
  } = useAuthStore();
  
  // Function to render tab icons (emoji or SVG)
  const renderTabIcon = (iconType) => {
    switch (iconType) {
      case 'profile':
        return <img src="/assets/icons/profile.svg" alt="Profile" className="w-5 h-5" />;
      case 'favorite':
        return <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-5 h-5" />;
      case 'box':
        return <img src="/assets/icons/box.svg" alt="Orders" className="w-5 h-5" />;
      case 'star':
        return <img src="/assets/icons/star.svg" alt="Rated Games" className="w-5 h-5" />;
      case 'location':
        return <img src="/assets/icons/location.svg" alt="Addresses" className="w-5 h-5" />;
      case 'payment':
        return <img src="/assets/icons/payment-48-regular.svg" alt="Payment" className="w-5 h-5" />;
      case 'security':
        return <img src="/assets/icons/security.svg" alt="Security" className="w-5 h-5" />;
      default:
        return <span className="text-lg">{iconType}</span>;
    }
  };
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const fileInputRef = React.useRef(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  // Payment method form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, user, navigate]);

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address form changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment form changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setIsUploadingPhoto(true);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        updateAvatar(dataUrl);
        setIsUploadingPhoto(false);
        alert('Photo uploaded successfully!');
      };
      
      reader.onerror = () => {
        setIsUploadingPhoto(false);
        alert('Error uploading photo. Please try again.');
      };
      
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Save profile changes
  const handleSaveProfile = () => {
    console.log('Profile updated:', profileForm);
    setIsEditing(false);
  };

  // Change password
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    console.log('Password changed:', passwordForm);
    setIsChangingPassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Save address
  const handleSaveAddress = () => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addressForm);
      setEditingAddress(null);
    } else {
      addAddress(addressForm);
    }
    setAddressForm({
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    });
    setIsAddingAddress(false);
  };

  // Save payment method
  const handleSavePayment = () => {
    if (editingPayment) {
      updatePaymentMethod(editingPayment.id, paymentForm);
      setEditingPayment(null);
    } else {
      addPaymentMethod(paymentForm);
    }
    setPaymentForm({
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
    setIsAddingPayment(false);
  };

  // Edit address
  const handleEditAddress = (address) => {
    setAddressForm(address);
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  // Edit payment method
  const handleEditPayment = (payment) => {
    setPaymentForm(payment);
    setEditingPayment(payment);
    setIsAddingPayment(true);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-32 sm:pt-36">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Modern Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 rounded-full text-white text-4xl font-bold mb-6 relative overflow-hidden shadow-2xl">
              {avatar && avatar !== 'null' && avatar !== 'undefined' && avatar.trim() !== '' && avatar.startsWith('data:image/') ? (
                <img 
                  src={avatar} 
                  alt={user?.name || 'User'} 
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Manage your account, view orders, and explore your favorites
            </p>
            
            {/* Photo Upload */}
            <div className="flex items-center justify-center">
              <button 
                onClick={() => fileInputRef.current.click()}
                disabled={isUploadingPhoto}
                className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-200 dark:border-gray-600"
              >
                {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*"
                className="hidden" 
              />
            </div>
          </div>

          {/* Modern Tab Navigation */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2">
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'profile', label: 'Profile', icon: 'profile' },
                  { id: 'favorites', label: 'Favorites', icon: 'favorite' },
                  { id: 'orders', label: 'Orders', icon: 'box' },
                  { id: 'ranked-games', label: 'Rated Games', icon: 'star' },
                  { id: 'addresses', label: 'Addresses', icon: 'location' },
                  { id: 'payment', label: 'Payment', icon: 'payment' },
                  { id: 'security', label: 'Security', icon: 'security' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {renderTabIcon(tab.icon)}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Personal Information
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed resize-none"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setProfileForm({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            address: user?.address || ''
                          });
                        }}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      My Favorite Games
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {favorites.length} game{favorites.length !== 1 ? 's' : ''} in favorites
                    </div>
                  </div>

                  {favorites.length === 0 ? (
                    <div className="text-center py-16">
                      <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-32 h-32 mb-6 mx-auto" />
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        No Favorite Games Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        Start adding games to your favorites by browsing our collection
                      </p>
                      <button
                        onClick={() => navigate('/games')}
                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg"
                      >
                        Browse Games
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((game) => (
                        <div
                          key={game.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="relative mb-4">
                            <img
                              src={game.background_image || game.image || '/assets/images/featured-game-1.jpg'}
                              alt={game.name}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeFromFavorites(game.id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                              title="Remove from favorites"
                            >
                              ×
                            </button>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                            {game.name}
                          </h3>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span>Added {new Date(game.addedAt).toLocaleDateString()}</span>
                            {game.rating && (
                              <span className="flex items-center gap-1">
                                <img src="/assets/icons/star.svg" alt="Rating" className="w-4 h-4" />
                                {game.rating}/5
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => navigate(`/games/${game.id}`)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200"
                          >
                            View Game
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs will be implemented similarly */}
              {activeTab === 'orders' && (
                <div className="text-center py-16">
                  <img src="/assets/icons/box.svg" alt="Orders" className="w-24 h-24 mb-4 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Orders Section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section will show your order history
                  </p>
                </div>
              )}

              {activeTab === 'ranked-games' && (
                <div className="text-center py-16">
                  <img src="/assets/icons/star.svg" alt="Rated Games" className="w-24 h-24 mb-4 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Rated Games Section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section will show your game ratings
                  </p>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="text-center py-16">
                  <img src="/assets/icons/location.svg" alt="Addresses" className="w-24 h-24 mb-4 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Addresses Section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section will show your saved addresses
                  </p>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="text-center py-16">
                  <img src="/assets/icons/payment-48-regular.svg" alt="Payment" className="w-24 h-24 mb-4 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Payment Methods Section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section will show your payment methods
                  </p>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="text-center py-16">
                  <img src="/assets/icons/security.svg" alt="Security" className="w-24 h-24 mb-4 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Security Section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section will show security settings
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
