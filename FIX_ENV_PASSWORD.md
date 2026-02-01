# Fix "Database Access Denied" Error

## Your MySQL Password is: 123

## Step 1: Check Your .env File

Open your `.env` file and make sure it looks EXACTLY like this:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

**CRITICAL:**
- `DB_PASSWORD=123` (no quotes, no spaces)
- File name is exactly `.env` (with the dot)
- File is in project root (same folder as package.json)

## Step 2: Common Mistakes

### ❌ WRONG:
```
DB_PASSWORD="123"      ← Has quotes
DB_PASSWORD = 123     ← Has spaces
DB_PASSWORD=          ← Empty (wrong password)
```

### ✅ CORRECT:
```
DB_PASSWORD=123       ← No quotes, no spaces, password is 123
```

## Step 3: Verify .env File

Run this command:
```bash
node check-env.js
```

You should see:
```
✅ .env file found
✅ DB_PASSWORD is set: "123"
✅ .env file looks good!
```

If you see `DB_PASSWORD: (not set)` or `(empty)`, your .env file is wrong!

## Step 4: Test Password

Run this to verify password works:
```bash
node test-db-connection.js
```

Should show: `✅ SUCCESS! Password "123" works!`

## Step 5: Restart Server

**IMPORTANT:** After fixing .env file, you MUST restart the server:

1. Stop server: Press `Ctrl+C`
2. Start again: `npm start` or `npm run dev`

## Step 6: Check Server Output

When server starts, you should see:
```
📄 .env file found at: C:\path\to\.env
🔑 Database password being used: "123" (3 chars)
   DB_PASSWORD: "123"
✅ Database connected successfully
```

If you see:
- `DB_PASSWORD: (not set)` → .env file is wrong
- `Access denied` → Password is wrong or .env not being read

---

## Still Not Working?

### Check 1: File Location
Make sure `.env` is in the same folder as `package.json`:
```
travel-agency-web/
├── .env          ← HERE
├── package.json
└── server.js
```

### Check 2: File Name
- Must be exactly: `.env` (with the dot)
- NOT: `env.txt` or `.env.txt` or `env`

### Check 3: File Content
Open `.env` in a text editor and verify:
- No quotes around `123`
- No spaces: `DB_PASSWORD=123` (not `DB_PASSWORD = 123`)
- Each line ends properly

### Check 4: Restart Server
After ANY change to .env file, restart the server!

---

## Quick Fix Checklist

- [ ] .env file exists in project root
- [ ] File name is exactly `.env` (with dot)
- [ ] Content: `DB_PASSWORD=123` (no quotes, no spaces)
- [ ] Ran `node check-env.js` - shows password "123"
- [ ] Ran `node test-db-connection.js` - password "123" works
- [ ] Restarted server after fixing .env
- [ ] Server shows: `✅ Database connected successfully`

---

## If Still Not Working

1. Delete `.env` file
2. Create new `.env` file
3. Copy this EXACT content:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=123
   DB_NAME=travel_agency_db
   PORT=3000
   JWT_SECRET=secret123
   ```
4. Save file
5. Run: `node check-env.js` to verify
6. Restart server: `npm start`
