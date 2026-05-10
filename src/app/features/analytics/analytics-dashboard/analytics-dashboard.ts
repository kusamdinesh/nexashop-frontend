import {
  Component, signal, inject, OnInit,
  AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import {
  AnalyticsService, Summary, TopProduct,
  ActivityLog, ActivityBreakdown
} from '../../../core/services/analytics';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css'
})
export class AnalyticsDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private analyticsService = inject(AnalyticsService);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('statusChart') statusChartRef!: ElementRef;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild('growthChart') growthChartRef!: ElementRef;

  summary = signal<Summary | null>(null);
  topProducts = signal<TopProduct[]>([]);
  recentActivity = signal<ActivityLog[]>([]);
  isLoading = signal(true);

  private charts: Chart[] = [];

  ngOnInit() {
    this.loadSummary();
    this.loadTopProducts();
    this.loadRecentActivity();
  }

  ngAfterViewInit() {
    this.loadCharts();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  loadSummary() {
    this.analyticsService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadTopProducts() {
    this.analyticsService.getTopProducts().subscribe({
      next: (data) => this.topProducts.set(data)
    });
  }

  loadRecentActivity() {
    this.analyticsService.getRecentActivity().subscribe({
      next: (data) => this.recentActivity.set(data)
    });
  }

  loadCharts() {
    this.analyticsService.getRevenueOverTime(30).subscribe({
      next: (data) => this.buildRevenueChart(data)
    });

    this.analyticsService.getOrdersByStatus().subscribe({
      next: (data) => this.buildStatusChart(data)
    });

    this.analyticsService.getTopCategories().subscribe({
      next: (data) => this.buildCategoryChart(data)
    });

    this.analyticsService.getCustomerGrowth(30).subscribe({
      next: (data) => this.buildGrowthChart(data)
    });
  }

  buildRevenueChart(data: any[]) {
    const ctx = this.revenueChartRef?.nativeElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          label: 'Revenue',
          data: data.map(d => d.revenue),
          borderColor: '#2997ff',
          backgroundColor: 'rgba(41,151,255,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2997ff',
          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f5f5f7',
            bodyColor: '#2997ff',
            callbacks: {
              label: (ctx) => ` $${(ctx.parsed.y ?? 0).toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              maxTicksLimit: 8,
              font: { size: 11 }
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              callback: (val) => `$${val}`
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  buildStatusChart(data: any[]) {
    const ctx = this.statusChartRef?.nativeElement;
    if (!ctx) return;

    const colors: Record<string, string> = {
      pending: '#ffd60a',
      processing: '#2997ff',
      shipped: '#64d2ff',
      delivered: '#30d158',
      cancelled: '#ff453a'
    };

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.status),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: data.map(d => colors[d.status] || '#888'),
          borderColor: '#0f0f0f',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255,255,255,0.6)',
              padding: 16,
              font: { size: 12 },
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f5f5f7',
            bodyColor: '#f5f5f7'
          }
        }
      }
    });
    this.charts.push(chart);
  }

  buildCategoryChart(data: any[]) {
    const ctx = this.categoryChartRef?.nativeElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.category),
        datasets: [{
          label: 'Products',
          data: data.map(d => d.count),
          backgroundColor: 'rgba(41,151,255,0.7)',
          borderColor: '#2997ff',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f5f5f7',
            bodyColor: '#f5f5f7'
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              stepSize: 1
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  buildGrowthChart(data: any[]) {
    const ctx = this.growthChartRef?.nativeElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          label: 'New Users',
          data: data.map(d => d.count),
          borderColor: '#30d158',
          backgroundColor: 'rgba(48,209,88,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#30d158',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f5f5f7',
            bodyColor: '#30d158'
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              maxTicksLimit: 8,
              font: { size: 11 }
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              stepSize: 1
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  getEventIcon(event: string): string {
    const icons: Record<string, string> = {
      'user_registered': '👤',
      'user_login': '🔐',
      'product_created': '📦',
      'product_updated': '✏️',
      'product_deleted': '🗑️',
      'customer_created': '👥',
      'order_created': '🛒',
      'order_status_updated': '🔄',
      'order_cancelled': '❌'
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
      'order_created': 'Order placed',
      'order_status_updated': 'Order status updated',
      'order_cancelled': 'Order cancelled'
    };
    return labels[event] || event;
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'out';
    if (quantity < 10) return 'low';
    return 'ok';
  }
}