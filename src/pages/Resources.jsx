// src/pages/Resources.jsx
import React, { useState } from 'react';

const Resources = () => {
  const [activeTab, setActiveTab] = useState("resources");
  const [selectedCategory, setSelectedCategory] = useState("Repair Procedures");
  
  // Work order data
  const workOrderData = {
    orderNumber: "WO-27491",
    vehicle: "R1T",
    vin: "7FTTW1CV3NLB51289",
    reportedIssue: "Vehicle experiencing loss of power during acceleration",
    diagnosedProblem: "Drive Unit Replacement Required",
    technicianAssigned: "Alex Rodriguez"
  };
  
  // Resource categories
  const categories = [
    "Repair Procedures",
    "Service Procedures (RiDE)",
    "Wiring Design Portal",
    "QUEST Nodes",
    "Theory of Operations",
    "Parts Information",
    "Tool Requirements"
  ];
  
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Work Order Info Banner */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold">Work Order: {workOrderData.orderNumber}</h1>
            <p className="text-sm text-gray-600">
              {workOrderData.vehicle} | VIN: {workOrderData.vin}
            </p>
          </div>
          <div className="bg-yellow-100 p-2 rounded">
            <p className="font-semibold">Diagnosed Issue:</p>
            <p className="text-red-600 font-bold">{workOrderData.diagnosedProblem}</p>
          </div>
        </div>
        <p className="mt-2"><span className="font-semibold">Reported Issue:</span> {workOrderData.reportedIssue}</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-t-lg shadow-md">
        <div 
          className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === "resources" ? "bg-white border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </div>
        <div 
          className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === "documentation" ? "bg-white border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("documentation")}
        >
          Documentation
        </div>
        <div 
          className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === "notes" ? "bg-white border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 bg-white rounded-b-lg shadow-md overflow-hidden">
        {/* Left Sidebar - Resource Categories */}
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-semibold mb-4">Resource Categories</h2>
          <ul className="space-y-2">
            {categories.map(category => (
              <li 
                key={category}
                className={`rounded p-2 cursor-pointer ${selectedCategory === category ? 'bg-blue-700 font-semibold' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Related Repairs</h3>
            <ul className="text-sm space-y-1">
              <li className="text-blue-300 hover:underline cursor-pointer">Battery Disconnection Procedure</li>
              <li className="text-blue-300 hover:underline cursor-pointer">Drivetrain Alignment Check</li>
              <li className="text-blue-300 hover:underline cursor-pointer">Torque Specifications</li>
            </ul>
          </div>
        </div>
        
        {/* Main Content - Resource Viewer */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Drive Unit Replacement Procedure</h2>
          
          <div className="flex justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Estimated Time: 4.5 hours</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Parts In Stock</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg">Required Resources:</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <a href="#" className="flex items-center p-3 border rounded hover:bg-blue-50">
                  <span className="mr-2 text-blue-600">📄</span>
                  Complete Procedure Document
                </a>
                <a href="#" className="flex items-center p-3 border rounded hover:bg-blue-50">
                  <span className="mr-2 text-blue-600">⚡</span>
                  RiDE Diagnostics
                </a>
                <a href="#" className="flex items-center p-3 border rounded hover:bg-blue-50 bg-blue-100">
                  <span className="mr-2 text-blue-600">🔌</span>
                  Wiring Diagrams
                </a>
                <a href="#" className="flex items-center p-3 border rounded hover:bg-blue-50">
                  <span className="mr-2 text-blue-600">🔧</span>
                  Parts Catalog
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">QUEST Node History:</h3>
              <div className="mt-2 border rounded p-4 bg-gray-50">
                <p className="text-sm"><span className="font-semibold">3 relevant QUEST nodes found</span> for Drive Unit Replacement on R1T</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-sm text-blue-600 hover:underline cursor-pointer">
                    • QUEST-2189: Drive Unit Noise Investigation (April 2025)
                  </li>
                  <li className="text-sm text-blue-600 hover:underline cursor-pointer">
                    • QUEST-1854: Drive Unit Replacement After Water Exposure (Feb 2025)
                  </li>
                  <li className="text-sm text-blue-600 hover:underline cursor-pointer">
                    • QUEST-1677: Drive Unit Connector Failure Analysis (Jan 2025)
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">Parts Required:</h3>
              <table className="min-w-full mt-2 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Part Number</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">RVN-DU-2572-A</td>
                    <td className="p-2">Drive Unit Assembly - R1T</td>
                    <td className="p-2">1</td>
                    <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">In Stock</span></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">RVN-MT-0582-B</td>
                    <td className="p-2">Mounting Hardware Kit</td>
                    <td className="p-2">1</td>
                    <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">In Stock</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;