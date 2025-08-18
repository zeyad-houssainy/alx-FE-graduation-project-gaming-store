import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCart } from '../../context/CartContext';

export default function Info({ totalPrice }) {
  const { items, getCartTotal } = useCart();
  
  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h6" fontWeight="bold">
        Order Summary
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <List disablePadding>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 2, px: 0 }}>
                  <Box
                    component="img"
                    src={item.imageUrl || '/assets/images/featured-game-1.jpg'}
                    alt={item.name}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      mr: 2,
                      objectFit: 'cover',
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    }
                  />
                  <Typography variant="body1" fontWeight="medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Shipping:</Typography>
            <Chip label="FREE" color="success" size="small" />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Tax:</Typography>
            <Typography variant="body1">${tax.toFixed(2)}</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${total.toFixed(2)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
