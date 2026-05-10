import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product, Category } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  // ── Dependencies ─────────────────────────────────
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // ── State Signals ────────────────────────────────
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  showDeleteConfirm = signal(false);
  selectedProduct = signal<Product | null>(null);

  // ── Pagination Signals ───────────────────────────
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);

  // ── Filter Signals ───────────────────────────────
  searchQuery = signal('');
  selectedCategory = signal('');

  // ── Computed ─────────────────────────────────────
  hasProducts = computed(() => this.products().length > 0);

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts(
      this.currentPage(),
      this.pageSize(),
      this.searchQuery() || undefined,
      this.selectedCategory() || undefined
    ).subscribe({
      next: (response) => {
        this.products.set(response.items);
        this.totalItems.set(response.total);
        this.totalPages.set(response.total_pages);
        this.isLoading.set(false);
      },
    error: () => {
      this.toastService.error('Failed to load products');
      this.isLoading.set(false);
    }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => {}
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onCategoryChange() {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  onAddProduct() {
    this.router.navigate(['/products/new']);
  }

  onEditProduct(product: Product) {
    this.router.navigate(['/products/edit', product.id]);
  }

  onDeleteClick(product: Product) {
    this.selectedProduct.set(product);
    this.showDeleteConfirm.set(true);
  }

  onConfirmDelete() {
    const product = this.selectedProduct();
    if (!product) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.selectedProduct.set(null);
        this.toastService.success('Product deleted successfully');
        this.loadProducts();
      },
      error: () => {
        this.toastService.error('Failed to delete product');
      }
    });
  }

  onCancelDelete() {
    this.showDeleteConfirm.set(false);
    this.selectedProduct.set(null);
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return 'Uncategorized';
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}