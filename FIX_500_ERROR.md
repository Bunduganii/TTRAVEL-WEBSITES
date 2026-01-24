# Fix 500 Error on Signup

## Common Causes:

### 1. Database Doesn't Exist
**Error:** "Unknown database 'travel_agency_db'"

**Fix:**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" (left sidebar)
3. Database name: `travel_agency_db`
4. Click "Create"
5. Click "Import" tab
6. Choose `schema.sql` file
7. Click "Go"

### 2. MySQL Not Running
**Error:** Connection refused or timeout

**Fix:**
1. Open XAMPP Control Panel
2. Make sure MySQL shows "Running" (green)
3. If not, click "Start"

### 3. Table Doesn't Exist
**Error:** "Table 'users' doesn't exist"

**Fix:**
1. Make sure you imported `schema.sql`
2. Check if `users` table exists in `travel_agency_db` database

### 4. Check Server Console
Look at your terminal/console where you ran `npm start` - it will show the actual error message.

---

## Quick Check:

1. **MySQL Running?** ✅ Check XAMPP
2. **Database exists?** ✅ Check phpMyAdmin
3. **Tables imported?** ✅ Check schema.sql imported
4. **.env file correct?** ✅ Should have `DB_NAME=travel_agency_db`

---

## Test Connection:

1. Restart server: `npm start`
2. Should see: "✅ Database connected successfully"
3. If you see error, check the message above

