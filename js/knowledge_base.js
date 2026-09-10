/**
 * Knowledge Base Dataset for AI Student Support Assistant
 * Covers Regulations, Syllabus, FAQs, and Circulars
 */

window.COLLEGE_KNOWLEDGE_BASE = [
  {
    id: 'reg_01',
    category: 'Regulations',
    title: 'Academic Regulations & Attendance Requirements 2026',
    tags: ['attendance', 'regulations', 'condonation', 'eligibility', 'rules'],
    content: `
# Academic Regulations & Attendance Rules

### 1. Attendance Requirement
- **Minimum Requirement**: A candidate must secure at least **75% overall attendance** in the current semester to be eligible to appear for the Semester End Examinations.
- **Condonation (70% - 74%)**: Students having attendance between 70% and 74% due to medical reasons or sanctioned sports duty may apply for condonation by paying a prescribed fee of **₹500 per subject** with valid doctor's certificates / sports approval.
- **Detention (<70%)**: Students securing less than 70% attendance will NOT be permitted to write semester exams and must repeat the semester in the subsequent academic year.

### 2. Grading & Evaluation Scheme
- **Internal Assessment**: 40 Marks (2 Assessment Tests + Assignments + Quiz).
- **End Semester Exam**: 60 Marks.
- **Passing Minimum**: 45% in End Semester Exam and 50% overall aggregate (Internal + External).
- **Grade Points**:
  - **O (Outstanding)**: 90 - 100 Marks (Grade Point 10)
  - **A+ (Excellent)**: 80 - 89 Marks (Grade Point 9)
  - **A (Very Good)**: 70 - 79 Marks (Grade Point 8)
  - **B+ (Good)**: 60 - 69 Marks (Grade Point 7)
  - **B (Average)**: 50 - 59 Marks (Grade Point 6)
  - **RA (Re-appear/Fail)**: < 50 Marks (Grade Point 0)

### 3. Revaluation & Answer Script Photocopy
- Answer script photocopy fee: **₹300 per paper**.
- Revaluation fee: **₹400 per paper**.
- Review procedure: Students can apply within 7 days of result publication via the student portal.
    `
  },
  {
    id: 'reg_02',
    category: 'Regulations',
    title: 'Honor Degree & Placement Eligibility Criteria',
    tags: ['honors', 'placement', 'cgpa', 'backlogs', 'internship'],
    content: `
# Honor Degree & Campus Placement Regulations

### B.E / B.Tech Honors Degree Criteria
- Students securing a **CGPA of 8.50 and above** up to 4th semester without any standing backlogs are eligible for B.E/B.Tech (Honors).
- Must complete **18 additional credits** through NPTEL / Swayam / SWAYAM online courses certified by Anna University / Institution.

### Campus Placement Eligibility Rules
- **Tier 1 Companies (Dream Offers > 8 LPA)**: CGPA >= 8.0, 0 Standing Backlogs, 10th & 12th >= 75%.
- **Core Engineering / IT Product Companies (4 - 8 LPA)**: CGPA >= 7.0, Max 1 history backlog cleared, 10th & 12th >= 60%.
- **Placement Registration**: All final year students must maintain 85% placement training session attendance to sit for interviews.
    `
  },
  {
    id: 'syl_cse_sem6',
    category: 'Syllabus',
    title: 'B.E Computer Science & Engineering - Semester 6 Syllabus',
    tags: ['syllabus', 'cse', 'semester 6', 'ai', 'cloud', 'compiler'],
    content: `
# CSE Semester 6 Syllabus & Course Codes

### 1. CS8691 - Artificial Intelligence & Agentic Systems
- **Credits**: 3 (3-0-0)
- **Unit I**: Problem Solving Agents, Search Algorithms (A*, Minimax, Alpha-Beta Pruning).
- **Unit II**: Knowledge Representation, First Order Logic, Ontologies & RAG (Retrieval Augmented Generation).
- **Unit III**: Machine Learning & Agentic Tool Calling, LangChain, Multi-Agent Coordination.
- **Unit IV**: Prompt Engineering, Vector Databases (ChromaDB, FAISS) & Semantic Embeddings.
- **Unit V**: AI Ethics, Safety, Hallucination Prevention & Real-world Agent Deployments.

### 2. CS8651 - Internet of Things (IoT) Architecture
- **Credits**: 3 | Sensors, Microcontrollers (ESP32, Raspberry Pi), MQTT Protocol, Cloud Data Analytics.

### 3. CS8601 - Compiler Design
- **Credits**: 4 | Lexical Analysis, Syntax Trees, LL/LR Parsers, Intermediate Code Gen, Code Optimization.

### 4. CS8681 - Cloud Computing & DevOps Laboratory
- **Credits**: 2 | Docker Containers, Kubernetes Orchestration, AWS EC2, S3, CI/CD Pipeline Automation.
    `
  },
  {
    id: 'syl_aids_sem6',
    category: 'Syllabus',
    title: 'B.Tech AI & Data Science - Semester 6 Syllabus',
    tags: ['syllabus', 'aids', 'semester 6', 'deep learning', 'nlp', 'big data'],
    content: `
# B.Tech AI & DS Semester 6 Curriculum

### 1. AD8601 - Deep Learning & Neural Networks
- **Credits**: 4 | CNNs, RNNs, LSTMs, Transformers, Attention Mechanism, PyTorch Framework.

### 2. AD8602 - Natural Language Processing & LLMs
- **Credits**: 3 | Tokenization, TF-IDF, Word2Vec, BERT, GPT Architectures, RAG Systems.

### 3. AD8603 - Big Data Analytics & Distributed Systems
- **Credits**: 3 | Hadoop HDFS, MapReduce, Apache Spark, NoSQL Databases (MongoDB, Cassandra).

### 4. AD8611 - AI & Agentic Application Lab
- **Credits**: 2 | Building AI Assistants, Vector Stores, Function Calling APIs, Full-stack AI UI.
    `
  },
  {
    id: 'faq_scholarships',
    category: 'FAQs',
    title: 'College Scholarships & Financial Assistance FAQs',
    tags: ['scholarship', 'fees', 'first graduate', 'post matric', 'pragati', '7.5 percentage'],
    content: `
# College Scholarships FAQ Guide

### Q1: What scholarships are available for Tamil Nadu Engineering students?
1. **7.5% Government School Reservation Scheme**: 100% tuition, hostel, transport fee waived for Tamil Nadu Govt School students admitted under 7.5% quota.
2. **First Graduate Scholarship**: **₹25,000 per year** discount in tuition fees for first-generation graduates in the family (valid certificate from Tahsildar required).
3. **Post-Matric Scholarship (SC/ST/SCA/SCC)**: Full tuition fee waiver for SC/ST students whose annual family income is below ₹2.5 Lakhs.
4. **AICTE Pragati Scholarship for Girls**: **₹50,000 per annum** for girl students in technical degree courses.

### Q2: How do I apply for scholarships?
- Submit hard copies of Community Certificate, Income Certificate, 10th & 12th Marksheet, and Bank Passbook front page to the **Scholarship Counter (Block B, Room 102)** before **September 30th**.
    `
  },
  {
    id: 'faq_hostel_bus',
    category: 'FAQs',
    title: 'Hostel Facilities, Mess Timings & Transport Routes',
    tags: ['hostel', 'bus', 'mess', 'timing', 'transport', 'wifi'],
    content: `
# Hostel & Bus Transport FAQ

### Hostel Facilities & Timings
- **In-time for Girls Hostel**: 6:30 PM (Weekdays), 7:00 PM (Weekends).
- **In-time for Boys Hostel**: 8:30 PM.
- **Mess Timings**:
  - Breakfast: 7:15 AM - 8:30 AM
  - Lunch: 12:15 PM - 1:30 PM
  - Snacks: 4:30 PM - 5:30 PM
  - Dinner: 7:15 PM - 8:45 PM
- **Wi-Fi**: Free 100 Mbps fiber Wi-Fi in all hostel blocks (Credentials generated at IT Helpdesk).

### Bus Transport Routes
- Route 1: Central Station -> Anna Nagar -> Guindy -> Campus (Departs 7:00 AM)
- Route 2: Tambaram -> Chromepet -> Campus (Departs 7:30 AM)
- Bus Pass Officer: Mr. Murugan (Admin Block, Room 05).
    `
  },
  {
    id: 'notice_exam_2026',
    category: 'Circulars & Notices',
    title: 'OFFICIAL CIRCULAR: End Semester Examination Schedule April/May 2026',
    tags: ['notice', 'exam', 'timetable', 'hall ticket', 'circular'],
    content: `
# Official Notice: End Semester Exams April/May 2026

**Ref No**: COE/CIRC/2026/042  
**Date**: March 15, 2026  

1. **Practical Examinations**: Commencing from **April 20, 2026 to April 27, 2026**.
2. **Theory Examinations**: Commencing from **May 4, 2026 to May 25, 2026**.
3. **Hall Ticket Download**: Hall tickets will be available on the Student Portal starting **April 15, 2026**.
4. **No Dues Clearance**: Students must clear all library books, tuition, and hostel dues before April 12, 2026 to download Hall Tickets.

*By Order of Controller of Examinations*
    `
  },
  {
    id: 'notice_hackathon_2026',
    category: 'Circulars & Notices',
    title: 'TNSDC - IBM Agentic AI Internship Final Project Submission Notice',
    tags: ['notice', 'ibm', 'tnsdc', 'internship', 'hackathon', 'submission'],
    content: `
# TNSDC - IBM Agentic AI Internship Announcement

**Date**: Current Academic Session 2026  
**Target**: All Day 1 - Day 5 Registered Internship Students  

### Key Requirements:
- Each student selects **1 Use Case** out of 5 (e.g. AI Student Support Assistant, AI HR Assistant, AI E-Commerce Agent, AI IT Helpdesk, AI Learning Assistant).
- **Core Agent Capabilities**: Must demonstrate **RAG (Retrieval Augmented Generation)**, **Tools Calling**, and **Memory**.
- Final Project Walkthrough and Code Submission must be completed by the end of the internship module.
    `
  }
];
