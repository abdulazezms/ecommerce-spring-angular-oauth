import { City } from './city';
import { Country } from './country';

export class Address {
  country!: Country;
  city!: City;
  street!: string;
  zipCode!: string;
}
