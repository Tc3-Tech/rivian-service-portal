// src/pages/ManagerDashboard.jsx - Full featured manager dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [allWorkOrders, setAllWorkOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  useEffect(() => {
    loadManagerData();
  }, []);

  const loadManagerData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be actual API calls
      const mockData = generateManagerMockData();
      setAllTechnicians(mockData.technicians);
      setAllWorkOrders(mockData.workOrders);
      setAnalytics(mockData.analytics);
    } catch (error) {
      console.error('Failed to load manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeAll = async () => {
    setOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate optimization results
      const optimizedData = generateOptimizedData();
      setAllWorkOrders(optimizedData.workOrders);
      setAnalytics(optimizedData.analytics);
      
      alert('✅ All assignments optimized! Average match score improved by 8 points.');
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const handleManualReassignment = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setShowReassignModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service center data...</p>
        </div>
      </div>
    );
  }

  const assignedWorkOrders = allWorkOrders.filter(wo => wo.status === 'assigned');
  const pendingWorkOrders = allWorkOrders.filter(wo => wo.status === 'pending');
  const totalWorkload = allTechnicians.reduce((sum, tech) => sum + tech.current_workload_hours, 0);
  const avgUtilization = Math.round(totalWorkload / (allTechnicians.length * 8) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Center Management</h1>
          <p className="text-sm text-gray-600">AI-powered technician assignment oversight</p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={handleOptimizeAll}
            disabled={optimizing}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              optimizing 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {optimizing ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Optimizing All...
              </>
            ) : (
              <>
                <span className="material-icons-outlined text-sm mr-1">auto_awesome</span>
                Optimize All Assignments
              </>
            )}
          </button>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Service Center Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">🏢 Service Center Overview</h2>
              <p className="text-blue-100 text-sm">Real-time operational metrics</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{avgUtilization}%</div>
              <div className="text-sm text-blue-100">Team Utilization</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm font-medium">Active Technicians</div>
              <div className="text-2xl font-bold">{allTechnicians.length}</div>
              <div className="text-xs text-blue-100">
                {allTechnicians.filter(t => t.current_workload_hours > 0).length} assigned work
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm font-medium">Work Orders</div>
              <div className="text-2xl font-bold">{assignedWorkOrders.length}/{allWorkOrders.length}</div>
              <div className="text-xs text-blue-100">
                {pendingWorkOrders.length} pending assignment
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm font-medium">Avg Match Score</div>
              <div className="text-2xl font-bold">{analytics?.avg_match_score || 0}%</div>
              <div className="text-xs text-blue-100">
                {analytics?.high_match_percent || 0}% are 85%+ matches
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm font-medium">System Health</div>
              <div className="text-2xl font-bold">{analytics?.efficiency_score || 0}%</div>
              <div className="text-xs text-blue-100">
                AI assignment quality
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          { id: 'technicians', label: 'Technicians', icon: 'people' },
          { id: 'assignments', label: 'Assignments', icon: 'assignment' },
          { id: 'analytics', label: 'Analytics', icon: 'analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id)}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="material-icons-outlined text-sm mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RIV Level Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">RIV Level Distribution</h3>
            <div className="space-y-3">
              {[1, 2, 3, 5].map(level => {
                const techsAtLevel = allTechnicians.filter(t => t.riv_level === level);
                const avgWorkload = techsAtLevel.length > 0 
                  ? techsAtLevel.reduce((sum, t) => sum + t.current_workload_hours, 0) / techsAtLevel.length 
                  : 0;
                
                return (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                        level === 5 ? 'bg-purple-600' :
                        level === 3 ? 'bg-blue-600' :
                        level === 2 ? 'bg-green-600' : 'bg-yellow-600'
                      }`}>
                        {level}
                      </span>
                      <div>
                        <div className="font-medium">RIV {level}</div>
                        <div className="text-sm text-gray-500">{techsAtLevel.length} technicians</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{avgWorkload.toFixed(1)}h avg</div>
                      <div className="text-xs text-gray-500">
                        {Math.round(avgWorkload / 8 * 100)}% utilization
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workload Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Workload Distribution</h3>
            <div className="space-y-3">
              {allTechnicians.slice(0, 8).map(tech => {
                const utilization = (tech.current_workload_hours / 8) * 100;
                return (
                  <div key={tech.id} className="flex items-center">
                    <div className="w-24 text-sm font-medium truncate">{tech.name.split(' ')[0]}</div>
                    <div className="flex-1 mx-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>RIV {tech.riv_level}</span>
                        <span>{tech.current_workload_hours.toFixed(1)}h</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            utilization > 95 ? 'bg-red-500' :
                            utilization > 85 ? 'bg-yellow-500' :
                            utilization > 60 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, utilization)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium">
                      {Math.round(utilization)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'technicians' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">All Technicians</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RIV Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workload
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Match Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allTechnicians.map(tech => {
                  const techWorkOrders = assignedWorkOrders.filter(wo => wo.assigned_technician_id === tech.id);
                  const avgMatchScore = techWorkOrders.length > 0 
                    ? Math.round(techWorkOrders.reduce((sum, wo) => sum + (wo.match_score || 0), 0) / techWorkOrders.length)
                    : 0;
                  
                  return (
                    <tr key={tech.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                            tech.riv_level === 5 ? 'bg-purple-600' :
                            tech.riv_level === 3 ? 'bg-blue-600' :
                            tech.riv_level === 2 ? 'bg-green-600' : 'bg-yellow-600'
                          }`}>
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                            <div className="text-sm text-gray-500">{tech.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tech.riv_level === 5 ? 'bg-purple-100 text-purple-800' :
                          tech.riv_level === 3 ? 'bg-blue-100 text-blue-800' :
                          tech.riv_level === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          RIV {tech.riv_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tech.current_workload_hours.toFixed(1)}h / 8h</div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (tech.current_workload_hours / 8) * 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {techWorkOrders.length} work {techWorkOrders.length === 1 ? 'order' : 'orders'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          avgMatchScore > 85 ? 'text-green-600' :
                          avgMatchScore > 75 ? 'text-blue-600' :
                          avgMatchScore > 0 ? 'text-yellow-600' : 'text-gray-400'
                        }`}>
                          {avgMatchScore > 0 ? `${avgMatchScore}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/dashboard?tech=${tech.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Dashboard
                        </Link>
                        <button 
                          onClick={() => setSelectedTechnician(tech)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedView === 'assignments' && (
        <div className="space-y-6">
          {/* Pending Assignments */}
          {pendingWorkOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <h3 className="font-bold text-lg text-gray-800">
                  ⏳ Pending Assignments ({pendingWorkOrders.length})
                </h3>
                <p className="text-sm text-yellow-700">These work orders need AI assignment</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingWorkOrders.slice(0, 6).map(wo => (
                    <div key={wo.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{wo.order_number}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          wo.priority_level === 'High' ? 'bg-red-100 text-red-800' :
                          wo.priority_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {wo.priority_level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{wo.repair_type}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {wo.vehicle_year} {wo.vehicle_model} • {wo.estimated_hours}h • RIV {wo.required_riv_level}+
                      </p>
                      <button className="w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700">
                        Auto-Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Assignments */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-800">
                ✅ Active Assignments ({assignedWorkOrders.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {assignedWorkOrders.map(wo => (
                  <div key={wo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-bold text-gray-800 mr-3">{wo.order_number}</h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full mr-2 ${
                            wo.priority_level === 'High' ? 'bg-red-100 text-red-800' :
                            wo.priority_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {wo.priority_level}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            wo.repair_category === 'diagnostic' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {wo.repair_category === 'diagnostic' ? 'Diagnostic' : 'Remove & Replace'}
                          </span>
                        </div>
                        <p className="text-blue-700 font-semibold mb-1">{wo.repair_type}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {wo.vehicle_year} {wo.vehicle_model} • {wo.estimated_hours}h • Requires RIV {wo.required_riv_level}+
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Assigned to: <span className="font-medium text-gray-700">{wo.technician_name}</span></span>
                          <span>RIV {wo.technician_riv_level}</span>
                        </div>
                      </div>
                      
                      <div className="lg:ml-6 mt-3 lg:mt-0">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg px-3 py-2 mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-blue-800 font-medium">AI Match Score</span>
                            <span className={`text-lg font-bold ${
                              wo.match_score > 90 ? 'text-green-600' :
                              wo.match_score > 80 ? 'text-blue-600' :
                              wo.match_score > 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>{wo.match_score}%</span>
                          </div>
                          <p className="text-xs text-gray-700 mb-2">{wo.assignment_reason}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">
                            View Details
                          </button>
                          <button 
                            onClick={() => handleManualReassignment(wo)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm"
                          >
                            Reassign
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Assignment Quality Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Average Match Score</span>
                  <span className="text-sm font-bold">{analytics?.avg_match_score || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-600 rounded-full" 
                    style={{ width: `${analytics?.avg_match_score || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">High-Quality Assignments</span>
                  <span className="text-sm font-bold">{analytics?.high_match_percent || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${analytics?.high_match_percent || 0}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Assignments with 85%+ match scores
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">System Efficiency</span>
                  <span className="text-sm font-bold">{analytics?.efficiency_score || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-purple-600 rounded-full" 
                    style={{ width: `${analytics?.efficiency_score || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Performance Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="material-icons-outlined text-green-600 text-sm">trending_up</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Optimal RIV Matching</p>
                  <p className="text-xs text-gray-600">94% of assignments match skill requirements</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="material-icons-outlined text-blue-600 text-sm">balance</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Workload Balance</p>
                  <p className="text-xs text-gray-600">±12% variance across technicians</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="material-icons-outlined text-purple-600 text-sm">school</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Growth Opportunities</p>
                  <p className="text-xs text-gray-600">3 stretch assignments with mentorship</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="material-icons-outlined text-yellow-600 text-sm">speed</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Efficiency Gains</p>
                  <p className="text-xs text-gray-600">12% improvement in completion times</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Reassignment Modal */}
      {showReassignModal && selectedWorkOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Reassign Work Order</h3>
              <button 
                onClick={() => setShowReassignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Work Order:</span> {selectedWorkOrder.order_number}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Current Assignment:</span> {selectedWorkOrder.technician_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Match Score:</span> {selectedWorkOrder.match_score}%
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reassign to:
              </label>
              <select className="w-full border rounded p-2 text-sm">
                <option value="">Select technician...</option>
                {allTechnicians
                  .filter(t => t.id !== selectedWorkOrder.assigned_technician_id)
                  .map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} (RIV {tech.riv_level}) - {tech.current_workload_hours.toFixed(1)}h workload
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for reassignment:
              </label>
              <textarea 
                className="w-full border rounded p-2 text-sm" 
                rows="3" 
                placeholder="Optional: Explain the reason for manual reassignment..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowReassignModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Work order reassigned successfully! AI will learn from this manual override.");
                  setShowReassignModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock data generation functions
function generateManagerMockData() {
  const technicians = [
    { id: 1, name: 'Alex Rodriguez', employee_id: 'RIV-001', riv_level: 3, current_workload_hours: 7.5 },
    { id: 2, name: 'Sarah Johnson', employee_id: 'RIV-002', riv_level: 5, current_workload_hours: 6.0 },
    { id: 3, name: 'Michael Chen', employee_id: 'RIV-003', riv_level: 2, current_workload_hours: 8.0 },
    { id: 4, name: 'Emma Davis', employee_id: 'RIV-004', riv_level: 1, current_workload_hours: 5.5 },
    { id: 5, name: 'James Wilson', employee_id: 'RIV-005', riv_level: 3, current_workload_hours: 7.0 },
    { id: 6, name: 'Maria Garcia', employee_id: 'RIV-006', riv_level: 2, current_workload_hours: 6.5 },
    { id: 7, name: 'David Thompson', employee_id: 'RIV-007', riv_level: 1, current_workload_hours: 4.0 },
    { id: 8, name: 'Lisa Anderson', employee_id: 'RIV-008', riv_level: 2, current_workload_hours: 7.5 },
    { id: 9, name: 'Kevin Martinez', employee_id: 'RIV-009', riv_level: 1, current_workload_hours: 6.0 },
    { id: 10, name: 'Ashley Brown', employee_id: 'RIV-010', riv_level: 3, current_workload_hours: 8.0 },
    { id: 11, name: 'Ryan Taylor', employee_id: 'RIV-011', riv_level: 2, current_workload_hours: 5.0 },
    { id: 12, name: 'Jessica Miller', employee_id: 'RIV-012', riv_level: 1, current_workload_hours: 7.0 },
    { id: 13, name: 'Brandon Lee', employee_id: 'RIV-013', riv_level: 2, current_workload_hours: 6.5 },
    { id: 14, name: 'Nicole White', employee_id: 'RIV-014', riv_level: 5, current_workload_hours: 7.5 },
    { id: 15, name: 'Christopher Moore', employee_id: 'RIV-015', riv_level: 3, current_workload_hours: 6.0 }
  ];

  const workOrders = [
    { id: 1, order_number: 'WO-27491', vehicle_year: 2025, vehicle_model: 'R1T', repair_type: 'Drive Unit Replacement', repair_category: 'remove_replace', estimated_hours: 3.5, priority_level: 'High', required_riv_level: 2, status: 'assigned', assigned_technician_id: 1, technician_name: 'Alex Rodriguez', technician_riv_level: 3, match_score: 92, assignment_reason: 'Perfect skill match, optimal efficiency rating' },
    { id: 2, order_number: 'WO-27492', vehicle_year: 2024, vehicle_model: 'R1S', repair_type: 'Battery System Diagnostic', repair_category: 'diagnostic', estimated_hours: 2.0, priority_level: 'High', required_riv_level: 3, status: 'assigned', assigned_technician_id: 2, technician_name: 'Sarah Johnson', technician_riv_level: 5, match_score: 96, assignment_reason: 'Senior technician expertise, mentorship capability' },
    { id: 3, order_number: 'WO-27493', vehicle_year: 2023, vehicle_model: 'R1T', repair_type: 'Suspension Calibration', repair_category: 'remove_replace', estimated_hours: 2.0, priority_level: 'Medium', required_riv_level: 1, status: 'assigned', assigned_technician_id: 3, technician_name: 'Michael Chen', technician_riv_level: 2, match_score: 85, assignment_reason: 'Efficient RIV match, balanced workload' },
    { id: 4, order_number: 'WO-27494', vehicle_year: 2025, vehicle_model: 'R1S', repair_type: 'Infotainment Update', repair_category: 'remove_replace', estimated_hours: 1.0, priority_level: 'Low', required_riv_level: 1, status: 'assigned', assigned_technician_id: 4, technician_name: 'Emma Davis', technician_riv_level: 1, match_score: 78, assignment_reason: 'Perfect RIV match, available capacity' },
    { id: 5, order_number: 'WO-27495', vehicle_year: 2024, vehicle_model: 'R1T', repair_type: 'ADAS Calibration Investigation', repair_category: 'diagnostic', estimated_hours: 1.5, priority_level: 'Medium', required_riv_level: 3, status: 'pending' },
    { id: 6, order_number: 'WO-27496', vehicle_year: 2023, vehicle_model: 'R1S', repair_type: 'Window Replacement', repair_category: 'remove_replace', estimated_hours: 2.5, priority_level: 'Medium', required_riv_level: 1, status: 'pending' }
  ];

  const analytics = {
    avg_match_score: 88,
    high_match_percent: 67,
    efficiency_score: 91,
    total_assignments: 4,
    pending_assignments: 2
  };

  return { technicians, workOrders, analytics };
}

function generateOptimizedData() {
  const { technicians, workOrders, analytics } = generateManagerMockData();
  
  // Improve match scores
  const optimizedWorkOrders = workOrders.map(wo => 
    wo.status === 'assigned' 
      ? { ...wo, match_score: Math.min(98, wo.match_score + Math.floor(Math.random() * 8) + 3) }
      : wo
  );

  const optimizedAnalytics = {
    ...analytics,
    avg_match_score: Math.min(95, analytics.avg_match_score + 5),
    high_match_percent: Math.min(95, analytics.high_match_percent + 15),
    efficiency_score: Math.min(98, analytics.efficiency_score + 4)
  };

  return { workOrders: optimizedWorkOrders, analytics: optimizedAnalytics };
}

export default ManagerDashboard;