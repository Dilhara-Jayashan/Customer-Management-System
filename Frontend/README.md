# Customer Management System — Frontend

A full-featured React SPA for managing customer records, built as a job-interview showcase project. Connects to a Spring Boot REST API backed by MariaDB.

---

## ✨ Features

- **Customer CRUD** — Create, view, edit, and delete customer profiles
- **Rich Profiles** — Each customer supports multiple mobile numbers, addresses (with city/country), and linked family members
- **Bulk Excel Upload** — Import up to 1,000,000 customers from an `.xlsx` / `.xls` file with real-time upload progress
- **Live Search** — Filter customers by name or NIC number instantly
- **Paginated API** — Fetches customers with server-side pagination
- **Dark Premium UI** — Custom dark design system with glassmorphism, gradients, and micro-animations

---

## 🛠️ Tech Stack

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19 | Core UI library |
| `react-dom` | ^19 | DOM rendering + `createPortal` for modals |
| `react-router-dom` | ^7 | Client-side routing (SPA navigation) |
| `axios` | ^1 | HTTP client — REST API calls with interceptors |
| `react-hot-toast` | ^2 | Toast notification system |
| `react-datepicker` | ^9 | Accessible date-picker component |
| `lucide-react` | ^1 | Icon library (SVG-based, tree-shakeable) |
| `date-fns` | ^4 | Date formatting and parsing utilities |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `vite` | Build tool and dev server (HMR) |
| `@vitejs/plugin-react` | Vite plugin for React JSX transform |
| `eslint` | Static code linting |
| `eslint-plugin-react-hooks` | Lint rules for React Hooks |
| `eslint-plugin-react-refresh` | Lint rules for Vite HMR compatibility |

---

## 📁 Project Structure

```
Frontend/
├── public/
│   └── favicon.svg             # App favicon
│
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Alert.jsx / .css    # Info / error / success alert banners
│   │   ├── Badge.jsx / .css    # Inline label badges
│   │   ├── Button.jsx / .css   # Primary, secondary, danger, ghost buttons
│   │   ├── DatePicker.jsx      # Themed react-datepicker wrapper
│   │   ├── Input.jsx / .css    # Text input + label + error message
│   │   ├── Modal.jsx / .css    # Portal-based modal dialog
│   │   ├── Select.jsx          # Themed <select> dropdown wrapper
│   │   ├── Table.jsx / .css    # Sortable data table with loading state
│   │   └── index.js            # Barrel export for all components
│   │
│   ├── pages/
│   │   ├── CustomerList.jsx    # Main customers page (list, add, edit, view, delete)
│   │   ├── CustomerList.css    # Page-level styles
│   │   ├── BulkUpload.jsx      # Excel bulk import page with drag-and-drop
│   │   ├── BulkUpload.css      # Bulk upload page styles
│   │   └── index.js            # Barrel export for pages
│   │
│   ├── services/
│   │   ├── api.js              # Axios instance with base URL + error interceptors
│   │   └── customerService.js  # All API calls: CRUD, bulk upload, master data
│   │
│   ├── App.jsx                 # Root component — router, navbar, layout, footer
│   ├── App.css                 # App shell layout (navbar, main, footer)
│   ├── theme.css               # CSS custom properties (design tokens)
│   ├── index.css               # Global resets, typography, scrollbar styles
│   └── main.jsx                # React entry point
│
├── index.html                  # HTML shell
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint flat config
└── package.json                # Project metadata and dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Spring Boot backend running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` folder.

---

## 🔌 API Integration

The frontend communicates with the backend at `http://localhost:8080/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/customers?page=&size=` | Paginated customer list |
| `POST` | `/customers/create` | Create a new customer |
| `PUT` | `/customers/{id}` | Update a customer |
| `DELETE` | `/customers/{id}` | Delete a customer |
| `POST` | `/customers/bulk/upload` | Bulk upload (multipart `.xlsx`) |
| `GET` | `/master/countries` | All countries (for address dropdowns) |
| `GET` | `/master/cities` | All cities |
| `GET` | `/master/cities/country/{id}` | Cities filtered by country |

---

## 🎨 Design System

The UI is built on CSS custom properties defined in `theme.css`. Key tokens:

- **Color palette** — Indigo/violet brand, dark navy surfaces (`#0a0e1a` base)
- **Typography** — [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- **Spacing & radius** — `--space-*` and `--radius-*` scale tokens
- **Shadows & glows** — Layered shadows with indigo glow effects
- **Z-index layers** — `--z-sticky` (100) → `--z-modal-bg` (9998) → `--z-modal` (9999) → `--z-toast` (99999)

---

## 📝 Key Design Decisions

- **React Portal for modals** — `Modal.jsx` uses `createPortal(…, document.body)` so modals always render above sticky navbars and footers, regardless of parent stacking contexts
- **Axios interceptors** — `api.js` centralises error handling (400, 404, 409, 500) so service methods stay clean
- **No global state library** — All state is local to pages/components; the app is simple enough that Context or Redux would be overkill
- **Multipart upload timeout** — Bulk upload sets a 10-minute timeout to support million-row Excel files

---

## 👤 Author

**Dilhara Jayashan**  
GitHub: [Dilhara-Jayashan](https://github.com/Dilhara-Jayashan)
