import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function PaymentForm({ onComplete }) {
  const [paymentType, setPaymentType] = React.useState('creditCard');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [bankName, setBankName] = React.useState('');
  const [bankAccount, setBankAccount] = React.useState('');
  const [routingNumber, setRoutingNumber] = React.useState('');
  const [accountHolder, setAccountHolder] = React.useState('');

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    const value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formattedCardNumber = value.match(/.{1,4}/g)?.join(' ');
    if (value.length <= 16) {
      setCardNumber(formattedCardNumber || '');
    }
  };

  const handleCvvChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleExpirationDateChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length >= 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpirationDate(formattedValue);
  };

  // Check if form is complete and call onComplete
  React.useEffect(() => {
    let isComplete = false;
    
    if (paymentType === 'creditCard') {
      isComplete = cardNumber && cvv && expirationDate && cardName;
    } else if (paymentType === 'bankTransfer') {
      isComplete = bankName && bankAccount && routingNumber && accountHolder;
    }
    
    if (isComplete && onComplete) {
      const paymentData = {
        type: paymentType,
        ...(paymentType === 'creditCard' ? {
          cardType: 'Credit Card',
          cardNumber: cardNumber,
          expiryDate: expirationDate,
          cardHolder: cardName
        } : {
          cardType: 'Bank Transfer',
          cardNumber: `****${bankAccount.slice(-4)}`,
          expiryDate: 'N/A',
          cardHolder: accountHolder
        })
      };
      onComplete(paymentData);
    }
  }, [paymentType, cardNumber, cvv, expirationDate, cardName, bankName, bankAccount, routingNumber, accountHolder, onComplete]);

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            flexDirection: { sm: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Card
            raised={paymentType === 'creditCard'}
            sx={{
              maxWidth: { sm: '100%', md: '50%' },
              flexGrow: 1,
              outline: '1px solid',
              outlineColor:
                paymentType === 'creditCard' ? 'primary.main' : 'divider',
              backgroundColor:
                paymentType === 'creditCard' ? 'primary.50' : '',
            }}
          >
            <CardActionArea onClick={() => setPaymentType('creditCard')}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Credit card
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            raised={paymentType === 'bankTransfer'}
            sx={{
              maxWidth: { sm: '100%', md: '50%' },
              flexGrow: 1,
              outline: '1px solid',
              outlineColor:
                paymentType === 'bankTransfer' ? 'primary.main' : 'divider',
              backgroundColor:
                paymentType === 'bankTransfer' ? 'primary.50' : '',
            }}
          >
            <CardActionArea onClick={() => setPaymentType('bankTransfer')}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Bank account
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>
      {paymentType === 'creditCard' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <FormControl sx={{ width: '65%' }}>
              <FormLabel htmlFor="card-number" required>
                Card number
              </FormLabel>
              <OutlinedInput
                id="card-number"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                size="small"
              />
            </FormControl>
            <FormControl sx={{ width: '35%' }}>
              <FormLabel htmlFor="cvv" required>
                CVV
              </FormLabel>
              <OutlinedInput
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                required
                size="small"
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <FormControl sx={{ width: '50%' }}>
              <FormLabel htmlFor="card-name" required>
                Cardholder name
              </FormLabel>
              <OutlinedInput
                id="card-name"
                placeholder="John Smith"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                size="small"
              />
            </FormControl>
            <FormControl sx={{ width: '50%' }}>
              <FormLabel htmlFor="card-expiration" required>
                Expiration date
              </FormLabel>
              <OutlinedInput
                id="card-expiration"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={handleExpirationDateChange}
                required
                size="small"
              />
            </FormControl>
          </Box>
          <FormControlLabel
            control={<Checkbox name="saveCard" />}
            label="Remember credit card details for next time"
          />
        </Box>
      )}

      {paymentType === 'bankTransfer' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning" icon={false}>
            Your order will be processed once we receive the funds.
          </Alert>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <FormControl sx={{ width: '50%' }}>
              <FormLabel htmlFor="bank-name" required>
                Bank name
              </FormLabel>
              <OutlinedInput
                id="bank-name"
                placeholder="Industrial Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                size="small"
              />
            </FormControl>
            <FormControl sx={{ width: '50%' }}>
              <FormLabel htmlFor="bank-account" required>
                Bank account number
              </FormLabel>
              <OutlinedInput
                id="bank-account"
                placeholder="987654321"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
                size="small"
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <FormControl sx={{ width: '50%' }}>
              <FormLabel htmlFor="routing-number" required>
                Routing number
              </FormLabel>
              <OutlinedInput
                id="routing-number"
                placeholder="123456789"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                required
                size="small"
              />
            </FormControl>
            <FormControl sx={{ width: '50%' }}>
              <FormLabel htmlFor="account-holder" required>
                Account holder name
              </FormLabel>
              <OutlinedInput
                id="account-holder"
                placeholder="John Smith"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
                size="small"
              />
            </FormControl>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
