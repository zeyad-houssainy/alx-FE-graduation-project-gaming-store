import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm({ onComplete, savedAddresses, onUseSavedAddress }) {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    countryCode: '+1', // Added for phone number
    phone: '' // Added for phone number
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if form is complete and call onComplete
  React.useEffect(() => {
    const isComplete = formData.firstName && formData.lastName && 
                     formData.address1 && formData.city && 
                     formData.state && formData.zip && formData.country &&
                     formData.phone;
    
    if (isComplete && onComplete) {
      onComplete(formData);
    }
  }, [formData, onComplete]);

  return (
    <Grid container spacing={3}>
      {/* Saved Addresses Section */}
      {savedAddresses && savedAddresses.length > 0 && (
        <FormGrid size={{ xs: 12 }}>
          <FormLabel>Use Saved Address</FormLabel>
          <div className="space-y-2">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onUseSavedAddress(address)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {address.firstName} {address.lastName}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {address.address1}<br />
                      {address.address2 && `${address.address2}<br />`}
                      {address.city}, {address.state} {address.zip}<br />
                      {address.country}
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white text-sm rounded transition-colors"
                  >
                    Use This Address
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Or fill out the form below to enter a new address
            </p>
          </div>
        </FormGrid>
      )}

      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="firstName" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="firstName"
          name="firstName"
          type="text"
          placeholder="John"
          autoComplete="given-name"
          required
          size="small"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="lastName" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Snow"
          autoComplete="family-name"
          required
          size="small"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="address1" required>
          Address line 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          type="text"
          placeholder="Street name and number"
          autoComplete="shipping address-line1"
          required
          size="small"
          value={formData.address1}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="address2"
          type="text"
          placeholder="Apartment, suite, unit, etc. (optional)"
          autoComplete="shipping address-line2"
          size="small"
          value={formData.address2}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          type="text"
          placeholder="New York"
          autoComplete="address-level2"
          required
          size="small"
          value={formData.city}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <OutlinedInput
          id="state"
          name="state"
          type="text"
          placeholder="NY"
          autoComplete="address-level1"
          required
          size="small"
          value={formData.state}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          type="text"
          placeholder="12345"
          autoComplete="postal-code"
          required
          size="small"
          value={formData.zip}
          onChange={handleInputChange}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          type="text"
          placeholder="United States"
          autoComplete="country"
          required
          size="small"
          value={formData.country}
          onChange={handleInputChange}
        />
      </FormGrid>
      
      {/* Phone Number Field */}
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="phone" required>
          Phone Number
        </FormLabel>
        <div className="flex gap-2">
          <select
            name="countryCode"
            value={formData.countryCode || '+20'}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
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
            id="phone"
            name="phone"
            type="text"
            placeholder="1000388906"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          />
        </div>
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
    </Grid>
  );
}
