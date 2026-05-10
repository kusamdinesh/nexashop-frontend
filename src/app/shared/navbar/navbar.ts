import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  // ── Dependencies ─────────────────────────────────
  private authService = inject(AuthService);
  private router = inject(Router);

  // ── Outputs ──────────────────────────────────────
  menuToggled = output<void>();

  // ── Computed ─────────────────────────────────────
  currentUser = this.authService.currentUser$;

  onToggleMenu() {
    this.menuToggled.emit();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}