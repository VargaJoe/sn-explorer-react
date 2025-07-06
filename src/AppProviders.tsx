import React, { useEffect } from 'react';
import { AuthenticationProvider, useOidcAuthentication } from '@sensenet/authentication-oidc-react';
import { RepositoryContext } from '@sensenet/hooks-react';
import { configuration } from './configuration';
import { setRepositoryAccessToken } from './services/sensenet';
import { createBrowserHistory } from 'history';

// Create a singleton browser history instance
export const browserHistory = createBrowserHistory();

export function AppProviders({ children }: { children: React.ReactNode }) {
  console.log('AppProviders mounted');
  return (
    <AuthProvider>
      <RepositoryProvider>
        {children}
      </RepositoryProvider>
    </AuthProvider>
  );
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider mounted, configuration:', configuration);
  // Use the singleton browserHistory for OIDC provider
  return (
    <AuthenticationProvider configuration={configuration} history={browserHistory}>
      {children}
    </AuthenticationProvider>
  );
};

export const RepositoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { oidcUser, isLoading, error } = useOidcAuthentication();
  useEffect(() => {
    console.log('RepositoryProvider: oidcUser', oidcUser, 'isLoading', isLoading, 'error', error);
    if (oidcUser?.access_token) {
      setRepositoryAccessToken(oidcUser.access_token);
    }
  }, [oidcUser, isLoading, error]);
  // Use the singleton repository instance from sensenetService
  const { repository } = require('./services/sensenet');
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
};
