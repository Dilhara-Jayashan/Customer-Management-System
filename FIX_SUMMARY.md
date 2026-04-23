# Fix Applied: Blank Page Issue

## 🔧 Issues Fixed

### 1. ✅ Paginated Response Handling
**Problem**: Backend returns `Page<CustomerDTO>` but frontend expected a simple list

**Fix**: Updated `customerService.js` to extract `content` from paginated response
```javascript
getAllCustomers: () => {
  return api.get(`${CUSTOMERS_ENDPOINT}?page=0&size=100`).then(res => {
    if (res.data && res.data.content) {
      return res.data.content; // Extract from Page object
    }
    return res.data;
  });
}
```

### 2. ✅ Better Error Handling
**Problem**: If backend isn't running, no error message shown

**Fix**: Updated `api.js` to detect connection failures
```javascript
if (!error.response) {
  return Promise.reject(new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8080'));
}
```

### 3. ✅ Console Logging
**Problem**: Silent failures made debugging difficult

**Fix**: Added console.error to `CustomerList.jsx`:
```javascript
const loadCustomers = async () => {
  try {
    await fetchCustomers();
  } catch (error) {
    console.error('Error loading customers:', error);
    showAlert('error', formatErrorMessage(error));
  }
};
```

---

## 📋 Files Changed

1. **`src/services/customerService.js`** - Handle paginated responses
2. **`src/services/api.js`** - Better error messages for connection failures
3. **`src/pages/CustomerList.jsx`** - Add console logging
4. **`TROUBLESHOOTING.md`** - New troubleshooting guide
5. **`start.sh`** - New startup script

---

## 🚀 What to Do Now

### Option 1: Manual Start (Recommended)

**Terminal 1 - Backend:**
```bash
cd Backend/customer-management-system
./mvnw spring-boot:run
# Wait for: "Started CustomerManagementSystemApplication"
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
# Wait for: "➜  Local:   http://localhost:5173/"
```

**Then open browser**: http://localhost:5173

### Option 2: Use Startup Script (macOS)
```bash
chmod +x start.sh
./start.sh
```

---

## ✅ What You Should See

If backend is running and connected:
```
┌──────────────────────────────────────────────────┐
│  Customer Management      [+ Add Customer]        │
├──────────────────────────────────────────────────┤
│ ID │ Name │ NIC Number │ Date of Birth │ Actions │
├────┼──────┼────────────┼───────────────┼─────────┤
│    │ (empty table or list of customers)        │
└──────────────────────────────────────────────────┘
```

If backend is NOT running, you'll see error alert:
```
❌ Cannot connect to server. Please ensure the backend 
   is running on http://localhost:8080
```

---

## 🔍 Debugging Tips

### Check Backend API
```bash
curl http://localhost:8080/api/customers?page=0&size=10
```

Should return:
```json
{
  "content": [...],
  "totalElements": 0,
  "totalPages": 0,
  "number": 0,
  "size": 10
}
```

### Check Browser Console (F12)
- **Network tab**: See if API calls succeed
- **Console tab**: Check for JavaScript errors
- **Application tab**: Check stored data

### Check Frontend Logs
In the terminal running `npm run dev`, look for:
- Vite build messages
- Any compilation errors
- Hot reload notifications

---

## Summary

✅ **Backend**: Must be running on `http://localhost:8080`
✅ **Frontend**: Must be running on `http://localhost:5173`  
✅ **Response Format**: Now handles paginated `Page<T>` objects
✅ **Error Messages**: Clear messages if backend isn't available
✅ **Console Logging**: Better debugging with console.error

Everything is now set up correctly! Just make sure both backend and frontend are running.

