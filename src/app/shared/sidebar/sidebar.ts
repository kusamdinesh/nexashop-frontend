import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser$;
  userRole = this.authService.getRole;

  allMenuItems: MenuItem[] = [
    { label: 'Dashboard',  icon: '📊', route: '/dashboard',  roles: ['admin', 'manager', 'staff'] },
    { label: 'Products',   icon: '📦', route: '/products',   roles: ['admin', 'manager', 'staff'] },
    { label: 'Orders',     icon: '🛒', route: '/orders',     roles: ['admin', 'manager', 'staff'] },
    { label: 'Customers',  icon: '👥', route: '/customers',  roles: ['admin', 'manager', 'staff'] },
    { label: 'Inventory',  icon: '🏭', route: '/inventory',  roles: ['admin', 'manager', 'staff'] },
    { label: 'Analytics',  icon: '📈', route: '/analytics',  roles: ['admin', 'manager'] },
    { label: 'Users',      icon: '👤', route: '/users',      roles: ['admin'] },
  ];

  visibleMenuItems = computed(() => {
    const role = this.userRole();
    return this.allMenuItems.filter(item => item.roles.includes(role));
  });

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}