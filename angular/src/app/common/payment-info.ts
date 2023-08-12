export class PaymentInfo {
  constructor(
    public currency?: string,
    public amount?: number,
    public paymentMethod?: string
  ) {}
}
