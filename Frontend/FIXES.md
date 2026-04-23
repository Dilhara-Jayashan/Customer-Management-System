# Customer Management System - Bug Fixes

## Issues Fixed

### 1. ✅ POST/PUT Mapping - API Response Handling
**Problem:** The API responses were not being properly extracted from the Axios response object.

**Solution:** 
- Updated `customerService.js` to extract `.data` from all API responses
- Modified all endpoints to return `response.data` directly
- This ensures consistent data structure throughout the application

**Files Modified:**
- `src/services/customerService.js`

**Code Changes:**
```javascript
// Before
createCustomer: (customerData) => {
  return api.post(CUSTOMERS_ENDPOINT, customerData);
}

// After
createCustomer: (customerData) => {
  return api.post(CUSTOMERS_ENDPOINT, customerData).then(res => res.data);
}
```

---

### 2. ✅ Mobile Number Add/Remove Functionality
**Problem:** Mobile numbers couldn't be added or removed properly due to state management issues.

**Solution:**
- Added null checks for `form.values.mobileNumbers` 
- Ensured array exists before spreading
- Fixed the state update logic in all mobile number handlers

**Files Modified:**
- `src/pages/CustomerList.jsx`

**Code Changes:**
```javascript
// Before
const handleAddMobileNumber = () => {
  form.setFieldValue('mobileNumbers', [
    ...form.values.mobileNumbers,  // Could be undefined
    { id: null, number: '' },
  ]);
};

// After
const handleAddMobileNumber = () => {
  const currentMobiles = form.values.mobileNumbers || [];
  form.setFieldValue('mobileNumbers', [
    ...currentMobiles,
    { id: null, number: '' },
  ]);
};
```

---

### 3. ✅ Address Add/Remove Functionality
**Problem:** Addresses couldn't be added or removed due to similar state management issues.

**Solution:**
- Added null checks for `form.values.addresses`
- Ensured array exists before operations
- Fixed all address change handlers with proper state updates

**Files Modified:**
- `src/pages/CustomerList.jsx`

**Code Changes:**
```javascript
// Before
const handleAddAddress = () => {
  form.setFieldValue('addresses', [
    ...form.values.addresses,  // Could be undefined
    { id: null, addressLine1: '', addressLine2: '', cityId: '', countryId: '' },
  ]);
};

// After
const handleAddAddress = () => {
  const currentAddresses = form.values.addresses || [];
  form.setFieldValue('addresses', [
    ...currentAddresses,
    { id: null, addressLine1: '', addressLine2: '', cityId: '', countryId: '' },
  ]);
};
```

---

### 4. ✅ Form Submission Payload Structure
**Problem:** The form submission wasn't properly formatting the mobile numbers and addresses for the API.

**Solution:**
- Added validation to ensure at least one mobile number is provided
- Added validation to ensure at least one address is provided
- Properly formatted the payload with correct nested object structure
- Converted city and country IDs to integers for API compatibility

**Files Modified:**
- `src/pages/CustomerList.jsx`

**Code Changes:**
```javascript
// Proper payload structure
const payload = {
  name: values.name,
  dateOfBirth: formatDate(values.dateOfBirth),
  nicNumber: values.nicNumber,
  mobileNumbers: values.mobileNumbers.map(m => ({
    id: m.id || null,
    number: m.number,
  })),
  addresses: values.addresses.map(a => ({
    id: a.id || null,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 || '',
    city: { id: parseInt(a.cityId) || null },
    country: { id: parseInt(a.countryId) || null },
  })),
};
```

---

## Testing Recommendations

### Test Case 1: Create New Customer
1. Click "Add Customer" button
2. Fill in Name, Date of Birth, NIC Number
3. Click "Add" button under Mobile Numbers
4. Enter a mobile number
5. Click "Add" button under Addresses
6. Fill in Address Line 1, City, and Country
7. Click "Save Customer"
8. Verify customer appears in the list

### Test Case 2: Add Multiple Mobile Numbers
1. Open Add/Edit Customer Modal
2. Click "Add" under Mobile Numbers 3 times
3. Verify all 3 input fields appear
4. Fill all numbers
5. Remove the middle one
6. Verify only 2 remain
7. Save and verify in backend

### Test Case 3: Add Multiple Addresses
1. Open Add/Edit Customer Modal
2. Click "Add" under Addresses 2 times
3. Fill different city/country combinations
4. Remove one
5. Verify only 1 remains
6. Save and verify in backend

### Test Case 4: Edit Existing Customer
1. Click Edit icon on a customer
2. Modify name
3. Add new mobile number
4. Add new address
5. Click "Save Customer"
6. Verify updates appear in list

### Test Case 5: Validation
1. Try to save without mobile numbers (should show error)
2. Try to save without addresses (should show error)
3. Try invalid phone number format
4. Try duplicate NIC number

---

## API Integration Verification

Ensure your backend API returns data in the following format:

### GET /api/customers
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "nicNumber": "12345",
    "dateOfBirth": "1990-01-15",
    "mobileNumbers": [
      { "id": 1, "number": "0701234567" }
    ],
    "addresses": [
      { "id": 1, "addressLine1": "123 Main St", "addressLine2": "", "city": { "id": 1 }, "country": { "id": 1 } }
    ]
  }
]
```

### POST /api/customers
**Request:**
```json
{
  "name": "John Doe",
  "nicNumber": "12345",
  "dateOfBirth": "1990-01-15",
  "mobileNumbers": [
    { "id": null, "number": "0701234567" }
  ],
  "addresses": [
    { "id": null, "addressLine1": "123 Main St", "addressLine2": "", "city": { "id": 1 }, "country": { "id": 1 } }
  ]
}
```

**Response:** Returns created customer object with generated ID

---

## Summary of Changes

| File | Changes | Impact |
|------|---------|--------|
| `src/services/customerService.js` | Extract `.data` from all responses | ✅ Fixes API response mapping |
| `src/pages/CustomerList.jsx` | Fix null checks and state management | ✅ Enables add/remove functionality |
| `src/pages/CustomerList.jsx` | Improve form validation & payload structure | ✅ Ensures proper API communication |

---

## Next Steps

1. Test all CRUD operations with the fixes
2. Verify mobile numbers can be added/removed
3. Verify addresses can be added/removed
4. Test form validation
5. Test API error handling
6. Deploy to production when ready

