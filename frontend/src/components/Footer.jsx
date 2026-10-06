import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">RoomDekho</h3>
            <p className="text-xs sm:text-sm">Find your perfect room in Lucknow. Affordable rentals for students and professionals.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-xs sm:text-sm transition">Home</Link></li>
              <li><Link to="/search" className="text-xs sm:text-sm transition">Find a room</Link></li>
              <li><Link to="/login" className="text-xs sm:text-sm transition">Login</Link></li>
              <li><Link to="/register" className="text-xs sm:text-sm transition">Register</Link></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4">For Landlords</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-xs sm:text-sm transition">Post Your Room</Link></li>
              <li><button className="text-xs sm:text-sm hover:text-white transition cursor-pointer bg-none border-none p-0">Dashboard</button></li>
              <li><button className="text-xs sm:text-sm hover:text-white transition cursor-pointer bg-none border-none p-0">Manage Listings</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>📍 Lucknow, Uttar Pradesh</li>
              <li>📧 info@roomdekho.com</li>
              <li>📞 +91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} RoomDekho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;