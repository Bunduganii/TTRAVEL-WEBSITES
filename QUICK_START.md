# 🚀 QUICK START GUIDE

## Step 1: Install XAMPP (Easiest Way)
1. Download: https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Click "Start" for Apache and MySQL

## Step 2: Create Database
1. Open browser: http://localhost/phpmyadmin
2. Click "New" (left sidebar)
3. Database name: `travel_agency`
4. Click "Create"
5. Click "Import" tab
6. Choose file: `schema.sql` (from project folder)
7. Click "Go" ✅

## Step 3: Install Node.js Packages
Open terminal in project folder:
```bash
npm install
```

## Step 4: Create .env File
Create file named `.env` in project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_agency
PORT=3000
JWT_SECRET=secret123
```
(Leave DB_PASSWORD empty if MySQL has no password)

## Step 5: Start Server
```bash
npm start
```

## Step 6: Open Browser
Go to: http://localhost:3000

## Step 7: Login
- Email: `customer@example.com`
- Password: (any password)
- Click "Log In"

## ✅ DONE!

If you see errors:
1. Check MySQL is running in XAMPP
2. Check database `travel_agency` exists
3. Check `.env` file exists and has correct info
4. See DATABASE_SETUP.md for detailed help

