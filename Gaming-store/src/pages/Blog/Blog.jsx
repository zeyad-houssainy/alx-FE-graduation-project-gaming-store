import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BlogHeader from './BlogHeader';
import MainContent from './MainContent';
import BlogFooter from './BlogFooter';

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
    h1: {
      fontFamily: "'Oxanium', sans-serif",
      fontWeight: 'bold',
    },
    h2: {
      fontFamily: "'Oxanium', sans-serif",
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: "'Oxanium', sans-serif",
      fontWeight: 'bold',
    },
    h4: {
      fontFamily: "'Oxanium', sans-serif",
      fontWeight: 'bold',
    },
  },
});

export default function Blog() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <BlogHeader />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          my: 16, 
          gap: 4,
          minHeight: '80vh'
        }}
      >
        <MainContent />
      </Container>
      <BlogFooter />
    </ThemeProvider>
  );
}
