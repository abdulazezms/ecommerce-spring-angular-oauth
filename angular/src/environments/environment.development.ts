export const environment = {
  oidc: {
    clientId: '0oaaeeost9XRbo0JD5d7', //update this with your okta client ID
    issuer: 'https://dev-08064476.okta.com/oauth2/default', //update this with your issuer URL
    redirectUri: `${window.location.origin}/login/callback`,
    scopes: ['profile', 'email', 'openid'],
  },
  production: false,
  backendBaseUrl: 'http://localhost/api/v1',
  //update this your stripe publishable key
  stripePublishableKey: 'pk_test_51NeL1YGZmmwStTMBzjoC2NwzXsZfyf1P1KUiFZtYXemUatJbc0qEGQTqN3RCdJeZWTpTLucpdzlTXfBEm3J7Rr0L000s8cEjaP'
};
