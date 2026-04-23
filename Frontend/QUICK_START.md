# Quick Start - After Bug Fixes

## What Was Fixed

✅ **POST/PUT API Response Mapping** - All API calls now properly extract data  
✅ **Mobile Number Add/Remove** - Fixed state management for adding/removing mobile numbers  
✅ **Address Add/Remove** - Fixed state management for adding/removing addresses  
✅ **Form Validation** - Ensures at least one mobile number and one address  
✅ **Payload Structure** - Proper formatting for API compatibility  

---

## Running the Application

### 1. Start the Backend
```bash
cd Backend/customer-management-system
./mvnw spring-boot:run
# Backend will run on http://localhost:8080
```

### 2. Start the Frontend
```bash
cd Frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### 3. Open in Browser
```
http://localhost:5173
```

---

## Testing the Fixes

### Test 1: Create a New Customer

1. Click **"Add Customer"** button
2. Fill in the form:
   - **Name**: e.g., "John Doe"
   - **Date of Birth**: Pick a date
   - **NIC Number**: e.g., "12345678"

3. **Add Mobile Number**:
   - Click "Add" button under "Mobile Numbers"
   - Enter mobile number (e.g., "0701234567")

4. **Add Address**:
   - Click "Add" button under "Addresses"
   - Fill Address Line 1
   - Select City from dropdown
   - Select Country from dropdown
   - (Address Line 2 is optional)

5. Click **"Save Customer"**
   - Should see success message
   - Customer appears in table

### Test 2: Add Multiple Mobile Numbers

1. Click "Add Customer"
2. Fill basic info
3. Click "Add" under Mobile Numbers **3 times**
4. Should see 3 mobile number input fields
5. Remove the middle one by clicking "Remove"
6. Should show 2 remaining
7. Click "Save Customer"

### Test 3: Add Multiple Addresses

1. Click "Add Customer"
2. Fill basic info
3. Click "Add" under Addresses **2 times**
4. Fill both addresses with different cities/countries
5. Remove one by clicking "Remove Address"
6. Should show 1 remaining
7. Click "Save Customer"

### Test 4: Edit Existing Customer

1. Click edit icon (pencil) on a customer
2. Modify the name
3. Add a new mobile number
4. Add a new address
5. Click "Save Customer"
6. Verify changes appear in the list

### Test 5: Delete Customer

1. Click delete icon (trash) on a customer
2. Confirm deletion
3. Customer should disappear from list

---

## Expected API Requests

### When Creating a Customer
```bash
POST http://localhost:8080/api/customers
Content-Type: application/json

{
  "name": "John Doe",
  "nicNumber": "12345678",
  "dateOfBirth": "1990-01-15",
  "mobileNumbers": [
    { "id": null, "number": "0701234567" }
  ],
  "addresses": [
    {
      "id": null,
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4",
      "city": { "id": 1 },
      "country": { "id": 1 }
    }
  ]
}
```

### When Getting All Customers
```bash
GET http://localhost:8080/api/customers
```

### When Updating a Customer
```bash
PUT http://localhost:8080/api/customers/1
Content-Type: application/json

{
  "name": "Updated Name",
  "nicNumber": "12345678",
  "dateOfBirth": "1990-01-15",
  "mobileNumbers": [...],
  "addresses": [...]
}
```

---

## Troubleshooting

### Issue: "At least one mobile number is required"
**Solution**: Click "Add" button under Mobile Numbers section and enter a phone number

### Issue: "At least one address is required"
**Solution**: Click "Add" button under Addresses section and fill in the address details

### Issue: Buttons don't work
**Cause**: Mobile number or address array is undefined
**Solution**: Fixed in this update - make sure you have the latest code

### Issue: Network errors
**Check**:
1. Backend is running on `http://localhost:8080`
2. Frontend is running on `http://localhost:5173`
3. No CORS issues in browser console

### Issue: Form not submitting
**Check**:
1. All required fields are filled
2. Date of birth is not in the future
3. NIC number is valid (5-20 characters)
4. Phone numbers are valid format
5. At least one mobile number added
6. At least one address added

---

## File Structure After Fixes

```
Frontend/
├── src/
│   ├── services/
│   │   ├── api.js              (Axios config)
│   │   └── customerService.js  ✅ UPDATED - Response mapping fixed
│   ├── pages/
│   │   └── CustomerList.jsx    ✅ UPDATED - Mobile/Address add/remove fixed
│   ├── hooks/
│   │   ├── useForm.js
│   │   └── useFetch.js
│   └── components/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       └── ...
└── FIXES.md                     📄 Detailed fix documentation
```

---

## Key Changes Summary

| Component | Change | Result |
|-----------|--------|--------|
| customerService.js | Add `.then(res => res.data)` to all calls | ✅ Proper response handling |
| CustomerList.jsx | Add null checks to mobile/address handlers | ✅ Add/remove works |
| CustomerList.jsx | Add validation for at least 1 mobile & address | ✅ Prevents invalid submissions |
| CustomerList.jsx | Format payload with nested objects | ✅ API compatibility |

---

## Next Steps

1. ✅ Run backend on port 8080
2. ✅ Run frontend on port 5173
3. ✅ Test all CRUD operations
4. ✅ Test mobile number add/remove
5. ✅ Test address add/remove
6. ✅ Test bulk upload (separate page)
7. ✅ Deploy to production

---

## Support

If you encounter any issues:

1. Check the browser console for error messages (F12)
2. Check the backend logs
3. Verify API endpoints are correct
4. Ensure required fields are filled
5. Check FIXES.md for detailed change descriptions

