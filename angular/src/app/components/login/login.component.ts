import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  oktaSignIn: any;
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: '/assets/images/logo.jpg',
      baseUrl: environment.oidc.issuer.split('/oauth2')[0],
      clientId: environment.oidc.clientId,
      redirectUri: environment.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: environment.oidc.issuer,
        scopes: environment.oidc.scopes,
      },
    });
  }
  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn
      .showSignInToGetTokens({
        el: '#okta-signin-widget',
      })
      .then((tokens: Tokens) => {
        //user logged in successfully.

        // Remove the widget
        this.oktaSignIn.remove();

        // // In this flow the redirect to Okta occurs in a hidden iframe
        this.oktaAuth.handleLoginRedirect(tokens);
      })
      .catch((err: any) => {
        // Typically due to misconfiguration
        throw err;
      });
  }
}
