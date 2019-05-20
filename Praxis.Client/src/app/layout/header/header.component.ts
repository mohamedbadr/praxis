import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProductModel } from '../../core/models/product.model';
import { ShoppingCartService } from '../../core/services/shopping-cart.service';
import { StorageService, StorageKeys } from '../../core/services/storage.service';
import { OrderService } from '../../core/services/order.service'; import { NotificationsService } from 'angular2-notifications';
import { OrderLogModel } from '../../core/models/orders/order-log.model';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'

})
export class HeaderComponent implements OnInit {

  lang = environment.defaultLanguage;
  username: string;
  cart: Array<ProductModel>;
  isCompany = false;
  isCustomer = false;

  customerNotifications: Array<OrderLogModel>;
  companyNotifications: Array<number>;

  hubConnection: signalR.HubConnection;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private notificationService: NotificationsService) { }

  ngOnInit() {
    this.setRoles();
    this.initializeHub();
    this.username = this.authService.getUserName();
    this.cart = this.storageService.getObject(StorageKeys.cart);
    this.cartService.getCart()
      .subscribe(i => {
        this.cart = this.storageService.getObject(StorageKeys.cart);
      });
    this.loadNotifications();
  }

  private initializeHub() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44335/notify')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    const hubName = this.isCompany ? 'CompanyMessage' : 'CustomerMessage';

    this.hubConnection.on(hubName, () => {
      this.loadNotifications();
    });
  }


  private setRoles() {
    const userRoles = this.authService.getUserRoles();

    this.isCompany = userRoles.indexOf('Company') > -1;
    this.isCustomer = userRoles.indexOf('Customer') > -1;
  }
  onSignout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  onClearCart() {
    this.storageService.setObject(StorageKeys.cart, []);
    this.cart = null;
  }

  onPlaceOrder() {
    this.orderService.addOrder(this.cart)
      .subscribe(result => {
        this.notificationService.success('', 'Order has been placed successfully');
        this.onClearCart();
      });
  }

  loadNotifications() {

    if (this.isCustomer) {
      console.log('get customer notifications');
      this.orderService.getCustomerNotifications(this.authService.getUserId())
        .subscribe(logs => {
          this.customerNotifications = logs;
        });
    } else {
      console.log('get company notifications');
      this.orderService.getCompanyNotifications(this.authService.getUserId())
        .subscribe(notifications => {
          this.companyNotifications = notifications;
        });
    }
  }

}
