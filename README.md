# 🎯 Customer Management System

## If you need to run in cloud DB  go to application.properties file  and uncomment  cloud DB part and comment local DB part 

> A robust, enterprise-grade full-stack application designed to manage customer records at scale.

A comprehensive full-stack customer management platform featuring advanced CRUD operations, high-performance bulk import capabilities, and intelligent data management with support for complex customer relationships including mobile numbers, addresses, and family member associations.

### 👥 Core Customer Management
- **Complete CRUD Operations**: Create, read, update, and delete customer profiles with full data integrity
- **Complex Relationship Management**: Handle multiple mobile numbers, addresses, and family member associations per customer
- **Unique Identity Validation**: NIC (National Identity Card) uniqueness enforcement with duplicate detection
- **Timestamp Tracking**: Automatic creation and modification timestamps for audit trails
- **Cascading Operations**: Smart cascade deletes and orphan removal for relational data

### 🚀 High-Performance Bulk Import
- **Enterprise-Scale Upload**: Import up to 1,000,000 customers in a single Excel file (.xlsx, .xls format)
- **Intelligent Batch Processing**: Automatic batching of 100 records per database transaction for optimal memory usage
- **Apache POI Integration**: Streaming-based Excel parsing to minimize memory footprint
- **Comprehensive Error Handling**: Detailed validation feedback with specific error messages per failed record
- **Progress Tracking**: Real-time upload progress monitoring with success/failure statistics

### 📊 Server-Side Pagination & Sorting
- **Efficient Data Retrieval**: Fetch large datasets in manageable chunks with configurable page sizes
- **Smart Sorting**: Automatic sorting by `updatedAt` (DESC) with `id` as tie-breaker for consistency
- **Stateless Pagination**: RESTful pagination endpoints supporting unlimited dataset sizes
- **Performance Optimized**: Lazy-loading relationships to minimize database queries

### 🎨 Modern User Interface
- **Custom React Components**: Zero-dependency UI components built from scratch (no Material-UI or Bootstrap)
- **Glassmorphism Design**: Modern frosted-glass aesthetic with backdrop blur effects
- **Modal Dialogs**: User-friendly forms for create/edit operations with validation
- **Drag-and-Drop Support**: Intuitive file upload zones for Excel imports
- **Toast Notifications**: Non-intrusive success/error feedback system
- **Responsive Design**: Fully responsive layouts for desktop, tablet, and mobile devices
- **Dark Theme**: Professional dark color scheme with excellent contrast and accessibility

### 🔧 Master Data Management
- **Dynamic Country/City Dropdowns**: Populate form fields with master data from database
- **Hierarchical Relationships**: Cities filtered by selected country
- **Extensible Design**: Easy to add new master data types

## � Tech Stack

### Frontend
- **React 19**: Modern UI framework with hooks and concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **Axios**: HTTP client with interceptors for error handling and request/response transformation
- **React Router v7**: Client-side routing and navigation
- **Lucide React**: Clean, consistent SVG icon library
- **React DatePicker**: Advanced date selection with custom formatting
- **Date-fns**: Modern date utility library for formatting and manipulation
- **React Hot Toast**: Elegant toast notifications system
- **CSS3**: Custom styling with flexbox, grid, and modern CSS features (no framework dependencies)

### Backend
- **Java 8+**: Core programming language
- **Spring Boot 2.7**: Rapid application development framework
- **Spring Data JPA**: Repository abstraction layer with Hibernate ORM
- **Hibernate ORM**: Object-relational mapping with advanced relationship management
- **Lombok**: Java boilerplate reduction (@Getter, @Setter, @Builder, etc.)
- **Apache POI 5.2**: Excel file reading and streaming
- **Spring Validation**: Bean validation with custom constraints
- **MariaDB JDBC Driver**: Optimized MariaDB database connector

### Database & Infrastructure
- **MariaDB**: Open-source relational database (Docker container support)
- **JUnit 5**: Modern testing framework
- **Mockito**: Mocking library for unit tests
- **Docker**: Containerized database deployment

## 🏗️ Project Architecture

### Frontend Structure
```
Frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Button.jsx           # Styled button component
│   │   ├── Input.jsx            # Form input component
│   │   ├── Select.jsx           # Dropdown select component
│   │   ├── DatePicker.jsx       # Date selection component
│   │   ├── Modal.jsx            # Modal dialog component
│   │   ├── Alert.jsx            # Alert notification component
│   │   ├── Badge.jsx            # Status badge component
│   │   ├── Table.jsx            # Data table component
│   │   └── index.js             # Component exports
│   ├── pages/                   # Page-level components
│   │   ├── CustomerList.jsx     # Main customer management page
│   │   ├── BulkUpload.jsx       # Excel bulk import page
│   │   └── index.js             # Page exports
│   ├── services/                # API integration layer
│   │   ├── api.js               # Axios instance with interceptors
│   │   └── customerService.js   # Customer API methods
│   ├── App.jsx                  # Root application component
│   ├── App.css                  # App-level styles
│   ├── theme.css                # Design system variables
│   ├── index.css                # Global styles
│   ├── main.jsx                 # React DOM entry point
│   └── vite.config.js           # Vite configuration
├── package.json                 # Dependencies
├── index.html                   # HTML entry point
└── public/                      # Static assets
    ├── favicon.svg
    └── icons.svg
```

### Backend Structure
```
Backend/customer-management-system/
├── src/
│   ├── main/
│   │   ├── java/com/dilhara/customer/
│   │   │   ├── CustomerManagementSystemApplication.java    # Spring Boot entry point
│   │   │   ├── controller/                  # REST API endpoints
│   │   │   │   ├── CustomerController.java      # Customer CRUD endpoints
│   │   │   │   ├── BulkUploadController.java    # Bulk import endpoint
│   │   │   │   └── MasterDataController.java    # Master data endpoints
│   │   │   ├── service/                    # Business logic layer
│   │   │   │   ├── CustomerService.java        # Customer operations
│   │   │   │   ├── BulkUploadService.java      # Bulk import logic
│   │   │   │   └── MasterDataService.java      # Master data operations
│   │   │   ├── repository/                 # Data access layer (JPA)
│   │   │   │   └── CustomerRepository.java     # Customer DB queries
│   │   │   ├── model/                      # Entity classes
│   │   │   │   ├── Customer.java               # Customer entity
│   │   │   │   ├── MobileNumber.java           # Mobile number entity
│   │   │   │   ├── Address.java                # Address entity
│   │   │   │   ├── FamilyMember.java           # Family member entity
│   │   │   │   ├── Country.java                # Country master data
│   │   │   │   └── City.java                   # City master data
│   │   │   ├── dto/                        # Data transfer objects
│   │   │   │   ├── CustomerDTO.java            # Customer DTO
│   │   │   │   ├── BulkUploadResponseDTO.java  # Upload response DTO
│   │   │   │   ├── AddressDTO.java             # Address DTO
│   │   │   │   └── Other DTOs                  # Additional DTOs
│   │   │   └── exception/                  # Custom exceptions
│   │   │       └── Global exception handling
│   │   └── resources/
│   │       ├── application.properties      # Spring Boot configuration
│   │       └── data.sql                    # Initial data setup
│   └── test/                               # Unit tests
│       └── java/com/dilhara/customer/
│           └── service/                    # Service layer tests
├── pom.xml                                 # Maven configuration
└── mvnw                                    # Maven wrapper script
```

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK)**: Version 8 or higher
- **Maven**: For Java dependency management and build (included: Maven Wrapper)
- **Node.js & npm**: Version 16+ for frontend development
- **SDK -zulu 1.8
- **Docker Desktop**: For MariaDB database container (optional but recommended)


### Installation & Setup

## If you need to run in cloud DB  go to application.properties file  and uncomment  cloud DB part and comment local DB part 


#### Step 1: Database Setup (if use cloud DB skip this)

1. **Start MariaDB Container**:
```bash
docker run -d \
  -p 3306:3306 \
  --name customer_db \
  -e MYSQL_ROOT_PASSWORD=password123 \
  -e MYSQL_DATABASE=customer_db \
  mariadb:latest
```

2. **Verify Database Connection**:
```bash
docker exec -it customer_db mysql -u root -p -e "SHOW DATABASES;"
```

#### Step 2: Backend Setup

1. **Navigate to Backend Directory**:
```bash
cd Backend/customer-management-system
```

2. **Start Backend Server** (Spring Boot will auto-create tables):
```bash
./mvnw spring-boot:run
```

Expected output: `Started CustomerManagementSystemApplication in X seconds`

Backend API: **http://localhost:8080**

#### Step 3: Frontend Setup

1. **Navigate to Frontend Directory** (in a new terminal):
```bash
cd Frontend
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Start Development Server**:
```bash
npm run dev
```

Expected output: `Local: http://localhost:5173`

#### Step 4: Access Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Quick Start Script

Alternatively, run both applications simultaneously using the provided startup script:
```bash
./start.sh
```

This script automatically:
- Checks if Backend is running on port 8080
- Starts Backend in a new terminal (if not running)
- Checks if Frontend is running on port 5173
- Starts Frontend in a new terminal (if not running)

## 🛣️ API Endpoints Reference

### Customer Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/customers` | Get paginated customer list with sorting |
| `POST` | `/api/customers/create` | Create a new customer |
| `GET` | `/api/customers/{id}` | Retrieve customer by ID |
| `PUT` | `/api/customers/{id}` | Update customer information |
| `DELETE` | `/api/customers/{id}` | Delete customer record |

### Bulk Import
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/customers/bulk/upload` | Upload customers from Excel file |

### Master Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/master/countries` | Get all countries |
| `GET` | `/api/master/cities` | Get all cities |
| `GET` | `/api/master/cities/country/{countryId}` | Get cities by country |

## 🔧 Configuration

### Backend Configuration
Edit `Backend/customer-management-system/src/main/resources/application.properties`:
```properties
# Server port
server.port=8080

# Database configuration
spring.datasource.url=jdbc:mariadb://localhost:3306/customer_db
spring.datasource.username=root
spring.datasource.password=password123

# JPA/Hibernate settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Frontend Configuration
Update API base URL in `Frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});
```

## 📊 Data Model

### Customer Entity Structure
```javascript
{
  id: number,
  name: string (required, 2-100 chars),
  dateOfBirth: Date (required),
  nicNumber: string (required, unique, 5-20 chars),
  mobileNumbers: MobileNumber[],
  addresses: Address[],
  familyMembers: FamilyMember[],
  createdAt: timestamp,
  updatedAt: timestamp
}

MobileNumber: { id, number, customer }
Address: { id, line1, line2, city, country, customer }
FamilyMember: { id, relationship, customer }
```

## 📥 Excel Format for Bulk Upload

Use this exact format for bulk uploads:

| Column | Example | Rules |
|--------|---------|-------|
| Name | John Doe | Required, 2-100 chars |
| Date of Birth | 1990-01-15 | Required, YYYY-MM-DD format |
| NIC Number | ABC123456 | Required, unique, 5-20 chars |
| Mobile Number 1 | 0701234567 | Optional, 7-10 digits |
| Mobile Number 2 | 0702345678 | Optional, 7-10 digits |
| Address Line 1 | 123 Main St | Optional |
| Address Line 2 | Apt 4 | Optional |
| City | Colombo | Optional (required if address given) |
| Country | Sri Lanka | Optional (required if address given) |

**Note**: Column headers must match exactly for proper parsing.

## 🧪 Usage Workflow

### Creating a Customer Manually
1. Navigate to **Customers** page
2. Click **+ Add Customer** button
3. Fill in required fields:
   - Full Name
   - Date of Birth (use date picker)
   - NIC Number (must be unique)
4. (Optional) Add mobile numbers and addresses
5. Click **Save Customer**
6. View updated customer list with new entry

### Bulk Uploading Customers
1. Navigate to **Bulk Upload** page
2. Prepare Excel file (.xlsx or .xls) with correct format
3. Click upload area or select file from file picker
4. Review data preview before uploading
5. Click **Upload All Customers**
6. Monitor progress bar and wait for completion
7. Review success/failure statistics
8. Download error report if needed (for failed records)

### Editing a Customer
1. Go to **Customers** page
2. Find customer in table
3. Click **Edit** button
4. Modify any field
5. Click **Save Changes**
6. Confirm in dialog

### Deleting a Customer
1. Go to **Customers** page
2. Find customer in table
3. Click **Delete** button
4. Confirm deletion in modal dialog
5. Customer removed from system

## 🚀 Build and Deployment

### Production Build

**Frontend Build**:
```bash
cd Frontend
npm run build  # Creates optimized dist/ folder
npm run preview # Test production build locally
```

**Backend Build**:
```bash
cd Backend/customer-management-system
./mvnw clean package  # Creates executable JAR
```

### Deployment Checklist
- [ ] Update database credentials in `application.properties`
- [ ] Update API base URL in frontend config
- [ ] Configure CORS if frontend on different domain
- [ ] Set JVM heap size appropriate for database size
- [ ] Use HTTPS in production
- [ ] Setup database backups
- [ ] Configure logging for production
- [ ] Test all CRUD operations in production environment

## ⚡ Performance Tips

- **Batch Size**: Bulk upload processes in 100-record batches
- **Pagination**: Frontend loads customers in 10-row pages (configurable)
- **Lazy Loading**: Related entities loaded on-demand
- **Database Indexing**: NIC number is indexed for fast lookups
- **File Size**: Supports up to 50MB Excel files (1,000,000+ records)

## 🔐 Security Considerations

- **Input Validation**: Both client-side (immediate feedback) and server-side
- **CORS Protection**: Only configured origins can access backend
- **NIC Uniqueness**: Prevents duplicate identity entries
- **SQL Injection Prevention**: Uses parameterized queries (JPA)
- **XSS Protection**: React automatically escapes content
- **Error Messages**: Generic messages to prevent information leakage

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Dark theme with accent colors
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: ARIA labels, keyboard navigation support

### Component Library (Custom Built)
- Button with variants (primary, secondary, danger)
- Input with validation feedback
- Select with search (countries, cities)
- DatePicker with calendar
- Modal with animations
- Table with hover states
- Alert/Toast for notifications
- Badge for status indicators

## 📱 Responsive Design

The application is fully responsive across all devices:

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | Two column, flexible |
| Desktop | > 1024px | Full layout, optimal spacing |

## ❓ Troubleshooting Guide

### Issue: "Cannot connect to backend"
**Solution**:
1. Verify backend is running: `http://localhost:8080`
2. Check browser console (F12) for CORS errors
3. Ensure both apps are on localhost
4. Restart backend server

### Issue: "Port 8080 already in use"
**Solution**:
```bash
# Find and kill process using port 8080
lsof -ti:8080 | xargs kill -9
# Or change port in application.properties
```

### Issue: "Port 5173 already in use"
**Solution**:
```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9
# Or change port in vite.config.js
```

### Issue: "Database connection failed"
**Solution**:
1. Verify MariaDB container is running: `docker ps`
2. Check credentials in `application.properties`
3. Verify database exists: `docker exec customer_db mysql -u root -p -e "SHOW DATABASES;"`
4. Restart container if needed

### Issue: "Validation error on NIC"
**Solution**: NIC must be:
- Unique (not already in database)
- 5-20 characters
- Not already taken

### Issue: "Bulk upload fails silently"
**Solution**:
1. Check console for error messages
2. Verify Excel headers match exactly
3. Check file is valid Excel format
4. Look at backend logs for detailed errors

### Issue: "Table shows no data"
**Solution**:
1. Check API responses in Network tab (F12)
2. Verify GET /api/customers returns data
3. Check if page size is correct
4. Try adding a new customer first

## 📚 Project Documentation

- **README.md** (this file) - Complete project guide
- **Frontend/package.json** - Frontend dependencies and scripts
- **Backend/pom.xml** - Backend dependencies and build configuration
- **start.sh** - Startup script for both applications

## 🎯 Development Roadmap

- [x] Core CRUD operations
- [x] Bulk Excel import
- [x] Relationship management
- [x] Responsive UI
- [ ] Advanced search filters
- [ ] Customer export to Excel
- [ ] Activity/audit logs
- [ ] User authentication
- [ ] Role-based access control
- [ ] Pagination optimization

## 🤝 Contributing Guidelines

### Code Style
- **Frontend**: ES6+, functional components with hooks
- **Backend**: Java 8+, Spring Boot conventions
- **Comments**: Meaningful comments for complex logic
- **Tests**: Unit tests for service layer

### Adding Features
1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes following code style
3. Test thoroughly
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push and create pull request

### Bug Fixes
1. Create bug branch: `git checkout -b fix/bug-name`
2. Add unit test reproducing bug
3. Fix the issue
4. Verify fix with test
5. Submit pull request

## 📞 Support & Feedback

For questions, issues, or suggestions:

1. **Check Console Errors**: Press F12 and check console tab
2. **Review Logs**: Backend logs show detailed error information
3. **Verify Setup**: Ensure all prerequisites are installed
4. **Test Endpoints**: Use Postman/curl to test API endpoints
5. **Network Tab**: Check network requests and responses

## 📝 License

This project is open source and available under the MIT License.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so.
```

---

## 👨‍💻 Author

**Dilhara Jayashan**
- GitHub: [@Dilhara-Jayashan](https://github.com/Dilhara-Jayashan)
- GitHub Repository: [Customer-Management-System](https://github.com/Dilhara-Jayashan/Customer-Management-System)


---

**Last Updated**: April 24, 2026  
**Project Version**: 1.0.0  
**Status**: ✅ Production Ready

**Made with ❤️ by Dilhara Jayashan**

For more information, visit the [GitHub Repository](https://github.com/Dilhara-Jayashan/Customer-Management-System)
