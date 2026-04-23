# API Payload Reference

## Create Customer - POST /api/customers

### Request Payload Structure

```json
{
  "name": "John Doe",
  "nicNumber": "198765432123",
  "dateOfBirth": "1990-05-15",
  "mobileNumbers": [
    {
      "id": null,
      "number": "0701234567"
    },
    {
      "id": null,
      "number": "0712345678"
    }
  ],
  "addresses": [
    {
      "id": null,
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": {
        "id": 1
      },
      "country": {
        "id": 1
      }
    },
    {
      "id": null,
      "addressLine1": "456 Secondary Ave",
      "addressLine2": "",
      "city": {
        "id": 2
      },
      "country": {
        "id": 1
      }
    }
  ]
}
```

### Required Fields
- `name` - String (2-100 characters)
- `nicNumber` - String (5-20 characters)
- `dateOfBirth` - Date string format: yyyy-MM-dd (must be past date)
- `mobileNumbers` - Array with at least 1 item
  - `number` - String (7-10 digits)
- `addresses` - Array with at least 1 item
  - `addressLine1` - String (required)
  - `addressLine2` - String (optional)
  - `city.id` - Integer (required)
  - `country.id` - Integer (required)

### Expected Response

```json
{
  "id": 1,
  "name": "John Doe",
  "nicNumber": "198765432123",
  "dateOfBirth": "1990-05-15",
  "mobileNumbers": [
    {
      "id": 1,
      "number": "0701234567"
    },
    {
      "id": 2,
      "number": "0712345678"
    }
  ],
  "addresses": [
    {
      "id": 1,
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": {
        "id": 1,
        "name": "Colombo"
      },
      "country": {
        "id": 1,
        "name": "Sri Lanka"
      }
    },
    {
      "id": 2,
      "addressLine1": "456 Secondary Ave",
      "addressLine2": null,
      "city": {
        "id": 2,
        "name": "Kandy"
      },
      "country": {
        "id": 1,
        "name": "Sri Lanka"
      }
    }
  ]
}
```

---

## Update Customer - PUT /api/customers/{id}

Same structure as Create. Example:

```bash
PUT http://localhost:8080/api/customers/1
Content-Type: application/json

{
  "name": "Jane Doe",
  "nicNumber": "198765432123",
  "dateOfBirth": "1990-05-15",
  "mobileNumbers": [
    {
      "id": 1,
      "number": "0701234567"
    },
    {
      "id": null,
      "number": "0799999999"
    }
  ],
  "addresses": [
    {
      "id": 1,
      "addressLine1": "123 Main Street",
      "addressLine2": "Updated",
      "city": {
        "id": 1
      },
      "country": {
        "id": 1
      }
    }
  ]
}
```

**Note**: When updating, include existing IDs to update, omit ID or set to null for new items.

---

## Get All Customers - GET /api/customers

### Request
```bash
GET http://localhost:8080/api/customers
```

### Response (Array)
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "nicNumber": "198765432123",
    "dateOfBirth": "1990-05-15",
    "mobileNumbers": [...],
    "addresses": [...]
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "nicNumber": "198765432124",
    "dateOfBirth": "1992-03-20",
    "mobileNumbers": [...],
    "addresses": [...]
  }
]
```

---

## Get Cities - GET /api/cities

### Request
```bash
GET http://localhost:8080/api/cities
```

### Expected Response
```json
[
  {
    "id": 1,
    "name": "Colombo"
  },
  {
    "id": 2,
    "name": "Kandy"
  },
  {
    "id": 3,
    "name": "Galle"
  },
  {
    "id": 4,
    "name": "Jaffna"
  },
  {
    "id": 5,
    "name": "Matara"
  }
]
```

---

## Get Countries - GET /api/countries

### Request
```bash
GET http://localhost:8080/api/countries
```

### Expected Response
```json
[
  {
    "id": 1,
    "name": "Sri Lanka"
  },
  {
    "id": 2,
    "name": "United States"
  },
  {
    "id": 3,
    "name": "United Kingdom"
  },
  {
    "id": 4,
    "name": "Australia"
  },
  {
    "id": 5,
    "name": "Canada"
  }
]
```

---

## Delete Customer - DELETE /api/customers/{id}

### Request
```bash
DELETE http://localhost:8080/api/customers/1
```

### Response
```json
{
  "message": "Customer deleted successfully"
}
```

Or returns 204 No Content if no response body.

---

## Error Responses

### Duplicate NIC Number - 409 Conflict
```json
{
  "status": 409,
  "message": "Duplicate NIC number. Please use a unique NIC number.",
  "timestamp": "2024-04-23T10:30:00Z"
}
```

### Invalid Request - 400 Bad Request
```json
{
  "status": 400,
  "message": "Invalid request",
  "timestamp": "2024-04-23T10:30:00Z"
}
```

### Not Found - 404 Not Found
```json
{
  "status": 404,
  "message": "Customer not found",
  "timestamp": "2024-04-23T10:30:00Z"
}
```

---

## Frontend Form to Backend Payload Mapping

### Frontend Form Values
```javascript
{
  name: "John Doe",
  dateOfBirth: Date object,
  nicNumber: "198765432123",
  mobileNumbers: [
    { id: null, number: "0701234567" },
    { id: null, number: "0712345678" }
  ],
  addresses: [
    { id: null, addressLine1: "123 Main St", addressLine2: "Apt 4", cityId: "1", countryId: "1" }
  ]
}
```

### Conversion Before Sending
```javascript
const payload = {
  name: values.name,
  dateOfBirth: formatDate(values.dateOfBirth),        // Date → "yyyy-MM-dd"
  nicNumber: values.nicNumber,
  mobileNumbers: values.mobileNumbers.map(m => ({
    id: m.id || null,
    number: m.number,
  })),
  addresses: values.addresses.map(a => ({
    id: a.id || null,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 || '',
    city: { id: parseInt(a.cityId) || null },         // String → Integer
    country: { id: parseInt(a.countryId) || null },   // String → Integer
  })),
};
```

---

## Testing with cURL

### Create Customer
```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "nicNumber": "12345678",
    "dateOfBirth": "1990-01-15",
    "mobileNumbers": [{"id": null, "number": "0701234567"}],
    "addresses": [{"id": null, "addressLine1": "Test St", "addressLine2": "", "city": {"id": 1}, "country": {"id": 1}}]
  }'
```

### Get All Customers
```bash
curl http://localhost:8080/api/customers
```

### Get Cities
```bash
curl http://localhost:8080/api/cities
```

### Get Countries
```bash
curl http://localhost:8080/api/countries
```

---

## Common Issues & Solutions

### Issue: "At least one mobile number is required"
**Solution**: Add at least one mobile number before saving

### Issue: "At least one address is required"
**Solution**: Add at least one complete address (with city and country) before saving

### Issue: "Duplicate NIC number"
**Solution**: Use a unique NIC number that doesn't already exist in the database

### Issue: Invalid date format
**Solution**: Ensure date is in yyyy-MM-dd format and is not in the future

### Issue: City/Country dropdown empty
**Solution**: Ensure `/api/cities` and `/api/countries` endpoints return proper data

