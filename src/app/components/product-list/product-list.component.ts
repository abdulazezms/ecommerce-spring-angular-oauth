import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = 'None';
  keyword: string = '';
  searchMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    this.keyword = this.route.snapshot.paramMap.get('keyword')!;
    this.productService
      .searchProducts(this.keyword)
      .subscribe((data: Product[]) => {
        this.products = data;
      });
  }

  handleListProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      this.productService
        .getProductsListByCategory(this.currentCategoryId)
        .subscribe(
          /* The method will run in an asychronous fashion.*/
          (data: Product[]) => {
            this.products = data;
          }
        );
    } else {
      this.currentCategoryName = 'All';
      this.productService.getProductsList().subscribe((data: Product[]) => {
        this.products = data;
      });
    }
  }
}
