# .env File Setup Guide

## Quick Setup

### Step 1: Create .env File

1. In your project root folder (same folder as `package.json`)
2. Create a new file named exactly: `.env` (with the dot at the beginning)
3. Copy and paste this content:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

### Step 2: Important Notes

**For Empty Password (Most Common with XAMPP):**
```
DB_PASSWORD=
```
- Nothing after the equals sign
- No quotes
- No spaces

**If Your MySQL Has a Password:**
```
DB_PASSWORD=1234
```
- Replace `1234` with your actual MySQL password
- No quotes
- No spaces

### Step 3: Verify .env File

Run this command:
```bash
node check-env.js
```

You should see:
```
✅ .env file found
✅ DB_PASSWORD is set: (empty)
✅ .env file looks good!
```

### Step 4: Find Your MySQL Password

If you're not sure what your MySQL password is:
```bash
node test-db-connection.js
```

This will test common passwords and tell you which one works!

---

## Common Mistakes

### ❌ WRONG:
```
DB_PASSWORD=""        ← Has quotes
DB_PASSWORD =         ← Has spaces
DB_PASSWORD=1234      ← Wrong password (if yours is empty)
```

### ✅ CORRECT:
```
DB_PASSWORD=          ← Empty password (nothing after equals)
DB_PASSWORD=1234       ← If your MySQL password is 1234
```

---

## File Location

Make sure `.env` is in the project root:

```
travel-agency-web/
├── .env          ← HERE (same folder as package.json)
├── package.json
├── config/
└── server.js
```

---

## After Creating .env

1. ✅ Save the file
2. ✅ Restart your server: `npm start` or `npm run dev`
3. ✅ Should see: `✅ Database connected successfully`

---

## Troubleshooting

**Error: "Access denied"**
- Run: `node test-db-connection.js` to find your password
- Update `.env` file with correct password
- Make sure `DB_PASSWORD=` has no quotes or spaces

**Error: ".env file not found"**
- Make sure file name is exactly `.env` (with the dot)
- Make sure it's in the project root folder
- Check file is saved

**Still having issues?**
- Run: `node check-env.js` to verify .env file
- Check MySQL is running in XAMPP
- Restart server after creating/updating .env
