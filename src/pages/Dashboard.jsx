// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Sample data
  const [assignedVehicles, setAssignedVehicles] = useState([
    {
      id: 'WO-27491',
      vehicle: '2025 Rivian R1T',
      repair: 'Drive Unit Replacement',
      estimatedTime: 3.5,
      status: 'Ready',
      priority: 'High',
      assignmentReason: 'Experience with drive units, availability in schedule',
      matchScore: 92
    },
    {
      id: 'WO-27492',
      vehicle: '2024 Rivian R1S',
      repair: '12V Battery System',
      estimatedTime: 1,
      status: 'Ready',
      priority: 'Medium',
      assignmentReason: 'Recent battery system certification, optimal workflow sequencing',
      matchScore: 88
    },
    {
      id: 'WO-27493',
      vehicle: '2023 Rivian R1T',
      repair: 'Suspension Calibration',
      estimatedTime: 2,
      status: 'Ready',
      priority: 'Medium',
      assignmentReason: 'Balanced workload distribution, suspension specialty',
      matchScore: 85
    },
    {
      id: 'WO-27494',
      vehicle: '2025 Rivian R1S',
      repair: 'Infotainment Update',
      estimatedTime: 1,
      status: 'Ready',
      priority: 'Low',
      assignmentReason: 'Quick task fits efficiently between major repairs',
      matchScore: 79
    }
  ]);

  const totalHours = assignedVehicles.reduce((acc, vehicle) => acc + vehicle.estimatedTime, 0);
  const dailyGoalPercentage = Math.round((totalHours / 8) * 100);
  const hoursRemaining = 8 - totalHours;

  // Statistics
  const technicianStats = {
    weeklyEfficiency: 94,
    monthlyCompletedRepairs: 48,
    averageCustomerSatisfaction: 4.8,
    skillsUtilization: 92
  };
  
  // Service center stats
  const serviceCenterStats = {
    totalWorkOrders: 32,
    assignedWorkOrders: 28,
    technicianUtilization: 87,
    averageWaitTime: 1.2
  };

  // For AI task reassignment
  const [showReassignmentModal, setShowReassignmentModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Service Technician Portal</h1>
        <div className="mt-2 sm:mt-0 text-sm text-gray-600 flex items-center">
          <span className="material-icons-outlined mr-1 text-green-600">calendar_today</span>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {/* Performance Summary Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-rivian-blue-700 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium mr-3">
                AR
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Alex Rodriguez</h2>
                <p className="text-sm text-gray-600">Drive Systems Specialist</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500">Daily Efficiency</div>
              <div className="text-xl font-bold text-green-600">94%</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-blue-800 font-medium mb-1">Week Efficiency</div>
              <div className="text-2xl font-bold text-blue-900">{technicianStats.weeklyEfficiency}%</div>
              <div className="text-xs text-blue-700 mt-1">+3% from last week</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-sm text-green-800 font-medium mb-1">Monthly Repairs</div>
              <div className="text-2xl font-bold text-green-900">{technicianStats.monthlyCompletedRepairs}</div>
              <div className="text-xs text-green-700 mt-1">Top 10% of technicians</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="text-sm text-yellow-800 font-medium mb-1">Customer Rating</div>
              <div className="text-2xl font-bold text-yellow-900">{technicianStats.averageCustomerSatisfaction} <span className="text-sm font-normal">/ 5</span></div>
              <div className="text-xs text-yellow-700 mt-1">Based on 23 reviews</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-sm text-purple-800 font-medium mb-1">Skills Utilization</div>
              <div className="text-2xl font-bold text-purple-900">{technicianStats.skillsUtilization}%</div>
              <div className="text-xs text-purple-700 mt-1">Optimal task-skill match</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Goals and Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-5 md:col-span-2">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Today's Goals & Progress</h3>
          
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex-1 min-w-[240px]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-700">Personal Goal</h4>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalHours} of 8 hours
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full mb-2">
                <div 
                  className="h-4 bg-blue-600 rounded-full" 
                  style={{ width: `${dailyGoalPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {dailyGoalPercentage}% of daily goal • {hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : 'Goal achieved!'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-green-600">AI optimized:</span> Your workload is balanced for maximum efficiency
              </div>
            </div>
            
            <div className="flex-1 min-w-[240px]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-700">Service Center</h4>
                <span className="text-sm text-gray-500">May 18, 2025</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full mb-2">
                <div className="h-4 bg-green-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="text-sm text-gray-600">
                65% • Team is on track for today
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-green-600">28 of 32</span> work orders assigned • <span className="text-green-600">87%</span> technician utilization
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div>
              <div className="text-sm font-medium text-blue-800 mb-2">AI Assignment Benefits</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center">
                  <span className="material-icons-outlined text-green-600 mr-1 text-sm">check_circle</span>
                  <span>Optimized repair sequencing for efficiency</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons-outlined text-green-600 mr-1 text-sm">check_circle</span>
                  <span>Tasks matched to your technical expertise</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons-outlined text-green-600 mr-1 text-sm">check_circle</span>
                  <span>Balanced workload across all technicians</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-800 mb-2">Service Center Improvements</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center">
                  <span className="material-icons-outlined text-green-600 mr-1 text-sm">trending_up</span>
                  <span>+12% increase in repairs completed</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons-outlined text-green-600 mr-1 text-sm">access_time</span>
                  <span>Average wait time reduced by 37%</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons-outlined text-green-600 mr-1 text-sm">sentiment_very_satisfied</span>
                  <span>Customer satisfaction up 15%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Service Center Stats</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium text-gray-600">Total Work Orders</div>
                <div className="text-sm font-bold">{serviceCenterStats.totalWorkOrders}</div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full" 
                  style={{ width: `${(serviceCenterStats.assignedWorkOrders / serviceCenterStats.totalWorkOrders) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {serviceCenterStats.assignedWorkOrders} assigned ({Math.round((serviceCenterStats.assignedWorkOrders / serviceCenterStats.totalWorkOrders) * 100)}%)
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium text-gray-600">Technician Utilization</div>
                <div className="text-sm font-bold">{serviceCenterStats.technicianUtilization}%</div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-600 rounded-full" 
                  style={{ width: `${serviceCenterStats.technicianUtilization}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                +7% above target
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium text-gray-600">Avg. Customer Wait Time</div>
                <div className="text-sm font-bold">{serviceCenterStats.averageWaitTime} days</div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-yellow-600 rounded-full" 
                  style={{ width: `${(serviceCenterStats.averageWaitTime / 3) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Target: 1.0 days
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Top Repair Types Today</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs">Drive Unit Replacement</div>
                  <div className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">7</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs">Battery System Service</div>
                  <div className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">5</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs">Software Updates</div>
                  <div className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Assigned Vehicles Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">AI-Assigned Vehicles</h3>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Sort by:</span>
            <select className="text-sm border rounded p-1">
              <option>Priority</option>
              <option>Estimated Time</option>
              <option>Match Score</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {assignedVehicles.map(vehicle => (
            <div 
              key={vehicle.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5 border-l-4 border-blue-600">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-bold text-lg text-gray-800">{vehicle.vehicle}</h4>
                      <div className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${
                        vehicle.priority === 'High' ? 'bg-red-100 text-red-800' :
                        vehicle.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.priority}
                      </div>
                    </div>
                    <p className="text-blue-700 font-semibold">{vehicle.repair}</p>
                    <p className="text-sm text-gray-600">WO: {vehicle.id}</p>
                  </div>
                  <div className="md:text-right mt-3 md:mt-0">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-xs text-blue-800 font-medium mr-2">AI Match Score</span>
                        <span className={`text-sm font-bold ${
                          vehicle.matchScore > 90 ? 'text-green-600' :
                          vehicle.matchScore > 80 ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>{vehicle.matchScore}%</span>
                      </div>
                      <p className="text-xs text-gray-700 text-right">{vehicle.assignmentReason}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center">
                        <span className="material-icons-outlined text-sm mr-1">play_arrow</span>
                        Start Work
                      </button>
                      <Link to="/resources" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors flex items-center">
                        <span className="material-icons-outlined text-sm mr-1">description</span>
                        OWL Resources
                      </Link>
                      <button 
                        onClick={() => setShowReassignmentModal(true)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-md text-sm transition-colors"
                        title="Request reassignment"
                      >
                        <span className="material-icons-outlined text-sm">swap_horiz</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="material-icons-outlined text-gray-400 text-sm mr-1">schedule</span>
                    <span className="text-sm text-gray-600">{vehicle.estimatedTime} hours</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons-outlined text-green-600 text-sm mr-1">check_circle</span>
                    <span className="text-sm text-gray-600">{vehicle.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Reassignment Modal */}
      {showReassignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Request Reassignment</h3>
              <button 
                onClick={() => setShowReassignmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">Please provide a reason for requesting task reassignment:</p>
            
            <div className="space-y-3 mb-4">
              {[
                "I don't have the necessary skills for this repair",
                "I have a conflicting priority task",
                "I need specialized tools that are unavailable",
                "I believe another technician would be better suited",
                "Other reason (please specify)"
              ].map(reason => (
                <div key={reason} className="flex items-center">
                  <input 
                    type="radio" 
                    id={reason.replace(/\s+/g, '-').toLowerCase()} 
                    name="reassignment-reason" 
                    className="mr-2"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  <label htmlFor={reason.replace(/\s+/g, '-').toLowerCase()} className="text-sm text-gray-700">
                    {reason}
                  </label>
                </div>
              ))}
            </div>
            
            {selectedReason === "Other reason (please specify)" && (
              <textarea 
                className="w-full border rounded p-2 text-sm mb-4" 
                rows="3" 
                placeholder="Please provide details..."
              ></textarea>
            )}
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowReassignmentModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Request submitted. AI will analyze and adjust assignments.");
                  setShowReassignmentModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;