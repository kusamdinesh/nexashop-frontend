import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  // ── Dependencies ─────────────────────────────────
  private authService = inject(AuthService);
  private router = inject(Router);

  // ── State Signals ────────────────────────────────
  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // ── Password Strength Computed Signal ────────────
  passwordStrength = computed(() => {
    const password = this.password();
    let strength = 0;
    const checks = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Count how many checks pass
    strength = Object.values(checks).filter(Boolean).length;

    return {
      checks,
      score: strength,
      label: strength <= 1 ? 'Very Weak' :
             strength === 2 ? 'Weak' :
             strength === 3 ? 'Fair' :
             strength === 4 ? 'Strong' : 'Very Strong',
      color: strength <= 1 ? '#ef5350' :
             strength === 2 ? '#ff7043' :
             strength === 3 ? '#ffca28' :
             strength === 4 ? '#66bb6a' : '#43a047'
    };
  });

  onRegister() {
    // Basic field validation
    if (!this.fullName() || !this.email() || !this.password()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    // Password match validation
    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    // Password strength validation
    const checks = this.passwordStrength().checks;

    if (!checks.hasMinLength) {
      this.errorMessage.set('Password must be at least 8 characters');
      return;
    }
    if (!checks.hasUppercase) {
      this.errorMessage.set('Password must contain at least one uppercase letter');
      return;
    }
    if (!checks.hasLowercase) {
      this.errorMessage.set('Password must contain at least one lowercase letter');
      return;
    }
    if (!checks.hasNumber) {
      this.errorMessage.set('Password must contain at least one number');
      return;
    }
    if (!checks.hasSpecialChar) {
      this.errorMessage.set('Password must contain at least one special character (!@#$%^&*)');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      full_name: this.fullName(),
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Account created! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.detail || 'Registration failed. Please try again.'
        );
      }
    });
  }
}