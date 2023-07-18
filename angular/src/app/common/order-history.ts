export class OrderHistory {
  constructor(
    public id: number,
    public orderTrackingNumber: number,
    public totalPrice: number,
    public totalQuantity: number,
    public dateCreated: Date,
    public status: string
  ) {}
}
