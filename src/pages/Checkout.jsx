import React, { useState, useEffect } from 'react';
import { useCartStore, useAuthStore } from '../stores';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaCheckCircle, FaPlus, FaEdit } from 'react-icons/fa';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getCartTotal } = useCartStore();
  const { addOrder, isLoggedIn, user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+20',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Saved addresses and payment methods
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle selecting saved address
  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setFormData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address1,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country
    }));
    setShowAddressForm(false);
  };

  // Handle selecting saved payment method
  const handleSelectPayment = (payment) => {
    setSelectedPaymentId(payment.id);
    setFormData(prev => ({
      ...prev,
      cardNumber: payment.cardNumber,
      cardName: payment.cardholderName,
      expiryDate: `${payment.expiryMonth}/${payment.expiryYear.slice(-2)}`,
      cvv: payment.cvv
    }));
    setShowPaymentForm(false);
  };

  // Get saved addresses and payment methods from auth store
  const getSavedAddresses = () => {
    return useAuthStore.getState().getAddresses ? useAuthStore.getState().getAddresses() : [];
  };

  const getSavedPaymentMethods = () => {
    return useAuthStore.getState().getPaymentMethods ? useAuthStore.getState().getPaymentMethods() : [];
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country', 'cardNumber', 'cardName', 'expiryDate', 'cvv'];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // NO PHONE VALIDATION - removed the strict phone validation

    // Card validation
    if (formData.cardNumber && !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number (XXXX XXXX XXXX XXXX)';
    }

    if (formData.cardName && !formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (formData.expiryDate && !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    }

    if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setErrors({ submit: 'Please log in to complete your purchase. Your order will be saved to your profile.' });
      return;
    }
    
    // Check if cart has items before proceeding
    if (items.length === 0) {
      setErrors({ submit: 'Your cart is empty! Please add some games before checkout.' });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order object
      const subtotal = getCartTotal();
      const shipping = 0; // Free shipping
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + shipping + tax;

      const newOrder = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        paymentDetails: {
          cardType: 'Credit Card',
          cardNumber: formData.cardNumber.slice(-4),
          expiryDate: formData.expiryDate,
          cardHolder: formData.cardName
        }
      };

      // Save order
      addOrder(newOrder);
      
      // Clear cart
      clearCart();
      
      // Navigate to success page
      navigate('/checkout/success');
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  useEffect(() => {
    // Only redirect if we're already on the page and cart becomes empty
    // Don't redirect immediately on page load
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 sm:pt-24">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
            CHECKOUT
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Complete your purchase and get ready to game!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
            {/* Login Status Indicator */}
            {!isLoggedIn ? (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Login Required</span>
                </div>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1 text-sm">
                  Please log in to complete your purchase. Your order will be saved to your profile for future reference.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Logged In</span>
                </div>
                <p className="text-green-700 dark:text-green-300 mt-1 text-sm">
                  Welcome back, {user?.name}! Your order will be saved to your profile.
                </p>
                {(getSavedAddresses().length > 0 || getSavedPaymentMethods().length > 0) && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                    <p className="text-green-600 dark:text-green-300 text-xs">
                      💡 <strong>Pro tip:</strong> Use your saved addresses and payment methods below for faster checkout!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                        errors.firstName 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                        errors.lastName 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                      errors.email 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-200 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number Field with Country Code Dropdown */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm sm:text-base"
                    >
                      <option value="+20">🇪🇬 Egypt +20</option>
                      <option value="+1">🇺🇸 United States +1</option>
                      <option value="+44">🇬🇧 United Kingdom +44</option>
                      <option value="+33">🇫🇷 France +33</option>
                      <option value="+49">🇩🇪 Germany +49</option>
                      <option value="+81">🇯🇵 Japan +81</option>
                      <option value="+86">🇨🇳 China +86</option>
                      <option value="+91">🇮🇳 India +91</option>
                      <option value="+61">🇦🇺 Australia +61</option>
                      <option value="+55">🇧🇷 Brazil +55</option>
                      <option value="+7">🇷🇺 Russia +7</option>
                      <option value="+52">🇲🇽 Mexico +52</option>
                      <option value="+39">🇮🇹 Italy +39</option>
                      <option value="+34">🇪🇸 Spain +34</option>
                      <option value="+31">🇳🇱 Netherlands +31</option>
                      <option value="+46">🇸🇪 Sweden +46</option>
                      <option value="+47">🇳🇴 Norway +47</option>
                      <option value="+45">🇩🇰 Denmark +45</option>
                      <option value="+358">🇫🇮 Finland +358</option>
                      <option value="+41">🇨🇭 Switzerland +41</option>
                      <option value="+43">🇦🇹 Austria +43</option>
                      <option value="+971">🇦🇪 UAE +971</option>
                      <option value="+966">🇸🇦 Saudi Arabia +966</option>
                      <option value="+974">🇶🇦 Qatar +974</option>
                      <option value="+965">🇰🇼 Kuwait +965</option>
                      <option value="+973">🇧🇭 Bahrain +973</option>
                      <option value="+968">🇴🇲 Oman +968</option>
                      <option value="+962">🇯🇴 Jordan +962</option>
                      <option value="+961">🇱🇧 Lebanon +961</option>
                      <option value="+963">🇸🇾 Syria +963</option>
                      <option value="+964">🇮🇶 Iraq +964</option>
                      <option value="+98">🇮🇷 Iran +98</option>
                      <option value="+90">🇹🇷 Turkey +90</option>
                      <option value="+27">🇿🇦 South Africa +27</option>
                      <option value="+234">🇳🇬 Nigeria +234</option>
                      <option value="+254">🇰🇪 Kenya +254</option>
                      <option value="+251">🇪🇹 Ethiopia +251</option>
                      <option value="+212">🇲🇦 Morocco +212</option>
                      <option value="+216">🇹🇳 Tunisia +216</option>
                      <option value="+213">🇩🇿 Algeria +213</option>
                    </select>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                        errors.phone 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="1000388906"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Saved Addresses */}
              {isLoggedIn && (
                <div className="mb-6">
                  {getSavedAddresses().length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Saved Addresses</h3>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(!showAddressForm)}
                          className="text-blue-600 dark:text-orange-400 hover:text-blue-700 dark:hover:text-orange-300 text-sm font-medium flex items-center gap-2"
                        >
                          {showAddressForm ? 'Hide Form' : 'Add New Address'}
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {getSavedAddresses().map((address, index) => (
                          <div
                            key={index}
                            onClick={() => handleSelectAddress(address)}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedAddressId === address.id
                                ? 'border-blue-500 dark:border-orange-400 bg-blue-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="text-sm">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {address.firstName} {address.lastName}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                {address.address1}
                                {address.address2 && <div>{address.address2}</div>}
                                <div>{address.city}, {address.state} {address.zip}</div>
                                <div>{address.country}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">No Saved Addresses</h3>
                          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                            Save addresses in your profile for faster checkout
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/profile')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Go to Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Selected Items Summary */}
              {(selectedAddressId || selectedPaymentId) && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Selected for Checkout:</h3>
                  <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                    {selectedAddressId && <div>📍 Using saved address</div>}
                    {selectedPaymentId && <div>💳 Using saved payment method</div>}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {isLoggedIn && getSavedAddresses().length > 0 ? 'Shipping Address (or select from saved above)' : 'Shipping Address'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                        errors.address 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                          errors.city 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-200 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                          errors.state 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-200 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="NY"
                      />
                      {errors.state && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                          errors.zip 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-200 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="12345"
                      />
                      {errors.zip && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.zip}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                          errors.country 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-200 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="United States"
                      />
                      {errors.country && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Payment Methods */}
              {isLoggedIn && (
                <div className="mb-6">
                  {getSavedPaymentMethods().length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Saved Payment Methods</h3>
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(!showPaymentForm)}
                          className="text-blue-600 dark:text-orange-400 hover:text-blue-700 dark:hover:text-orange-300 text-sm font-medium flex items-center gap-2"
                        >
                          {showPaymentForm ? 'Hide Form' : 'Add New Payment Method'}
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {getSavedPaymentMethods().map((payment, index) => (
                          <div
                            key={index}
                            onClick={() => handleSelectPayment(payment)}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedPaymentId === payment.id
                                ? 'border-blue-500 dark:border-orange-400 bg-blue-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="text-sm">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {payment.cardholderName}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                <div>•••• •••• •••• {payment.cardNumber.slice(-4)}</div>
                                <div>Expires {payment.expiryMonth}/{payment.expiryYear.slice(-2)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">No Saved Payment Methods</h3>
                          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                            Save payment methods in your profile for faster checkout
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/profile')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Go to Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Information */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {isLoggedIn && getSavedPaymentMethods().length > 0 ? 'Payment Information (or select from saved above)' : 'Payment Information'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setFormData(prev => ({ ...prev, cardNumber: formatted }));
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                        errors.cardNumber 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                        errors.cardName 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setFormData(prev => ({ ...prev, expiryDate: formatted }));
                        }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                          errors.expiryDate 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-200 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors text-sm sm:text-base ${
                          errors.cvv 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-200 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Summary */}
              {(selectedAddressId || selectedPaymentId) && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Checkout Summary:</h3>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    {selectedAddressId && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>Using saved address for shipping</span>
                      </div>
                    )}
                    {selectedPaymentId && (
                      <div className="flex items-center gap-2">
                        <span>💳</span>
                        <span>Using saved payment method</span>
                      </div>
                    )}
                    <div className="text-blue-600 dark:text-blue-400 mt-2">
                      Your checkout will be faster with these pre-saved details!
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !isLoggedIn}
                className="w-full bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {isProcessing ? 'Processing...' : !isLoggedIn ? 'Login Required' : 'Complete Purchase'}
              </button>

              {errors.submit && (
                <p className="text-red-500 dark:text-red-400 text-center">{errors.submit}</p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 h-fit">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Order Summary</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Your Cart is Empty
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 px-2">
                  Add some games to your cart to continue with checkout
                </p>
                <button
                  onClick={() => navigate('/games')}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Browse Games
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img 
                          src={item.background_image || item.image || '/assets/images/featured-game-1.jpg'} 
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 sm:space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <span>Shipping:</span>
                    <span className="text-green-600 dark:text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <span>Tax:</span>
                    <span>${(getCartTotal() * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-3">
                    <span>Total:</span>
                    <span>${(getCartTotal() * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base">Secure Checkout</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                  {isLoggedIn && (
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
                      ✓ Order will be saved to your profile
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
