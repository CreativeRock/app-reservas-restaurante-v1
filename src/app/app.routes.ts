import { Routes } from '@angular/router';
import { clienteAuthGuard } from './core/guards/cliente-auth-guard';
import { staffAuthGuard } from './core/guards/staff-auth-guard';

export const routes: Routes = [
  //Landing Page
  {
    path: '',
    loadComponent: () => import('./features/landing/components/landing-page/landing-page')
      .then(componente => componente.LandingPage)
  },

  //Autenticación de clientes
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/cliente-login/cliente-login')
      .then(componente => componente.ClienteLogin)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/components/cliente-register/cliente-register')
      .then(componente => componente.ClienteRegister)
  },

  //Reservaciones
  {
    path: 'disponibiliad',
    loadComponent: () => import('./features/reservacion/components/disponibilidad/disponibilidad')
      .then(componente => componente.Disponibilidad)
  },
  {
    path: 'mesas',
    loadComponent: () => import('./features/reservacion/components/mesas-galeria/mesas-galeria')
      .then(componente => componente.MesasGaleria)
  },
  {
    path: 'reservacion/:tableId',
    loadComponent: () => import('./features/reservacion/components/reservacion-detalles/reservacion-detalles')
      .then(componente => componente.ReservacionDetalles)
  },
  {
    path: 'reservacion/confirmacion/:reservaId',
    loadComponent: () => import('./features/reservacion/components/reservacion-confirmacion/reservacion-confirmacion')
      .then(componente => componente.ReservacionConfirmacion)
  },

  //Área Cliente (Protegida)
  {
    path: 'cliente',
    canActivate: [clienteAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/cliente/components/dashboard/dashboard')
          .then(componente => componente.Dashboard)
      },
      {
        path: 'mis-reservas',
        loadComponent: () => import('./features/cliente/components/mi-reservacion/mi-reservacion')
          .then(componente => componente.MiReservacion)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/cliente/components/profile/profile')
          .then(componente => componente.Profile)
      }
    ]
  },

  //Área Staff (Protegida)
  {
    path: 'staff',
    canActivate: [staffAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/staff/components/dashboard/dashboard')
          .then(componente => componente.Dashboard)
      },
      {
        path: 'reservas',
        loadComponent: () => import('./features/staff/components/reservas/reservas')
          .then(componente => componente.Reservas)
      }
    ]
  },

  //Login Staff
  {
    path: 'staff/login',
    loadComponent: () => import('./features/staff/components/staff-login/staff-login')
    .then(componente => componente.StaffLogin)
  },

  //Ruta por defecto
  {
    path: '**',
    redirectTo: ''
  }
];
