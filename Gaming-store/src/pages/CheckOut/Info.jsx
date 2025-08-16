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

const products = [
  {
    name: 'Cyberpunk 2077 Deluxe Edition',
    desc: 'Action RPG Game',
    price: '$59.99',
    imageUrl: '/assets/images/featured-game-1.jpg',
  },
  {
    name: 'Gaming Headset Pro',
    desc: 'Wireless RGB Headset',
    price: '$79.99',
    imageUrl: '/assets/images/featured-game-2.jpg',
  },
  {
    name: 'Game Pass Ultimate - 3 Months',
    desc: 'Subscription Service',
    price: '$44.99',
    imageUrl: '/assets/images/featured-game-3.jpg',
  },
];

export default function Info({ totalPrice = '$194.96' }) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h6" fontWeight="bold">
        Order Summary
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <List disablePadding>
            {products.map((product, index) => (
              <React.Fragment key={product.name}>
                <ListItem sx={{ py: 2, px: 0 }}>
                  <Box
                    component="img"
                    src={product.imageUrl}
                    alt={product.name}
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
                        {product.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {product.desc}
                      </Typography>
                    }
                  />
                  <Typography variant="body1" fontWeight="medium">
                    {product.price}
                  </Typography>
                </ListItem>
                {index < products.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1">$184.97</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Shipping:</Typography>
            <Chip label="FREE" color="success" size="small" />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Tax:</Typography>
            <Typography variant="body1">$9.99</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {totalPrice}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Button variant="text" sx={{ textAlign: 'left', justifyContent: 'flex-start' }}>
        Add coupon code
      </Button>
    </Stack>
  );
}
