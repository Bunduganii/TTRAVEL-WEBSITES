# Fix "Access Denied" Database Error

## Quick Fix Steps

### Step 1: Check .env File
Run this diagnostic tool:
```bash
node check-env.js
```

This will tell you:
- If .env file exists
- What password is being read
- Common formatting mistakes

### Step 2: Find Your MySQL Password
Run this to test passwords:
```bash
node test-db-connection.js
```

This will test common passwords and tell you which one works!

### Step 3: Fix .env File

**Common Mistakes:**

❌ **WRONG - Has quotes:**
```
DB_PASSWORD="1234"
```

✅ **CORRECT - No quotes:**
```
DB_PASSWORD=1234
```

---

❌ **WRONG - Has spaces:**
```
DB_PASSWORD = 1234
```

✅ **CORRECT - No spaces:**
```
DB_PASSWORD=1234
```

---

❌ **WRONG - Wrong location:**
```
.env file in wrong folder
```

✅ **CORRECT - In project root:**
```
TTRAVEL/
├── .env          ← HERE (same folder as package.json)
├── config/
├── routes/
└── server.js
```

---

### Step 4: Verify .env File Format

Your `.env` file should look EXACTLY like this:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

**Important:**
- No quotes around values
- No spaces around = sign
- Replace `1234` with your actual MySQL password
- File name must be exactly `.env` (with the dot)

### Step 5: Restart Server

After fixing .env file:
```bash
npm start
```

You should see:
```
✅ Database connected successfully
```

---

## Still Not Working?

### Check 1: Verify Password
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Try logging in with the password you're using
3. If it doesn't work, your MySQL password is different!

### Check 2: Verify .env File Location
Make sure `.env` is in the same folder as `package.json`:
```bash
# Windows PowerShell
Get-ChildItem .env

# Should show: .env file
```

### Check 3: Check File Encoding
- Make sure .env file is saved as UTF-8 (not UTF-16 or other)
- In Notepad: Save As → Encoding: UTF-8
- In VS Code: Bottom right → Click encoding → Select UTF-8

### Check 4: Check for Hidden Characters
- Open .env in a text editor
- Make sure there are no invisible characters
- Each line should end with just a newline (no extra spaces)

### Check 5: Verify MySQL is Running
- Open XAMPP Control Panel
- MySQL should show "Running" (green)
- If not, click "Start"

---

## Debug Output

When you start the server, you should see:
```
📄 .env file found at: C:\path\to\TTRAVEL\.env
🔑 Database password being used: "1234" (4 chars)
📊 Environment variables loaded:
   DB_HOST: localhost
   DB_USER: root
   DB_PASSWORD: "1234"
   DB_NAME: travel_agency_db
✅ Database connected successfully
```

If you see:
- `.env file NOT found` → Create .env file
- `DB_PASSWORD: (not set)` → Add DB_PASSWORD=1234 to .env
- `Access denied` → Password is wrong, run test-db-connection.js

---

## Still Stuck?

1. Run: `node check-env.js` → Shows .env file status
2. Run: `node test-db-connection.js` → Finds correct password
3. Update .env file with correct password
4. Restart server: `npm start`
5. Check server output for debug messages
