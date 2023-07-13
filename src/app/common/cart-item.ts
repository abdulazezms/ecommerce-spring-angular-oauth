import { Product } from './product';

export class CartItem {
  id: number;
  sku: string;
  name: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.sku = product.sku;
    this.name = product.name;
    this.unitPrice = product.unitPrice;
    this.imageUrl = product.imageUrl;
    this.quantity = 1;
  }
}
