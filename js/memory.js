/**
 * Memory Management System
 * Dual-layer memory handling Student Profile, Short-Term Buffer, and Long-Term Extracted Facts
 */

class StudentMemory {
  constructor() {
    this.profile = {
      name: 'Rahul Kumar',
      rollNo: '7376231CS101',
      department: 'CSE',
      semester: 6,
      cgpa: '8.72',
      quota: '7.5% Govt School Quota',
      scholarship: 'First Graduate Scholarship'
    };

    this.shortTermBuffer = [];
    this.longTermFacts = [
      'Targeting Tier 1 placement in AI & Full-Stack engineering.',
      'Completed 75% mandatory attendance in Sem 6.',
      'Enrolled in NPTEL Deep Learning course for Honors degree.'
    ];

    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    try {
      const savedMem = localStorage.getItem('ai_student_memory');
      if (savedMem) {
        const parsed = JSON.parse(savedMem);
        if (parsed.profile) this.profile = parsed.profile;
        if (parsed.longTermFacts) this.longTermFacts = parsed.longTermFacts;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('ai_student_memory', JSON.stringify({
        profile: this.profile,
        longTermFacts: this.longTermFacts
      }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  addShortTermMessage(role, content) {
    this.shortTermBuffer.push({ role, content, timestamp: new Date().toISOString() });
    if (this.shortTermBuffer.length > 10) {
      this.shortTermBuffer.shift(); // Keep last 10 turns
    }
  }

  addLongTermFact(fact) {
    if (fact && !this.longTermFacts.includes(fact)) {
      this.longTermFacts.push(fact);
      this.saveToLocalStorage();
    }
  }

  removeLongTermFact(index) {
    if (index >= 0 && index < this.longTermFacts.length) {
      this.longTermFacts.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  updateProfile(key, value) {
    this.profile[key] = value;
    this.saveToLocalStorage();
  }

  /**
   * Formats student memory context into prompt injection string
   */
  getMemoryPromptContext() {
    let contextStr = '--- STUDENT MEMORY & PROFILE CONTEXT ---\n';
    contextStr += `Student Name: ${this.profile.name}\n`;
    contextStr += `Roll No: ${this.profile.rollNo}\n`;
    contextStr += `Department: ${this.profile.department} | Semester: ${this.profile.semester} | CGPA: ${this.profile.cgpa}\n`;
    contextStr += `Scholarship / Quota: ${this.profile.scholarship} (${this.profile.quota})\n`;

    if (this.longTermFacts.length > 0) {
      contextStr += 'Extracted Facts & Preferences:\n';
      this.longTermFacts.forEach(fact => {
        contextStr += `- ${fact}\n`;
      });
    }

    contextStr += '--- END OF MEMORY CONTEXT ---\n';
    return contextStr;
  }
}

window.studentMemory = new StudentMemory();
