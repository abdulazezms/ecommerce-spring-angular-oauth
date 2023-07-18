import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/common/address';
import { CartItem } from 'src/app/common/cart-item';
import { City } from 'src/app/common/city';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { BusinessValidators } from 'src/app/validators/business-validators';

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

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries!: Country[];
  shippingCities!: City[];
  billingCities!: City[];

  billingSameAsShipping: boolean = false;

  constructor(
    private fromBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.shippingFee = cartService.shippingFee;
  }

  ngOnInit(): void {
    this.reviewOrder();

    const startMonth = new Date().getMonth() + 1;

    //populate years
    this.formService.getCreditCardYears().subscribe((value: number[]) => {
      this.creditCardYears = value;
    });

    //populate months
    this.formService
      .getCreditCardMonths(startMonth)
      .subscribe((value: number[]) => {
        this.creditCardMonths = value;
      });

    //populate countries
    this.formService.getCountries().subscribe((data: Country[]) => {
      this.countries = data;
    });

    //Constructs a new `FormGroup` instance.
    this.checkoutFormGroup = this.fromBuilder.group({
      //Constructs a new `FormGroup` instance for billing details.
      shippingAddress: this.fromBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          BusinessValidators.notEmpty,
        ]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          BusinessValidators.notEmpty,
        ]),
      }),

      //Constructs a new `FormGroup` instance for shipping details.
      billingAddress: this.fromBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.minLength(2),
          BusinessValidators.notEmpty,
          Validators.required,
        ]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.minLength(2),
          BusinessValidators.notEmpty,
          Validators.required,
        ]),
      }),

      //Constructs a new `FormGroup` instance for payment details.
      creditCard: this.fromBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          BusinessValidators.notEmpty,
          Validators.minLength(2),
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{16}$'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{3}$'),
        ]),
        expirationMonth: new FormControl('', []),
        expirationYear: new FormControl('', []),
      }),
    });
  }

  //shipping address fields
  get shippingAddressStreet() {
    return this.getControl('shippingAddress', 'street');
  }

  get shippingAddressCountry() {
    return this.getControl('shippingAddress', 'country');
  }

  get shippingAddressCity() {
    return this.getControl('shippingAddress', 'city');
  }

  get shippingAddressZipCode() {
    return this.getControl('shippingAddress', 'zipCode');
  }

  //billing address fields
  get billingAddressStreet() {
    return this.getControl('billingAddress', 'street');
  }

  get billingAddressCountry() {
    return this.getControl('billingAddress', 'country');
  }

  get billingAddressCity() {
    return this.getControl('billingAddress', 'city');
  }

  get billingAddressZipCode() {
    return this.getControl('billingAddress', 'zipCode');
  }

  //payment fields

  get cardType() {
    return this.getControl('creditCard', 'cardType');
  }

  get nameOnCard() {
    return this.getControl('creditCard', 'nameOnCard');
  }

  get cardNumber() {
    return this.getControl('creditCard', 'cardNumber');
  }

  get securityCode() {
    return this.getControl('creditCard', 'securityCode');
  }

  getControl(formGroupName: string, formControlName: string) {
    return this.checkoutFormGroup.get(`${formGroupName}.${formControlName}`);
  }

  onSubmit() {
    if (this.billingSameAsShipping) {
      this.copyShippingToBillingOperation();
    }

    if (this.checkoutFormGroup.invalid) {
      //touching all fields to trigger all error messages.
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //populate order and order items.
    const order: Order = new Order(this.totalPrice, this.totalQuantity);
    const cartItems: CartItem[] = this.cartService.cartItems;
    const orderItems: OrderItem[] = cartItems.map(
      (cartItem) => new OrderItem(cartItem)
    );

    //populate addresses.
    const billingAddress: Address = new Address();
    billingAddress.city = this.billingAddressCity?.value;
    billingAddress.country = this.billingAddressCountry?.value;
    billingAddress.zipCode = this.billingAddressZipCode?.value;
    billingAddress.street = this.billingAddressStreet?.value;

    const shippingAddress: Address = new Address();
    shippingAddress.city = this.shippingAddressCity?.value;
    shippingAddress.country = this.shippingAddressCountry?.value;
    shippingAddress.zipCode = this.shippingAddressZipCode?.value;
    shippingAddress.street = this.shippingAddressStreet?.value;

    //populate purchase.
    const purchase: Purchase = new Purchase();
    purchase.orderItems = orderItems;
    purchase.order = order;
    purchase.billingAddress = billingAddress;
    purchase.shippingAddress = shippingAddress;

    //place the order.
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
        );
        this.resetCart();
      },
      error: (response) => {
        alert(`There was an error: ${response.message}`);
      },
    });
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.billingSameAsShipping = true;
      this.copyShippingToBillingOperation();
    } else {
      this.billingSameAsShipping = false;
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingCities = [];
    }
  }

  copyShippingToBillingOperation() {
    this.checkoutFormGroup.controls['billingAddress'].setValue(
      this.checkoutFormGroup.controls['shippingAddress'].value
    );
    this.billingCities = this.shippingCities;
  }

  handleYearChange() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = +creditCardFormGroup?.get('expirationYear')?.value;
    let startMonth = 1;

    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.formService
      .getCreditCardMonths(startMonth)
      .subscribe((value: number[]) => {
        this.creditCardMonths = value;
      });
  }

  getCities(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryName = formGroup?.value.country.name;
    this.formService.getCities(countryName).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingCities = data;
      } else {
        this.billingCities = data;
      }
      formGroup?.get('city')?.setValue(data[0]);
    });
  }

  reviewOrder() {
    this.cartService.totalPrice.subscribe((value: number) => {
      this.totalPrice = value;
    });

    this.cartService.totalQuantity.subscribe((value: number) => {
      this.totalQuantity = value;
    });
  }

  resetCart() {
    this.cartService.cartItems = [];

    //reset total price and quantity to 0, so all subscribers get to know.
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.shippingCities = [];
    this.billingCities = [];
    this.checkoutFormGroup.reset();
    this.billingSameAsShipping = false;
    sessionStorage.removeItem('cartItems');
    this.router.navigateByUrl('/history');
  }
}
