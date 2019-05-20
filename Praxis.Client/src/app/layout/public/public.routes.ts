import { Routes } from '@angular/router';
import { NotAuthenticatedComponent } from 'src/app/public/not-authenticated/not-authenticated.component';
import { LoginComponent } from 'src/app/public/login/login.component';
import { RegisterComponent } from 'src/app/public/register/register.component';

export const PUBLIC_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'not-authenticated', component: NotAuthenticatedComponent },
];
