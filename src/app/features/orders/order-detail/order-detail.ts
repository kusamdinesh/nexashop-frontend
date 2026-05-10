import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadOrder(id);
  }

  loadOrder(id: string) {
    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Order not found');
        this.isLoading.set(false);
      }
    });
  }

  onBack() { this.router.navigate(['/orders']); }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'warning', processing: 'accent',
      shipped: 'info', delivered: 'success', cancelled: 'danger'
    };
    return map[status] || 'neutral';
  }
}