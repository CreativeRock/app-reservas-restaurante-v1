import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Mesas } from './components/mesas/mesas';

export const STAFF_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'reservas',
    component: Mesas
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
