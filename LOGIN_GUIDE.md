# Login Guide - Separated Admin and Customer Access

## 🔐 Login Types

### 1. Customer Login
- **Select:** "Customer" button
- **For:** Regular customers only
- **Access:** Customer Dashboard
- **Example:** `customer@example.com`

### 2. Staff/Agent/Admin Login  
- **Select:** "Staff/Agent/Admin" button
- **For:** Staff, Agents, and Admins
- **Access:** 
  - Staff/Agent → Flight Search Portal
  - Admin → Admin Dashboard
- **Examples:** 
  - `agent@example.com` (Staff/Agent)
  - `admin@example.com` (Admin)

---

## 🚫 Important Rules

1. **Admin CANNOT login as Customer**
   - Admin must select "Staff/Agent/Admin"
   - Error: "Admin accounts must use Staff/Agent login"

2. **Customer CANNOT login as Staff/Agent**
   - Customer must select "Customer"
   - Error: "Customer accounts must use Customer login"

3. **Staff/Agent CANNOT login as Customer**
   - Staff/Agent must select "Staff/Agent/Admin"
   - Error: "Staff/Agent accounts must use Staff/Agent login"

---

## 📋 Admin Login Steps

1. Go to: http://localhost:3000
2. **Click "Staff/Agent/Admin" button** (NOT Customer)
3. Email: `admin@example.com`
4. Password: `123456` (or any password)
5. Click "Log In →"
6. ✅ Redirected to Admin Dashboard

---

## 📋 Customer Login Steps

1. Go to: http://localhost:3000
2. **Click "Customer" button** (default selected)
3. Email: `customer@example.com`
4. Password: `123456` (or any password)
5. Click "Log In →"
6. ✅ Redirected to Customer Dashboard

---

## 📋 Staff/Agent Login Steps

1. Go to: http://localhost:3000
2. **Click "Staff/Agent/Admin" button**
3. Email: `agent@example.com`
4. Password: `123456` (or any password)
5. Click "Log In →"
6. ✅ Redirected to Flight Search Portal

---

## ⚠️ Fix Database Error First

Before logging in, fix the database connection error:

1. **Create `.env` file** in project root
2. **Copy content from `env_template.txt`**
3. **Add your MySQL password** (if you have one)
4. **Restart server:** `npm start`

See `FIX_DATABASE_ERROR.md` for detailed instructions.

