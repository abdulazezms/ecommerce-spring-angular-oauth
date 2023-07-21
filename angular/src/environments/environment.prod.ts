export const environment = {
  oidc: {
    clientId: '0oaaeeost9XRbo0JD5d7',
    issuer: 'https://dev-08064476.okta.com/oauth2/default',
    redirectUri: `${window.location.origin}/login/callback`,
    scopes: ['profile', 'email', 'openid'],
  },
  production: true,
  backendBaseUrl: 'http://localhost:8090/api/v1',
};
