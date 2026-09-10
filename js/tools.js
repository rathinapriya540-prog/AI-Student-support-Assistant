/**
 * Agent Executable Tools & UI Widget Generators
 */

class AgentTools {
  constructor() {
    this.toolsRegistry = {
      check_exam_timetable: {
        name: 'check_exam_timetable',
        description: 'Looks up official exam schedule dates, subject codes, and session timings.',
        parameters: { department: 'string', semester: 'number' },
        handler: this.checkExamTimetable.bind(this)
      },
      calculate_cgpa: {
        name: 'calculate_cgpa',
        description: 'Calculates SGPA/CGPA from grade points (O, A+, A, B+, B, RA).',
        parameters: { grades: 'array' },
        handler: this.calculateCGPA.bind(this)
      },
      lookup_faculty_contact: {
        name: 'lookup_faculty_contact',
        description: 'Finds faculty professor email, department cabin, and office hours.',
        parameters: { department: 'string', name: 'string' },
        handler: this.lookupFaculty.bind(this)
      },
      check_fee_status: {
        name: 'check_fee_status',
        description: 'Checks student tuition fee dues, hostel fee status, and scholarship adjustments.',
        parameters: { studentId: 'string' },
        handler: this.checkFeeStatus.bind(this)
      },
      search_library: {
        name: 'search_library',
        description: 'Searches library catalog for textbook availability, rack locations, and e-books.',
        parameters: { query: 'string' },
        handler: this.searchLibrary.bind(this)
      }
    };
  }

  /**
   * Tool 1: Exam Timetable Lookup
   */
  checkExamTimetable(dept = 'CSE', sem = 6) {
    const timetableData = {
      CSE: {
        6: [
          { date: '2026-05-04', code: 'CS8691', title: 'Artificial Intelligence & Agentic Systems', time: '09:30 AM - 12:30 PM (FN)' },
          { date: '2026-05-08', code: 'CS8651', title: 'Internet of Things Architecture', time: '09:30 AM - 12:30 PM (FN)' },
          { date: '2026-05-12', code: 'CS8601', title: 'Compiler Design', time: '09:30 AM - 12:30 PM (FN)' },
          { date: '2026-05-16', code: 'CS8681', title: 'Cloud Computing & DevOps', time: '09:30 AM - 12:30 PM (FN)' }
        ]
      },
      AIDS: {
        6: [
          { date: '2026-05-04', code: 'AD8601', title: 'Deep Learning & Neural Networks', time: '09:30 AM - 12:30 PM (FN)' },
          { date: '2026-05-08', code: 'AD8602', title: 'Natural Language Processing & LLMs', time: '09:30 AM - 12:30 PM (FN)' },
          { date: '2026-05-13', code: 'AD8603', title: 'Big Data Analytics', time: '09:30 AM - 12:30 PM (FN)' }
        ]
      }
    };

    const deptKey = (dept || 'CSE').toUpperCase();
    const semKey = parseInt(sem) || 6;
    const schedule = (timetableData[deptKey] && timetableData[deptKey][semKey]) || timetableData['CSE'][6];

    let widgetHTML = `
      <div class="widget-card">
        <div class="widget-title">📅 Exam Timetable: ${deptKey} - Semester ${semKey}</div>
        <table class="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Course Code</th>
              <th>Subject</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
    `;

    schedule.forEach(item => {
      widgetHTML += `
        <tr>
          <td><strong style="color:#6ee7b7;">${item.date}</strong></td>
          <td><code>${item.code}</code></td>
          <td>${item.title}</td>
          <td>${item.time}</td>
        </tr>
      `;
    });

    widgetHTML += `
          </tbody>
        </table>
        <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 8px;">* Venue details will be specified on your Hall Ticket.</div>
      </div>
    `;

    return {
      status: 'success',
      data: schedule,
      widgetHTML: widgetHTML,
      textResult: `Found ${schedule.length} exams scheduled for ${deptKey} Sem ${semKey} starting from ${schedule[0].date}.`
    };
  }

  /**
   * Tool 2: CGPA / SGPA Calculator
   */
  calculateCGPA(gradesInput) {
    // Map of grades to points
    const gradePointsMap = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, RA: 0 };
    let grades = [];

    if (Array.isArray(gradesInput)) {
      grades = gradesInput;
    } else if (typeof gradesInput === 'string') {
      grades = gradesInput.toUpperCase().split(/[\s,]+/).filter(g => gradePointsMap.hasOwnProperty(g));
    }

    if (grades.length === 0) {
      grades = ['O', 'A+', 'A', 'A', 'B+']; // Default sample
    }

    let totalPoints = 0;
    let totalCredits = grades.length * 3; // Assuming 3 credits average

    grades.forEach(g => {
      totalPoints += (gradePointsMap[g.toUpperCase()] || 0) * 3;
    });

    const gpa = (totalPoints / totalCredits).toFixed(2);
    const classification = gpa >= 8.5 ? 'First Class with Distinction 🌟' : gpa >= 7.0 ? 'First Class 👍' : 'Second Class';

    let widgetHTML = `
      <div class="widget-card">
        <div class="widget-title">🧮 SGPA / CGPA Calculation Summary</div>
        <div style="display: flex; gap: 20px; align-items: center; margin: 12px 0;">
          <div style="font-size: 2.5rem; font-weight: 800; color: #6366f1; background: rgba(99,102,241,0.15); padding: 10px 20px; border-radius: 12px; border: 1px solid var(--border-glow);">
            ${gpa}
          </div>
          <div>
            <div style="font-weight: 600; font-size: 1rem; color: #fff;">${classification}</div>
            <div style="font-size: 0.8rem; color: #9ca3af;">Grades Evaluated: ${grades.join(', ')}</div>
            <div style="font-size: 0.8rem; color: #9ca3af;">Total Credits: ${totalCredits}</div>
          </div>
        </div>
      </div>
    `;

    return {
      status: 'success',
      gpa: gpa,
      classification: classification,
      widgetHTML: widgetHTML,
      textResult: `Calculated SGPA is ${gpa} (${classification}) based on grades: ${grades.join(', ')}.`
    };
  }

  /**
   * Tool 3: Faculty Contact Directory
   */
  lookupFaculty(dept = 'CSE', query = '') {
    const facultyList = [
      { name: 'Dr. S. Ramanathan', dept: 'CSE', role: 'Professor & HOD', cabin: 'Tech Block Room 301', email: 'hod.cse@college.edu', subject: 'Artificial Intelligence' },
      { name: 'Dr. M. Kousalya', dept: 'CSE', role: 'Associate Professor', cabin: 'Tech Block Room 308', email: 'kousalya.m@college.edu', subject: 'Compiler Design' },
      { name: 'Prof. R. Vignesh', dept: 'AIDS', role: 'Assistant Professor', cabin: 'R&D Block Room 104', email: 'vignesh.r@college.edu', subject: 'Deep Learning & NLP' },
      { name: 'Dr. P. Anitha', dept: 'ECE', role: 'Professor', cabin: 'ECE Block Room 205', email: 'anitha.p@college.edu', subject: 'Embedded Systems' }
    ];

    const results = facultyList.filter(f => 
      (!dept || f.dept.toLowerCase() === dept.toLowerCase()) ||
      (!query || f.name.toLowerCase().includes(query.toLowerCase()) || f.subject.toLowerCase().includes(query.toLowerCase()))
    );

    const match = results[0] || facultyList[0];

    let widgetHTML = `
      <div class="widget-card">
        <div class="widget-title">👨‍🏫 Faculty Contact Details</div>
        <div style="display: flex; gap: 14px; align-items: center;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">
            👤
          </div>
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: #fff;">${match.name}</div>
            <div style="font-size: 0.8rem; color: var(--accent-cyan);">${match.role} - Dept of ${match.dept}</div>
            <div style="font-size: 0.8rem; color: #9ca3af;">📍 Cabin: ${match.cabin}</div>
            <div style="font-size: 0.8rem; color: #a5b4fc;">📧 Email: <a href="mailto:${match.email}" style="color:#a5b4fc;">${match.email}</a></div>
          </div>
        </div>
      </div>
    `;

    return {
      status: 'success',
      data: match,
      widgetHTML: widgetHTML,
      textResult: `Found faculty record for ${match.name} (${match.role}, Dept of ${match.dept}). Cabin: ${match.cabin}, Email: ${match.email}.`
    };
  }

  /**
   * Tool 4: Fee Due & Scholarship Status Checker
   */
  checkFeeStatus(studentId = '7376231CS101') {
    const feeInfo = {
      studentId: studentId,
      studentName: 'Rahul Kumar',
      dept: 'CSE - 3rd Year',
      tuitionFeeTotal: 85000,
      scholarshipCredit: 25000, // First Graduate Scholarship
      amountPaid: 60000,
      balanceDue: 0,
      status: 'PAID (No Dues) ✅'
    };

    let widgetHTML = `
      <div class="widget-card">
        <div class="widget-title">💳 Student Fee & Dues Status</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
          <div><span style="color:#9ca3af;">Roll No:</span> <strong>${feeInfo.studentId}</strong></div>
          <div><span style="color:#9ca3af;">Status:</span> <strong style="color:#6ee7b7;">${feeInfo.status}</strong></div>
          <div><span style="color:#9ca3af;">Tuition Fee:</span> ₹${feeInfo.tuitionFeeTotal.toLocaleString()}</div>
          <div><span style="color:#9ca3af;">Scholarship Waiver:</span> -₹${feeInfo.scholarshipCredit.toLocaleString()}</div>
          <div><span style="color:#9ca3af;">Amount Paid:</span> ₹${feeInfo.amountPaid.toLocaleString()}</div>
          <div><span style="color:#9ca3af;">Balance Dues:</span> <strong style="color:#6ee7b7;">₹${feeInfo.balanceDue}</strong></div>
        </div>
      </div>
    `;

    return {
      status: 'success',
      data: feeInfo,
      widgetHTML: widgetHTML,
      textResult: `Fee status for ${studentId}: Tuition ₹85,000 with ₹25,000 First Graduate Scholarship waiver. Total Paid: ₹60,000. Balance Dues: ₹0 (No Dues Cleared).`
    };
  }

  /**
   * Tool 5: Library Catalog Search
   */
  searchLibrary(query = 'Artificial Intelligence') {
    const books = [
      { title: 'Artificial Intelligence: A Modern Approach (4th Ed)', author: 'Stuart Russell & Peter Norvig', rack: 'Rack B-14', copies: 6, available: 4 },
      { title: 'Deep Learning with PyTorch', author: 'Eli Stevens', rack: 'Rack C-02', copies: 4, available: 2 },
      { title: 'Hands-On Machine Learning with Scikit-Learn & TensorFlow', author: 'Aurélien Géron', rack: 'Rack B-18', copies: 8, available: 5 }
    ];

    const book = books[0];

    let widgetHTML = `
      <div class="widget-card">
        <div class="widget-title">📚 Library Book Availability</div>
        <div style="font-weight: 600; color: #fff;">${book.title}</div>
        <div style="font-size: 0.8rem; color: #9ca3af;">Author: ${book.author}</div>
        <div style="display: flex; gap: 16px; margin-top: 8px; font-size: 0.85rem;">
          <div style="background: rgba(6,182,212,0.15); color: #06b6d4; padding: 4px 10px; border-radius: 6px;">📍 ${book.rack}</div>
          <div style="background: rgba(16,185,129,0.15); color: #6ee7b7; padding: 4px 10px; border-radius: 6px;">✅ ${book.available} of ${book.copies} Copies Available</div>
        </div>
      </div>
    `;

    return {
      status: 'success',
      data: book,
      widgetHTML: widgetHTML,
      textResult: `Found "${book.title}" in Central Library (${book.rack}). ${book.available} copies currently available on shelf.`
    };
  }
}

window.agentTools = new AgentTools();
