import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private apiUrl = environment.backendBaseUrl;
  private ordersUrl = `${this.apiUrl}/orders`;
  constructor(private httpClient: HttpClient) {}

  getOrderHistory(): Observable<OrderHistory[]> {
    return this.httpClient.get<OrderHistory[]>(`${this.ordersUrl}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
