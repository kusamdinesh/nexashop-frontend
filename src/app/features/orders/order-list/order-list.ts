import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  selectedOrder = signal<Order | null>(null);
  showStatusModal = signal(false);
  showCancelConfirm = signal(false);
  newStatus = signal('');

  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);
  searchQuery = signal('');
  statusFilter = signal('');

  hasOrders = computed(() => this.orders().length > 0);

  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.isLoading.set(true);
    this.orderService.getOrders(
      this.currentPage(),
      this.pageSize(),
      this.statusFilter() || undefined,
      this.searchQuery() || undefined
    ).subscribe({
      next: (response) => {
        this.orders.set(response.items);
        this.totalItems.set(response.total);
        this.totalPages.set(response.total_pages);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load orders');
        this.isLoading.set(false);
      }
    });
  }

  onSearch() { this.currentPage.set(1); this.loadOrders(); }
  onFilterChange() { this.currentPage.set(1); this.loadOrders(); }
  onPageChange(page: number) { this.currentPage.set(page); this.loadOrders(); }

  onNewOrder() { this.router.navigate(['/orders/new']); }

  onViewOrder(order: Order) {
    this.router.navigate(['/orders', order.id]);
  }

  onUpdateStatus(order: Order) {
    this.selectedOrder.set(order);
    this.newStatus.set(order.status);
    this.showStatusModal.set(true);
  }

  onConfirmStatus() {
    const order = this.selectedOrder();
    if (!order) return;
    this.orderService.updateStatus(order.id, this.newStatus()).subscribe({
      next: () => {
        this.showStatusModal.set(false);
        this.loadOrders();
      },
      error: (err) => this.errorMessage.set(err.error?.detail || 'Failed to update status')
    });
  }

  onCancelClick(order: Order) {
    this.selectedOrder.set(order);
    this.showCancelConfirm.set(true);
  }

  onConfirmCancel() {
    const order = this.selectedOrder();
    if (!order) return;
    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        this.showCancelConfirm.set(false);
        this.loadOrders();
      },
      error: (err) => this.errorMessage.set(err.error?.detail || 'Failed to cancel order')
    });
  }

  onCloseModals() {
    this.showStatusModal.set(false);
    this.showCancelConfirm.set(false);
    this.selectedOrder.set(null);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'warning',
      processing: 'accent',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return map[status] || 'neutral';
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}