import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { CustomerList, BulkUpload } from './pages'
import './App.css'

function AppContent() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>Customer Management System</h1>
          </div>
          <ul className="nav-menu">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/')}`}
              >
                Customers
              </Link>
            </li>
            <li>
              <Link 
                to="/bulk-upload" 
                className={`nav-link ${isActive('/bulk-upload')}`}
              >
                Bulk Upload
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/bulk-upload" element={<BulkUpload />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Customer Management System. All rights reserved.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
