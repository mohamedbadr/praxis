import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { BaseComponent } from '../../../utilities/base.component';
import { InjectHelper } from '../../../utilities/helpers/inject.helper';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent extends BaseComponent implements OnInit {

  orderId: number;
  order: any;

  constructor(
    injectHelper: InjectHelper,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { super(injectHelper); }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.orderId = +params.get('id');
        this.loadOrder();
      });
  }

  private loadOrder() {
    this.orderService.getCustomerOrderById(this.orderId)
      .subscribe(order => {
        this.order = order;
      });
  }

}
