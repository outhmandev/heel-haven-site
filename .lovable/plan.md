
# ShoeStore — Professional eCommerce Platform

## Overview
A modern, full-featured shoe store for men and women with authentication, shopping cart, order management, product reviews, and an admin dashboard. Clean black/white/beige design, fully responsive.

---

## 1. Design & Branding
- **Color palette**: Black, white, warm beige/tan accents
- **Typography**: Clean sans-serif (Inter or similar)
- **Responsive**: Mobile-first layout with hamburger nav on small screens
- **Style**: Minimalist, editorial-inspired product imagery layout

---

## 2. Pages & Navigation

### Public Pages
- **Home** — Hero banner, featured products, shop-by-category (Men/Women), newsletter section
- **Shop** — Filterable product grid (category, size, price range, sort)
- **Product Detail** — Large image gallery, description, price, size selector, add-to-cart, customer reviews with star ratings
- **Cart** — Item list with quantity controls, remove items, order summary, proceed to checkout
- **Checkout** — Shipping address form, order summary, place order (cash on delivery)

### Auth Pages
- **Login / Register** — Email & password authentication
- **Profile** — View/edit name, email, order history

### Admin Dashboard (protected)
- **Products Management** — Add, edit, delete products (name, description, price, images, sizes, category)
- **Orders Management** — View all orders, update order status (pending → confirmed → shipped → delivered)
- **Users Management** — View registered users

---

## 3. Core Features

### Authentication & Profiles
- Supabase Auth for registration, login, logout, password reset
- Profiles table for display name and shipping info
- Role-based access: separate `user_roles` table with admin role

### Product Catalog
- Products table with name, description, price, images (URLs), category (men/women), available sizes
- 5-10 pre-loaded sample shoes across men's and women's categories
- Category filtering and search

### Shopping Cart
- Client-side cart state (persisted in localStorage for guests, synced for logged-in users)
- Add/remove items, update quantities, size selection

### Orders & Checkout
- Cash on delivery checkout flow
- Shipping address collection
- Orders table linked to users, order_items table for line items
- Order status tracking (pending → confirmed → shipped → delivered)
- Order history in user profile

### Product Reviews
- Authenticated users can submit star ratings (1-5) and written reviews
- Reviews displayed on product detail page with average rating
- One review per user per product

### Admin Dashboard
- Protected route accessible only to users with admin role
- CRUD operations for products
- Order management with status updates
- User list view

---

## 4. Database Structure (Supabase)

- **profiles** — user display name, phone, shipping address
- **user_roles** — role assignment (admin/user) with security definer function
- **products** — name, description, price, image URLs, category, sizes, created_at
- **orders** — user_id, status, total, shipping address, created_at
- **order_items** — order_id, product_id, quantity, size, price
- **reviews** — user_id, product_id, rating, comment, created_at

All tables with appropriate RLS policies.

---

## 5. Sample Data
- 5-10 shoes (mix of men's and women's) with placeholder images, descriptions, prices, and sizes
