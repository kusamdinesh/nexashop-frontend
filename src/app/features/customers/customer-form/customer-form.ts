import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService, CustomerCreate } from '../../../core/services/customer';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerFormComponent implements OnInit {
  // ── Dependencies ─────────────────────────────────
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ── State Signals ────────────────────────────────
  isEditMode = signal(false);
  customerId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  // ── Form Fields ──────────────────────────────────
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  address = signal('');
  city = signal('');
  state = signal('');
  country = signal('');
  zipCode = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.customerId.set(id);
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: string) {
    this.isLoading.set(true);
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.firstName.set(customer.first_name);
        this.lastName.set(customer.last_name);
        this.email.set(customer.email);
        this.phone.set(customer.phone || '');
        this.address.set(customer.address || '');
        this.city.set(customer.city || '');
        this.state.set(customer.state || '');
        this.country.set(customer.country || '');
        this.zipCode.set(customer.zip_code || '');
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load customer');
        this.isLoading.set(false);
      }
    });
  }

  onSave() {
    if (!this.firstName() || !this.lastName() || !this.email()) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    const customerData: CustomerCreate = {
      first_name: this.firstName(),
      last_name: this.lastName(),
      email: this.email(),
      phone: this.phone() || undefined,
      address: this.address() || undefined,
      city: this.city() || undefined,
      state: this.state() || undefined,
      country: this.country() || undefined,
      zip_code: this.zipCode() || undefined
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    if (this.isEditMode()) {
      this.customerService.updateCustomer(this.customerId()!, customerData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.detail || 'Failed to update customer');
        }
      });
    } else {
      this.customerService.createCustomer(customerData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.detail || 'Failed to create customer');
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/customers']);
  }
}