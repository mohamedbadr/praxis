import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../utilities/base.component';
import { InjectHelper } from 'src/app/utilities/helpers/inject.helper';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OrderLogModel } from 'src/app/core/models/orders/order-log.model';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  orderId: number;
  order: any;
  visible: false;

  constructor(
    injectHelper: InjectHelper,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    super(injectHelper);
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.orderId = +params.get('id');
        this.loadOrder();
      });

    this.createForm();
  }

  private loadOrder() {
    this.orderService.getCompanyOrderById(this.orderId)
      .subscribe(order => {
        this.order = order;
      });
  }

  private createForm() {
    this.form = this.fb.group({
      orderStatus: [1],
      notes: [null]
    });
  }

  onSubmit() {
    const orderLog = new OrderLogModel();
    orderLog.orderId = this.orderId;
    orderLog.oldStatus = this.order.orderStatus;
    orderLog.newStatus = this.form.controls.orderStatus.value;
    orderLog.notes = this.form.controls.notes.value;

    this.orderService.addOrderLog(orderLog)
      .subscribe(() => {
        this.form.reset();
        this.visible = false;
        this.loadOrder();
      }, error => {
        this.handleError(error);
      });
  }

}
