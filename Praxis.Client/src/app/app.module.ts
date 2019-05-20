import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SweetAlertService } from 'ng2-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { RequestInterceptor } from './core/interceptors/request.interceptor';
import { HomeComponent } from './home.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { PublicComponent } from './layout/public/public.component';
import { PublicModule } from './layout/public/public.module';
import { SecureComponent } from './layout/secure/secure.component';
import { SecureModule } from './layout/secure/secure.module';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { SharedModule } from './shared/shared.module';
import { BaseComponent } from './utilities/base.component';
import { InjectHelper } from './utilities/helpers/inject.helper';
import { NotAuthenticatedComponent } from './public/not-authenticated/not-authenticated.component';
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { CompanyProductsComponent } from './modules/company-products/company-products.component';
import { AddProductComponent } from './modules/company-products/add-product/add-product.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { EditProductComponent } from './modules/company-products/edit-product/edit-product.component';
import { CustomerProductsComponent } from './modules/customer-products/customer-products.component';
import { CustomerOrdersComponent } from './modules/customer-orders/customer-orders.component';
import { OrderViewComponent } from './modules/customer-orders/order-view/order-view.component';
import { EditOrderComponent } from './modules/edit-order/edit-order.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SecureComponent,
    PublicComponent,
    HomeComponent,
    SidebarComponent,
    FooterComponent,
    NotFoundComponent,
    BaseComponent,
    NotAuthenticatedComponent,
    LoginComponent,
    RegisterComponent,
    CompanyProductsComponent,
    AddProductComponent,
    FileSelectDirective,
    EditProductComponent,
    CustomerProductsComponent,
    CustomerOrdersComponent,
    OrderViewComponent,
    EditOrderComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    PublicModule,
    SecureModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgHttpLoaderModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [
    AuthService,
    InjectHelper,
    SweetAlertService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
