import { Component, OnInit, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: OrderHistory[] = [];
  email: string = '';

  constructor(
    private orderHistoryService: OrderHistoryService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  async ngOnInit() {
    const userClaims = await this.oktaAuth.getUser();
    this.email = userClaims.email as string;
    this.setOrderHistory();
  }

  setOrderHistory() {
    this.orderHistoryService.getOrderHistory(this.email).subscribe((value) => {
      this.orderHistory = value;
    });
  }
}
