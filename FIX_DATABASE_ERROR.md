# Fix Database Connection Error

## Error: "Access denied for user 'root'@'localhost' (using password: NO)"

This means MySQL is trying to connect without a password, but your MySQL requires one.

## Solution 1: Set MySQL Password in .env (Recommended)

1. **Open `.env` file** in your project folder
2. **Add your MySQL password:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=travel_agency
   PORT=3000
   JWT_SECRET=secret123
   ```
3. **Replace `your_mysql_password_here`** with your actual MySQL root password
4. **Restart server:** Stop (Ctrl+C) and run `npm start` again

## Solution 2: If MySQL Has No Password

1. **Open `.env` file**
2. **Make sure it looks like this:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=travel_agency
   PORT=3000
   JWT_SECRET=secret123
   ```
3. **Leave DB_PASSWORD empty** (no spaces)
4. **Restart server**

## Solution 3: Reset MySQL Password (If You Forgot)

### Using XAMPP:
1. Open XAMPP Control Panel
2. Stop MySQL
3. Start MySQL
4. Open MySQL Command Line
5. Type: `ALTER USER 'root'@'localhost' IDENTIFIED BY '';` (empty password)
6. Or set a password: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';`

### Using MySQL Command Line:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
```

## Solution 4: Check MySQL is Running

1. **XAMPP:** Make sure MySQL shows "Running" (green)
2. **Windows Services:** Check MySQL service is running
3. **Test connection:** Try opening phpMyAdmin (http://localhost/phpmyadmin)

## After Fixing:

1. **Restart your Node.js server:**
   ```bash
   npm start
   ```
2. **Try signup again**
3. **If still error:** Check MySQL is running and database `travel_agency` exists

