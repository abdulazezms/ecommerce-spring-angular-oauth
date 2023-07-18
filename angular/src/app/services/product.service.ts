import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.backendBaseUrl;
  private productsUrl: string = `${this.baseUrl}/products`;
  private categoryUrl: string = `${this.baseUrl}/product-category`;

  constructor(private httpClient: HttpClient) {}

  searchProducts(
    keyword: string,
    page: number,
    pageSize: number
  ): Observable<GetResponseProducts> {
    return this.getProducts(
      `${this.productsUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`
    );
  }

  getProductsListPaginate(
    page: number,
    pageSize: number
  ): Observable<GetResponseProducts> {
    return this.getProducts(
      `${this.productsUrl}?page=${page}&size=${pageSize}`
    );
  }

  getProductsList(
    page: number,
    pageSize: number
  ): Observable<GetResponseProducts> {
    return this.getProducts(
      `${this.productsUrl}?page=${page}&size=${pageSize}`
    );
  }

  getProductsListByCategory(
    categoryId: number,
    page: number,
    pageSize: number
  ): Observable<GetResponseProducts> {
    return this.getProducts(
      `${this.productsUrl}/search/findByProductCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductsCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl: string = `${this.productsUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(url: string): Observable<GetResponseProducts> {
    return this.httpClient.get<GetResponseProducts>(url);
  }
}

export interface GetResponseProducts {
  /* Grabbing the JSON data, unwrapping it, and then placing that data into an array of products.*/
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface GetResponseProductsCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
