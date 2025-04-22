import React, { useState, useEffect } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Stack,
  Paper
} from '@mui/material';
import ContentList from './components/ContentList';
import TreeExplorer from './components/TreeExplorer';
import ActionToolbar from './components/ActionToolbar';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

const ExplorerContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('/Root');
  
  // Sync path from URL
  useEffect(() => {
    const pathFromUrl = location.pathname === '/' ? '/Root' : location.pathname;
    setCurrentPath(pathFromUrl);
  }, [location.pathname]);
  
  // Handle path changes
  const handlePathChange = (newPath: string) => {
    setCurrentPath(newPath);
    navigate(newPath === '/Root' ? '/' : newPath);
  };

  return (
    <>
      <ActionToolbar />
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ height: 'calc(100vh - 128px)' }}
      >
        <Paper 
          elevation={1} 
          sx={{ 
            width: '25%', 
            borderRight: '1px solid #e0e0e0', 
            height: '100%', 
            overflow: 'auto' 
          }}
        >
          <TreeExplorer currentPath={currentPath} onPathChange={handlePathChange} />
        </Paper>
        
        <Box sx={{ width: '75%', height: '100%', overflow: 'auto' }}>
          <ContentList currentPath={currentPath} onPathChange={handlePathChange} />
        </Box>
      </Stack>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sensenet Content Explorer
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, height: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/*" element={<ExplorerContent />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
