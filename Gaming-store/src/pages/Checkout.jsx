import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { addOrder, isLoggedIn, user } = useAuth();
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-['Oxanium'] mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
            CHECKOUT
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Complete your purchase and get ready to game!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
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
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
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
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
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
                      className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
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
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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

              {/* Payment Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Information</h2>
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
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 transition-colors ${
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !isLoggedIn}
                className="w-full bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? 'Processing...' : !isLoggedIn ? 'Login Required' : 'Complete Purchase'}
              </button>

              {errors.submit && (
                <p className="text-red-500 dark:text-red-400 text-center">{errors.submit}</p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Your Cart is Empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add some games to your cart to continue with checkout
                </p>
                <button
                  onClick={() => navigate('/games')}
                  className="px-6 py-3 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Browse Games
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.imageUrl || '/assets/images/featured-game-1.jpg'} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping:</span>
                    <span className="text-green-600 dark:text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax:</span>
                    <span>${(getCartTotal() * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span>Total:</span>
                    <span>${(getCartTotal() * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Secure Checkout</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                  {isLoggedIn && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
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
