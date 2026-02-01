# Create .env File with Empty Password

## Your MySQL Password is Empty (No Password)

The test found that your MySQL password is **empty** (no password required).

## Step-by-Step Instructions

### Step 1: Create .env File

1. In your project folder, create a new file named exactly: `.env`
   - **Important:** The file name must start with a dot (`.env`)
   - No extension, just `.env`

### Step 2: Add This Content

Copy and paste this EXACT content into your `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_agency_db
PORT=3000
JWT_SECRET=secret123
```

**Important Notes:**
- `DB_PASSWORD=` has **NO value** after the equals sign (empty password)
- **NO quotes** around the empty value
- **NO spaces** around the equals sign
- Each line should end with just a newline

### Step 3: Save the File

Save the `.env` file in your project root folder (same folder as `package.json`).

### Step 4: Verify .env File

Run this command to check if your .env file is correct:
```bash
node check-env.js
```

You should see:
```
✅ .env file found
✅ DB_PASSWORD is set: (empty)
✅ .env file looks good!
```

### Step 5: Test Connection

Run the test again to verify:
```bash
node test-db-connection.js
```

### Step 6: Start Server

Start your server:
```bash
npm start
```

You should see:
```
✅ Database connected successfully
```

---

## Common Mistakes

### ❌ WRONG - Has quotes:
```
DB_PASSWORD=""
```

### ✅ CORRECT - No quotes, just empty:
```
DB_PASSWORD=
```

---

### ❌ WRONG - Has spaces:
```
DB_PASSWORD = 
```

### ✅ CORRECT - No spaces:
```
DB_PASSWORD=
```

---

### ❌ WRONG - Missing the line:
```
DB_HOST=localhost
DB_USER=root
DB_NAME=travel_agency_db
```

### ✅ CORRECT - Include DB_PASSWORD even if empty:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_agency_db
```

---

## File Location

Make sure `.env` is in the **project root folder**:

```
travel-agency-web/
├── .env          ← HERE (same folder as package.json)
├── config/
├── routes/
├── package.json
└── server.js
```

---

## Still Having Issues?

1. Run: `node check-env.js` to verify .env file
2. Make sure `.env` file is in the project root
3. Make sure `DB_PASSWORD=` has no quotes and no spaces
4. Restart your server after creating/updating .env file
