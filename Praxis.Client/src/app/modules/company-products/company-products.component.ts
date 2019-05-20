import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { BaseComponent } from '../../utilities/base.component';
import { InjectHelper } from '../../utilities/helpers/inject.helper';
import { ProductModel } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-company-products',
  templateUrl: './company-products.component.html'
})
export class CompanyProductsComponent extends BaseComponent implements OnInit {

  @ViewChild('deleteDialog') deleteDialog: DeleteDialogComponent;
  products: Array<ProductModel> = [];
  companyId: string;
  page = 0;
  selectedId: number;

  constructor(
    injectHelper: InjectHelper,
    private productService: ProductService) {
    super(injectHelper);
  }

  ngOnInit() {

    this.companyId = this.authService.getUserId();
    this.fetchProducts();

  }

  private fetchProducts() {
    this.productService.getProductsByCompany(this.companyId, this.page)
      .subscribe(products => {

        products.forEach((item) => {
          this.products.push(item);
        });

        if (products.length > 0) {
          this.page = this.page + 1;
        }

      }, error => {
        this.handleError(error);
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.fetchProducts();
    }
  }

  onDelete(id: number) {
    this.selectedId = id;
    this.deleteDialog.showDialog();
  }

  onDeleteConfirmed() {
    this.productService.deleteProduct(this.selectedId)
      .subscribe(result => {
        if (result) {
          this.products = this.products.filter(i => i.productId !== this.selectedId);
          this.showSuccessNotification('Product has been deleted successfully');
          this.selectedId = 0;
        }
      }, error => {
        this.handleError(error);
      });
  }

}
