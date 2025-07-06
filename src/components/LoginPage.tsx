import React, { useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, oidcUser } = useOidcAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (oidcUser) {
      navigate('/');
    }
  }, [oidcUser, navigate]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2} align="center">Login to Sensenet</Typography>
        {error && (
          <Typography color="error" variant="body2" mt={1} align="center">
            {error.message || String(error)}
          </Typography>
        )}
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={login} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login with Sensenet'}
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="text" color="secondary" onClick={() => navigate('/')}>Back</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
