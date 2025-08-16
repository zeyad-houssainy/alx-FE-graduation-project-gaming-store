import * as React from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
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
  },
  {
    name: 'Gaming Headset Pro',
    desc: 'Wireless RGB Headset',
    price: '$79.99',
  },
  {
    name: 'Game Pass Ultimate - 3 Months',
    desc: 'Subscription Service',
    price: '$44.99',
  },
];

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Card type', detail: 'Visa' },
  { name: 'Card holder', detail: 'Mr John Smith' },
  { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date', detail: '04/2024' },
];

export default function Review() {
  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            sx={{ mr: 2 }}
            primary="Products"
            secondary={`${products.length} selected`}
          />
          <Typography variant="body1" fontWeight="medium">
            $184.97
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
            $9.99
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" fontWeight="bold">
            $194.96
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
          <Typography gutterBottom>{addresses.join(', ')}</Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: '100%', mb: 1 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {payment.name}:
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
