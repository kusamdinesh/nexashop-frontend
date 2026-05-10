import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast';


interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = 'http://localhost:8000/api/v1/users';

  users = signal<User[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  selectedUser = signal<User | null>(null);
  showRoleModal = signal(false);
  newRole = signal('');

  roles = ['admin', 'manager', 'staff'];

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.isLoading.set(true);
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load users');
        this.isLoading.set(false);
      }
    });
  }

  onChangeRole(user: User) {
    this.selectedUser.set(user);
    this.newRole.set(user.role);
    this.showRoleModal.set(true);
  }

  onConfirmRole() {
    const user = this.selectedUser();
    if (!user) return;

    this.http.put(`${this.apiUrl}/${user.id}`, { role: this.newRole() }).subscribe({
      next: () => {
        this.toastService.success('User role updated successfully!');
        this.showRoleModal.set(false);
        this.loadUsers();
      },
      error: (err) => this.errorMessage.set(err.error?.detail || 'Failed to update role')
    });
  }

  onToggleActive(user: User) {
    this.http.put(`${this.apiUrl}/${user.id}`, { is_active: !user.is_active }).subscribe({
      next: () => {
        this.toastService.success('User status updated!');
        this.loadUsers();
      },
      error: (err) => this.errorMessage.set(err.error?.detail || 'Failed to update user')
    });
  }

  onCloseModal() {
    this.showRoleModal.set(false);
    this.selectedUser.set(null);
  }

  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      admin: 'danger',
      manager: 'accent',
      staff: 'success'
    };
    return map[role] || 'neutral';
  }
}