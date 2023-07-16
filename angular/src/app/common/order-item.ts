import { CartItem } from './cart-item';
import { Item } from './item';

export class OrderItem {
  quantity!: number;
  product!: Item;
  constructor(private cartItem: CartItem) {
    this.quantity = cartItem.quantity;
    this.product = new Item(cartItem.id);
  }
}
