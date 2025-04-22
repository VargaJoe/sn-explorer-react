import React from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  AppBar, 
  Toolbar, 
  Typography, 
  Container,
  Box
} from '@mui/material';
import ContentList from './components/ContentList';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0088cc',
    },
    secondary: {
      main: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sensenet Content Explorer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box sx={{ py: 3 }}>
          <ContentList />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
