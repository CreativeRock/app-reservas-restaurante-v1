import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Mesas } from './components/mesas/mesas';
import { Reservas } from './components/reservas/reservas';

export const STAFF_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'reservas',
    component: Reservas
  },
  {
    path: 'mesas',
    component: Mesas
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
]
