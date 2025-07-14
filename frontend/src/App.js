import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import ShortenerPage from './pages/ShortenerPage';
import RedirectPage from './pages/RedirectPage';
import StatisticsPage from './pages/StatisticsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#388e3c',
    },
    background: {
      default: '#e3f2fd',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

function AppNavBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>URL Shortener</Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Shortener</Button>
        <Button color="inherit" onClick={() => navigate('/stats')}>Statistics</Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: -1, background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)' }} />
      <Router>
        <AppNavBar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path=":shortcode" element={<RedirectPage />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
