import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { Country } from '../common/country';
import { City } from '../common/city';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiUrl = environment.backendBaseUrl;
  private countriesUrl: string = `${this.apiUrl}/countries`;
  private citiesUrl: string = `${this.apiUrl}/cities`;
  private pageSize: number = 350;
  constructor(private httpClient: HttpClient) {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    const result: number[] = [];
    for (let i = startMonth; i <= 12; i++) {
      result.push(i);
    }
    return of(result);
  }

  getCreditCardYears(): Observable<number[]> {
    const startYear: number = new Date().getFullYear();
    const result: number[] = [];
    for (let i = startYear; i <= startYear + 10; i++) {
      result.push(i);
    }
    return of(result);
  }
  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(`${this.countriesUrl}?size=${this.pageSize}`)
      .pipe(map((response: any) => response._embedded.countries));
  }

  getCities(countryName: string): Observable<City[]> {
    const searchUrl = `${this.citiesUrl}/search/findByCountryName?name=${countryName}&size=${this.pageSize}`;
    return this.httpClient
      .get<GetResponseCountries>(searchUrl)
      .pipe(map((response: any) => response._embedded.cities));
  }
}

export interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

export interface GetResponseCities {
  _embedded: {
    cities: City[];
  };
}
