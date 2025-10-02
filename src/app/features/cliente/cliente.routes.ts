import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { MiReservacion } from './components/mi-reservacion/mi-reservacion';
import { Profile } from './components/profile/profile';

export const CLIENTE_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'mis-reservas',
    component: MiReservacion
  },
  {
    path: 'perfil',
    component:  Profile
  }
]
