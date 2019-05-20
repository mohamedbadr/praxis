import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpService: HttpClientService) { }

  public getAllProducts(page: number): Observable<Array<ProductModel>> {
    return this.httpService.get(`products/page/${page}`);
  }

  public getProductsByCompany(companyId: string, page: number): Observable<Array<ProductModel>> {
    return this.httpService.get(`products/company/${companyId}/page/${page}`);
  }

  public getProductById(productId: number): Observable<ProductModel> {
    return this.httpService.get(`products/${productId}`);
  }

  public addProduct(data: any): Observable<boolean> {
    return this.httpService.post('products/add', data);
  }

  public editProduct(productId: number, data: any): Observable<ProductModel> {
    return this.httpService.post(`products/${productId}/edit`, data);
  }

  public deleteProduct(productId: number): Observable<boolean> {
    return this.httpService.delete(`products/${productId}`);
  }

  public deleteProductImage(imageId: number): Observable<boolean> {
    return this.httpService.delete(`product-images/${imageId}`);
  }
}
