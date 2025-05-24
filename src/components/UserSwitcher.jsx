// User Switcher Component for easy login switching
// Save as: src/components/UserSwitcher.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserSwitcher = ({ currentUser, onUserChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const users = [
    // Managers
    { id: 'manager1', name: 'Service Manager', type: 'manager', role: 'Service Center Manager' },
    { id: 'manager2', name: 'Assistant Manager', type: 'manager', role: 'Assistant Manager' },
    
    // RIV 5 Technicians (Mentors)
    { id: 2, name: 'Sarah Johnson', type: 'technician', riv_level: 5, role: 'Senior Technician - Mentor' },
    { id: 14, name: 'Nicole White', type: 'technician', riv_level: 5, role: 'Senior Technician - Mentor' },
    
    // RIV 3 Technicians
    { id: 1, name: 'Alex Rodriguez', type: 'technician', riv_level: 3, role: 'Drive Systems Specialist' },
    { id: 5, name: 'James Wilson', type: 'technician', riv_level: 3, role: 'Diagnostic Specialist' },
    { id: 10, name: 'Ashley Brown', type: 'technician', riv_level: 3, role: 'Thermal Systems Specialist' },
    { id: 15, name: 'Christopher Moore', type: 'technician', riv_level: 3, role: 'ADAS Specialist' },
    
    // RIV 2 Technicians
    { id: 3, name: 'Michael Chen', type: 'technician', riv_level: 2, role: 'General Technician' },
    { id: 6, name: 'Maria Garcia', type: 'technician', riv_level: 2, role: 'Battery Specialist' },
    { id: 8, name: 'Lisa Anderson', type: 'technician', riv_level: 2, role: 'Electronics Technician' },
    { id: 11, name: 'Ryan Taylor', type: 'technician', riv_level: 2, role: 'Suspension Specialist' },
    { id: 13, name: 'Brandon Lee', type: 'technician', riv_level: 2, role: 'Battery Systems Tech' },
    
    // RIV 1 Technicians
    { id: 4, name: 'Emma Davis', type: 'technician', riv_level: 1, role: 'Junior Technician' },
    { id: 7, name: 'David Thompson', type: 'technician', riv_level: 1, role: 'Apprentice Technician' },
    { id: 9, name: 'Kevin Martinez', type: 'technician', riv_level: 1, role: 'Entry Level Tech' },
    { id: 12, name: 'Jessica Miller', type: 'technician', riv_level: 1, role: 'Trainee Technician' }
  ];

  const handleUserSwitch = (user) => {
    onUserChange(user);
    setIsOpen(false);
    
    // Navigate to appropriate dashboard
    if (user.type === 'manager') {
      navigate('/manager');
    } else {
      navigate(`/dashboard?tech=${user.id}`);
    }
  };

  const getCurrentUserDisplay = () => {
    if (currentUser?.type === 'manager') {
      return currentUser;
    }
    return users.find(u => u.id === currentUser?.id) || users[2]; // Default to Alex Rodriguez
  };

  const currentUserDisplay = getCurrentUserDisplay();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-rivian-blue-800 transition-colors"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
          currentUserDisplay?.type === 'manager' ? 'bg-purple-600' :
          currentUserDisplay?.riv_level === 5 ? 'bg-purple-600' :
          currentUserDisplay?.riv_level === 3 ? 'bg-blue-600' :
          currentUserDisplay?.riv_level === 2 ? 'bg-green-600' : 'bg-yellow-600'
        }`}>
          {currentUserDisplay?.name?.split(' ').map(n => n[0]).join('') || 'AR'}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">
            {currentUserDisplay?.name || 'Alex Rodriguez'}
          </div>
          <div className="text-xs text-gray-300">
            {currentUserDisplay?.role || 'Drive Systems Specialist'}
          </div>
        </div>
        <span className="material-icons-outlined text-gray-300 text-sm">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="font-medium text-gray-800">Switch User Role</h3>
            <p className="text-xs text-gray-600">Test different perspectives and assignments</p>
          </div>

          {/* Managers Section */}
          <div className="p-2">
            <div className="text-xs font-medium text-purple-800 uppercase tracking-wider px-2 py-1">
              👔 Management
            </div>
            {users.filter(u => u.type === 'manager').map(user => (
              <button
                key={user.id}
                onClick={() => handleUserSwitch(user)}
                className={`w-full flex items-center p-2 rounded hover:bg-purple-50 transition-colors ${
                  currentUserDisplay?.id === user.id ? 'bg-purple-100' : ''
                }`}
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm font-medium text-gray-800">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <span className="material-icons-outlined text-purple-600 text-sm">dashboard</span>
              </button>
            ))}
          </div>

          {/* Technicians by RIV Level */}
          <div className="border-t">
            {[5, 3, 2, 1].map(rivLevel => {
              const techsAtLevel = users.filter(u => u.type === 'technician' && u.riv_level === rivLevel);
              if (techsAtLevel.length === 0) return null;

              const levelConfig = {
                5: { color: 'purple', label: '🏆 RIV 5 - Senior Mentors', bgColor: 'bg-purple-600' },
                3: { color: 'blue', label: '🔧 RIV 3 - Specialists', bgColor: 'bg-blue-600' },
                2: { color: 'green', label: '⚙️ RIV 2 - Technicians', bgColor: 'bg-green-600' },
                1: { color: 'yellow', label: '📚 RIV 1 - Trainees', bgColor: 'bg-yellow-600' }
              };

              return (
                <div key={rivLevel} className="p-2">
                  <div className={`text-xs font-medium text-${levelConfig[rivLevel].color}-800 uppercase tracking-wider px-2 py-1`}>
                    {levelConfig[rivLevel].label}
                  </div>
                  {techsAtLevel.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSwitch(user)}
                      className={`w-full flex items-center p-2 rounded hover:bg-${levelConfig[rivLevel].color}-50 transition-colors ${
                        currentUserDisplay?.id === user.id ? `bg-${levelConfig[rivLevel].color}-100` : ''
                      }`}
                    >
                      <div className={`w-8 h-8 ${levelConfig[rivLevel].bgColor} rounded-full flex items-center justify-center text-white font-medium text-sm mr-3`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                      <span className={`material-icons-outlined text-${levelConfig[rivLevel].color}-600 text-sm`}>
                        person
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t bg-gray-50 text-center">
            <p className="text-xs text-gray-600">
              🤖 AI assignments adapt based on each user's RIV level and skills
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;