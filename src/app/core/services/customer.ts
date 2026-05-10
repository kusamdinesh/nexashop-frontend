import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  is_active: boolean;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at?: string;
}

export interface CustomerListResponse {
  items: Customer[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CustomerCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1/customers';

  getCustomers(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    isActive?: boolean
  ): Observable<CustomerListResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);

    if (search) params = params.set('search', search);
    if (isActive !== undefined) params = params.set('is_active', isActive);

    return this.http.get<CustomerListResponse>(this.apiUrl, { params });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(data: CustomerCreate): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, data);
  }

  updateCustomer(id: string, data: Partial<CustomerCreate>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, data);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}