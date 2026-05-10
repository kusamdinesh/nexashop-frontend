import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  // ── Dependencies ─────────────────────────────────
  private router = inject(Router);

  // ── Menu Items ───────────────────────────────────
  menuItems: MenuItem[] = [
    { label: 'Dashboard',  icon: '📊', route: '/dashboard'  },
    { label: 'Products',   icon: '📦', route: '/products'   },
    { label: 'Orders',     icon: '🛒', route: '/orders'     },
    { label: 'Customers',  icon: '👥', route: '/customers'  },
    { label: 'Inventory',  icon: '🏭', route: '/inventory'  },
    { label: 'Analytics',  icon: '📈', route: '/analytics'  },
  ];

  // ── Active Route ─────────────────────────────────
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}