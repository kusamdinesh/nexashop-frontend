import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, ProductCreate, Category } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit {
  // ── Dependencies ─────────────────────────────────
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ── State Signals ────────────────────────────────
  isEditMode = signal(false);
  productId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  categories = signal<Category[]>([]);

  // ── Form Fields ──────────────────────────────────
  name = signal('');
  description = signal('');
  price = signal<number | null>(null);
  stockQuantity = signal<number | null>(null);
  sku = signal('');
  categoryId = signal('');
  imageUrl = signal('');

  ngOnInit() {
    this.loadCategories();

    // Check if edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => {}
    });
  }

  loadProduct(id: string) {
    this.isLoading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.name.set(product.name);
        this.description.set(product.description || '');
        this.price.set(product.price);
        this.stockQuantity.set(product.stock_quantity);
        this.sku.set(product.sku);
        this.categoryId.set(product.category_id || '');
        this.imageUrl.set(product.image_url || '');
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load product');
        this.isLoading.set(false);
      }
    });
  }

  onSave() {
    // Validation
    if (!this.name() || !this.sku() || !this.price() || this.stockQuantity() === null) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    if (this.price()! <= 0) {
      this.errorMessage.set('Price must be greater than 0');
      return;
    }

    if (this.stockQuantity()! < 0) {
      this.errorMessage.set('Stock quantity cannot be negative');
      return;
    }

    const productData: ProductCreate = {
      name: this.name(),
      description: this.description() || undefined,
      price: this.price()!,
      stock_quantity: this.stockQuantity()!,
      sku: this.sku(),
      category_id: this.categoryId() || undefined,
      image_url: this.imageUrl() || undefined
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    if (this.isEditMode()) {
      this.productService.updateProduct(this.productId()!, productData).subscribe({
        next: () => {
          this.toastService.success('Product updated successfully! ✏️');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.detail || 'Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.toastService.success('Product created successfully! 📦');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to create product');
          this.isSaving.set(false);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/products']);
  }
}