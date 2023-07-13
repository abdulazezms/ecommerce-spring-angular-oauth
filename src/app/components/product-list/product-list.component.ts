import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { GetResponseProducts } from 'src/app/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'None';

  currentKeyword: string = '';
  previousKeyword: string = '';
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

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
    this.currentKeyword = this.route.snapshot.paramMap.get('keyword')!;
    this.pageNumber =
      this.currentKeyword == this.previousKeyword ? this.pageNumber : 1; //reset page number when the keyword changes.
    this.previousKeyword = this.currentKeyword;
    this.updateProducts(
      this.productService.searchProducts(
        this.currentKeyword,
        this.pageNumber - 1,
        this.pageSize
      )
    );
  }

  handleListProducts() {
    if (this.route.snapshot.paramMap.has('id')) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      this.pageNumber =
        this.currentCategoryId == this.previousCategoryId ? this.pageNumber : 1; //reset page number when the category number changes.
      this.previousCategoryId = this.currentCategoryId;

      this.updateProducts(
        this.productService.getProductsListByCategory(
          this.currentCategoryId,
          this.pageNumber - 1,
          this.pageSize
        )
      );
    } else {
      this.currentCategoryName = 'All';
      this.updateProducts(
        this.productService.getProductsList(this.pageNumber - 1, this.pageSize)
      );
    }
  }

  updateProducts(obs: Observable<GetResponseProducts>) {
    obs.subscribe((data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    });
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
}
