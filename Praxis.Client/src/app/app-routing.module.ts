import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth-guard.service';
import { PublicComponent } from './layout/public/public.component';
import { PUBLIC_ROUTES } from './layout/public/public.routes';
import { SecureComponent } from './layout/secure/secure.component';
import { SECURE_ROUTES } from './layout/secure/secure.routes';
import { NotAuthenticatedComponent } from './public/not-authenticated/not-authenticated.component';
import { NotFoundComponent } from './public/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: SecureComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { title: 'Secure Views' },
    children: SECURE_ROUTES
  },
  { path: 'account', component: PublicComponent, data: { title: 'Public Views' }, children: PUBLIC_ROUTES },
  { path: 'not-authenticated', component: NotAuthenticatedComponent },
  { path: 'forbidden', component: NotAuthenticatedComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
