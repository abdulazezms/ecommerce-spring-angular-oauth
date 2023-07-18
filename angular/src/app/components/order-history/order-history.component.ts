import { Component, OnInit, Inject } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: OrderHistory[] = [];

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.setOrderHistory();
  }

  setOrderHistory() {
    this.orderHistoryService.getOrderHistory().subscribe((value) => {
      this.orderHistory = value;
    });
  }
}
