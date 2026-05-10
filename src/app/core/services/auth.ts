import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v1/auth';

  // ── Signals ─────────────────────────────────────
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  // ── Computed values derived from signals ─────────
  isLoggedIn = computed(() => !!this.token());
  // ── Role Computed Signals ────────────────────────
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isManager = computed(() => 
    this.currentUser()?.role === 'admin' || 
    this.currentUser()?.role === 'manager'
  );
  isStaff = computed(() => !!this.currentUser());

  getRole = computed(() => this.currentUser()?.role || '');
  currentUser$ = computed(() => this.currentUser());

  constructor(private http: HttpClient) {
    // Load saved session on app start
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      this.token.set(savedToken);
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  register(data: {
    full_name: string;
    email: string;
    password: string
  }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // OAuth2 requires form data format
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`, formData
    ).pipe(
      tap(response => {
        // Save to localStorage and update signals
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.token.set(response.access_token);
        this.currentUser.set(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  getUserValue(): User | null {
    return this.currentUser();
  }
}