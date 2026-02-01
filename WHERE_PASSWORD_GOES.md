# Where Does MySQL Password Go?

## Answer: In the `.env` file

The MySQL password **MUST** be in the `.env` file in your project root folder.

---

## File Location

```
travel-agency-web/
├── .env          ← PASSWORD GOES HERE
├── package.json
├── config/
│   └── database.js  ← Reads password from .env
└── server.js
```

---

## How It Works

1. **`.env` file** → Stores your MySQL password
2. **`config/database.js`** → Reads password from `.env` file
3. **Server** → Uses password to connect to MySQL

---

## Your .env File Should Look Like This:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

**The password is:** `DB_PASSWORD=123`

---

## Step-by-Step Setup

### Step 1: Create .env File

1. Go to your project root folder (same folder as `package.json`)
2. Create a new file named exactly: `.env` (with the dot)
3. Copy this content:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

4. Save the file

### Step 2: Verify It's Working

Run this command:
```bash
node check-env.js
```

You should see:
```
✅ .env file found
✅ DB_PASSWORD is set: "123"
```

### Step 3: Check What Password is Being Used

When you start your server (`npm start`), you'll see:
```
🔑 Database password being used: "123" (3 chars)
   DB_PASSWORD: "123"
```

This shows the password is being read from `.env` file.

---

## Important Notes

### ✅ CORRECT:
- Password in `.env` file: `DB_PASSWORD=123`
- No quotes, no spaces
- File name: `.env` (with the dot)

### ❌ WRONG:
- Password in `config/database.js` directly (hardcoded)
- Password in `server.js`
- Password anywhere else

---

## If Password is Not Working

### Check 1: Does .env file exist?
```bash
# Windows PowerShell
Get-ChildItem .env
```

### Check 2: Is password correct in .env?
Open `.env` file and verify:
```
DB_PASSWORD=123
```

### Check 3: Is server reading .env?
When server starts, check output:
- Should show: `📄 .env file found at: ...`
- Should show: `DB_PASSWORD: "123"`

If it shows `(not set in .env, using default)`, the .env file is not being read!

---

## Summary

**MySQL Password Location:**
- ✅ **`.env` file** (project root folder)
- ❌ NOT in `config/database.js` (only reads from .env)
- ❌ NOT in `server.js`
- ❌ NOT anywhere else

**Your password:** `123`  
**Where it goes:** `.env` file as `DB_PASSWORD=123`
