# XAMPP MySQL Setup (No Password)

## Quick Fix for XAMPP Users

### Step 1: Create .env File

1. **In your project folder**, create a file named `.env`
2. **Copy this exact content:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=travel_agency
   PORT=3000
   JWT_SECRET=secret123
   ```
3. **Important:** Leave `DB_PASSWORD=` empty (no spaces, no quotes)

### Step 2: Make Sure MySQL is Running

1. Open **XAMPP Control Panel**
2. Check **MySQL** shows "Running" (green)
3. If not running, click **Start** button

### Step 3: Create Database

1. Open browser: **http://localhost/phpmyadmin**
2. Click **"New"** on left sidebar
3. Database name: **`travel_agency`**
4. Click **"Create"**
5. Click **"Import"** tab
6. Choose **`schema.sql`** file
7. Click **"Go"**

### Step 4: Restart Node.js Server

1. **Stop server:** Press `Ctrl+C` in terminal
2. **Start again:**
   ```bash
   npm start
   ```
3. You should see: **"✅ Database connected successfully"**

---

## If Still Getting Error

### Option 1: Reset MySQL Password to Empty

1. Open **XAMPP Control Panel**
2. Click **"Shell"** button (or open MySQL Command Line)
3. Type:
   ```sql
   mysql -u root
   ```
4. Then type:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Option 2: Check Database Exists

1. Open **phpMyAdmin**: http://localhost/phpmyadmin
2. Check if **`travel_agency`** database exists
3. If not, create it (Step 3 above)

### Option 3: Test Connection

1. Open **phpMyAdmin**: http://localhost/phpmyadmin
2. Try to login (should work with no password)
3. If phpMyAdmin works, Node.js should work too

---

## Common XAMPP Issues

### Issue: "Access denied"
- **Fix:** Make sure `.env` file exists with empty `DB_PASSWORD=`
- **Fix:** Restart MySQL in XAMPP
- **Fix:** Restart Node.js server

### Issue: "Database doesn't exist"
- **Fix:** Create `travel_agency` database in phpMyAdmin
- **Fix:** Import `schema.sql` file

### Issue: "Can't connect to MySQL"
- **Fix:** Check MySQL is running in XAMPP
- **Fix:** Check port 3306 is not blocked
- **Fix:** Try restarting XAMPP

---

## Verify Setup

After setup, you should see in terminal:
```
✅ Database connected successfully
Travel Agency Server running on http://localhost:3000
```

Then try signup - it should work! ✅

