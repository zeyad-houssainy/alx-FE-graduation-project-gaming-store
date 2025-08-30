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

  // Fetch addresses and payment methods on component mount
  useEffect(() => {
    if (isLoggedIn && user) {
      // The getAddresses and getPaymentMethods functions are already available from the store
      // They will be called when rendering the respective tabs
    }
  }, [isLoggedIn, user]);

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
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 rounded-full text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 relative overflow-hidden shadow-2xl">
              {avatar && avatar !== 'null' && avatar !== 'undefined' && avatar.trim() !== '' && avatar.startsWith('data:image/') ? (
                <img 
                  src={avatar} 
                  alt={user?.name || 'User'} 
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">
              Manage your account, view orders, and explore your favorites
            </p>
            
            {/* Photo Upload */}
            <div className="flex items-center justify-center">
              <button 
                onClick={() => fileInputRef.current.click()}
                disabled={isUploadingPhoto}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-200 dark:border-gray-600"
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
          <div className="max-w-6xl mx-auto mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2">
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
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
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {renderTabIcon(tab.icon)}
                    <span className="hidden xs:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Personal Information
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm sm:text-base"
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm sm:text-base"
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm sm:text-base"
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed resize-none text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
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
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg text-sm sm:text-base"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      My Favorite Games
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {favorites.length} game{favorites.length !== 1 ? 's' : ''} in favorites
                    </div>
                  </div>

                  {favorites.length === 0 ? (
                    <div className="text-center py-8 sm:py-16">
                      <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-4 sm:mb-6 mx-auto" />
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                        No Favorite Games Yet
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2">
                        Start adding games to your favorites by browsing our collection
                      </p>
                      <button
                        onClick={() => navigate('/games')}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base md:text-lg shadow-lg"
                      >
                        Browse Games
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {favorites.map((game) => (
                        <div
                          key={game.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="relative mb-3 sm:mb-4">
                            <img
                              src={game.background_image || game.image || '/assets/images/featured-game-1.jpg'}
                              alt={game.name}
                              className="w-full h-32 sm:h-40 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeFromFavorites(game.id)}
                              className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg text-sm sm:text-base"
                              title="Remove from favorites"
                            >
                              ×
                            </button>
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                            {game.name}
                          </h3>
                          
                          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                            <span>Added {new Date(game.addedAt).toLocaleDateString()}</span>
                            {game.rating && (
                              <span className="flex items-center gap-1">
                                <img src="/assets/icons/star.svg" alt="Rating" className="w-3 h-3 sm:w-4 sm:h-4" />
                                {game.rating}/5
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => navigate(`/games/${game.id}`)}
                            className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 text-sm sm:text-base"
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
                <div className="text-center py-8 sm:py-16">
                  <img src="/assets/icons/box.svg" alt="Orders" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 mx-auto" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                    Orders Section
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
                    This section will show your order history
                  </p>
                </div>
              )}

              {activeTab === 'ranked-games' && (
                <div className="text-center py-8 sm:py-16">
                  <img src="/assets/icons/star.svg" alt="Rated Games" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 mx-auto" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                    Rated Games Section
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
                    This section will show your game ratings
                  </p>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="py-6 sm:py-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img src="/assets/icons/location.svg" alt="Addresses" className="w-8 h-8 sm:w-10 sm:h-10" />
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Saved Addresses
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 text-sm sm:text-base flex items-center gap-2"
                    >
                      <span className="text-lg font-bold">+</span>
                      Add Address
                    </button>
                  </div>

                  {/* Addresses List */}
                  <div className="space-y-4 sm:space-y-6">
                    {getAddresses().length > 0 ? (
                      getAddresses().map((address, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-2">
                                {address.firstName} {address.lastName}
                              </h4>
                              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1">
                                <p>{address.address1}</p>
                                {address.address2 && <p>{address.address2}</p>}
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.country}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit Address"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteAddress(index)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Address"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <img src="/assets/icons/location.svg" alt="No Addresses" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          No Saved Addresses
                        </h4>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-4 sm:mb-6">
                          Add your first address to make checkout faster
                        </p>
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200"
                        >
                          Add Your First Address
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add/Edit Address Form */}
                  {isAddingAddress && (
                    <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingAddress(false);
                            setEditingAddress(null);
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
                          }}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <form onSubmit={(e) => { e.preventDefault(); handleSaveAddress(); }} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={addressForm.firstName}
                              onChange={handleAddressChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={addressForm.lastName}
                              onChange={handleAddressChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            name="address1"
                            value={addressForm.address1}
                            onChange={handleAddressChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            name="address2"
                            value={addressForm.address2}
                            onChange={handleAddressChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={addressForm.state}
                              onChange={handleAddressChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="zip"
                              value={addressForm.zip}
                              onChange={handleAddressChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Country
                          </label>
                          <select
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        
                        <div className="flex justify-end gap-3 sm:gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingAddress(false);
                              setEditingAddress(null);
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
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200"
                          >
                            {editingAddress ? 'Update Address' : 'Save Address'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="py-6 sm:py-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img src="/assets/icons/payment-48-regular.svg" alt="Payment" className="w-8 h-8 sm:w-10 sm:h-10" />
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Payment Methods
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsAddingPayment(true)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 text-sm sm:text-base flex items-center gap-2"
                    >
                      <span className="text-lg font-bold">+</span>
                      Add Payment
                    </button>
                  </div>

                  {/* Payment Methods List */}
                  <div className="space-y-4 sm:space-y-6">
                    {getPaymentMethods().length > 0 ? (
                      getPaymentMethods().map((payment, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                                  {payment.cardholderName}
                                </h4>
                              </div>
                              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1">
                                <p>•••• •••• •••• {payment.cardNumber.slice(-4)}</p>
                                <p>Expires {payment.expiryMonth}/{payment.expiryYear}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEditPayment(payment)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit Payment Method"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deletePaymentMethod(index)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Payment Method"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <img src="/assets/icons/payment-48-regular.svg" alt="No Payment Methods" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          No Payment Methods
                        </h4>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-4 sm:mb-6">
                          Add your first payment method for faster checkout
                        </p>
                        <button
                          onClick={() => setIsAddingPayment(true)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200"
                        >
                          Add Your First Payment Method
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add/Edit Payment Method Form */}
                  {isAddingPayment && (
                    <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingPayment(false);
                            setEditingPayment(null);
                            setPaymentForm({
                              cardNumber: '',
                              cardholderName: '',
                              expiryMonth: '',
                              expiryYear: '',
                              cvv: ''
                            });
                          }}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <form onSubmit={(e) => { e.preventDefault(); handleSavePayment(); }} className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentForm.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardholderName"
                            value={paymentForm.cardholderName}
                            onChange={handlePaymentChange}
                            placeholder="John Doe"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Month
                            </label>
                            <select
                              name="expiryMonth"
                              value={paymentForm.expiryMonth}
                              onChange={handlePaymentChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            >
                              <option value="">Month</option>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={month.toString().padStart(2, '0')}>
                                  {month.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Year
                            </label>
                            <select
                              name="expiryYear"
                              value={paymentForm.expiryYear}
                              onChange={handlePaymentChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={paymentForm.cvv}
                              onChange={handlePaymentChange}
                              placeholder="123"
                              maxLength="4"
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 sm:gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingPayment(false);
                              setEditingPayment(null);
                              setPaymentForm({
                                cardNumber: '',
                                cardholderName: '',
                                expiryMonth: '',
                                expiryYear: '',
                                cvv: ''
                              });
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 hover:from-blue-600 hover:to-purple-700 dark:hover:from-orange-600 dark:hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200"
                          >
                            {editingPayment ? 'Update Payment Method' : 'Save Payment Method'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="text-center py-8 sm:py-16">
                  <img src="/assets/icons/security.svg" alt="Security" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 mx-auto" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                    Security Section
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
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
