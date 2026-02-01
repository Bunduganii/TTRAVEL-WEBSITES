# Complete Database Setup Guide

## Quick Setup Steps

### Step 1: Open phpMyAdmin

1. Start MySQL in XAMPP Control Panel
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Click on "SQL" tab at the top

### Step 2: Run Clean Database Setup

Copy and paste the entire content of `CLEAN_DATABASE_SETUP.sql` into the SQL tab and click "Go"

**OR** use the SQL commands below:

---

## Complete SQL Commands

### 1. Drop and Create Database

```sql
DROP DATABASE IF EXISTS travel_agency_db;
CREATE DATABASE travel_agency_db;
USE travel_agency_db;
```

### 2. Create All Tables

Copy all CREATE TABLE commands from `CLEAN_DATABASE_SETUP.sql`

### 3. Create Admin User

**Option A: Using Node.js Script (Recommended)**
```bash
node CREATE_ADMIN_SCRIPT.js
```

**Option B: Using SQL (Password hash included)**
```sql
INSERT INTO users (email, password, full_name, user_type, phone) VALUES
('admin@travel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'admin', NULL);
```

---

## Admin Login Credentials

### Admin Account:
- **Email:** `admin@travel.com`
- **Password:** `admin123`
- **User Type:** `admin`

### How to Login:
1. Go to: http://localhost:3000
2. Click **"Admin"** tab
3. Enter:
   - Email: `admin@travel.com`
   - Password: `admin123`
4. Click "Sign In"

---

## Complete Setup Process

### Method 1: Using SQL File (phpMyAdmin)

1. **Open phpMyAdmin:** http://localhost/phpmyadmin
2. **Click SQL tab**
3. **Copy entire `CLEAN_DATABASE_SETUP.sql` file**
4. **Paste into SQL tab**
5. **Click "Go"**
6. **Run admin creation script:**
   ```bash
   node CREATE_ADMIN_SCRIPT.js
   ```

### Method 2: Step by Step SQL Commands

1. **Drop existing database:**
   ```sql
   DROP DATABASE IF EXISTS travel_agency_db;
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE travel_agency_db;
   USE travel_agency_db;
   ```

3. **Create tables:** (Copy from CLEAN_DATABASE_SETUP.sql)

4. **Insert sample data:** (Copy from CLEAN_DATABASE_SETUP.sql)

5. **Create admin user:**
   ```bash
   node CREATE_ADMIN_SCRIPT.js
   ```

---

## Verify Setup

### Check Tables Created:
```sql
SHOW TABLES;
```
Should show: `users`, `flights`, `hotels`, `packages`, `bookings`

### Check Admin User:
```sql
SELECT id, email, full_name, user_type FROM users WHERE email = 'admin@travel.com';
```
Should show admin user with user_type = 'admin'

### Check Sample Data:
```sql
SELECT COUNT(*) FROM flights;   -- Should show 5
SELECT COUNT(*) FROM hotels;     -- Should show 5
SELECT COUNT(*) FROM packages;   -- Should show 5
```

---

## Troubleshooting

### Error: "Table already exists"
- Run: `DROP DATABASE IF EXISTS travel_agency_db;` first
- Then create database again

### Error: "Access denied"
- Make sure MySQL is running in XAMPP
- Check your MySQL password in `.env` file

### Admin login not working
- Run: `node CREATE_ADMIN_SCRIPT.js` to create admin
- Make sure password hash is correct
- Check user_type is 'admin' in database

---

## Files Included

1. **CLEAN_DATABASE_SETUP.sql** - Complete database setup
2. **CREATE_ADMIN_USER.sql** - Admin user creation SQL
3. **CREATE_ADMIN_SCRIPT.js** - Node.js script to create admin (recommended)

---

## After Setup

1. ✅ Database created
2. ✅ Tables created
3. ✅ Sample data inserted
4. ✅ Admin user created
5. ✅ Start server: `npm start`
6. ✅ Login at: http://localhost:3000

**Admin Login:**
- Email: `admin@travel.com`
- Password: `admin123`
