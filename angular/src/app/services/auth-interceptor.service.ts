import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    //specify the endpoints, such that when requested, the interceptor should add the Authorization header.
    const baseUrl = environment.backendBaseUrl;

    const secureBackendEndpoints = [
      `${baseUrl}/orders`,
      `${baseUrl}/countries`,
      `${baseUrl}/cities`,
      `${baseUrl}/checkout`,
    ];
    //check if any of secure endpoints is in the current requested url.
    if (secureBackendEndpoints.some((url) => req.urlWithParams.includes(url))) {
      console.log(
        'receiving teh access token: ' + this.oktaAuth.getAccessToken()
      );
      const accessToken: string = this.oktaAuth.getAccessToken()!;
      const idToken: string = this.oktaAuth.getIdToken()!;
      console.log('id token is ' + idToken);
      //clone the request and add the access token. Since the request is immutable, we copy it and make changes on the copy.
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer '.concat(accessToken),
        },
      });
    }
    //pass the request to the next interceptor in the chain, if any, or make it to the destination endpoint.
    return await lastValueFrom(next.handle(req));
  }
}
