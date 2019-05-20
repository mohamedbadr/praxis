import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../utilities/base.component';
import { InjectHelper } from '../../utilities/helpers/inject.helper';
import { OrderService } from '../../core/services/order.service';
import { OrderModel } from 'src/app/core/models/orders/order.model';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent extends BaseComponent implements OnInit {

  orders: Array<OrderModel>;

  constructor(
    injectHelper: InjectHelper,
    private orderService: OrderService
  ) {
    super(injectHelper);
  }

  ngOnInit() {
    const customerId = this.authService.getUserId();
    this.orderService.getCustomerOrders(customerId)
      .subscribe(orders => {
        this.orders = orders;
      }, error => {
        this.handleError(error);
      });
  }

}
