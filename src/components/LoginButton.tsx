import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { AuthContext } from '../AuthProvider';

const LoginButton: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    user ? (
      <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
        Logout
      </Button>
    ) : null
  );
};

export default LoginButton;
