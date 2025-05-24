// Backend API Server for Rivian AI Assignment System
// Save as: backend/server.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'rivian_service.db');
const db = new sqlite3.Database(dbPath);

// Initialize database and AI system
let assignmentEngine;

// Import the AI system we created earlier
const { RivianAssignmentEngine, RivianAPI } = require('./ai-system'); // You'd save the previous code as ai-system.js

class RivianBackend {
  constructor() {
    this.initializeSystem();
  }

  async initializeSystem() {
    try {
      await this.setupDatabase();
      await this.seedData();
      
      this.assignmentEngine = new RivianAssignmentEngine(db);
      this.api = new RivianAPI(db, this.assignmentEngine);
      
      console.log('✅ Rivian AI System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize system:', error);
    }
  }

  async setupDatabase() {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Create tables (same schema as before)
        db.run(`
          CREATE TABLE IF NOT EXISTS technicians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            employee_id TEXT UNIQUE NOT NULL,
            riv_level INTEGER NOT NULL,
            hire_date DATE NOT NULL,
            specialties TEXT,
            current_workload_hours REAL DEFAULT 0,
            max_daily_hours REAL DEFAULT 8,
            shift_start TIME DEFAULT '07:00',
            shift_end TIME DEFAULT '16:00',
            efficiency_scores TEXT,
            success_rates TEXT,
            avg_completion_times TEXT,
            certifications TEXT,
            is_mentor BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS work_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE NOT NULL,
            vehicle_vin TEXT NOT NULL,
            vehicle_model TEXT NOT NULL,
            vehicle_year INTEGER NOT NULL,
            repair_type TEXT NOT NULL,
            repair_category TEXT NOT NULL,
            estimated_hours REAL NOT NULL,
            priority_level TEXT NOT NULL,
            required_riv_level INTEGER NOT NULL,
            required_skills TEXT,
            required_certifications TEXT,
            parts_ready BOOLEAN DEFAULT TRUE,
            customer_wait_days INTEGER DEFAULT 0,
            assigned_technician_id INTEGER,
            assignment_reason TEXT,
            match_score INTEGER,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            assigned_at DATETIME,
            FOREIGN KEY (assigned_technician_id) REFERENCES technicians (id)
          )
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS repair_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            work_order_id INTEGER NOT NULL,
            technician_id INTEGER NOT NULL,
            repair_type TEXT NOT NULL,
            estimated_hours REAL NOT NULL,
            actual_hours REAL,
            was_successful BOOLEAN,
            completion_date DATE,
            customer_satisfaction_score REAL,
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

  async seedData() {
    // Check if data already exists
    const techCount = await this.getTableCount('technicians');
    if (techCount > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }

    console.log('Seeding initial data...');
    
    // Generate and insert technicians
    const technicians = this.generateTechnicians();
    for (const tech of technicians) {
      await this.insertTechnician(tech);
    }

    // Generate and insert work orders
    const workOrders = this.generateWorkOrders();
    for (const wo of workOrders) {
      await this.insertWorkOrder(wo);
    }

    console.log(`✅ Seeded ${technicians.length} technicians and ${workOrders.length} work orders`);
  }

  getTableCount(tableName) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  generateTechnicians() {
    const names = [
      'Alex Rodriguez', 'Sarah Johnson', 'Michael Chen', 'Emma Davis', 
      'James Wilson', 'Maria Garcia', 'David Thompson', 'Lisa Anderson',
      'Kevin Martinez', 'Ashley Brown', 'Ryan Taylor', 'Jessica Miller',
      'Brandon Lee', 'Nicole White', 'Christopher Moore'
    ];

    const rivDistribution = [
      { level: 1, count: 4 },
      { level: 2, count: 5 },
      { level: 3, count: 4 },
      { level: 5, count: 2 }
    ];

    const technicians = [];
    let nameIndex = 0;

    rivDistribution.forEach(riv => {
      for (let i = 0; i < riv.count; i++) {
        const tech = this.generateTechnician(names[nameIndex], riv.level, nameIndex + 1);
        technicians.push(tech);
        nameIndex++;
      }
    });

    return technicians;
  }

  generateTechnician(name, rivLevel, empId) {
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
      success_rates: JSON.stringify(this.generateSuccessRates(rivLevel)),
      avg_completion_times: JSON.stringify(this.generateCompletionTimes(rivLevel)),
      certifications: JSON.stringify(this.generateCertifications(rivLevel)),
      is_mentor: rivLevel === 5
    };
  }

  generateSuccessRates(rivLevel) {
    const baseRate = 0.7 + (rivLevel * 0.05);
    return {
      'Drive Unit': Math.min(0.98, baseRate + Math.random() * 0.1),
      'Battery System': Math.min(0.98, baseRate + Math.random() * 0.1),
      'Suspension': Math.min(0.98, baseRate + Math.random() * 0.1),
      'Infotainment': Math.min(0.98, baseRate + Math.random() * 0.1)
    };
  }

  generateCompletionTimes(rivLevel) {
    const efficiency = 1.2 - (rivLevel * 0.05);
    return {
      'Drive Unit': efficiency * (0.9 + Math.random() * 0.2),
      'Battery System': efficiency * (0.9 + Math.random() * 0.2),
      'Suspension': efficiency * (0.9 + Math.random() * 0.2),
      'Infotainment': efficiency * (0.9 + Math.random() * 0.2)
    };
  }

  generateCertifications(rivLevel) {
    const allCerts = ['ADAS', 'High Voltage', 'RivianOS', 'Thermal Systems'];
    return allCerts.slice(0, Math.min(rivLevel, allCerts.length));
  }

  generateWorkOrders() {
    const repairTypes = [
      { type: 'Drive Unit Replacement', category: 'remove_replace', riv: 2, hours: 3.5, skills: ['Drive Unit'], priority: 'High' },
      { type: 'Drive Unit Diagnosis', category: 'diagnostic', riv: 3, hours: 2.0, skills: ['Drive Unit'], priority: 'High' },
      { type: 'Battery System Service', category: 'remove_replace', riv: 2, hours: 1.0, skills: ['Battery System'], priority: 'Medium' },
      { type: 'Battery Diagnostic', category: 'diagnostic', riv: 3, hours: 1.5, skills: ['Battery System'], priority: 'High' },
      { type: 'Suspension Calibration', category: 'remove_replace', riv: 1, hours: 2.0, skills: ['Suspension'], priority: 'Medium' },
      { type: 'Infotainment Update', category: 'remove_replace', riv: 1, hours: 1.0, skills: ['Infotainment'], priority: 'Low' },
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
        estimated_hours: repair.hours + (Math.random() * 0.5 - 0.25),
        priority_level: repair.priority,
        required_riv_level: repair.riv,
        required_skills: JSON.stringify(repair.skills),
        required_certifications: JSON.stringify([]),
        customer_wait_days: Math.floor(Math.random() * 3)
      };
    });
  }

  insertTechnician(tech) {
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

  insertWorkOrder(wo) {
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
}

// Initialize the backend system
const backend = new RivianBackend();

// API Routes

// Get all technicians
app.get('/api/technicians', (req, res) => {
  db.all('SELECT * FROM technicians ORDER BY riv_level DESC, name ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const technicians = rows.map(tech => ({
      ...tech,
      specialties: JSON.parse(tech.specialties || '[]'),
      efficiency_scores: JSON.parse(tech.efficiency_scores || '{}'),
      success_rates: JSON.parse(tech.success_rates || '{}'),
      certifications: JSON.parse(tech.certifications || '[]')
    }));
    
    res.json(technicians);
  });
});

// Get technician dashboard data
app.get('/api/technician/:id/dashboard', async (req, res) => {
  try {
    const technicianId = req.params.id;
    const dashboard = await backend.api.getTechnicianDashboard(technicianId);
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all work orders
app.get('/api/work-orders', (req, res) => {
  const sql = `
    SELECT wo.*, t.name as technician_name, t.riv_level as technician_riv_level
    FROM work_orders wo 
    LEFT JOIN technicians t ON wo.assigned_technician_id = t.id 
    ORDER BY wo.priority_level DESC, wo.created_at DESC
  `;
  
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const workOrders = rows.map(wo => ({
      ...wo,
      required_skills: JSON.parse(wo.required_skills || '[]'),
      required_certifications: JSON.parse(wo.required_certifications || '[]')
    }));
    
    res.json(workOrders);
  });
});

// Optimize assignments (main AI endpoint)
app.post('/api/assignments/optimize', async (req, res) => {
  try {
    console.log('🤖 Running AI assignment optimization...');
    const assignments = await backend.api.optimizeAssignments();
    
    // Get updated assignments with full details
    const sql = `
      SELECT wo.*, t.name as technician_name, t.riv_level as technician_riv_level
      FROM work_orders wo 
      LEFT JOIN technicians t ON wo.assigned_technician_id = t.id 
      WHERE wo.status = 'assigned'
      ORDER BY wo.match_score DESC
    `;
    
    db.all(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const optimizedAssignments = rows.map(wo => ({
        ...wo,
        required_skills: JSON.parse(wo.required_skills || '[]')
      }));
      
      res.json({
        message: `Successfully optimized ${assignments.length} assignments`,
        assignments: optimizedAssignments,
        summary: {
          total_assigned: assignments.length,
          avg_match_score: Math.round(assignments.reduce((sum, a) => sum + a.match_score, 0) / assignments.length),
          high_match_count: assignments.filter(a => a.match_score > 85).length
        }
      });
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit reassignment request
app.post('/api/assignments/:workOrderId/reassign', (req, res) => {
  const { workOrderId } = req.params;
  const { reason, details } = req.body;
  
  // In a real system, this would trigger AI re-evaluation
  // For now, we'll just log the feedback
  console.log(`📝 Reassignment request for WO-${workOrderId}:`, { reason, details });
  
  // Reset work order to pending status
  db.run(
    'UPDATE work_orders SET status = "pending", assigned_technician_id = NULL WHERE id = ?',
    [workOrderId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({ 
        message: 'Reassignment request submitted successfully',
        feedback_recorded: true,
        work_order_status: 'pending'
      });
    }
  );
});

// Analytics endpoint
app.get('/api/analytics/summary', (req, res) => {
  const queries = {
    technician_utilization: `
      SELECT 
        AVG(current_workload_hours) as avg_workload,
        AVG(current_workload_hours / max_daily_hours * 100) as avg_utilization
      FROM technicians
    `,
    assignment_quality: `
      SELECT 
        AVG(match_score) as avg_match_score,
        COUNT(*) as total_assignments,
        COUNT(CASE WHEN match_score > 85 THEN 1 END) as high_quality_assignments
      FROM work_orders 
      WHERE status = 'assigned'
    `,
    riv_distribution: `
      SELECT 
        riv_level,
        COUNT(*) as count,
        AVG(current_workload_hours) as avg_workload
      FROM technicians 
      GROUP BY riv_level
    `
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.technician_utilization, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.assignment_quality, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.riv_distribution, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  ]).then(([utilization, quality, rivDistribution]) => {
    res.json({
      technician_utilization: {
        avg_workload_hours: Math.round(utilization.avg_workload * 10) / 10,
        avg_utilization_percent: Math.round(utilization.avg_utilization)
      },
      assignment_quality: {
        avg_match_score: Math.round(quality.avg_match_score),
        total_assignments: quality.total_assignments,
        high_quality_percent: Math.round((quality.high_quality_assignments / quality.total_assignments) * 100)
      },
      riv_distribution: rivDistribution,
      service_center_health: {
        status: utilization.avg_utilization > 85 ? 'Optimal' : 'Good',
        efficiency_score: Math.round(85 + (quality.avg_match_score - 80) / 2)
      }
    });
  }).catch(error => {
    res.status(500).json({ error: error.message });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    system: 'Rivian AI Assignment System',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Rivian Backend API Server running on port ${PORT}`);
  console.log(`📊 Access API at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = app;