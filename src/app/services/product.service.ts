import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl: string = 'http://localhost:8080/api/v1/products';
  private categoryUrl: string = 'http://localhost:8080/api/v1/product-category';
  constructor(private httpClient: HttpClient) {}

  getProductsList(): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(this.productsUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProductsListByCategory(categoryId: number): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(
        `${this.productsUrl}/search/findByProductCategoryId?id=${categoryId}`
      )
      .pipe(map((response) => response._embedded.products));
  }

  getProductCategories() {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }
}

interface GetResponseProduct {
  /* Grabbing the JSON data, unwrapping it, and then placing that data into an array of products.*/
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  /* Grabbing the JSON data, unwrapping it, and then placing that data into an array of product categories.*/
  _embedded: {
    productCategory: ProductCategory[];
  };
}
