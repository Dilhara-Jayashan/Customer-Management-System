import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Users, Upload, LayoutDashboard } from 'lucide-react';
import { CustomerList } from './pages/CustomerList';
import { BulkUpload }   from './pages/BulkUpload';
import './theme.css';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="nav-container">
            <NavLink to="/" className="nav-brand" aria-label="Customer Management System Home">
              <div className="nav-logo">
                <LayoutDashboard size={18} />
              </div>
              <div className="nav-brand-text">
                <span className="nav-brand-title">CMS</span>
                <span className="nav-brand-subtitle">Customer Management</span>
              </div>
            </NavLink>

            <ul className="nav-menu" role="list">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  id="nav-customers"
                >
                  <Users size={15} />
                  Customers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/bulk-upload"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  id="nav-bulk-upload"
                >
                  <Upload size={15} />
                  Bulk Upload
                </NavLink>
              </li>
            </ul>

            <div className="nav-status" aria-label="Backend connection status">
              <span className="status-dot" aria-hidden="true" />
              <span>API: localhost:8080</span>
            </div>
          </div>
        </nav>

        {/* ── Page Content ────────────────────────────────────── */}
        <main className="main-content" id="main-content">
          <Routes>
            <Route path="/"            element={<CustomerList />} />
            <Route path="/bulk-upload" element={<BulkUpload />}   />
          </Routes>
        </main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="footer" role="contentinfo">
          <div className="footer-left">
            © {new Date().getFullYear()} Customer Management System · Built with React + Spring Boot
          </div>
          <div className="footer-right">
            <span className="footer-badge">React 19</span>
            <span className="footer-badge">Spring Boot</span>
            <span className="footer-badge">MariaDB</span>
          </div>
        </footer>

        {/* ── Toast Notifications ─────────────────────────────── */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a2340',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            },
            success: {
              iconTheme: { primary: '#4ade80', secondary: '#1a2340' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#1a2340' },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
