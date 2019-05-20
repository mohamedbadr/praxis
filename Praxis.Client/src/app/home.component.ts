import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { OrderService } from './core/services/order.service';
import { BaseComponent } from './utilities/base.component';
import { routerTransition } from './utilities/helpers/animation.helper';
import { InjectHelper } from './utilities/helpers/inject.helper';
import { OrderModel } from './core/models/orders/order.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [routerTransition()],
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {


  selectedStatus = 0;
  orders: Array<OrderModel>;

  constructor(
    injectHelper: InjectHelper,
    private orderService: OrderService) {
    super(injectHelper);
  }

  ngOnInit() {

    const userRoles = this.authService.getUserRoles();
    if (userRoles.indexOf('Customer') > -1) {
      this.router.navigate(['/customer-products']);
      return;
    }

    this.loadData();

  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  loadData() {
    const id = this.authService.getUserId();
    this.orderService.getCompanyOrders(id, this.selectedStatus)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.orders = data;
      }, error => {
        this.handleError(error);
      });
  }

  onStatusChange(status) {
    this.selectedStatus = status;
    this.loadData();
  }

}
