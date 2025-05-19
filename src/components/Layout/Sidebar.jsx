// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-4 font-bold text-xl border-b border-gray-700">
        Rivian OWL & NEST
      </div>
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link to="/" className="block p-3 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li>
            <Link to="/resources" className="block p-3 hover:bg-gray-700 rounded">Resources (OWL)</Link>
          </li>
          <li>
            <Link to="/work-orders" className="block p-3 hover:bg-gray-700 rounded">Work Orders</Link>
          </li>
          <li>
            <Link to="/technician-view" className="block p-3 hover:bg-gray-700 rounded">Technician View</Link>
          </li>
        </ul>
      </nav>
      
      <div className="px-4 py-4 mt-4 border-t border-gray-700">
        <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Related Links</div>
        <ul className="space-y-1">
          <li>
            <button 
              className="block p-3 hover:bg-gray-700 rounded w-full text-left text-gray-300"
              onClick={() => alert('RiDE Tool would launch here')}
            >
              RiDE Diagnostic Tool
            </button>
          </li>
          <li>
            <button 
              className="block p-3 hover:bg-gray-700 rounded w-full text-left text-gray-300"
              onClick={() => alert('Documentation would open here')}
            >
              Help & Documentation
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;