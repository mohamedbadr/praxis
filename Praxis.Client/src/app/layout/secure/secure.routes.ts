import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home.component';
import { AuthGuard } from 'src/app/auth/auth-guard.service';
import { Role } from 'src/app/core/enums/role.enum';
import { CompanyProductsComponent } from '../../modules/company-products/company-products.component';
import { AddProductComponent } from '../../modules/company-products/add-product/add-product.component';
import { EditProductComponent } from 'src/app/modules/company-products/edit-product/edit-product.component';
import { CustomerProductsComponent } from 'src/app/modules/customer-products/customer-products.component';
import { CustomerOrdersComponent } from 'src/app/modules/customer-orders/customer-orders.component';
import { OrderViewComponent } from '../../modules/customer-orders/order-view/order-view.component';
import { EditOrderComponent } from '../../modules/edit-order/edit-order.component';

export const SECURE_ROUTES: Routes = [
  {
    path: '',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Company]
    },
    component: HomeComponent, pathMatch: 'full'
  },
  {
    path: 'company-products',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Company]
    },
    component: CompanyProductsComponent, pathMatch: 'full'
  },
  {
    path: 'company-products/add',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Company]
    },
    component: AddProductComponent, pathMatch: 'full'
  },
  {
    path: 'company-products/:id/edit',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Company]
    },
    component: EditProductComponent, pathMatch: 'full'
  },
  {
    path: 'customer-products',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Customer]
    },
    component: CustomerProductsComponent, pathMatch: 'full'
  },
  {
    path: 'customer-orders',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Customer]
    },
    component: CustomerOrdersComponent, pathMatch: 'full'
  },
  {
    path: 'customer-orders/:id/view',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Customer]
    },
    component: OrderViewComponent, pathMatch: 'full'
  },
  {
    path: 'company-orders/:id',
    canLoad: [AuthGuard],
    data: {
      expectedRoles: [Role.Company]
    },
    component: EditOrderComponent, pathMatch: 'full'
  }
];
