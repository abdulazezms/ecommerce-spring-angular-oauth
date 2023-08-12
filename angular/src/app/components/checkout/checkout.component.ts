import {Component, Inject, OnInit} from '@angular/core';
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
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { BusinessValidators } from 'src/app/validators/business-validators';
import { environment } from 'src/environments/environment';
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth, UserClaims} from "@okta/okta-auth-js";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();

  cardElement: any;
  displayError: any = '';

  checkoutFormGroup!: FormGroup;

  orderPrice: number = 0;
  totalQuantity: number = 0;
  shippingFee: number = 0;

  countries!: Country[];
  shippingCities!: City[];
  billingCities!: City[];

  billingSameAsShipping: boolean = false;

  isDisabled: boolean = false;

  userProfile!: UserClaims;

  constructor(
    private fromBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {
    this.shippingFee = cartService.shippingFee;
  }

  async ngOnInit() {
    //retrieve user profile
    this.oktaAuth.getUser().then((value) => {
      this.userProfile = value;
    }).catch( (err) => {console.log("There was an error while fetching the user's details.")});

    this.setupPaymentForm();

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
      creditCard: this.fromBuilder.group({}),
    });

    this.reviewOrder();
  }
  setupPaymentForm() {
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });
    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }
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

  getControl(formGroupName: string, formControlName: string) {
    return this.checkoutFormGroup.get(`${formGroupName}.${formControlName}`);
  }

  onSubmit() {
    if (this.billingSameAsShipping) {
      this.copyShippingToBillingOperation();
    }

    if (
      this.checkoutFormGroup.invalid ||
      this.displayError.textContent !== ''
    ) {
      //touching all fields to trigger all error messages.
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //populate order and order items.
    const order: Order = new Order(this.orderPrice, this.totalQuantity);
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
    const total = this.orderPrice + this.shippingFee;
    //compute amount in the lowest denomination
    this.paymentInfo.amount = Math.round(total * 100);
    console.log('The amount is ' + this.paymentInfo.amount);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.paymentMethod = 'card';

    //disable purchase button
    this.isDisabled = true;

    //create a payment intent
    this.checkoutService
      .createPaymentIntent(this.paymentInfo)
      .subscribe({
        next: paymentIntent => {
          console.log("I am in the next phase");
          this.stripe
            .confirmCardPayment(
              paymentIntent.client_secret,
              {
                //send credit card data along with user's billing information to stripe's service.
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: this.userProfile.email,
                    name: `${this.userProfile.given_name} ${this.userProfile.family_name}`,
                  },
                },
              },
              {handleActions: false}
            )
            .then((result: any) => {
              console.log("I am in the then phase ")
              if (result.error) {
                //an error occurred. Inform the user.
                alert(`An error occurred: ${result.error.message} `);
                this.isDisabled = false;
              } else {
                //successful; call the backend to place the order.
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (value: any) => {
                    alert('Your order has been received!');
                    this.resetCart();
                    this.isDisabled = false;
                    this.router.navigateByUrl('/history');
                  },
                  error: (error: any) => {
                    alert(`An error occurred: ${error.message} `);
                    this.isDisabled = false;
                  },
                });
              }
            });
        },
        error: err => {
          alert(`Sorry, we weren't able to reach out to the payment processor. Try again later.`);
          this.isDisabled = false;
          this.router.navigateByUrl('/history');
        }
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
      this.orderPrice = value;
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
