import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AnalyticsService,
  Summary,
  TopProduct,
  ActivityLog,
  ActivityBreakdown,
  CustomerGrowth
} from '../../../core/services/analytics';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css'
})
export class AnalyticsDashboardComponent implements OnInit {
  // ── Dependencies ─────────────────────────────────
  private analyticsService = inject(AnalyticsService);

  // ── State Signals ────────────────────────────────
  summary = signal<Summary | null>(null);
  topProducts = signal<TopProduct[]>([]);
  recentActivity = signal<ActivityLog[]>([]);
  activityBreakdown = signal<ActivityBreakdown[]>([]);
  customerGrowth = signal<CustomerGrowth[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.isLoading.set(true);

    // Load summary
    this.analyticsService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: () => {}
    });

    // Load top products
    this.analyticsService.getTopProducts().subscribe({
      next: (data) => this.topProducts.set(data),
      error: () => {}
    });

    // Load recent activity
    this.analyticsService.getRecentActivity().subscribe({
      next: (data) => this.recentActivity.set(data),
      error: () => {}
    });

    // Load activity breakdown
    this.analyticsService.getActivityBreakdown().subscribe({
      next: (data) => this.activityBreakdown.set(data),
      error: () => {}
    });

    // Load customer growth
    this.analyticsService.getCustomerGrowth().subscribe({
      next: (data) => {
        this.customerGrowth.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // ── Helper Methods ───────────────────────────────
  getEventIcon(event: string): string {
    const icons: Record<string, string> = {
      'user_registered': '👤',
      'user_login': '🔐',
      'product_created': '📦',
      'product_updated': '✏️',
      'product_deleted': '🗑️',
      'customer_created': '👥',
      'customer_updated': '✏️',
      'customer_deleted': '🗑️'
    };
    return icons[event] || '📋';
  }

  getEventLabel(event: string): string {
    const labels: Record<string, string> = {
      'user_registered': 'New user registered',
      'user_login': 'User logged in',
      'product_created': 'Product created',
      'product_updated': 'Product updated',
      'product_deleted': 'Product deleted',
      'customer_created': 'Customer added',
      'customer_updated': 'Customer updated',
      'customer_deleted': 'Customer removed'
    };
    return labels[event] || event;
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'out';
    if (quantity < 10) return 'low';
    return 'ok';
  }

  // ── Bar Chart Helper ─────────────────────────────
  getBarWidth(count: number): number {
    const max = Math.max(...this.activityBreakdown().map(a => a.count));
    return max > 0 ? (count / max) * 100 : 0;
  }
}