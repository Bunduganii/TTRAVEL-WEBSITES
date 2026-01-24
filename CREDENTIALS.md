# Login Credentials

## Default Test Accounts

These accounts are created automatically when you import `schema.sql`:

### Customer Account
- **Email:** `customer@example.com`
- **Password:** Any password (authentication is simplified for demo)
- **Type:** Customer
- **Access:** Customer Dashboard

### Agent/Staff Account
- **Email:** `agent@example.com`
- **Password:** Any password (authentication is simplified for demo)
- **Type:** Agent
- **Access:** Flight Search Portal (Agent Portal)

### Admin Account
- **Email:** `admin@example.com`
- **Password:** Any password (authentication is simplified for demo)
- **Type:** Admin
- **Access:** Admin Dashboard

---

## Important Notes

1. **Password Authentication:** For this demo system, password checking is simplified. Any password will work with the correct email.

2. **User Type:** Make sure to select the correct user type (Customer/Staff/Agent) on the login page before entering credentials.

3. **Creating New Accounts:** Use the Sign Up page (`/signup`) to create new customer or staff accounts.

4. **Admin Access:** Only the default admin account can access the admin dashboard. New admin accounts must be created directly in the database.

---

## How to Login

1. Go to: http://localhost:3000
2. Select user type (Customer/Staff/Agent)
3. Enter email and password
4. Click "Log In →"

---

## Sign Up New Users

1. Click "Sign up for free" on login page
2. Or go to: http://localhost:3000/signup
3. Fill in the form
4. Select user type (Customer or Staff/Agent)
5. Click "Sign Up →"

