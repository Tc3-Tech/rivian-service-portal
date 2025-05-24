// src/services/googleSheetsApi.js - Complete Google Sheets Integration
class GoogleSheetsService {
  constructor() {
    // Google Sheets API configuration
    this.API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    this.BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
    this.debug = process.env.REACT_APP_DEBUG_SHEETS === 'true';
  }

  // Log debug messages if enabled
  log(message, data = null) {
    if (this.debug) {
      console.log(`[GoogleSheets] ${message}`, data || '');
    }
  }

  // Fetch data from Google Sheets
  async fetchSheetData(spreadsheetId, range) {
    try {
      if (!this.API_KEY) {
        throw new Error('Google Sheets API key not found in environment variables');
      }

      const url = `${this.BASE_URL}/${spreadsheetId}/values/${range}?key=${this.API_KEY}`;
      this.log(`Fetching data from: ${range}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      this.log(`Received ${data.values?.length || 0} rows from ${range}`);
      return data.values || [];
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      throw error;
    }
  }

  // Parse technician data from Google Sheets
  async getTechnicians(spreadsheetId) {
    try {
      // Expected sheet structure:
      // Row 1: Headers - Name, Employee_ID, RIV_Level, Hire_Date, Specialties, Email, etc.
      const rawData = await this.fetchSheetData(spreadsheetId, 'Technicians!A:N');
      
      if (rawData.length === 0) {
        throw new Error('No data found in Technicians sheet');
      }

      const [headers, ...rows] = rawData;
      this.log('Technician headers:', headers);
      
      const technicians = rows.map((row, index) => {
        const technician = {};
        headers.forEach((header, colIndex) => {
          const key = header.toLowerCase().replace(/\s+/g, '_');
          technician[key] = row[colIndex] || '';
        });

        // Transform and validate data
        const processedTech = {
          id: index + 1,
          name: technician.name || 'Unknown',
          employee_id: technician.employee_id || `RIV-${(index + 1).toString().padStart(3, '0')}`,
          riv_level: parseInt(technician.riv_level) || 1,
          hire_date: technician.hire_date || new Date().toISOString().split('T')[0],
          specialties: technician.specialties ? 
            technician.specialties.split(',').map(s => s.trim()).filter(s => s) : [],
          email: technician.email || '',
          phone: technician.phone || '',
          shift_start: technician.shift_start || '07:00',
          shift_end: technician.shift_end || '16:00',
          current_workload_hours: parseFloat(technician.current_workload_hours) || 0,
          max_daily_hours: parseFloat(technician.max_daily_hours) || 8,
          certifications: technician.certifications ? 
            technician.certifications.split(',').map(s => s.trim()).filter(s => s) : [],
          notes: technician.notes || '',
          is_active: technician.is_active !== 'FALSE' && technician.is_active !== 'false'
        };

        this.log(`Processed technician: ${processedTech.name} (RIV ${processedTech.riv_level})`);
        return processedTech;
      }).filter(tech => tech.is_active); // Only return active technicians

      this.log(`Returning ${technicians.length} active technicians`);
      return technicians;
    } catch (error) {
      console.error('Error parsing technician data:', error);
      throw error;
    }
  }

  // Parse work order data from Google Sheets
  async getWorkOrders(spreadsheetId) {
    try {
      // Expected sheet structure:
      // Headers: Order_Number, Vehicle_VIN, Vehicle_Model, Vehicle_Year, Repair_Type, etc.
      const rawData = await this.fetchSheetData(spreadsheetId, 'WorkOrders!A:Q');
      
      if (rawData.length === 0) {
        this.log('No work orders found, returning empty array');
        return [];
      }

      const [headers, ...rows] = rawData;
      this.log('Work order headers:', headers);
      
      const workOrders = rows.map((row, index) => {
        const workOrder = {};
        headers.forEach((header, colIndex) => {
          const key = header.toLowerCase().replace(/\s+/g, '_');
          workOrder[key] = row[colIndex] || '';
        });

        const processedWO = {
          id: index + 1,
          order_number: workOrder.order_number || `WO-${(27490 + index).toString()}`,
          vehicle_vin: workOrder.vehicle_vin || '',
          vehicle_model: workOrder.vehicle_model || 'R1T',
          vehicle_year: parseInt(workOrder.vehicle_year) || 2024,
          repair_type: workOrder.repair_type || 'General Repair',
          repair_category: workOrder.repair_category || 'remove_replace',
          estimated_hours: parseFloat(workOrder.estimated_hours) || 2.0,
          priority_level: workOrder.priority_level || 'Medium',
          required_riv_level: parseInt(workOrder.required_riv_level) || 1,
          required_skills: workOrder.required_skills ? 
            workOrder.required_skills.split(',').map(s => s.trim()).filter(s => s) : [],
          required_certifications: workOrder.required_certifications ? 
            workOrder.required_certifications.split(',').map(s => s.trim()).filter(s => s) : [],
          parts_ready: workOrder.parts_ready !== 'FALSE' && workOrder.parts_ready !== 'false',
          customer_wait_days: parseInt(workOrder.customer_wait_days) || 0,
          assigned_technician_id: workOrder.assigned_technician_id ? 
            parseInt(workOrder.assigned_technician_id) : null,
          status: workOrder.status || 'pending',
          created_at: workOrder.created_at || new Date().toISOString(),
          notes: workOrder.notes || ''
        };

        this.log(`Processed work order: ${processedWO.order_number} - ${processedWO.repair_type}`);
        return processedWO;
      });

      this.log(`Returning ${workOrders.length} work orders`);
      return workOrders;
    } catch (error) {
      console.error('Error parsing work order data:', error);
      throw error;  
    }
  }

  // Update Google Sheets with assignment results (requires write permissions)
  async updateAssignments(spreadsheetId, assignments) {
    try {
      this.log('Assignment updates to be written to Google Sheets:', assignments);
      
      // For read-only API key, just log the updates
      // Full write implementation requires OAuth2 authentication
      assignments.forEach(assignment => {
        console.log(`📝 Assignment: WO-${assignment.work_order_id} → Technician ${assignment.technician_id} (${assignment.match_score}% match)`);
      });

      return { 
        success: true, 
        message: `Logged ${assignments.length} assignment updates (write integration pending)` 
      };
    } catch (error) {
      console.error('Error updating assignments:', error);
      return { success: false, error: error.message };
    }
  }

  // Get historical performance data
  async getPerformanceHistory(spreadsheetId) {
    try {
      const rawData = await this.fetchSheetData(spreadsheetId, 'Performance!A:M');
      
      if (rawData.length === 0) {
        this.log('No performance history found');
        return [];
      }

      const [headers, ...rows] = rawData;
      this.log('Performance headers:', headers);
      
      const performance = rows.map(row => {
        const perf = {};
        headers.forEach((header, colIndex) => {
          const key = header.toLowerCase().replace(/\s+/g, '_');
          perf[key] = row[colIndex] || '';
        });

        return {
          technician_id: parseInt(perf.technician_id) || 0,
          work_order_id: perf.work_order_id || '',
          repair_type: perf.repair_type || '',
          estimated_hours: parseFloat(perf.estimated_hours) || 0,
          actual_hours: parseFloat(perf.actual_hours) || 0,
          was_successful: perf.was_successful === 'TRUE' || perf.was_successful === 'true',
          completion_date: perf.completion_date || '',
          customer_satisfaction_score: parseFloat(perf.customer_satisfaction_score) || 0,
          had_complications: perf.had_complications === 'TRUE' || perf.had_complications === 'true',
          notes: perf.notes || ''
        };
      });

      this.log(`Returning ${performance.length} performance records`);
      return performance;
    } catch (error) {
      console.error('Error parsing performance history:', error);
      return [];
    }
  }
}

// Enhanced API service that uses Google Sheets
class RivianAPIWithSheets {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.spreadsheetId = process.env.REACT_APP_RIVIAN_SPREADSHEET_ID;
    this.cache = {
      technicians: null,
      workOrders: null,
      performance: null,
      lastFetch: null
    };
    this.debug = process.env.REACT_APP_DEBUG_SHEETS === 'true';
  }

  log(message, data = null) {
    if (this.debug) {
      console.log(`[RivianAPI] ${message}`, data || '');
    }
  }

  // Check if cache is still valid (5 minutes)
  isCacheValid() {
    const cacheValid = this.cache.lastFetch && (Date.now() - this.cache.lastFetch) < 5 * 60 * 1000;
    this.log(`Cache valid: ${cacheValid}`);
    return cacheValid;
  }

  // Clear cache manually
  clearCache() {
    this.cache = {
      technicians: null,
      workOrders: null,
      performance: null,
      lastFetch: null
    };
    this.log('Cache cleared');
  }

  // Fetch technicians (with caching)
  async fetchTechnicians() {
    if (this.isCacheValid() && this.cache.technicians) {
      this.log('Returning cached technicians');
      return this.cache.technicians;
    }

    if (!this.spreadsheetId) {
      throw new Error('Spreadsheet ID not found in environment variables');
    }

    try {
      this.log('Fetching fresh technician data from Google Sheets');
      const technicians = await this.sheetsService.getTechnicians(this.spreadsheetId);
      
      // Enhance with calculated fields
      const enhancedTechnicians = technicians.map(tech => ({
        ...tech,
        efficiency_scores: this.calculateEfficiencyScores(tech),
        success_rates: this.calculateSuccessRates(tech),
        avg_completion_times: this.calculateCompletionTimes(tech),
        is_mentor: tech.riv_level === 5
      }));

      this.cache.technicians = enhancedTechnicians;
      this.cache.lastFetch = Date.now();
      
      this.log(`Successfully loaded ${enhancedTechnicians.length} technicians`);
      return enhancedTechnicians;
    } catch (error) {
      console.error('Failed to fetch technicians from Google Sheets:', error);
      throw error; // Re-throw to let calling code handle fallback
    }
  }

  // Fetch work orders (with caching)
  async fetchWorkOrders() {
    if (this.isCacheValid() && this.cache.workOrders) {
      this.log('Returning cached work orders');
      return this.cache.workOrders;
    }

    if (!this.spreadsheetId) {
      throw new Error('Spreadsheet ID not found in environment variables');
    }

    try {
      this.log('Fetching fresh work order data from Google Sheets');
      const workOrders = await this.sheetsService.getWorkOrders(this.spreadsheetId);
      this.cache.workOrders = workOrders;
      this.cache.lastFetch = Date.now();
      
      this.log(`Successfully loaded ${workOrders.length} work orders`);
      return workOrders;
    } catch (error) {
      console.error('Failed to fetch work orders from Google Sheets:', error);
      throw error; // Re-throw to let calling code handle fallback
    }
  }

  // Fetch performance history
  async fetchPerformanceHistory() {
    try {
      if (!this.spreadsheetId) {
        throw new Error('Spreadsheet ID not found in environment variables');
      }

      this.log('Fetching performance history from Google Sheets');
      const performance = await this.sheetsService.getPerformanceHistory(this.spreadsheetId);
      this.cache.performance = performance;
      
      this.log(`Successfully loaded ${performance.length} performance records`);
      return performance;
    } catch (error) {
      console.error('Failed to fetch performance history from Google Sheets:', error);
      return []; // Return empty array as fallback
    }
  }

  // Calculate efficiency scores based on specialties and RIV level
  calculateEfficiencyScores(technician) {
    const baseSkills = {
      'Drive Unit': Math.min(10, 3 + technician.riv_level * 1.5),
      'Battery System': Math.min(10, 2 + technician.riv_level * 1.5),
      'Suspension': Math.min(10, 3 + technician.riv_level * 1.2),
      'Infotainment': Math.min(10, 2 + technician.riv_level * 1.2),
      'Body/Glass': Math.min(10, 2 + technician.riv_level * 1.0),
      'ADAS': Math.min(10, 1 + technician.riv_level * 1.3),
      'Thermal System': Math.min(10, 2 + technician.riv_level * 1.3),
      'Chassis': Math.min(10, 2 + technician.riv_level * 1.0)
    };

    // Boost skills based on specialties
    technician.specialties.forEach(specialty => {
      if (baseSkills[specialty]) {
        baseSkills[specialty] = Math.min(10, baseSkills[specialty] + 2);
      }
    });

    this.log(`Calculated skills for ${technician.name}:`, baseSkills);
    return baseSkills;
  }

  calculateSuccessRates(technician) {
    const baseRate = 0.75 + (technician.riv_level * 0.04);
    const rates = {
      'Drive Unit': Math.min(0.98, baseRate + (Math.random() * 0.1 - 0.05)),
      'Battery System': Math.min(0.98, baseRate + (Math.random() * 0.1 - 0.05)),
      'Suspension': Math.min(0.98, baseRate + (Math.random() * 0.1 - 0.05)),
      'Infotainment': Math.min(0.98, baseRate + (Math.random() * 0.1 - 0.05)),
      'ADAS': Math.min(0.98, baseRate + (Math.random() * 0.1 - 0.05)),
      'Thermal System': Math.min(0.98, baseRate + (Math.random() * 0.1 - 0.05))
    };

    // Boost success rates for specialties
    technician.specialties.forEach(specialty => {
      if (rates[specialty]) {
        rates[specialty] = Math.min(0.98, rates[specialty] + 0.05);
      }
    });

    return rates;
  }

  calculateCompletionTimes(technician) {
    const efficiency = 1.15 - (technician.riv_level * 0.03);
    const times = {
      'Drive Unit': efficiency * (0.9 + Math.random() * 0.2),
      'Battery System': efficiency * (0.9 + Math.random() * 0.2),
      'Suspension': efficiency * (0.9 + Math.random() * 0.2),
      'Infotainment': efficiency * (0.9 + Math.random() * 0.2),
      'ADAS': efficiency * (0.9 + Math.random() * 0.2),
      'Thermal System': efficiency * (0.9 + Math.random() * 0.2)
    };

    // Improve completion times for specialties
    technician.specialties.forEach(specialty => {
      if (times[specialty]) {
        times[specialty] = Math.max(0.7, times[specialty] - 0.1);
      }
    });

    return times;
  }

  // AI Assignment optimization (enhanced with real data)
  async optimizeAssignments() {
    try {
      this.log('Starting AI assignment optimization with real data');
      
      const technicians = await this.fetchTechnicians();
      const workOrders = await this.fetchWorkOrders();
      
      // Filter pending work orders
      const pendingOrders = workOrders.filter(wo => wo.status === 'pending');
      this.log(`Found ${pendingOrders.length} pending work orders to assign`);
      
      if (pendingOrders.length === 0) {
        return { message: 'No pending work orders to optimize', assignments: [] };
      }

      // Run assignment algorithm with real data
      const assignments = this.runAssignmentAlgorithm(technicians, pendingOrders);
      
      // Update Google Sheets with results (if configured for write access)
      await this.sheetsService.updateAssignments(this.spreadsheetId, assignments);
      
      this.log(`Generated ${assignments.length} optimized assignments`);
      return {
        message: `Optimized ${assignments.length} work order assignments`,
        assignments,
        summary: {
          total_assigned: assignments.length,
          avg_match_score: assignments.length > 0 ? 
            Math.round(assignments.reduce((sum, a) => sum + a.match_score, 0) / assignments.length) : 0,
          high_match_count: assignments.filter(a => a.match_score > 85).length
        }
      };
    } catch (error) {
      console.error('Assignment optimization failed:', error);
      throw error;
    }
  }

  runAssignmentAlgorithm(technicians, workOrders) {
    this.log('Running AI assignment algorithm');
    const assignments = [];

    // Sort work orders by priority and complexity
    const sortedOrders = [...workOrders].sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      if (priorityOrder[a.priority_level] !== priorityOrder[b.priority_level]) {
        return priorityOrder[b.priority_level] - priorityOrder[a.priority_level];
      }
      return b.required_riv_level - a.required_riv_level;
    });

    for (const workOrder of sortedOrders) {
      const assignment = this.findBestTechnicianForWorkOrder(workOrder, technicians);
      if (assignment) {
        assignments.push(assignment);
        
        // Update technician workload for subsequent assignments
        const tech = technicians.find(t => t.id === assignment.technician_id);
        if (tech) {
          tech.current_workload_hours += workOrder.estimated_hours;
        }
      }
    }

    return assignments;
  }

  findBestTechnicianForWorkOrder(workOrder, technicians) {
    // Filter eligible technicians
    const eligibleTechs = technicians.filter(tech => {
      // Basic workload check
      if (tech.current_workload_hours + workOrder.estimated_hours > tech.max_daily_hours) {
        return false;
      }
      
      // RIV level requirement
      if (workOrder.repair_category === 'diagnostic' && tech.riv_level < 3) {
        return false;
      }
      
      if (tech.riv_level < workOrder.required_riv_level) {
        return false;
      }

      return true;
    });

    if (eligibleTechs.length === 0) {
      this.log(`No eligible technicians found for ${workOrder.order_number}`);
      return null;
    }

    // Calculate match scores for eligible technicians
    let bestTech = null;
    let bestScore = 0;
    let bestReason = '';

    for (const tech of eligibleTechs) {
      const score = this.calculateMatchScore(tech, workOrder);
      const reason = this.generateAssignmentReason(tech, workOrder, score);
      
      if (score.total > bestScore) {
        bestScore = score.total;
        bestTech = tech;
        bestReason = reason;
      }
    }

    if (bestTech) {
      return {
        work_order_id: workOrder.id,
        order_number: workOrder.order_number,
        technician_id: bestTech.id,
        technician_name: bestTech.name,
        match_score: Math.round(bestScore),
        assignment_reason: bestReason
      };
    }

    return null;
  }

  calculateMatchScore(technician, workOrder) {
    const efficiency = technician.efficiency_scores || {};
    const successRates = technician.success_rates || {};
    
    // 1. Skill Match (35%)
    let skillMatch = 50; // Base score
    if (workOrder.required_skills.length > 0) {
      const matchingSkills = workOrder.required_skills.filter(skill => 
        technician.specialties.includes(skill)
      );
      skillMatch = (matchingSkills.length / workOrder.required_skills.length) * 100;
      
      // Boost for efficiency in matched skills
      const avgEfficiency = matchingSkills.reduce((sum, skill) => 
        sum + (efficiency[skill] || 5), 0) / Math.max(matchingSkills.length, 1);
      skillMatch = (skillMatch + avgEfficiency * 10) / 2;
    }

    // 2. RIV Level Match (25%)
    let rivMatch = 100;
    if (workOrder.repair_category === 'diagnostic') {
      rivMatch = technician.riv_level >= 3 ? 100 : 70;
    } else {
      // Prefer appropriate level, slight penalty for over-qualification
      if (technician.riv_level === workOrder.required_riv_level) {
        rivMatch = 100;
      } else if (technician.riv_level > workOrder.required_riv_level) {
        rivMatch = Math.max(85, 100 - (technician.riv_level - workOrder.required_riv_level) * 5);
      }
    }

    // 3. Success Rate (20%)
    const primarySkill = workOrder.required_skills[0] || 'General';
    const successRate = (successRates[primarySkill] || 0.8) * 100;

    // 4. Workload Balance (15%)
    const utilizationPenalty = (technician.current_workload_hours / technician.max_daily_hours) * 100;
    const workloadScore = Math.max(20, 100 - utilizationPenalty);

    // 5. Priority Handling (5%)
    let priorityBonus = 0;
    if (workOrder.priority_level === 'High' && technician.riv_level >= 3) {
      priorityBonus = 20;
    }

    const scores = {
      skillMatch: skillMatch * 0.35,
      rivMatch: rivMatch * 0.25,
      successRate: successRate * 0.20,
      workloadScore: workloadScore * 0.15,
      priorityBonus: priorityBonus * 0.05,
      total: 0
    };

    scores.total = scores.skillMatch + scores.rivMatch + scores.successRate + scores.workloadScore + scores.priorityBonus;
    
    this.log(`Match score for ${technician.name} on ${workOrder.order_number}: ${Math.round(scores.total)}%`);
    return scores;
  }

  generateAssignmentReason(technician, workOrder, scores) {
    const reasons = [];
    
    if (scores.skillMatch > 30) {
      const matchingSkills = workOrder.required_skills.filter(skill => 
        technician.specialties.includes(skill)
      );
      if (matchingSkills.length > 0) {
        reasons.push(`Perfect ${matchingSkills[0]} skill match`);
      }
    }
    
    if (technician.riv_level >= 3 && workOrder.repair_category === 'diagnostic') {
      reasons.push('Diagnostic expertise required');
    }
    
    if (scores.workloadScore > 12) {
      reasons.push('Optimal workload distribution');
    }
    
    if (workOrder.priority_level === 'High' && technician.riv_level >= 3) {
      reasons.push('High priority assignment');
    }
    
    if (technician.is_mentor) {
      reasons.push('Senior technician for complex repair');
    }

    return reasons.slice(0, 2).join(', ') || 'Balanced assignment decision';
  }
}

export default RivianAPIWithSheets;