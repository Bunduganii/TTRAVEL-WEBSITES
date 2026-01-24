# Setup Guide - Step by Step Instructions

## Step 1: Install Node.js
If you don't have Node.js installed:
1. Go to https://nodejs.org/
2. Download and install Node.js (v16 or higher)
3. Verify installation by opening terminal/command prompt and typing:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Install MySQL Database
If you don't have MySQL installed:
1. Download MySQL from https://www.mysql.com/downloads/
2. Install MySQL Server
3. Remember your MySQL root password (you'll need it)
4. Or use XAMPP/WAMP which includes MySQL

## Step 3: Install Project Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```
This will install all required packages (express, mysql2, etc.)

## Step 4: Create Database
1. Open MySQL command line or phpMyAdmin
2. Create the database and import tables:
   
   **Option A - Using MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```
   Then in MySQL:
   ```sql
   source schema.sql
   ```
   Or copy-paste the contents of schema.sql

   **Option B - Using phpMyAdmin:**
   - Open phpMyAdmin (usually http://localhost/phpmyadmin)
   - Click "New" to create database
   - Name it: `travel_agency`
   - Click "Import" tab
   - Choose `schema.sql` file
   - Click "Go"

## Step 5: Configure Environment Variables
1. Create a file named `.env` in the project root folder
2. Copy this content into `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=travel_agency
   PORT=3000
   JWT_SECRET=your_secret_key_here
   ```
3. Replace `your_mysql_password_here` with your actual MySQL root password
4. Replace `your_secret_key_here` with any random string (for security)

## Step 6: Start the Server
In terminal/command prompt, run:
```bash
npm start
```
You should see: "Travel Agency Server running on http://localhost:3000"

## Step 7: Open in Browser
1. Open your web browser
2. Go to: http://localhost:3000
3. You should see the login page

## Step 8: Test Login
Use these test accounts (created by schema.sql):
- **Customer**: 
  - Email: `customer@example.com`
  - Password: (any password works - authentication is simplified for demo)
  
- **Agent/Staff**: 
  - Email: `agent@example.com`
  - Password: (any password works)

- **Admin**: 
  - Email: `admin@example.com`
  - Password: (any password works)

## Troubleshooting

### Port 3000 already in use?
Change PORT in `.env` file to another number like 3001, then use http://localhost:3001

### Database connection error?
- Check MySQL is running
- Verify password in `.env` file
- Make sure database `travel_agency` exists
- Check MySQL user has proper permissions

### Module not found error?
Run `npm install` again

### Can't find .env file?
Make sure the file is named exactly `.env` (with the dot at the beginning)
On Windows, you might need to create it as `.env.` (with dot at end) then rename

## What to Test

1. ✅ Login as customer → Should go to customer dashboard
2. ✅ Click "Book Flight" → Should show flight search page
3. ✅ Search flights → Should display flight results
4. ✅ Click "Book Now" on a flight → Should go to payment page
5. ✅ Select payment method (Card/Zaad/E-Dahab) → Should show form
6. ✅ Enter payment info and click "Pay Now" → Should show "Thank you for purchasing"
7. ✅ Login as agent → Should go to flight search page
8. ✅ Login as admin → Should go to admin dashboard

## Next Steps After Setup

1. **Add Real Data**: Modify `schema.sql` to add more flights, hotels, and packages
2. **Customize Design**: Edit `public/css/styles.css` to match your brand
3. **Add Features**: Extend functionality in the JavaScript files
4. **Deploy**: When ready, deploy to a hosting service like Heroku, AWS, or DigitalOcean

## Need Help?

- Check `README.md` for more details
- Review `requirements.txt` for system requirements
- Check console/terminal for error messages
- Verify all files are in correct folders

