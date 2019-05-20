import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/orders/order.model';
import { ProductModel } from '../models/product.model';
import { OrderLogModel } from '../models/orders/order-log.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpService: HttpClientService) { }

  public getCompanyOrders(companyId: string, status: number): Observable<Array<OrderModel>> {
    return this.httpService.get(`orders/${companyId}?status=${status}`);
  }

  public getCustomerOrders(customerId: string): Observable<Array<OrderModel>> {
    return this.httpService.get(`orders/customer/${customerId}`);
  }

  public addOrder(items: Array<ProductModel>): Observable<boolean> {
    return this.httpService.post('orders', items);
  }

  public getCustomerOrderById(orderId: number): Observable<any> {
    return this.httpService.get(`customer-order/${orderId}`);
  }

  public getCompanyOrderById(orderId: number): Observable<any> {
    return this.httpService.get(`orders/${orderId}`);
  }

  public addOrderLog(log: OrderLogModel): Observable<boolean> {
    return this.httpService.post('orders/log', log);
  }

  public getCustomerNotifications(customerId: string): Observable<Array<OrderLogModel>> {
    return this.httpService.get(`orders/customer-notifications/${customerId}`);
  }

  public getCompanyNotifications(companyId: string): Observable<Array<number>> {
    return this.httpService.get(`orders/company-notifications/${companyId}`);
  }
}
