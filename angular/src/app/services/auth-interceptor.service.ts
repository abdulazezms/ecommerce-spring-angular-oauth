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
    const apiUrl = environment.backendBaseUrl;

    const secureBackendEndpoints = [
      `${apiUrl}/orders`,
      `${apiUrl}/countries`,
      `${apiUrl}/cities`,
      `${apiUrl}/checkout`,
    ];
    //check if any of the secure urls is in the current requested url.
    if (secureBackendEndpoints.some((url) => req.urlWithParams.includes(url))) {
      const accessToken: string = this.oktaAuth.getAccessToken()!;
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
