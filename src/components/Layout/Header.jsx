// src/components/Layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-rivian-blue-900 text-white shadow-md z-10">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div>
              <Link to="/" className="flex items-center space-x-2">
                <div className="font-bold text-xl">Rivian</div>
                <div className="text-sm text-gray-300">Service Portal</div>
              </Link>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="px-2 py-1 rounded hover:bg-rivian-blue-800 text-sm font-medium">Dashboard</Link>
              <Link to="/resources" className="px-2 py-1 rounded hover:bg-rivian-blue-800 text-sm font-medium">Resources</Link>
              <Link to="/work-orders" className="px-2 py-1 rounded hover:bg-rivian-blue-800 text-sm font-medium">Work Orders</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-rivian-blue-800 text-white text-sm rounded-full py-1 px-4 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-600 w-40"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="material-icons-outlined text-sm">search</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-rivian-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">
                AR
              </div>
              <div className="ml-2 text-sm">
                <div className="font-medium">Alex Rodriguez</div>
                <div className="text-xs text-gray-300">Service Technician</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;