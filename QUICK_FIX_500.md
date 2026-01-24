# Quick Fix for 500 Error

## Step 1: Check Server Console
Look at your terminal where you ran `npm start` - it will show the exact error.

## Step 2: Create Database (if missing)

1. Open: http://localhost/phpmyadmin
2. Click "New" (left sidebar)
3. Database name: `travel_agency_db`
4. Click "Create"

## Step 3: Import Tables

1. Click on `travel_agency_db` database
2. Click "Import" tab
3. Choose `schema.sql` file
4. Click "Go"

## Step 4: Restart Server

```bash
npm start
```

## Step 5: Try Signup Again

The error message will now be clearer and tell you exactly what's wrong.

