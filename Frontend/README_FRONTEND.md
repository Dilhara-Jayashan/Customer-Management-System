# Customer Management System - Frontend

A modern React-based frontend for the Customer Management System built with Vite, featuring customer CRUD operations and bulk customer uploads.

## Features

- **Customer Management**
  - Create new customers
  - View all customers in a table format
  - Edit existing customer information
  - Delete customers
  - Multiple mobile numbers per customer
  - Multiple addresses per customer
  - Family member relationships

- **Bulk Upload**
  - Upload multiple customers from CSV files
  - Preview data before uploading
  - Progress tracking for large uploads
  - Error handling and detailed upload reports
  - CSV template download

- **User Interface**
  - Responsive design (mobile, tablet, desktop)
  - Form validation
  - Real-time error messages
  - Alert notifications
  - Modal dialogs
  - Data tables with sorting

## Tech Stack

- **React 19.2** - UI Library
- **Vite 8.0** - Build tool
- **Axios 1.15** - HTTP Client
- **React DatePicker 9.1** - Date selection
- **Lucide React 1.8** - Icons
- **date-fns 4.1** - Date formatting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── DatePicker.jsx
│   ├── Modal.jsx
│   ├── Alert.jsx
│   ├── Table.jsx
│   └── index.js
├── pages/              # Main page components
│   ├── CustomerList.jsx
│   ├── BulkUpload.jsx
│   └── index.js
├── services/           # API service layer
│   ├── api.js          # Axios instance
│   └── customerService.js
├── hooks/              # Custom React hooks
│   ├── useForm.js      # Form state management
│   ├── useFetch.js     # Data fetching hook
│   └── index.js
├── utils/              # Utility functions
│   ├── validation.js   # Form validation
│   ├── fileHelper.js   # File handling
├── App.jsx            # Main app component
├── App.css            # Main app styles
└── main.jsx           # Entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the backend API URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## API Endpoints

The frontend expects the following API endpoints:

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `POST /api/customers/bulk-upload` - Bulk upload customers

### Master Data
- `GET /api/cities` - Get all cities
- `GET /api/countries` - Get all countries

## Form Validation

The application includes validation for:
- **Name**: 2-100 characters (required)
- **Date of Birth**: Valid date, not in future (required)
- **NIC Number**: 5-20 characters, unique (required)
- **Mobile Number**: 7-10 digits (optional, multiple)
- **Address**: 
  - Address Line 1: Required
  - Address Line 2: Optional
  - City: Required
  - Country: Required

## Bulk Upload Format

CSV file format for bulk uploads:
```csv
Name,Date of Birth,NIC Number,Mobile Number 1,Mobile Number 2
John Doe,1990-01-15,ABC123456,0701234567,0702345678
Jane Smith,1992-03-20,XYZ789012,0703456789,
```

## Error Handling

The application handles various error scenarios:
- Network errors
- Duplicate NIC numbers
- Invalid form data
- File upload errors
- API validation errors

Error messages are displayed in alert notifications.

## Performance Considerations

- Lazy loading components with React
- CSV parsing handled in the browser
- Progress tracking for bulk uploads (up to 50MB files)
- Debounced form submissions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- [ ] Excel file support for bulk uploads
- [ ] Customer search and filtering
- [ ] Export customers to CSV/Excel
- [ ] Pagination for large datasets
- [ ] Family member management UI
- [ ] Address autocomplete
- [ ] Customer analytics dashboard

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
