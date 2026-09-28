import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      { to: '/login', label: 'Login', icon: User }
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600">RoomDekho</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3"><ThemeControls />
          <nav className="flex space-x-4 lg:space-x-6 items-center">
            {navItems.map((item, i) => (
              item.to ? (
                <Link key={i} to={item.to} className="flex items-center space-x-1 hover:text-blue-600 font-medium text-sm lg:text-base">
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ) : (
                <button key={i} onClick={item.onClick} className="flex items-center space-x-1 hover:text-blue-600 font-medium text-sm lg:text-base">
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              )
            ))}
          </nav></div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2"><ThemeControls />
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <nav className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-4">
            {navItems.map((item, i) => (
              item.to ? (
                <Link
                  key={i}
                  to={item.to}
                  className="flex items-center space-x-2 p-2 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg text-left"
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
