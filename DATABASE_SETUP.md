# Database Setup - Step by Step

## Method 1: Using phpMyAdmin (Easiest - Recommended)

1. **Install XAMPP or WAMP** (includes MySQL and phpMyAdmin)
   - Download XAMPP: https://www.apachefriends.org/
   - Or WAMP: https://www.wampserver.com/
   - Install it

2. **Start MySQL**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Click "Start" next to Apache (for phpMyAdmin)

3. **Open phpMyAdmin**
   - Go to: http://localhost/phpmyadmin
   - Or click "Admin" button next to MySQL in XAMPP

4. **Create Database**
   - Click "New" on the left sidebar
   - Database name: `travel_agency`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

5. **Import Tables**
   - Click on `travel_agency` database (left sidebar)
   - Click "Import" tab at the top
   - Click "Choose File"
   - Select `schema.sql` file from your project folder
   - Scroll down and click "Go" button
   - You should see "Import has been successfully finished"

6. **Verify**
   - You should see 5 tables: `users`, `flights`, `hotels`, `packages`, `bookings`
   - Done! ✅

---

## Method 2: Using MySQL Command Line

1. **Open MySQL Command Line**
   - Windows: Search "MySQL Command Line Client"
   - Or open terminal and type: `mysql -u root -p`
   - Enter your MySQL password

2. **Create Database**
   ```sql
   CREATE DATABASE travel_agency;
   USE travel_agency;
   ```

3. **Import Schema**
   - Exit MySQL: `exit`
   - In terminal, navigate to your project folder:
     ```bash
     cd C:\Users\HAMSE CHOCO\OneDrive\Desktop\TTRAVEL
     ```
   - Run:
     ```bash
     mysql -u root -p travel_agency < schema.sql
     ```
   - Enter password when prompted

4. **Verify**
   ```sql
   USE travel_agency;
   SHOW TABLES;
   ```
   - Should show 5 tables

---

## Method 3: Using MySQL Workbench

1. **Download MySQL Workbench**
   - https://www.mysql.com/products/workbench/

2. **Connect to MySQL**
   - Open MySQL Workbench
   - Click on your local connection
   - Enter password

3. **Create Database**
   - Click "Create Schema" icon (or File > New Query Tab)
   - Type: `CREATE DATABASE travel_agency;`
   - Click Execute (⚡ icon)

4. **Import Schema**
   - Right-click on `travel_agency` in left panel
   - Select "Table Data Import Wizard"
   - Or: File > Run SQL Script
   - Select `schema.sql` file
   - Click "Run"

---

## After Database Setup

1. **Create `.env` file** in project root:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=travel_agency
   PORT=3000
   JWT_SECRET=secret123
   ```

2. **Replace `your_mysql_password`** with:
   - Your MySQL root password (if you set one)
   - Or leave empty if no password: `DB_PASSWORD=`

3. **Test Connection**
   - Run: `npm start`
   - If you see "Travel Agency Server running..." = Success! ✅
   - If error about database = check password in `.env`

---

## Troubleshooting

**Error: "Access denied for user 'root'@'localhost'"**
- Check password in `.env` file
- Try empty password: `DB_PASSWORD=`
- Or reset MySQL password

**Error: "Database 'travel_agency' doesn't exist"**
- Make sure you created the database first
- Check database name matches in `.env`

**Error: "Table doesn't exist"**
- Make sure you imported `schema.sql`
- Check all 5 tables exist in phpMyAdmin

**Can't find phpMyAdmin**
- Make sure Apache is running in XAMPP
- Try: http://localhost/phpmyadmin
- Or use MySQL Workbench instead

---

## Quick Test

After setup, test with:
```sql
SELECT * FROM users;
```
Should show 3 test users (customer, agent, admin)

