# Fix: "ECONNREFUSED" - MySQL Not Running

## The Problem

If you see this error:
```
❌ Failed: connect ECONNREFUSED 127.0.0.1:3306
```

**This means MySQL is NOT running!** The connection is being refused because there's no MySQL server listening on port 3306.

## Solution: Start MySQL

### Step 1: Open XAMPP Control Panel

1. Search for "XAMPP" in Windows Start menu
2. Open "XAMPP Control Panel"
3. Or find it in: `C:\xampp\xampp-control.exe`

### Step 2: Start MySQL

1. In XAMPP Control Panel, find "MySQL"
2. Click the **"Start"** button next to MySQL
3. Wait until it shows **"Running"** (green status)
4. You should see the port number (usually 3306)

### Step 3: Verify MySQL is Running

You should see:
- ✅ MySQL status: **Running** (green)
- Port: **3306**

### Step 4: Test Connection Again

Now run the test script again:
```bash
node test-db-connection.js
```

It should work now!

---

## If XAMPP is Not Installed

### Install XAMPP:

1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/
   - Click "Download" for Windows
   - Choose the latest version

2. **Install XAMPP:**
   - Run the installer
   - Follow the installation wizard
   - Install to default location: `C:\xampp`

3. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for "Running" status

4. **Test Connection:**
   ```bash
   node test-db-connection.js
   ```

---

## Alternative: Install MySQL Separately

If you don't want to use XAMPP:

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download MySQL Community Server
   - Install it

2. **Start MySQL Service:**
   - Open Windows Services (search "services" in Start menu)
   - Find "MySQL" service
   - Right-click → Start

3. **Test Connection:**
   ```bash
   node test-db-connection.js
   ```

---

## Quick Checklist

Before running `test-db-connection.js`:

- [ ] XAMPP is installed
- [ ] XAMPP Control Panel is open
- [ ] MySQL shows "Running" (green) in XAMPP
- [ ] Port 3306 is shown (not red)

---

## Still Having Issues?

### Check if MySQL is actually running:

**Windows PowerShell:**
```powershell
netstat -an | findstr 3306
```

If you see `0.0.0.0:3306` or `127.0.0.1:3306` in LISTENING state, MySQL is running.

If you see nothing, MySQL is NOT running.

### Check Windows Services:

1. Press `Win + R`
2. Type: `services.msc`
3. Press Enter
4. Look for "MySQL" service
5. Check if it's "Running"
6. If not, right-click → Start

---

## Common Issues

### Issue 1: Port 3306 Already in Use

**Error:** Port 3306 is already in use

**Solution:**
- Another MySQL instance might be running
- Check Windows Services for multiple MySQL services
- Stop the other MySQL service
- Or change XAMPP MySQL port in `C:\xampp\mysql\bin\my.ini`

### Issue 2: XAMPP MySQL Won't Start

**Error:** MySQL fails to start in XAMPP

**Solution:**
1. Check XAMPP logs: Click "Logs" button next to MySQL
2. Common causes:
   - Port 3306 already in use
   - MySQL data folder corrupted
   - Insufficient permissions
3. Try restarting your computer
4. Reinstall XAMPP if needed

### Issue 3: Can't Find XAMPP

**Solution:**
- XAMPP is usually installed at: `C:\xampp\`
- Control Panel: `C:\xampp\xampp-control.exe`
- Create a desktop shortcut for easy access

---

## After MySQL is Running

Once MySQL is running:

1. ✅ Run: `node test-db-connection.js`
2. ✅ It will test passwords and find the correct one
3. ✅ Create `.env` file with the correct password
4. ✅ Start your server: `npm start`

You should see: `✅ Database connected successfully`
