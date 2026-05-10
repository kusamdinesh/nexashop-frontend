import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnalyticsService, Summary } from '../../../core/services/analytics';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  summary = signal<Summary | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.analyticsService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}