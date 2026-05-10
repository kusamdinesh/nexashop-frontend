import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth routes — no layout
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  // Protected routes — with layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layout/layout')
        .then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/product-form/product-form')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/products/product-form/product-form')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'orders/new',
        loadComponent: () =>
          import('./features/orders/order-form/order-form')
            .then(m => m.OrderFormComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./features/orders/order-detail/order-detail')
            .then(m => m.OrderDetailComponent)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order-list/order-list')
            .then(m => m.OrderListComponent)
      },
      {
        path: 'customers/new',
        loadComponent: () =>
          import('./features/customers/customer-form/customer-form')
            .then(m => m.CustomerFormComponent)
      },
      {
        path: 'customers/edit/:id',
        loadComponent: () =>
          import('./features/customers/customer-form/customer-form')
            .then(m => m.CustomerFormComponent)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customer-list/customer-list')
            .then(m => m.CustomerListComponent)
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/inventory-list/inventory-list')
            .then(m => m.InventoryListComponent)
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics-dashboard/analytics-dashboard')
            .then(m => m.AnalyticsDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list/user-list')
            .then(m => m.UserListComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];