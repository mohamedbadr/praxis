import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cartSubject = new Subject<number>();

  getCart(): Observable<number> {
    return this.cartSubject.asObservable();
  }

  public updateCart(count: number) {
    return this.cartSubject.next(count);
  }

}
