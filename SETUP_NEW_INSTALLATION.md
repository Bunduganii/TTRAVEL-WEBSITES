# Setup Guide for New Installation

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MySQL Database

**Option A: Using XAMPP (Recommended)**
1. Download and install XAMPP: https://www.apachefriends.org/
2. Start MySQL in XAMPP Control Panel
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create database: Click "New" → Name: `travel_agency_db` → Click "Create"
5. Import schema: Click on `travel_agency_db` → Click "Import" → Choose `schema.sql` → Click "Go"

**Option B: Using MySQL Command Line**
```bash
mysql -u root -p
```
Then:
```sql
CREATE DATABASE travel_agency_db;
USE travel_agency_db;
SOURCE schema.sql;
```

### 3. Find Your MySQL Password

**Run the test script to find your password:**
```bash
node test-db-connection.js
```

This will test common passwords and tell you which one works!

**Common XAMPP MySQL passwords:**
- Empty password (no password)
- `1234`
- `123`
- `root`
- `password`

### 4. Create .env File

Create a file named `.env` in the project root folder with:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

**Important:**
- Replace `your_password_here` with the password that worked in step 3
- If no password works, use: `DB_PASSWORD=` (empty)
- File name must be exactly `.env` (with the dot at the beginning)

### 5. Test Connection

```bash
node test-db-connection.js
```

You should see: `✅ SUCCESS! Password "..." works!`

### 6. Start Server

```bash
npm start
```

You should see: `✅ Database connected successfully`

### 7. Open in Browser

Go to: http://localhost:3000

---

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:**
1. Run `node test-db-connection.js` to find your MySQL password
2. Update `.env` file with the correct password
3. Make sure MySQL is running in XAMPP

### Error: "Database 'travel_agency_db' doesn't exist"

**Solution:**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create database: Click "New" → Name: `travel_agency_db` → Click "Create"
3. Import `schema.sql` file

### Error: "Cannot connect to MySQL"

**Solution:**
1. Open XAMPP Control Panel
2. Make sure MySQL is running (green "Running" status)
3. If not running, click "Start" next to MySQL

### Still Having Issues?

1. Check MySQL is running: Open XAMPP → MySQL should show "Running"
2. Test connection: `node test-db-connection.js`
3. Check `.env` file exists and has correct password
4. Make sure database `travel_agency_db` exists in phpMyAdmin
