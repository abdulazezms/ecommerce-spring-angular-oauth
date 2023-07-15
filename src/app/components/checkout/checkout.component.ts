import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { City } from 'src/app/common/city';
import { Country } from 'src/app/common/country';
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
    private formService: FormService
  ) {}

  ngOnInit(): void {
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
      //Constructs a new `FormGroup` instance for customer details.
      customer: this.fromBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          BusinessValidators.notEmpty,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          BusinessValidators.notEmpty,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      //Constructs a new `FormGroup` instance for billing details.
      shippingAddress: this.fromBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          BusinessValidators.notEmpty,
        ]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
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
        state: new FormControl('', [Validators.required]),
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

  //customer fields
  get firstName() {
    return this.getControl('customer', 'firstName');
  }

  get lastName() {
    return this.getControl('customer', 'lastName');
  }

  get email() {
    return this.getControl('customer', 'email');
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

  get shippingAddressState() {
    return this.getControl('shippingAddress', 'state');
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

  get billingAddressState() {
    return this.getControl('billingAddress', 'state');
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
    console.log('handling submission');
    console.log(this.checkoutFormGroup?.get('customer')?.value);
    console.log(this.checkoutFormGroup?.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup?.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup?.get('creditCard')?.value);
    if (this.checkoutFormGroup.invalid) {
      //touching all fields to trigger all error messages.
      console.log('indvalid!');
      this.checkoutFormGroup.markAllAsTouched();
    } else {
      //TODO:
    }
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.billingSameAsShipping = true;
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingCities = this.shippingCities;
    } else {
      this.billingSameAsShipping = false;
      this.checkoutFormGroup.controls['billingAddress'].reset();
      // this.checkoutFormGroup.controls['billingAddress'].markAllAsTouched();
      this.billingCities = [];
    }
  }

  handleYearChange() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = +creditCardFormGroup?.get('expirationYear')?.value;
    let startMonth = 1;
    console.log('select year is ' + selectedYear);
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
      console.log('yes years are equal!');
    } else {
      startMonth = 1;
    }
    this.formService
      .getCreditCardMonths(startMonth)
      .subscribe((value: number[]) => {
        this.creditCardMonths = value;
      });
  }

  getStates(formGroupName: string) {
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
}
