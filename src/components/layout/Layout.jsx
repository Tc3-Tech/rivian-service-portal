// src/components/Layout/Layout.jsx - Enhanced version with UserContext
import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

// User Context for managing current user across the app
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Alex Rodriguez',
    type: 'technician',
    riv_level: 3,
    role: 'Drive Systems Specialist'
  });

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const Layout = () => {
  return (
    <UserProvider>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </UserProvider>
  );
};

export default Layout;