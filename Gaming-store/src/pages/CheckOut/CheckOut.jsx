import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import Info from './Info';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

// Gaming-themed colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
    },
    background: {
      default: '#f8fafc', // gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // gray-900
      secondary: '#4b5563', // gray-600
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function getStepContent(step, orderData) {
  switch (step) {
    case 0:
      return <AddressForm onComplete={(data) => orderData.updateOrderData(0, data)} />;
    case 1:
      return <PaymentForm onComplete={(data) => orderData.updateOrderData(1, data)} />;
    case 2:
      return <Review shippingAddress={orderData.shippingAddress} paymentDetails={orderData.paymentDetails} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function CheckOut() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [orderData, setOrderData] = React.useState({
    shippingAddress: null,
    paymentDetails: null
  });
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { addOrder } = useAuth();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;

    // Create order object
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
      shippingAddress: orderData.shippingAddress,
      paymentDetails: orderData.paymentDetails
    };

    // Save order
    addOrder(newOrder);
    
    // Clear cart
    clearCart();
    
    // Navigate to success page (which will auto-redirect to home after 4 seconds)
    navigate('/checkout/success');
  };

  // Update order data when forms are completed
  const updateOrderData = (step, data) => {
    setOrderData(prev => ({
      ...prev,
      [step === 0 ? 'shippingAddress' : 'paymentDetails']: data
    }));
  };

  // Check if we can proceed to next step
  const canProceed = (step) => {
    if (step === 0) return orderData.shippingAddress;
    if (step === 1) return orderData.paymentDetails;
    return true;
  };

  const handleNextStep = () => {
    if (canProceed(activeStep)) {
      handleNext();
    } else {
      alert('Please complete the current step before proceeding.');
    }
  };

  // Create orderData object to pass to getStepContent
  const orderDataForSteps = {
    shippingAddress: orderData.shippingAddress,
    paymentDetails: orderData.paymentDetails,
    updateOrderData: updateOrderData
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Header />
      
      <Grid
        container
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          pt: 8, // Add padding top to account for fixed header
        }}
      >
        <Grid
          size={{ xs: 12, sm: 5, lg: 4 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: { xs: 2, sm: 4, md: 8 },
            px: { xs: 2, sm: 4, md: 10 },
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                G
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 'bold' }}>
              Gamiz
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Info totalPrice="$144.97" />
          </Box>
        </Grid>
        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 2, sm: 8 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Button
                startIcon={<ChevronLeftRoundedIcon />}
                component="a"
                href="/cart"
                sx={{ alignSelf: 'start' }}
              >
                Back to cart
              </Button>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexGrow: 1,
                height: 150,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: '100%',
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ':first-child': { pl: 0 },
                      ':last-child': { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: 'flex', md: 'none' },
              width: '100%',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                ':last-child': { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">${getCartTotal().toFixed(2)}</Typography>
              </div>
              <Info />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{
                display: { sm: 'flex', md: 'none' },
                width: '100%',
              }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ':first-child': { pl: 0 },
                    ':last-child': { pr: 0 },
                    '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" color="text.secondary">
                  Your order number is
                  <strong>&nbsp;#140396</strong>. We have emailed your order
                  confirmation and will update you once its shipped.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: 'start',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Go to my orders
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, orderDataForSteps)}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    justifyContent: activeStep !== 0 ? 'space-between' : 'flex-end',
                    alignItems: 'end',
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: '60px',
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: 'flex', sm: 'none' },
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: 'white',
                          borderColor: 'primary.main',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'primary.main',
                          transform: 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.3s ease',
                          zIndex: 0,
                        },
                        '&:hover::before': {
                          transform: 'scaleX(1)',
                        },
                        '& > *': {
                          position: 'relative',
                          zIndex: 1,
                        },
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNextStep}
                    sx={{
                      width: { xs: '100%', sm: 'fit-content' },
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  );
}
