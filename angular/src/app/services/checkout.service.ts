import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = environment.backendBaseUrl;
  private purchaseUrl = `${this.baseUrl}/checkout/purchase`;

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post(this.purchaseUrl, purchase);
  }
}
