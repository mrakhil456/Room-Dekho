import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearRooms } from '../store/roomsSlice';
import { LogOut, User, Home, Search, Heart, Plus, Menu, X, GitCompare } from 'lucide-react';
import ThemeControls from './ThemeControls';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearRooms());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getNavItems = () => {
    if (!user) return [
      { to: '/', label: 'Home', icon: Home },
      { to: '/search', label: 'Find a room', icon: Search },
      { to: '/login', label: 'Sign in', icon: User },
      { to: '/register', label: 'Get started', icon: Plus, primary: true }
    ];
    const items = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/search', label: 'Search', icon: Search },
      { to: '/wishlist', label: 'Wishlist', icon: Heart },
      { to: '/compare', label: 'Compare', icon: GitCompare }
    ];
    if (user.role === 'tenant') items.push({ to: '/tenant', label: 'Dashboard', icon: Heart });
    if (user.role === 'landlord') items.push({ to: '/landlord', label: 'Listings', icon: Plus });
    if (user.role === 'admin') items.push({ to: '/admin', label: 'Admin', icon: User });
    items.push({ label: 'Logout', icon: LogOut, onClick: handleLogout });
    return items;
  };

  const navItems = getNavItems();

  return (
    <header className="header-shell sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] justify-between items-center py-3">
          <Link to="/" className="brand-mark text-xl sm:text-2xl font-extrabold tracking-tight">RoomDekho<span>.</span></Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3"><ThemeControls />
          <nav aria-label="Main navigation" className="flex items-center gap-1 lg:gap-2">
            {navItems.map((item, i) => (
              item.to ? (
                <NavLink key={i} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${item.primary ? 'nav-link-primary' : ''}`}>
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <button key={i} onClick={item.onClick} className="nav-link">
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              )
            ))}
          </nav></div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2"><ThemeControls />
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button></div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation" className="mobile-nav lg:hidden pb-4 space-y-1 border-t pt-3">
            {navItems.map((item, i) => (
              item.to ? (
                <NavLink
                  key={i}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link mobile-nav-link ${isActive ? 'active' : ''} ${item.primary ? 'nav-link-primary' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className="nav-link mobile-nav-link w-full text-left"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
