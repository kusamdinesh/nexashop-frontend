# NexaShop Frontend 🛒

A modern e-commerce admin dashboard built with **Angular 19** featuring the new Signals API, dark premium UI, real-time charts, and role-based access control.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## ✨ Features

### Modern Angular 19
- **Signals** — reactive state management without RxJS complexity
- **Standalone Components** — no NgModules, cleaner architecture
- **Lazy Loading** — routes load on demand for better performance
- **HTTP Interceptor** — automatic JWT token injection on every request
- **Auth Guard** — protects routes from unauthorized access
- **Role Guard** — restricts pages based on user role

### UI/UX
- **Dark Premium UI** — glass morphism cards, electric blue accents
- **Chart.js Analytics** — revenue line chart, orders doughnut, category bars, growth chart
- **Toast Notifications** — signal-based notification system
- **Page Transitions** — smooth animations between routes
- **Role Badge** — sidebar shows current user role

### Modules
- 🔐 **Auth** — Login with JWT, Register with live password strength meter
- 📊 **Dashboard** — Live stats from PostgreSQL + MongoDB
- 📦 **Products** — CRUD with search, filters, pagination
- 👥 **Customers** — CRUD with address management
- 🛒 **Orders** — Create orders, status tracking, order detail
- 🏭 **Inventory** — Stock levels, adjustments, history
- 📈 **Analytics** — Real-time Chart.js visualizations
- 👤 **Users** — Role management (Admin only)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 19 |
| Language | TypeScript 5 |
| State | Angular Signals |
| Charts | Chart.js |
| UI | Custom dark theme |
| HTTP | Angular HttpClient |
| Auth | JWT + HTTP Interceptor |
| Server | Nginx (production) |
| Container | Docker |
| CI/CD | GitHub Actions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Angular CLI 19

### Local Setup

```bash
# Clone the repo
git clone https://github.com/kusamdinesh/nexashop-frontend.git
cd nexashop-frontend

# Install dependencies
npm install

# Start development server
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

Make sure the backend is running at [http://localhost:8000](http://localhost:8000)

### Docker Setup

```bash
docker compose up --build
```

---

## 📁 Project Structure

nexashop-frontend/src/app/
├── core/
│   ├── services/           # API services
│   │   ├── auth.ts         # Auth + Signals
│   │   ├── product.ts
│   │   ├── customer.ts
│   │   ├── order.ts
│   │   ├── inventory.ts
│   │   ├── analytics.ts
│   │   └── toast.ts        # Toast notification service
│   ├── guards/
│   │   ├── auth-guard.ts   # Protects all routes
│   │   └── role-guard.ts   # Admin/Manager guards
│   └── interceptors/
│       └── auth.interceptor.ts  # Auto JWT injection
├── features/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── register/       # Register with password strength
│   ├── dashboard/          # Live stats dashboard
│   ├── products/
│   │   ├── product-list/   # Search, filter, pagination
│   │   └── product-form/   # Add/Edit product
│   ├── customers/
│   │   ├── customer-list/
│   │   └── customer-form/
│   ├── orders/
│   │   ├── order-list/
│   │   ├── order-form/     # Multi-item order builder
│   │   └── order-detail/
│   ├── inventory/
│   │   └── inventory-list/ # Stock management
│   ├── analytics/
│   │   └── analytics-dashboard/  # Chart.js charts
│   └── users/
│       └── user-list/      # Role management
└── shared/
├── layout/             # Shell layout with router-outlet
├── navbar/             # Frosted glass navbar
├── sidebar/            # Role-based sidebar
└── toast/              # Toast notification component

---

## 🎨 Design System

```css
/* Color Palette */
--bg: #080808          /* Near black background */
--accent: #2997ff      /* Electric blue */
--success: #30d158     /* Green */
--warning: #ffd60a     /* Yellow */
--danger: #ff453a      /* Red */

/* Effects */
Glass morphism cards
Backdrop blur navbar
Glow on accent buttons
Smooth page transitions
```

---

## 👥 Default Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@nexashop.com | Admin123! | Full access |
| Manager | manager@nexashop.com | Manager123! | No delete, no users |
| Staff | staff@nexashop.com | Staff123! | Read only |

---

## 🔒 Role Based Access

| Page | Admin | Manager | Staff |
|------|-------|---------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ |
| Analytics | ✅ | ✅ | ❌ |
| Users | ✅ | ❌ | ❌ |

---

## 🐳 CI/CD Pipeline

Every push to `main` triggers:

Code Quality → Security Scan → Build → SonarCloud → Docker Build → Push to Docker Hub

Docker image: `kusamdinesh/nexashop-frontend:latest`

---

## 🤝 Related Repositories

- [nexashop-backend](https://github.com/kusamdinesh/nexashop-backend) — FastAPI backend
- [nexashop-docker](https://github.com/kusamdinesh/nexashop-docker) — Docker Compose setup