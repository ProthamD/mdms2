import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  Receipt, 
  Wrench
} from 'lucide-react';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { to: '/suppliers', icon: <Truck size={20} />, label: 'Suppliers' },
    { to: '/dealers', icon: <Users size={20} />, label: 'Dealers' },
    { to: '/manufacturing', icon: <Wrench size={20} />, label: 'Manufacturing' },
    { to: '/billing', icon: <Receipt size={20} />, label: 'Billing' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">M</span>
            <h2>ManufactureHub</h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      
      <main className="main-content">
        <div className="content-wrapper glass-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
