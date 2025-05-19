// src/components/NEST/TechnicianDashboard.jsx
import React from 'react';

const TechnicianDashboard = ({ technician }) => {
  // Sample data - in a real app this would come from props or an API
  const assignedVehicles = [
    {
      id: 'WO-27491',
      vehicle: '2025 Rivian R1T',
      repair: 'Drive Unit Replacement',
      estimatedTime: 3.5,
      status: 'pending',
      partsStatus: 'Ready'
    },
    {
      id: 'WO-27492',
      vehicle: '2024 Rivian R1S',
      repair: '12V Battery System',
      estimatedTime: 1,
      status: 'pending',
      partsStatus: 'Ready'
    },
    {
      id: 'WO-27493',
      vehicle: '2023 Rivian R1T',
      repair: 'Suspension Calibration',
      estimatedTime: 2,
      status: 'pending',
      partsStatus: 'Ready'
    },
    {
      id: 'WO-27494',
      vehicle: '2025 Rivian R1S',
      repair: 'Infotainment Update',
      estimatedTime: 1,
      status: 'pending',
      partsStatus: 'Ready'
    }
  ];

  const totalHours = assignedVehicles.reduce((acc, vehicle) => acc + vehicle.estimatedTime, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Today's Assignments</h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <span className="font-bold">{totalHours} hours</span> of work assigned
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">Daily Goal</h3>
          <div className="flex items-center mt-2">
            <div className="h-4 bg-gray-200 rounded-full flex-grow">
              <div className="h-4 bg-green-600 rounded-full" style={{ width: `${(totalHours/8)*100}%` }}></div>
            </div>
            <span className="ml-2 font-bold">{Math.round((totalHours/8)*100)}%</span>
          </div>
          <p className="text-sm mt-2 text-green-800">{8 - totalHours > 0 ? `${8 - totalHours} hours remaining` : 'Goal achieved!'}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800">Team Progress</h3>
          <div className="flex items-center mt-2">
            <div className="h-4 bg-gray-200 rounded-full flex-grow">
              <div className="h-4 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="ml-2 font-bold">65%</span>
          </div>
          <p className="text-sm mt-2 text-blue-800">Team is on track for today</p>
        </div>
      </div>
      
      <h3 className="font-bold text-lg mb-4 border-b pb-2">Assigned Vehicles</h3>
      
      <div className="space-y-4">
        {assignedVehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            className="border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer bg-white"
            draggable="true"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">{vehicle.vehicle}</h4>
                <p className="text-blue-700 font-semibold">{vehicle.repair}</p>
                <p className="text-sm text-gray-600">WO: {vehicle.id}</p>
              </div>
              <div className="text-right">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{vehicle.estimatedTime} hours</span>
                <p className="text-sm mt-2">{vehicle.partsStatus}</p>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <button className="text-white bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700">
                Start Work
              </button>
              <button className="text-blue-600 underline text-sm">
                View OWL Resources
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianDashboard;