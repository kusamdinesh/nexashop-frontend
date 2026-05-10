import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  isSidebarOpen = signal(true);

  onMenuToggle() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}