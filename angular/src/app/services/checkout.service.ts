import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = 'http://localhost:8080/api/v1';
  private purchaseUrl = `${this.baseUrl}/checkout/purchase`;

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post(this.purchaseUrl, purchase);
  }
}
