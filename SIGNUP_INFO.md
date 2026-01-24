# Signup Information

## ✅ Customer Signup Only

The public signup form **only creates customer accounts**.

### How It Works:

1. **Public Signup** (`/signup`)
   - Anyone can sign up
   - **Always creates:** Customer account
   - **Cannot create:** Staff, Agent, or Admin accounts
   - **Access:** Customer Dashboard only

2. **Staff/Agent/Admin Accounts**
   - Must be created by Admin through admin panel
   - Or manually added to database
   - **Cannot be created** through public signup form

---

## 🔐 Account Types

### Customer Account
- **Created via:** Public signup form
- **Login:** Select "Customer" button
- **Access:** Customer Dashboard
- **Can:** Book flights, hotels, packages

### Staff/Agent Account
- **Created by:** Admin only
- **Login:** Select "Staff/Agent/Admin" button
- **Access:** Flight Search Portal (Agent Portal)
- **Can:** Search and book flights for customers

### Admin Account
- **Created by:** Database setup (schema.sql)
- **Login:** Select "Staff/Agent/Admin" button
- **Access:** Admin Dashboard
- **Can:** Manage all bookings, users, and system

---

## 📝 Signup Process

1. Go to: http://localhost:3000/signup
2. Fill in:
   - Full Name
   - Email Address
   - Phone Number
   - Password
   - Confirm Password
3. Click "Sign Up →"
4. Account created as **Customer**
5. Login with Customer button

---

## ⚠️ Important Notes

- **Email must be unique** - Cannot signup with existing email
- **Password minimum:** 6 characters
- **Passwords must match**
- **Only customer accounts** can be created through signup
- **Staff/Agent accounts** require admin approval

---

## 🚫 Error Messages

- **"Email already registered"** → Email exists, use login instead
- **"Only customer accounts can be created"** → Trying to create staff/admin (not allowed)
- **"Passwords do not match"** → Password confirmation doesn't match

