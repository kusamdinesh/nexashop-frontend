import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Summary {
  total_products: number;
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  low_stock_products: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
}

export interface CustomerGrowth {
  date: string;
  count: number;
}

export interface ActivityLog {
  event: string;
  email?: string;
  timestamp: string;
  product_name?: string;
  customer_email?: string;
}

export interface ActivityBreakdown {
  event: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1/analytics';

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/summary`);
  }

  getTopProducts(limit: number = 5): Observable<TopProduct[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products`, { params });
  }

  getCustomerGrowth(days: number = 30): Observable<CustomerGrowth[]> {
    const params = new HttpParams().set('days', days);
    return this.http.get<CustomerGrowth[]>(`${this.apiUrl}/customer-growth`, { params });
  }

  getRecentActivity(limit: number = 10): Observable<ActivityLog[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/recent-activity`, { params });
  }

  getActivityBreakdown(): Observable<ActivityBreakdown[]> {
    return this.http.get<ActivityBreakdown[]>(`${this.apiUrl}/activity-breakdown`);
  }
}