# Code Guide — Section-by-Section

This document explains **what each section of code does** in the main files. Use it for presentations, reports, or GitHub documentation.

---

## 1. Login Page — `views/login.html`

| Section | What it does |
|--------|----------------|
| `auth-page` | Full-page split layout: form on left, hero image/quote on right. |
| `auth-form-panel` | Left panel: logo, title, role tabs, form, footer link. |
| `logo-mark` | Brand logo (✈) + "TravelCo" text. |
| `role-tabs` | Buttons: **Customer** \| **Admin**. User selects login type. |
| `#loginForm` | Form with email, password, submit. |
| `input-wrapper` | Wraps each input; holds icon or toggle. |
| `password-input-wrapper` | Password field + **eye icon** button to show/hide password. |
| `password-toggle` | Eye (👁) = show password, Lock (🔒) = hide. Click toggles. |
| `btn-text` / `btn-spinner` | Submit button: text + loading spinner. |
| `auth-hero-panel` | Right panel: background image + quote. |

---

## 2. Signup Page — `views/signup.html`

| Section | What it does |
|--------|----------------|
| Same layout as login | `auth-page`, `auth-form-panel`, `auth-hero-panel`. |
| `#signupForm` | Full name, email, phone, password, confirm password, submit. |
| `password-input-wrapper` | Used for **Password** and **Confirm password**. Both have eye toggle. |
| `password-toggle` | Same as login: click to show/hide each password field. |

---

## 3. Auth Script — `public/js/auth.js`

| Section | What it does |
|--------|----------------|
| `showToast(message, type)` | Shows a temporary success (green) or error (red) message. |
| `setLoading(btn, loading)` | Disables button, shows spinner, hides "Sign in" text while submitting. |
| `setupPasswordToggles()` | Finds all `.password-toggle` buttons; on click, toggles `input` type (`password` ↔ `text`) and icon (👁 ↔ 🔒). |
| `DOMContentLoaded` | Runs when page is ready. |
| Role tabs handler | Listens for tab clicks; stores `selectedType` (`customer` \| `admin`). |
| `setupPasswordToggles()` call | Enables eye icon on password field(s). |
| Form submit handler | Prevents default, calls `setLoading(loginBtn, true)`, sends POST to `/api/auth/login` with `email`, `password`, `userType`. On success: saves user in `sessionStorage`, redirects to `/dashboard` or `/admin`. On error: `showToast`. Always calls `setLoading(loginBtn, false)` in `finally`. |

---

## 4. Signup Script — `public/js/signup.js`

| Section | What it does |
|--------|----------------|
| `showToast(msg, type)` | Same as auth: temporary success/error message. |
| `setLoading(btn, loading)` | Same as auth: disables button, spinner, hides "Create account" text. |
| `setupPasswordToggles()` | Same as auth: eye icon on **password** and **confirm password** fields. |
| `DOMContentLoaded` | Runs when page is ready. |
| `setupPasswordToggles()` call | Enables eye toggles on both password inputs. |
| Form submit handler | Validates: passwords match, length ≥ 6. POST to `/api/auth/register` with `email`, `password`, `fullName`, `phone`. On success: "Redirecting…", then redirect to `/`. On error: `showToast`. |

---

## 5. Server — `server.js`

| Section | What it does |
|--------|----------------|
| `require` | Imports Express, path, body-parser, cors, dotenv. |
| `app` / `PORT` | Creates Express app; port from `process.env.PORT` or 3000. |
| Middleware | `cors`, `bodyParser` (JSON + urlencoded), `express.static` for `public` and `views`. |
| Routes import | Requires auth, flights, hotels, packages, bookings, users. |
| `app.use('/api/...')` | Mounts API routes under `/api/auth`, `/api/flights`, etc. |
| `app.get('/')` | Serves `login.html` as homepage. |
| `app.get('/dashboard')` | Serves `customer-dashboard.html`. |
| `app.get('/flight-search')` | Serves `flight-search.html`. |
| `app.get('/hotel-search')` | Serves `hotel-search.html`. |
| `app.get('/packages')` | Serves `packages.html`. |
| `app.get('/payment')` | Serves `payment.html`. |
| `app.get('/admin')` | Serves `admin-dashboard.html`. |
| `app.get('/signup')` | Serves `signup.html`. |
| `server.listen(PORT)` | Starts HTTP server. |
| `EADDRINUSE` handler | If port is busy, tries `PORT + 1`. |
| `SIGINT` handler | Graceful shutdown: close server, then exit. |

---

## 6. Auth Routes — `routes/auth.js`

| Section | What it does |
|--------|----------------|
| `POST /login` | Receives `email`, `password`, `userType`. Finds user by email; checks role (customer vs admin); verifies password with bcrypt. Returns `{ success, user }` or error. |
| `POST /register` | Receives `email`, `password`, `fullName`, `phone`. Validates; allows only `userType === 'customer'`; checks email not taken; hashes password; inserts into `users`. Returns `{ success, userId }` or error. |

---

## 7. Forms Overview

| Form | Page | Fields | Special behaviour |
|------|------|--------|--------------------|
| **Login** | `login.html` | Email, Password | Role tabs (Customer/Admin). Eye toggle on password. Loading on submit. |
| **Signup** | `signup.html` | Full name, Email, Phone, Password, Confirm | Eye toggles on both password fields. Validation: match + min length. Loading on submit. |
| **Flight search** | `flight-search.html` | Origin, Destination, Depart, Return | Search → display results → book → payment. |
| **Hotel search** | `hotel-search.html` | Location | Search → display → book → payment. |
| **Packages** | `packages.html` | Search bar + filters (price, duration, type) | Filter packages, then book → payment. |
| **Payment** | `payment.html` | Method (Card / Zaad / E-Dahab) + related inputs | Simulated payment; creates booking. |
| **Settings** | `customer-dashboard` | Name, Email (readonly), Phone | Save profile. |
| **Add Flight/Hotel/Package** | `admin-dashboard` | Modal forms per type | POST to `/api/flights`, `/api/hotels`, `/api/packages`. |

---

## 8. Styles — `public/css/styles.css`

| Section | What it does |
|--------|----------------|
| `:root` | CSS variables: fonts, colors (primary teal, accent amber), shadows, radius. |
| `.input-wrapper` | Relative positioning for input + icon/toggle. |
| `input-wrapper .input-icon` | Absolute icon on the right (non-clickable). |
| `.password-input-wrapper input` | Extra `padding-right` so text doesn’t overlap eye button. |
| `.password-toggle` | Absolute button (eye icon). Hover/focus styles. Used to show/hide password. |

---

Use this guide together with **README.md** (requirements, structure, setup) for a clear, presentable project description.
