import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = environment.backendBaseUrl;
  private purchaseUrl = `${this.baseUrl}/checkout/purchase`;
  private paymentIntentUrl = `${this.baseUrl}/checkout/payment-intent`;

  constructor(private httpClient: HttpClient) {}

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(
        this.paymentIntentUrl,
        paymentInfo
    );
  }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
