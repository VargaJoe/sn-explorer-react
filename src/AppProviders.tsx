import React from 'react';
import { AuthenticationProvider, useOidcAuthentication } from '@sensenet/authentication-oidc-react';
import { Repository } from '@sensenet/client-core';
import { RepositoryContext } from '@sensenet/hooks-react';
import { configuration, repositoryUrl } from './configuration';
import { useLocation, useNavigate } from 'react-router-dom';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RepositoryProvider>
        {children}
      </RepositoryProvider>
    </AuthProvider>
  );
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const history = {
    location,
    push: navigate,
  };
  return (
    <AuthenticationProvider configuration={configuration} history={history}>
      {children}
    </AuthenticationProvider>
  );
};

export const RepositoryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RepositoryContext.Provider value={new Repository({ repositoryUrl })}>
      {children}
    </RepositoryContext.Provider>
  );
};
