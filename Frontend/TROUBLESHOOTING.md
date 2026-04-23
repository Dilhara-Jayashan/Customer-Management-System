# Troubleshooting: Blank/White Page

## ❌ What's Happening
The page at `localhost:5173` shows a blank white screen instead of the customer management table.

## ✅ Solutions to Try

### Step 1: Check if Backend is Running
```bash
# In a new terminal
curl http://localhost:8080/api/customers?page=0&size=10
```

If you get a response, backend is running ✅
If you get "Connection refused", start backend:
```bash
cd Backend/customer-management-system
./mvnw spring-boot:run
# Wait for: "Started CustomerManagementSystemApplication"
```

### Step 2: Check if Frontend is Running
```bash
# In a new terminal
cd Frontend
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Open Browser Console (F12)
Check the Console tab for errors:

- **"Cannot connect to server"** → Backend not running
- **"Cannot read property 'content' of undefined"** → API format issue
- **"Network error"** → CORS issue

### Step 4: Try These Fixes

#### Fix 1: Clear Browser Cache
Press `Ctrl+Shift+Delete` (or Cmd+Shift+Delete on Mac) and clear cache, then refresh.

#### Fix 2: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for the API call to `http://localhost:8080/api/customers`
5. Check the Response - should show customer data

#### Fix 3: Verify API Response Format
The API should return:
```json
{
  "content": [
    { "id": 1, "name": "John", ... },
    { "id": 2, "name": "Jane", ... }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "number": 0,
  "size": 10
}
```

### Step 4: Manual Testing

Open your browser and test:

```bash
# Test backend is running
curl http://localhost:8080/api/customers?page=0&size=10

# Should return JSON with customer data or empty content array
```

### Step 5: Check the Frontend Code

The service now handles paginated responses:
```javascript
getAllCustomers: () => {
  return api.get(`${CUSTOMERS_ENDPOINT}?page=0&size=100`).then(res => {
    if (res.data && res.data.content) {
      return res.data.content; // Extract content from Page object
    }
    return res.data;
  });
}
```

---

## Quick Startup Checklist

- [ ] Backend running on `http://localhost:8080`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Browser console shows no errors
- [ ] Network tab shows API response with customer data
- [ ] Page displays "Customer Management" header
- [ ] Table shows customer list or "No data" message

---

## If Still Not Working

1. **Stop everything**: Press Ctrl+C in both terminals
2. **Clear node_modules**: `rm -rf Frontend/node_modules`
3. **Reinstall**: `cd Frontend && npm install`
4. **Restart**: 
   - Backend: `cd Backend/customer-management-system && ./mvnw spring-boot:run`
   - Frontend: `cd Frontend && npm run dev`

---

## Expected Screen After Fix

```
┌─────────────────────────────────────────────────────┐
│  Customer Management            [+ Add Customer]     │
├─────────────────────────────────────────────────────┤
│ ID │ Name      │ NIC Number │ Date of Birth │ Acts  │
├────┼───────────┼────────────┼───────────────┼───────┤
│ 1  │ John Doe  │ 12345678   │ 1990-01-15   │ ✏️ 🗑 │
│ 2  │ Jane Smith│ 87654321   │ 1992-05-20   │ ✏️ 🗑 │
└─────────────────────────────────────────────────────┘
```

