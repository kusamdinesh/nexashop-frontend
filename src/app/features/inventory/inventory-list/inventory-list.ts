import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  category: string;
  status: string;
}

interface InventorySummary {
  total: number;
  out_of_stock: number;
  low_stock: number;
  well_stocked: number;
}

interface StockHistory {
  product_name: string;
  sku: string;
  old_quantity: number;
  adjustment: number;
  new_quantity: number;
  reason: string;
  adjusted_by: string;
  timestamp: string;
}

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.css'
})
export class InventoryListComponent implements OnInit {
  Math = Math;
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = 'http://localhost:8000/api/v1/inventory';

  // ── State ────────────────────────────────────────
  items = signal<InventoryItem[]>([]);
  summary = signal<InventorySummary | null>(null);
  history = signal<StockHistory[]>([]);
  isLoading = signal(false);
  showAdjustModal = signal(false);
  showHistoryModal = signal(false);
  selectedItem = signal<InventoryItem | null>(null);

  // ── Pagination ───────────────────────────────────
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);

  // ── Filters ──────────────────────────────────────
  searchQuery = signal('');
  statusFilter = signal('');

  // ── Adjustment Form ──────────────────────────────
  adjustmentValue = signal(0);
  adjustmentReason = signal('');
  isAdjusting = signal(false);

  hasItems = computed(() => this.items().length > 0);

  ngOnInit() { this.loadInventory(); }

  loadInventory() {
    this.isLoading.set(true);
    let params = new HttpParams()
      .set('page', this.currentPage())
      .set('page_size', this.pageSize());

    if (this.searchQuery()) params = params.set('search', this.searchQuery());
    if (this.statusFilter()) params = params.set('status', this.statusFilter());

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.items.set(response.items);
        this.summary.set(response.summary);
        this.totalItems.set(response.total);
        this.totalPages.set(response.total_pages);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Failed to load inventory');
        this.isLoading.set(false);
      }
    });
  }

  onSearch() { this.currentPage.set(1); this.loadInventory(); }
  onFilterChange() { this.currentPage.set(1); this.loadInventory(); }
  onPageChange(page: number) { this.currentPage.set(page); this.loadInventory(); }

  onAdjustStock(item: InventoryItem) {
    this.selectedItem.set(item);
    this.adjustmentValue.set(0);
    this.adjustmentReason.set('');
    this.showAdjustModal.set(true);
  }

  onConfirmAdjust() {
    const item = this.selectedItem();
    if (!item || !this.adjustmentReason()) {
      this.toastService.warning('Please enter a reason for the adjustment');
      return;
    }

    if (this.adjustmentValue() === 0) {
      this.toastService.warning('Adjustment value cannot be zero');
      return;
    }

    this.isAdjusting.set(true);

    this.http.post(`${this.apiUrl}/adjust`, {
      product_id: item.id,
      adjustment: this.adjustmentValue(),
      reason: this.adjustmentReason()
    }).subscribe({
      next: (response: any) => {
        this.toastService.success(
          `Stock updated: ${response.old_quantity} → ${response.new_quantity}`
        );
        this.showAdjustModal.set(false);
        this.isAdjusting.set(false);
        this.loadInventory();
      },
      error: (err) => {
        this.toastService.error(err.error?.detail || 'Failed to adjust stock');
        this.isAdjusting.set(false);
      }
    });
  }

  onViewHistory(item: InventoryItem) {
    this.selectedItem.set(item);
    this.http.get<StockHistory[]>(
      `${this.apiUrl}/history?product_id=${item.id}&limit=10`
    ).subscribe({
      next: (data) => {
        this.history.set(data);
        this.showHistoryModal.set(true);
      },
      error: () => this.toastService.error('Failed to load history')
    });
  }

  onCloseModals() {
    this.showAdjustModal.set(false);
    this.showHistoryModal.set(false);
    this.selectedItem.set(null);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      ok: 'In Stock',
      low: 'Low Stock',
      out: 'Out of Stock'
    };
    return map[status] || status;
  }
}