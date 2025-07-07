// Sensenet OIDC and repository configuration
export const repositoryUrl = process.env.REACT_APP_REPOSITORY_URL || '';
export const configuration = {
  client_id: process.env.REACT_APP_CLIENT_ID || '', // set in .env for production
  automaticSilentRenew: true,
  redirect_uri: `${window.location.origin}/authentication/callback`,
  response_type: 'code',
  post_logout_redirect_uri: `${window.location.origin}/`,
  scope: 'sensenet',
  authority: process.env.REACT_APP_AUTH_URL || '',
  silent_redirect_uri: `${window.location.origin}/authentication/silent_callback`,
  extraQueryParams: { snrepo: repositoryUrl },
};
