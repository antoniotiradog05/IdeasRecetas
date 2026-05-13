import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: '📅', label: 'Planificador' },
  { to: '/recipes',   icon: '📖', label: 'Recetas' },
  { to: '/shopping',  icon: '🛒', label: 'Lista de la compra' },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="app-layout">
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="modal-backdrop" 
          style={{ zIndex: 105 }} 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🛒</div>
          <div className="sidebar-logo-text">Smart<span>Cart</span></div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
