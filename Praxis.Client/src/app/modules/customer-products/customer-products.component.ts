import { Component, OnInit, HostListener } from '@angular/core';
import { BaseComponent } from '../../utilities/base.component';
import { InjectHelper } from '../../utilities/helpers/inject.helper';
import { ProductService } from '../../core/services/product.service';
import { ProductModel } from '../../core/models/product.model';
import { ShoppingCartService } from '../../core/services/shopping-cart.service';
import { StorageKeys } from '../../core/services/storage.service';

@Component({
  selector: 'app-customer-products',
  templateUrl: './customer-products.component.html'
})
export class CustomerProductsComponent extends BaseComponent implements OnInit {

  page = 0;
  products: Array<ProductModel> = [];

  constructor(
    injectHelper: InjectHelper,
    private productService: ProductService,
    private cartService: ShoppingCartService) {
    super(injectHelper);
  }

  ngOnInit() {
    this.fetchProducts();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.fetchProducts();
    }
  }

  private fetchProducts() {
    this.productService.getAllProducts(this.page)
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

  onAddToCart(productId: number) {

    const product = this.products.find(i => i.productId === productId);


    let cart = this.storageService.getObject(StorageKeys.cart) as Array<ProductModel>;
    if (!cart) {
      cart = new Array<ProductModel>();
    }

    // update quantity if item exists in shopping cart
    const cartExistingItem = cart.filter(i => i.productId === product.productId);
    if (cartExistingItem.length > 0) {
      const index = cart.indexOf(cartExistingItem[0]);
      cartExistingItem[0].quantity = cartExistingItem[0].quantity + 1;
      cart[index] = cartExistingItem[0];
    } else {
      const customerId = this.authService.getUserId();
      product.quantity = 1;
      product.customerId = customerId;
      cart.push(product);
    }



    this.storageService.setObject(StorageKeys.cart, cart);
    this.cartService.updateCart(cart.length);
    this.showSuccessNotification('ITem added to the shopping cart');
  }


}
