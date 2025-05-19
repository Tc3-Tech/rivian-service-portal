// src/pages/Dashboard.jsx
import React from 'react';
import TechnicianDashboard from '../components/NEST/TechnicianDashboard';

const Dashboard = () => {
  // Mock technician data
  const technician = {
    name: 'Alex Rodriguez',
    id: 'T-3891',
    specialization: 'Drive Systems',
    efficiency: 87
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Service Technician Portal</h1>
        <div className="text-sm text-gray-600">
          Welcome back, <span className="font-semibold">{technician.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TechnicianDashboard technician={technician} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm font-semibold hover:bg-blue-200 flex flex-col items-center justify-center">
                <span className="material-icons-outlined text-2xl mb-1">description</span>
                OWL Resources
              </button>
              <button className="bg-purple-100 text-purple-800 p-3 rounded-lg text-sm font-semibold hover:bg-purple-200 flex flex-col items-center justify-center">
                <span className="material-icons-outlined text-2xl mb-1">build</span>
                RiDE Tools
              </button>
              <button className="bg-green-100 text-green-800 p-3 rounded-lg text-sm font-semibold hover:bg-green-200 flex flex-col items-center justify-center">
                <span className="material-icons-outlined text-2xl mb-1">inventory</span>
                Parts Lookup
              </button>
              <button className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm font-semibold hover:bg-yellow-200 flex flex-col items-center justify-center">
                <span className="material-icons-outlined text-2xl mb-1">query_stats</span>
                QUEST Nodes
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Service Bulletins</h2>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded">
                <p className="font-semibold text-red-800">SB-2025-042 (New)</p>
                <p className="text-sm">Drive Unit High Voltage Connector Torque Update</p>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                <p className="font-semibold text-yellow-800">SB-2025-038</p>
                <p className="text-sm">Infotainment System Software Update Required</p>
              </div>
              <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                <p className="font-semibold text-gray-800">SB-2025-035</p>
                <p className="text-sm">Suspension Calibration Procedure Update</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;