const API_BASE_URL = 'http://localhost:3001/api';

class RivianAPI {
  static async fetchTechnicians() {
    const response = await fetch(`${API_BASE_URL}/technicians`);
    if (!response.ok) throw new Error('Failed to fetch technicians');
    return await response.json();
  }

  static async fetchTechnicianDashboard(technicianId) {
    const response = await fetch(`${API_BASE_URL}/technician/${technicianId}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return await response.json();
  }

  static async fetchWorkOrders() {
    const response = await fetch(`${API_BASE_URL}/work-orders`);
    if (!response.ok) throw new Error('Failed to fetch work orders');
    return await response.json();
  }

  static async optimizeAssignments() {
    const response = await fetch(`${API_BASE_URL}/assignments/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to optimize assignments');
    return await response.json();
  }

  static async requestReassignment(workOrderId, reason, details = '') {
    const response = await fetch(`${API_BASE_URL}/assignments/${workOrderId}/reassign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, details })
    });
    if (!response.ok) throw new Error('Failed to submit reassignment request');
    return await response.json();
  }

  static async fetchAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics/summary`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  }
}

export default RivianAPI;