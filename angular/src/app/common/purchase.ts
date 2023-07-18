import { Address } from './address';
import { Order } from './order';
import { OrderItem } from './order-item';

export class Purchase {
  shippingAddress!: Address;
  billingAddress!: Address;
  order!: Order;
  orderItems!: OrderItem[];
}
