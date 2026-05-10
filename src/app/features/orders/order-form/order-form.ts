import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order';
import { CustomerService, Customer } from '../../../core/services/customer';
import { ProductService, Product } from '../../../core/services/product';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderFormComponent implements OnInit {
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private router = inject(Router);

  customers = signal<Customer[]>([]);
  products = signal<Product[]>([]);
  cart = signal<CartItem[]>([]);
  selectedCustomerId = signal('');
  selectedProductId = signal('');
  selectedQuantity = signal(1);
  notes = signal('');
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );
  tax = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() + this.tax());

  ngOnInit() {
    this.loadCustomers();
    this.loadProducts();
  }

  loadCustomers() {
    this.customerService.getCustomers(1, 100).subscribe({
      next: (r) => this.customers.set(r.items),
      error: () => {}
    });
  }

  loadProducts() {
    this.productService.getProducts(1, 100).subscribe({
      next: (r) => this.products.set(r.items.filter(p => p.stock_quantity > 0)),
      error: () => {}
    });
  }

  onAddToCart() {
    if (!this.selectedProductId() || this.selectedQuantity() < 1) return;

    const product = this.products().find(p => p.id === this.selectedProductId());
    if (!product) return;

    const existing = this.cart().find(i => i.product.id === product.id);
    if (existing) {
      this.cart.update(items =>
        items.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + this.selectedQuantity() }
          : i
        )
      );
    } else {
      this.cart.update(items => [...items, { product, quantity: this.selectedQuantity() }]);
    }

    this.selectedProductId.set('');
    this.selectedQuantity.set(1);
  }

  onRemoveFromCart(productId: string) {
    this.cart.update(items => items.filter(i => i.product.id !== productId));
  }

  onPlaceOrder() {
    if (!this.selectedCustomerId()) {
      this.errorMessage.set('Please select a customer');
      return;
    }
    if (this.cart().length === 0) {
      this.errorMessage.set('Please add at least one product');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.orderService.createOrder({
      customer_id: this.selectedCustomerId(),
      items: this.cart().map(i => ({
        product_id: i.product.id,
        quantity: i.quantity
      })),
      notes: this.notes() || undefined
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.detail || 'Failed to place order');
      }
    });
  }

  onCancel() { this.router.navigate(['/orders']); }
}