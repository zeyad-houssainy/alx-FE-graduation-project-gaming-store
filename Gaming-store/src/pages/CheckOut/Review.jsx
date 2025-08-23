import React from 'react';
import { useCartStore } from '../../stores';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export default function Review({ shippingAddress, paymentDetails }) {
  const { items, getCartTotal } = useCartStore();
  
  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  return (
    <Stack spacing={2}>
      <List disablePadding>
        {items.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={item.name}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography variant="body1" fontWeight="medium">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <Divider />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="body1" fontWeight="medium">
            ${subtotal.toFixed(2)}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body1" fontWeight="medium">
            Free
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tax" />
          <Typography variant="body1" fontWeight="medium">
            ${tax.toFixed(2)}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" fontWeight="bold">
            ${total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          {shippingAddress ? (
            <Typography gutterBottom>
              {shippingAddress.firstName} {shippingAddress.lastName}<br />
              {shippingAddress.address1}<br />
              {shippingAddress.address2 && `${shippingAddress.address2}<br />`}
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}<br />
              {shippingAddress.country}
            </Typography>
          ) : (
            <Typography color="text.secondary">No shipping address provided</Typography>
          )}
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          {paymentDetails ? (
            <Typography gutterBottom>
              {paymentDetails.cardType} ending in {paymentDetails.cardNumber.slice(-4)}<br />
              Expires: {paymentDetails.expiryDate}
            </Typography>
          ) : (
            <Typography color="text.secondary">No payment details provided</Typography>
          )}
        </div>
      </Stack>
    </Stack>
  );
}
