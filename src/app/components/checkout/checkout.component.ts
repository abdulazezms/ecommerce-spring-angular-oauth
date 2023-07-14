import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City } from 'src/app/common/city';
import { Country } from 'src/app/common/country';
import { FormService } from 'src/app/services/form.service';

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
      console.log('Retrieved: ' + JSON.stringify(data));
      this.countries = data;
    });

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
    console.log(this.checkoutFormGroup?.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup?.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup?.get('creditCard')?.value);
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
