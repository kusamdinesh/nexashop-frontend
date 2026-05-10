import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  sku: string;
  category_id?: string;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  sku: string;
  category_id?: string;
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1/products';

  // ── Categories ──────────────────────────────────
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(data: { name: string; description?: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, data);
  }

  // ── Products ────────────────────────────────────
  getProducts(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    categoryId?: string,
    isActive?: boolean
  ): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);

    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('category_id', categoryId);
    if (isActive !== undefined) params = params.set('is_active', isActive);

    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  updateProduct(id: string, data: Partial<ProductCreate>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}