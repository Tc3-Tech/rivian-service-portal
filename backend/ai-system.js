// Rivian AI Assignment System
// Complete implementation with database, algorithms, and API

// Database Schema and Seed Data
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Use file for persistence

// Initialize Database Schema
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Technicians table
      db.run(`
        CREATE TABLE technicians (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          employee_id TEXT UNIQUE NOT NULL,
          riv_level INTEGER NOT NULL,
          hire_date DATE NOT NULL,
          specialties TEXT, -- JSON array
          current_workload_hours REAL DEFAULT 0,
          max_daily_hours REAL DEFAULT 8,
          shift_start TIME DEFAULT '07:00',
          shift_end TIME DEFAULT '16:00',
          efficiency_scores TEXT, -- JSON object by repair type
          success_rates TEXT, -- JSON object by repair type
          avg_completion_times TEXT, -- JSON object by repair type
          certifications TEXT, -- JSON array
          is_mentor BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Work Orders table
      db.run(`
        CREATE TABLE work_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          vehicle_vin TEXT NOT NULL,
          vehicle_model TEXT NOT NULL,
          vehicle_year INTEGER NOT NULL,
          repair_type TEXT NOT NULL,
          repair_category TEXT NOT NULL, -- 'diagnostic' or 'remove_replace'
          estimated_hours REAL NOT NULL,
          priority_level TEXT NOT NULL, -- 'High', 'Medium', 'Low'
          required_riv_level INTEGER NOT NULL,
          required_skills TEXT, -- JSON array
          required_certifications TEXT, -- JSON array
          parts_ready BOOLEAN DEFAULT TRUE,
          customer_wait_days INTEGER DEFAULT 0,
          assigned_technician_id INTEGER,
          assignment_reason TEXT,
          match_score INTEGER,
          status TEXT DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed'
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          assigned_at DATETIME,
          FOREIGN KEY (assigned_technician_id) REFERENCES technicians (id)
        )
      `);

      // Repair History table
      db.run(`
        CREATE TABLE repair_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          work_order_id INTEGER NOT NULL,
          technician_id INTEGER NOT NULL,
          repair_type TEXT NOT NULL,
          estimated_hours REAL NOT NULL,
          actual_hours REAL,
          was_successful BOOLEAN, -- no comeback within 30 days
          completion_date DATE,
          customer_satisfaction_score REAL, -- 1-5 scale
          had_complications BOOLEAN DEFAULT FALSE,
          required_help BOOLEAN DEFAULT FALSE,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (work_order_id) REFERENCES work_orders (id),
          FOREIGN KEY (technician_id) REFERENCES technicians (id)
        )
      `);

      resolve();
    });
  });
}

// Seed Data Generation
function generateTechnicians() {
  const names = [
    'Alex Rodriguez', 'Sarah Johnson', 'Michael Chen', 'Emma Davis', 
    'James Wilson', 'Maria Garcia', 'David Thompson', 'Lisa Anderson',
    'Kevin Martinez', 'Ashley Brown', 'Ryan Taylor', 'Jessica Miller',
    'Brandon Lee', 'Nicole White', 'Christopher Moore'
  ];

  const rivDistribution = [
    { level: 1, count: 4 }, // 4 RIV 1s
    { level: 2, count: 5 }, // 5 RIV 2s  
    { level: 3, count: 4 }, // 4 RIV 3s
    { level: 5, count: 2 }  // 2 RIV 5s (mentors)
  ];

  const technicians = [];
  let nameIndex = 0;

  rivDistribution.forEach(riv => {
    for (let i = 0; i < riv.count; i++) {
      const tech = generateTechnician(names[nameIndex], riv.level, nameIndex + 1);
      technicians.push(tech);
      nameIndex++;
    }
  });

  return technicians;
}

function generateTechnician(name, rivLevel, empId) {
  const baseSkills = {
    'Drive Unit': rivLevel >= 2 ? 7 + rivLevel : 3,
    'Battery System': rivLevel >= 2 ? 6 + rivLevel : 2,
    'Suspension': rivLevel >= 1 ? 5 + rivLevel : 4,
    'Infotainment': rivLevel >= 2 ? 6 + rivLevel : 3,
    'Body/Glass': rivLevel >= 1 ? 4 + rivLevel : 3,
    'ADAS': rivLevel >= 1 ? 3 + rivLevel : 2,
    'Thermal System': rivLevel >= 2 ? 5 + rivLevel : 2,
    'Chassis': rivLevel >= 1 ? 4 + rivLevel : 3
  };

  // Add some variation
  Object.keys(baseSkills).forEach(skill => {
    baseSkills[skill] = Math.min(10, Math.max(1, baseSkills[skill] + (Math.random() * 2 - 1)));
  });

  const specialties = Object.keys(baseSkills).filter(skill => baseSkills[skill] >= 8);
  
  return {
    name,
    employee_id: `RIV-${empId.toString().padStart(3, '0')}`,
    riv_level: rivLevel,
    hire_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
    specialties: JSON.stringify(specialties),
    efficiency_scores: JSON.stringify(baseSkills),
    success_rates: JSON.stringify(generateSuccessRates(rivLevel)),
    avg_completion_times: JSON.stringify(generateCompletionTimes(rivLevel)),
    certifications: JSON.stringify(generateCertifications(rivLevel)),
    is_mentor: rivLevel === 5
  };
}

function generateSuccessRates(rivLevel) {
  const baseRate = 0.7 + (rivLevel * 0.05); // RIV 1: 75%, RIV 5: 95%
  return {
    'Drive Unit': Math.min(0.98, baseRate + Math.random() * 0.1),
    'Battery System': Math.min(0.98, baseRate + Math.random() * 0.1),
    'Suspension': Math.min(0.98, baseRate + Math.random() * 0.1),
    'Infotainment': Math.min(0.98, baseRate + Math.random() * 0.1)
  };
}

function generateCompletionTimes(rivLevel) {
  const efficiency = 1.2 - (rivLevel * 0.05); // RIV 1: 115% of estimate, RIV 5: 95%
  return {
    'Drive Unit': efficiency * (0.9 + Math.random() * 0.2),
    'Battery System': efficiency * (0.9 + Math.random() * 0.2),
    'Suspension': efficiency * (0.9 + Math.random() * 0.2),
    'Infotainment': efficiency * (0.9 + Math.random() * 0.2)
  };
}

function generateCertifications(rivLevel) {
  const allCerts = ['ADAS', 'High Voltage', 'RivianOS', 'Thermal Systems'];
  return allCerts.slice(0, Math.min(rivLevel, allCerts.length));
}

// Work Order Generation
function generateWorkOrders() {
  const repairTypes = [
    { type: 'Drive Unit Replacement', category: 'remove_replace', riv: 2, hours: 3.5, skills: ['Drive Unit'], priority: 'High' },
    { type: 'Drive Unit Diagnosis', category: 'diagnostic', riv: 3, hours: 2.0, skills: ['Drive Unit'], priority: 'High' },
    { type: 'Battery System Service', category: 'remove_replace', riv: 2, hours: 1.0, skills: ['Battery System'], priority: 'Medium' },
    { type: 'Battery Diagnostic', category: 'diagnostic', riv: 3, hours: 1.5, skills: ['Battery System'], priority: 'High' },
    { type: 'Suspension Calibration', category: 'remove_replace', riv: 1, hours: 2.0, skills: ['Suspension'], priority: 'Medium' },
    { type: 'Suspension Noise Investigation', category: 'diagnostic', riv: 3, hours: 1.5, skills: ['Suspension'], priority: 'Medium' },
    { type: 'Infotainment Update', category: 'remove_replace', riv: 1, hours: 1.0, skills: ['Infotainment'], priority: 'Low' },
    { type: 'Infotainment Black Screen', category: 'diagnostic', riv: 3, hours: 2.0, skills: ['Infotainment'], priority: 'High' },
    { type: 'Window Replacement', category: 'remove_replace', riv: 1, hours: 2.5, skills: ['Body/Glass'], priority: 'Medium' },
    { type: 'ADAS Calibration', category: 'remove_replace', riv: 2, hours: 1.5, skills: ['ADAS'], priority: 'Medium' }
  ];

  const vehicles = ['R1T', 'R1S'];
  const years = [2023, 2024, 2025];
  
  return Array.from({ length: 25 }, (_, i) => {
    const repair = repairTypes[Math.floor(Math.random() * repairTypes.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    
    return {
      order_number: `WO-${(27490 + i).toString()}`,
      vehicle_vin: `7FTTW1CV3NLB${(51289 + i).toString()}`,
      vehicle_model: vehicle,
      vehicle_year: year,
      repair_type: repair.type,
      repair_category: repair.category,
      estimated_hours: repair.hours + (Math.random() * 0.5 - 0.25), // ±15 minutes variation
      priority_level: repair.priority,
      required_riv_level: repair.riv,
      required_skills: JSON.stringify(repair.skills),
      required_certifications: JSON.stringify([]),
      customer_wait_days: Math.floor(Math.random() * 3)
    };
  });
}

// AI Assignment Algorithm
class RivianAssignmentEngine {
  constructor(db) {
    this.db = db;
  }

  async assignWorkOrders() {
    const workOrders = await this.getUnassignedWorkOrders();
    const technicians = await this.getAllTechnicians();
    
    // Sort work orders by priority and complexity
    workOrders.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      if (priorityOrder[a.priority_level] !== priorityOrder[b.priority_level]) {
        return priorityOrder[b.priority_level] - priorityOrder[a.priority_level];
      }
      return b.required_riv_level - a.required_riv_level;
    });

    const assignments = [];
    
    for (const workOrder of workOrders) {
      const assignment = await this.findBestAssignment(workOrder, technicians);
      if (assignment) {
        assignments.push(assignment);
        // Update technician workload
        const tech = technicians.find(t => t.id === assignment.technician_id);
        if (tech) {
          tech.current_workload_hours += workOrder.estimated_hours;
        }
      }
    }

    return assignments;
  }

  async findBestAssignment(workOrder, technicians) {
    const candidates = technicians.filter(tech => {
      // Basic eligibility checks
      if (tech.current_workload_hours + workOrder.estimated_hours > tech.max_daily_hours) {
        return false;
      }
      
      // RIV level requirements
      if (workOrder.repair_category === 'diagnostic' && tech.riv_level < 3) {
        return false;
      }
      
      return true;
    });

    if (candidates.length === 0) return null;

    let bestCandidate = null;
    let bestScore = -1;
    let bestReason = '';

    for (const tech of candidates) {
      const score = await this.calculateAssignmentScore(tech, workOrder);
      const reason = this.generateAssignmentReason(tech, workOrder, score);
      
      if (score.total > bestScore) {
        bestScore = score.total;
        bestCandidate = tech;
        bestReason = reason;
      }
    }

    if (bestCandidate) {
      return {
        work_order_id: workOrder.id,
        technician_id: bestCandidate.id,
        match_score: Math.round(bestScore),
        assignment_reason: bestReason
      };
    }

    return null;
  }

  async calculateAssignmentScore(technician, workOrder) {
    const efficiency = JSON.parse(technician.efficiency_scores || '{}');
    const successRates = JSON.parse(technician.success_rates || '{}');
    const completionTimes = JSON.parse(technician.avg_completion_times || '{}');
    const requiredSkills = JSON.parse(workOrder.required_skills || '[]');

    // 1. Skill Match (30%)
    let skillMatch = 0;
    if (requiredSkills.length > 0) {
      const avgSkill = requiredSkills.reduce((sum, skill) => {
        return sum + (efficiency[skill] || 5);
      }, 0) / requiredSkills.length;
      skillMatch = (avgSkill / 10) * 100;
    } else {
      skillMatch = 70; // Default if no specific skills required
    }

    // 2. RIV Level Appropriateness (25%)
    let rivMatch = 100;
    if (workOrder.repair_category === 'diagnostic') {
      // Diagnostic work - prefer RIV 3+
      rivMatch = technician.riv_level >= 3 ? 100 : 60;
    } else {
      // Remove/Replace - RIV 1-2 preferred for efficiency, but higher levels OK
      if (technician.riv_level <= 2) {
        rivMatch = 100;
      } else {
        rivMatch = 85; // Slight penalty for overqualification
      }
    }

    // 3. Historical Success Rate (20%)
    const primarySkill = requiredSkills[0] || workOrder.repair_type.split(' ')[0];
    const successRate = (successRates[primarySkill] || 0.8) * 100;

    // 4. Workload Balance (15%)
    const workloadPenalty = (technician.current_workload_hours / technician.max_daily_hours) * 100;
    const workloadScore = Math.max(0, 100 - workloadPenalty);

    // 5. Growth Opportunity (10%)
    let growthBonus = 0;
    if (technician.riv_level < 3 && workOrder.repair_category === 'diagnostic') {
      // Give growth opportunity, but with mentor support
      const hasRiv5Available = await this.hasAvailableMentor();
      if (hasRiv5Available) {
        growthBonus = 20; // Bonus for growth with mentorship
      }
    }

    const scores = {
      skillMatch: skillMatch * 0.30,
      rivMatch: rivMatch * 0.25,
      successRate: successRate * 0.20,
      workloadScore: workloadScore * 0.15,
      growthBonus: growthBonus * 0.10,
      total: 0
    };

    scores.total = scores.skillMatch + scores.rivMatch + scores.successRate + scores.workloadScore + scores.growthBonus;

    return scores;
  }

  generateAssignmentReason(technician, workOrder, scores) {
    const reasons = [];
    
    if (scores.skillMatch > 25) {
      reasons.push(`Strong skill match for ${workOrder.repair_type}`);
    }
    
    if (technician.riv_level >= 3 && workOrder.repair_category === 'diagnostic') {
      reasons.push('Diagnostic expertise required');
    }
    
    if (scores.workloadScore > 12) {
      reasons.push('Optimal workload distribution');
    }
    
    if (scores.growthBonus > 0) {
      reasons.push('Growth opportunity with mentorship');
    }
    
    if (technician.is_mentor) {
      reasons.push('Senior technician for complex repair');
    }

    return reasons.join(', ');
  }

  async hasAvailableMentor() {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT COUNT(*) as count FROM technicians WHERE riv_level = 5 AND current_workload_hours < max_daily_hours - 1',
        (err, row) => {
          resolve(row && row.count > 0);
        }
      );
    });
  }

  async getUnassignedWorkOrders() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM work_orders WHERE status = "pending" ORDER BY priority_level DESC, created_at ASC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getAllTechnicians() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM technicians', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

// API Layer
class RivianAPI {
  constructor(db, assignmentEngine) {
    this.db = db;
    this.assignmentEngine = assignmentEngine;
  }

  async getTechnicianDashboard(technicianId) {
    return new Promise((resolve, reject) => {
      // Get technician info
      this.db.get(
        'SELECT * FROM technicians WHERE id = ?',
        [technicianId],
        (err, technician) => {
          if (err) {
            reject(err);
            return;
          }

          // Get assigned work orders
          this.db.all(
            `SELECT wo.*, t.name as technician_name 
             FROM work_orders wo 
             LEFT JOIN technicians t ON wo.assigned_technician_id = t.id 
             WHERE wo.assigned_technician_id = ? AND wo.status IN ('assigned', 'in_progress')
             ORDER BY wo.priority_level DESC`,
            [technicianId],
            (err, workOrders) => {
              if (err) {
                reject(err);
                return;
              }

              resolve({
                technician: {
                  ...technician,
                  efficiency_scores: JSON.parse(technician.efficiency_scores || '{}'),
                  success_rates: JSON.parse(technician.success_rates || '{}'),
                  specialties: JSON.parse(technician.specialties || '[]')
                },
                assignedWorkOrders: workOrders.map(wo => ({
                  ...wo,
                  required_skills: JSON.parse(wo.required_skills || '[]')
                }))
              });
            }
          );
        }
      );
    });
  }

  async optimizeAssignments() {
    const assignments = await this.assignmentEngine.assignWorkOrders();
    
    // Update database with assignments
    for (const assignment of assignments) {
      await this.updateWorkOrderAssignment(assignment);
    }
    
    return assignments;
  }

  async updateWorkOrderAssignment(assignment) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE work_orders 
         SET assigned_technician_id = ?, match_score = ?, assignment_reason = ?, 
             status = 'assigned', assigned_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [assignment.technician_id, assignment.match_score, assignment.assignment_reason, assignment.work_order_id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
}

// Main Application Setup
async function initializeRivianSystem() {
  console.log('Initializing Rivian AI Assignment System...');
  
  // Initialize database
  await initializeDatabase();
  console.log('✅ Database schema created');
  
  // Seed technicians
  const technicians = generateTechnicians();
  for (const tech of technicians) {
    await insertTechnician(tech);
  }
  console.log(`✅ ${technicians.length} technicians created`);
  
  // Seed work orders
  const workOrders = generateWorkOrders();
  for (const wo of workOrders) {
    await insertWorkOrder(wo);
  }
  console.log(`✅ ${workOrders.length} work orders created`);
  
  // Initialize AI engine
  const assignmentEngine = new RivianAssignmentEngine(db);
  const api = new RivianAPI(db, assignmentEngine);
  
  console.log('🚀 System ready for assignments!');
  
  return { db, assignmentEngine, api };
}

// Helper functions for database operations
function insertTechnician(tech) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO technicians (
      name, employee_id, riv_level, hire_date, specialties, 
      efficiency_scores, success_rates, avg_completion_times, 
      certifications, is_mentor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      tech.name, tech.employee_id, tech.riv_level, tech.hire_date,
      tech.specialties, tech.efficiency_scores, tech.success_rates,
      tech.avg_completion_times, tech.certifications, tech.is_mentor
    ], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

function insertWorkOrder(wo) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO work_orders (
      order_number, vehicle_vin, vehicle_model, vehicle_year, repair_type,
      repair_category, estimated_hours, priority_level, required_riv_level,
      required_skills, required_certifications, customer_wait_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      wo.order_number, wo.vehicle_vin, wo.vehicle_model, wo.vehicle_year,
      wo.repair_type, wo.repair_category, wo.estimated_hours, wo.priority_level,
      wo.required_riv_level, wo.required_skills, wo.required_certifications,
      wo.customer_wait_days
    ], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

// Example usage and testing
async function runExample() {
  const { db, assignmentEngine, api } = await initializeRivianSystem();
  
  console.log('\n🎯 Running AI Assignment Optimization...');
  const assignments = await api.optimizeAssignments();
  console.log(`✅ ${assignments.length} work orders assigned`);
  
  // Show sample dashboard for first technician
  console.log('\n📊 Sample Technician Dashboard:');
  const dashboard = await api.getTechnicianDashboard(1);
  console.log(JSON.stringify(dashboard, null, 2));
  
  db.close();
}

// Export for integration with React app
module.exports = {
  initializeRivianSystem,
  RivianAssignmentEngine,
  RivianAPI,
  runExample
};

// Run example if called directly
if (require.main === module) {
  runExample().catch(console.error);
}