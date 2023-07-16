import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';
import myAppConfig from 'src/app/config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  oktaSignIn: any;
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    console.log("Yes, i've been called!");
    this.oktaSignIn = new OktaSignIn({
      logo: '/assets/images/logo.jpg',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
    });
  }
  ngOnInit(): void {
    this.oktaSignIn.remove();
    console.log('ng on in it is in the house baby');
    this.oktaSignIn
      .showSignInToGetTokens({
        el: '#okta-signin-widget',
      })
      .then((tokens: Tokens) => {
        // Remove the widget
        this.oktaSignIn.remove();

        // In this flow the redirect to Okta occurs in a hidden iframe
        this.oktaAuth.handleLoginRedirect(tokens);
      })
      .catch((err: any) => {
        // Typically due to misconfiguration
        throw err;
      });
  }
}
