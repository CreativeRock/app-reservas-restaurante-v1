import { Routes } from '@angular/router';
import { ClienteLogin } from './components/cliente-login/cliente-login';
import { ClienteRegister } from './components/cliente-register/cliente-register';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: ClienteLogin
  },
  {
    path: 'registro',
    component: ClienteRegister
  }
]
