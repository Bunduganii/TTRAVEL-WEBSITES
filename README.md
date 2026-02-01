# TravelCo — Travel Agency Management System

A full-stack **travel agency management system** with customer portal and admin dashboard. Built for booking flights, hotels, and packages, with user authentication and payment flow.

---

## Table of Contents

- [Requirements](#requirements)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Forms & Pages](#forms--pages)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Requirements

### Functional Requirements

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | **User authentication** | Login (Customer / Admin), Signup (Customer only). Session stored in `sessionStorage`. |
| 2 | **Role-based access** | Customers → dashboard, bookings, search. Admins → admin dashboard, manage bookings, add flights/hotels/packages. |
| 3 | **Flight search & booking** | Search by origin, destination, date. Display results, book, redirect to payment. |
| 4 | **Hotel search & booking** | Search by location. Display hotels, book, redirect to payment. |
| 5 | **Package tours** | Browse packages, filters (price, duration, type), search bar. Book and pay. |
| 6 | **Payment** | Credit Card, Zaad, E-Dahab (simulated). Create booking record after “payment”. |
| 7 | **Customer dashboard** | Recent bookings, My Trips (filter/sort), Saved, Wallet, Settings, profile update. |
| 8 | **Admin dashboard** | Stats (revenue, bookings, users), charts, add Flight/Hotel/Package, list bookings & users, search. |
| 9 | **Password visibility** | Eye icon on login and signup password fields to show/hide password. |
| 10 | **Loading states** | Spinner on login, signup, logout; skeleton loaders where applicable. |

### Non-Functional Requirements

- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Database**: MySQL / MariaDB (e.g. XAMPP).
- **Security**: Passwords hashed with bcrypt; no plain-text storage.

---

## Features

- **Login**: Email + password, Customer / Admin tabs. Eye icon to show/hide password.
- **Signup**: Full name, email, phone (optional), password, confirm password. Eye icon on both password fields. Customer-only registration.
- **Flights**: Search, list results, book, pay.
- **Hotels**: Search by location, list, book, pay.
- **Packages**: Grid view, search bar, filters (price, duration, trip type). Book and pay.
- **Payment**: Simulated Credit Card, Zaad, E-Dahab. Creates booking and redirects to confirmation.
- **Customer dashboard**: Tabs (Dashboard, My Trips, Saved, Wallet, Settings). Recent bookings, filters, sort, profile save.
- **Admin dashboard**: Revenue/bookings/users stats, charts, add Flight/Hotel/Package, bookings table, users table, search.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Database | MySQL / MariaDB |
| Auth | bcrypt, sessionStorage (client) |
| Styling | Custom CSS (Sora + DM Sans, teal/amber palette) |

---

## Project Structure

```
TTRAVEL/
├── config/
│   └── database.js          # MySQL connection pool
├── public/
│   ├── css/
│   │   └── styles.css       # Global styles, auth, forms, dashboard, etc.
│   └── js/
│       ├── auth.js          # Login: form submit, role tabs, password toggle, loading
│       ├── signup.js        # Signup: form submit, validation, password toggles, loading
│       ├── dashboard.js     # Customer dashboard: tabs, bookings, filters, settings
│       ├── booking.js       # Flights, hotels, packages: search, filters, display, book
│       ├── admin.js         # Admin dashboard: stats, charts, CRUD, tables, search
│       └── modal.js         # Reusable modal (success, error, info)
├── routes/
│   ├── auth.js              # POST /login, POST /register
│   ├── flights.js           # GET/POST flights, search
│   ├── hotels.js            # GET/POST hotels, search
│   ├── packages.js          # GET/POST packages
│   ├── bookings.js          # GET/POST bookings, user bookings
│   └── users.js             # GET users (admin)
├── views/
│   ├── login.html           # Sign-in page (email, password, eye icon, Customer/Admin tabs)
│   ├── signup.html          # Create account (name, email, phone, password, confirm, eye icons)
│   ├── customer-dashboard.html
│   ├── admin-dashboard.html
│   ├── flight-search.html
│   ├── hotel-search.html
│   ├── packages.html
│   └── payment.html
├── server.js                # Express app, middleware, routes, static files, HTML routes
├── schema.sql               # DB schema
├── CREATE_ADMIN_SCRIPT.js   # Run once: creates admin@travel.com / admin123
├── package.json
├── .env.example             # Copy to .env and set DB_* if needed
└── README.md
```

---

## Forms & Pages

| Page | Form / Section | Purpose |
|------|----------------|---------|
| **Login** (`/`) | Email, Password (with eye toggle), Customer/Admin tabs | Authenticate; redirect to dashboard or admin. |
| **Signup** (`/signup`) | Full name, Email, Phone, Password, Confirm password (eye toggles on both) | Register new customer. |
| **Flight search** | Origin, Destination, Depart, Return | Search flights, then book. |
| **Hotel search** | Location | Search hotels, then book. |
| **Packages** | Search bar, filters (price, duration, type) | Browse and book packages. |
| **Payment** | Payment method (Card / Zaad / E-Dahab), related fields | Simulated payment; create booking. |
| **Customer dashboard** | Settings: name, email, phone; My Trips: search, status, sort | Update profile; filter/sort trips. |
| **Admin dashboard** | Add Flight / Hotel / Package modals; search bookings | CRUD for flights, hotels, packages; search bookings. |

---

## Installation

1. **Install Node.js** (v16+): [nodejs.org](https://nodejs.org/)
2. **Install MySQL/MariaDB**: e.g. via [XAMPP](https://www.apachefriends.org/)

```bash
git clone <your-repo-url>
cd TTRAVEL
npm install
```

3. **Setup Database**:
   - Start MySQL (e.g. XAMPP).
   - Create database `travel_agency_db` in phpMyAdmin (or `CREATE DATABASE travel_agency_db;`).
   - Import `schema.sql` in phpMyAdmin.

4. **Create `.env` file** in project root (copy from `.env.example`):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=travel_agency_db
   PORT=3000
   JWT_SECRET=secret123
   ```
   Use empty `DB_PASSWORD=` if MySQL has no password. If MySQL has a password, set it here.

5. **Run server** (admin is already in the database: **admin@travel.com** / **admin123**):
   ```bash
   npm start
   ```
   You should see: `✅ Database connected successfully`

6. Open **http://localhost:3000**. Log in with **Admin** tab → **admin@travel.com** / **admin123**.

---

## Database Setup

1. Start MySQL (e.g. XAMPP).
2. Create database: `CREATE DATABASE IF NOT EXISTS travel_agency_db;`
3. Import `schema.sql` via phpMyAdmin or:
   ```bash
   mysql -u root travel_agency_db < schema.sql
   ```
4. Adjust `DB_*` in `.env` if your setup differs.

---

## Usage

### Login

- **Customer**: Choose “Customer” tab → email + password → Sign in. Redirects to `/dashboard`.
- **Admin**: Choose “Admin” tab → admin email + password → Sign in. Redirects to `/admin`.
- Use the **eye icon** next to the password field to show/hide password.

### Signup

- Fill Full name, Email, Phone (optional), Password, Confirm password.
- Use **eye icons** on password fields to show/hide.
- Submit → account created → redirect to login.

### Default admin account (in database after importing `schema.sql`)

- **Email:** `admin@travel.com` · **Password:** `admin123` · Select the **Admin** tab, then Sign in.
- **Customer**: Register via Signup.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (body: `email`, `password`, `userType`) |
| POST | `/api/auth/register` | Register customer (body: `email`, `password`, `fullName`, `phone`?) |
| GET | `/api/flights` | List flights |
| GET | `/api/flights/search?origin=&destination=&departureDate=` | Search flights |
| POST | `/api/flights` | Create flight (admin) |
| GET | `/api/hotels` | List hotels |
| GET | `/api/hotels/search?city=` | Search hotels |
| POST | `/api/hotels` | Create hotel (admin) |
| GET | `/api/packages` | List packages |
| POST | `/api/packages` | Create package (admin) |
| GET | `/api/bookings` | All bookings (admin) |
| GET | `/api/bookings/user/:userId` | User’s bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/users` | List users (admin) |

---

## License

This project is for **educational purposes** (e.g. university assignment). Feel free to use and adapt with attribution.
