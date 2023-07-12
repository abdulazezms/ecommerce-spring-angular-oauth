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
  private baseUrl = 'http://localhost:8080/api/v1';
  private productsUrl: string = `${this.baseUrl}/products`;
  private categoryUrl: string = `${this.baseUrl}/product-category`;

  constructor(private httpClient: HttpClient) {}

  searchProducts(keyword: string): Observable<Product[]> {
    return this.getProducts(
      `${this.productsUrl}/search/findByNameContaining?name=${keyword}`
    );
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(url)
      .pipe(map((response) => response._embedded.products));
  }

  getProductsList(): Observable<Product[]> {
    return this.getProducts(this.productsUrl);
  }

  getProductsListByCategory(categoryId: number): Observable<Product[]> {
    return this.getProducts(
      `${this.productsUrl}/search/findByProductCategoryId?id=${categoryId}`
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProduct(currentProductId: number): Observable<Product> {
    const productUrl: string = `${this.productsUrl}/${currentProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProduct {
  /* Grabbing the JSON data, unwrapping it, and then placing that data into an array of products.*/
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
