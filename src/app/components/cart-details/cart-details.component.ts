import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  shippingFee: number = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe((value: number) => {
      this.totalPrice = value;
    });

    this.cartService.totalQuantity.subscribe((value: number) => {
      this.totalQuantity = value;
    });

    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addCartItem(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.removeCartItem(cartItem);
  }

  removeCartItem(cartItem: CartItem) {
    this.cartService.remove(cartItem);
  }
}
