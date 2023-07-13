import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
    this.cartService.computeCartTotals();
  }

  updateCartStatus() {
    //subscribe to cart status service total price subject.
    this.cartService.totalPrice.subscribe((value: number) => {
      this.totalPrice = value;
    });

    //subscribe to cart status service total quantity subject.
    this.cartService.totalQuantity.subscribe((value: number) => {
      this.totalQuantity = value;
    });
  }
}
