// src/components/Layout/Header.jsx - Enhanced version with UserSwitcher
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './Layout';
import UserSwitcher from '../UserSwitcher';

const Header = () => {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useUser();

  const getPageTitle = () => {
    if (location.pathname === '/manager') {
      return 'Service Center Management';
    } else if (location.pathname.startsWith('/dashboard') || location.pathname === '/') {
      return 'Technician Dashboard';
    } else if (location.pathname === '/resources') {
      return 'Resources (OWL)';
    } else if (location.pathname === '/work-orders') {
      return 'Work Orders';
    } else {
      return 'Rivian Service Portal';
    }
  };

  const getPageDescription = () => {
    if (location.pathname === '/manager') {
      return 'AI-powered assignment oversight and analytics';
    } else if (location.pathname.startsWith('/dashboard') || location.pathname === '/') {
      return 'Your personalized AI-optimized work assignments';
    } else {
      return 'Powered by AI assignment technology';
    }
  };

  return (
    <header className="bg-rivian-blue-900 text-white shadow-md z-10">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div>
              <Link to="/" className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="font-bold text-xl">Rivian</div>
                  <div className="ml-2 px-2 py-0.5 bg-blue-600 text-xs rounded-full">AI</div>
                </div>
                <div className="text-sm text-gray-300">Service Portal</div>
              </Link>
              <div className="mt-1">
                <div className="text-sm font-medium">{getPageTitle()}</div>
                <div className="text-xs text-blue-200">{getPageDescription()}</div>
              </div>
            </div>
            
            {/* Quick Navigation */}
            <div className="hidden lg:flex space-x-6">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' || location.pathname === '/' 
                    ? 'bg-rivian-blue-800 text-white' 
                    : 'hover:bg-rivian-blue-800'
                }`}
              >
                <span className="material-icons-outlined text-sm mr-1">person</span>
                Technician
              </Link>
              <Link 
                to="/manager" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/manager' 
                    ? 'bg-purple-700 text-white' 
                    : 'hover:bg-rivian-blue-800'
                }`}
              >
                <span className="material-icons-outlined text-sm mr-1">dashboard</span>
                Manager
              </Link>
              <Link 
                to="/resources" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/resources' 
                    ? 'bg-rivian-blue-800 text-white' 
                    : 'hover:bg-rivian-blue-800'
                }`}
              >
                <span className="material-icons-outlined text-sm mr-1">library_books</span>
                Resources
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search work orders, techs..."
                className="bg-rivian-blue-800 text-white text-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600 w-64 placeholder-blue-300"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                <span className="material-icons-outlined text-sm">search</span>
              </div>
            </div>

            {/* AI Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-rivian-blue-800 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300">AI Active</span>
            </div>

            {/* User Switcher */}
            <UserSwitcher 
              currentUser={currentUser} 
              onUserChange={setCurrentUser}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;