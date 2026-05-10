import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, Customer } from '../../../core/services/customer';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {
  // ── Dependencies ─────────────────────────────────
  private customerService = inject(CustomerService);
  private router = inject(Router);

  // ── State Signals ────────────────────────────────
  customers = signal<Customer[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  showDeleteConfirm = signal(false);
  selectedCustomer = signal<Customer | null>(null);

  // ── Pagination Signals ───────────────────────────
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);

  // ── Filter Signals ───────────────────────────────
  searchQuery = signal('');

  // ── Computed ─────────────────────────────────────
  hasCustomers = computed(() => this.customers().length > 0);

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading.set(true);
    this.customerService.getCustomers(
      this.currentPage(),
      this.pageSize(),
      this.searchQuery() || undefined
    ).subscribe({
      next: (response) => {
        this.customers.set(response.items);
        this.totalItems.set(response.total);
        this.totalPages.set(response.total_pages);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load customers');
        this.isLoading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadCustomers();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadCustomers();
  }

  onAddCustomer() {
    this.router.navigate(['/customers/new']);
  }

  onEditCustomer(customer: Customer) {
    this.router.navigate(['/customers/edit', customer.id]);
  }

  onDeleteClick(customer: Customer) {
    this.selectedCustomer.set(customer);
    this.showDeleteConfirm.set(true);
  }

  onConfirmDelete() {
    const customer = this.selectedCustomer();
    if (!customer) return;

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.selectedCustomer.set(null);
        this.loadCustomers();
      },
      error: () => {
        this.errorMessage.set('Failed to delete customer');
      }
    });
  }

  onCancelDelete() {
    this.showDeleteConfirm.set(false);
    this.selectedCustomer.set(null);
  }

  getFullName(customer: Customer): string {
    return `${customer.first_name} ${customer.last_name}`;
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}