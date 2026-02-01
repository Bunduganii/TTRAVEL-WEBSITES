# ⚠️ URGENT: Create .env File Now!

## The Problem

Your server is showing:
```
Access denied for user 'root'@'localhost' (using password: YES)
```

This means the `.env` file is **missing or not being read**.

## Quick Fix (2 minutes)

### Step 1: Create .env File

1. Open your project folder: `travel-agency-web`
2. Create a **NEW file** named exactly: `.env`
   - File name: `.env` (just dot and "env", no extension)
   - **Important:** The file name starts with a dot!

### Step 2: Copy This EXACT Content

Open `.env` file and paste this:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

**CRITICAL:** 
- `DB_PASSWORD=` has **NOTHING** after the equals sign (empty password)
- **NO quotes** around it
- **NO spaces** around the equals sign

### Step 3: Save the File

Save `.env` in the **same folder** as `package.json`:

```
travel-agency-web/
├── .env          ← HERE (same folder as package.json)
├── package.json
├── config/
└── server.js
```

### Step 4: Restart Server

**STOP** your current server (Ctrl+C), then:

```bash
npm run dev
```

Or:
```bash
npm start
```

### Step 5: Check Output

You should now see:
```
📄 .env file found at: C:\Users\admin\Downloads\...\.env
🔑 Database password being used: (empty)
   DB_PASSWORD: (empty - no password)
✅ Database connected successfully
```

---

## Verify .env File is Correct

Run this command to check:
```bash
node check-env.js
```

You should see:
```
✅ .env file found
✅ DB_PASSWORD is set: (empty)
✅ .env file looks good!
```

---

## Common Mistakes

### ❌ WRONG:
```
DB_PASSWORD=""        ← Has quotes
DB_PASSWORD =         ← Has spaces
DB_PASSWORD=1234      ← Wrong password (yours is empty!)
```

### ✅ CORRECT:
```
DB_PASSWORD=          ← Nothing after equals, no quotes, no spaces
```

---

## File Location Check

Make sure `.env` is in the **project root** (same folder as `package.json`):

**Windows PowerShell:**
```powershell
Get-ChildItem .env
```

Should show: `.env` file

**If you see "file not found":**
- You're in the wrong folder
- Navigate to: `C:\Users\admin\Downloads\TTRAVEL-WEBSITE-main\travel-agency-web`
- Create `.env` there

---

## Still Not Working?

1. **Check file name:** Must be exactly `.env` (with the dot)
2. **Check file location:** Same folder as `package.json`
3. **Check file content:** `DB_PASSWORD=` (nothing after equals)
4. **Restart server:** Stop and start again after creating .env
5. **Run diagnostic:** `node check-env.js`

---

## After Creating .env

Once `.env` is created correctly:

1. ✅ Stop server (Ctrl+C)
2. ✅ Start server again: `npm run dev`
3. ✅ Should see: `✅ Database connected successfully`
4. ✅ Try signing up again - it should work!
