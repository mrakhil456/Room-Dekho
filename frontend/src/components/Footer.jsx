import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
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
              <li><a href="/" className="text-xs sm:text-sm hover:text-white transition">Home</a></li>
              <li><a href="/login" className="text-xs sm:text-sm hover:text-white transition">Login</a></li>
              <li><a href="/register" className="text-xs sm:text-sm hover:text-white transition">Register</a></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4">For Landlords</h4>
            <ul className="space-y-2">
              <li><a href="/register" className="text-xs sm:text-sm hover:text-white transition">Post Your Room</a></li>
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