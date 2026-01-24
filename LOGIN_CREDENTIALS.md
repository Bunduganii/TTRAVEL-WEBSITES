# Login Credentials

## Default Test Accounts

These accounts are created automatically when you import `schema.sql`:

### Customer Account
- **Email:** `customer@example.com`
- **Password:** Any password (authentication is simplified for demo)
- **User Type:** Customer
- **Access:** Customer Dashboard

### Agent/Staff Account
- **Email:** `agent@example.com`
- **Password:** Any password (authentication is simplified for demo)
- **User Type:** Agent
- **Access:** Agent Portal (Flight Search)

### Admin Account
- **Email:** `admin@example.com`
- **Password:** Any password (authentication is simplified for demo)
- **User Type:** Admin
- **Access:** Admin Dashboard

---

## How to Login

1. Go to: http://localhost:3000
2. Select user type (Customer or Staff/Agent)
3. Enter email and any password
4. Click "Log In"

**Note:** For demo purposes, password validation is simplified. Any password will work with the correct email.

---

## Create New Account

1. Click "Sign up for free" on login page
2. Or go to: http://localhost:3000/signup
3. Fill in the form:
   - Full Name
   - Email
   - Phone Number
   - Password
   - Confirm Password
4. Select user type (Customer or Staff/Agent)
5. Click "Sign Up"

---

## Admin Access

To access admin dashboard:
1. Login with: `admin@example.com`
2. Any password
3. You'll be redirected to admin dashboard automatically

---

## Troubleshooting

**Can't login?**
- Make sure database is imported correctly
- Check that users table exists
- Verify email is correct (case-sensitive)

**Want to add more admin users?**
- Use signup form and select "Staff/Agent"
- Or manually insert into database:
```sql
INSERT INTO users (email, password, full_name, user_type) 
VALUES ('newadmin@example.com', 'hashed_password', 'Admin Name', 'admin');
```

