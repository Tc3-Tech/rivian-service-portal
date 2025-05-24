import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Resources from './pages/Resources';
import WorkOrders from './pages/WorkOrders';
import TechnicianView from './pages/TechnicianView';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manager" element={<ManagerDashboard />} />
          <Route path="resources" element={<Resources />} />
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="technician-view" element={<TechnicianView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;