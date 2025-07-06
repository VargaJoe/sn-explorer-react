import React from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react';
import { useNavigate } from 'react-router-dom';

const LoginButton: React.FC = () => {
  const { oidcUser, logout, isLoading } = useOidcAuthentication();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Button color="inherit" sx={{ ml: 2 }} disabled>
        <CircularProgress size={20} color="inherit" />
      </Button>
    );
  }

  if (oidcUser) {
    return (
      <>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {oidcUser.profile?.name || oidcUser.profile?.preferred_username || oidcUser.profile?.email}
        </Typography>
        <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
          Logout
        </Button>
      </>
    );
  }

  return (
    <Button color="inherit" onClick={() => navigate('/login')} sx={{ ml: 2 }}>
      Login
    </Button>
  );
};

export default LoginButton;
