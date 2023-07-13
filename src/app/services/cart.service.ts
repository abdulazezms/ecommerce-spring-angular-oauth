import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  //a subject, a subclass of observable, is used to publish events to all subscribers in multicast mode, unlike unicast with observables.
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() {
    this.cartItems =
      JSON.parse(sessionStorage.getItem('cartItems')!) != null
        ? JSON.parse(sessionStorage.getItem('cartItems')!)
        : [];
  }

  addCartItem(cartItem: CartItem) {
    let matchingItem: CartItem | undefined = this.cartItems.find(
      (temp) => temp.id === cartItem.id
    );
    if (matchingItem) {
      //item already exists. Increment the quantity.
      matchingItem.quantity++;
    } else {
      //otherwise we add it to the cart.
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPrice = 0,
      totalQuantity = 0;

    this.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.unitPrice;
      totalQuantity += item.quantity;
    });

    //publish to all subscribers.
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

    //persist cart data in the current session storage.
    this.persistCartItems();
  }

  persistCartItems() {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
