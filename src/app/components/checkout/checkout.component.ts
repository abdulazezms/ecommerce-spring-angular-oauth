import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  shippingFee: number = 0;

  constructor(private fromBuilder: FormBuilder) {}

  ngOnInit(): void {
    //Constructs a new `FormGroup` instance.
    this.checkoutFormGroup = this.fromBuilder.group({
      //Constructs a new `FormGroup` instance.
      customer: this.fromBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),

      //Constructs a new `FormGroup` instance.
      shippingAddress: this.fromBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      //Constructs a new `FormGroup` instance.
      billingAddress: this.fromBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      //Constructs a new `FormGroup` instance.
      creditCard: this.fromBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
  }

  onSubmit() {
    console.log('handling submission');
    console.log(this.checkoutFormGroup?.get('customer')?.value);
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
}
