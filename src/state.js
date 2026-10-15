// ============================================
// OneLife — Centralized State & Event Bus
// ============================================

const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
  return () => { listeners[event] = listeners[event].filter(f => f !== fn); };
}

export function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}

// ── Department definitions ──
export const DEPARTMENTS = [
  {
    id: 'academic-affairs',
    num: 1,
    name: 'Academic Affairs / Registrar',
    shortName: 'Academic Affairs',
    issues: 'Probation, course load, credit shortfall, records',
    sensitivity: 'Tier 2',
    icon: '🏛️',
    color: '#4F46E5',
  },
  {
    id: 'faculty-coord',
    num: 2,
    name: 'Faculty & Department Coordination',
    shortName: 'Faculty Coordination',
    issues: 'Attendance, deadline extensions, class-level adjustments',
    sensitivity: 'Tier 2',
    icon: '👨‍🏫',
    color: '#2563EB',
  },
  {
    id: 'exam-cell',
    num: 3,
    name: 'Examination Cell',
    shortName: 'Exam Cell',
    issues: 'Missed exams, re-exams, medical or special exam arrangements',
    sensitivity: 'Tier 2',
    icon: '📝',
    color: '#7C3AED',
  },
  {
    id: 'financial-aid',
    num: 4,
    name: 'Financial Aid & Scholarships',
    shortName: 'Financial Aid',
    issues: 'Hardship funds, scholarship issues, emergency aid',
    sensitivity: 'Tier 2',
    icon: '💰',
    color: '#059669',
  },
  {
    id: 'fees-accounts',
    num: 5,
    name: 'Fees & Accounts',
    shortName: 'Fees & Accounts',
    issues: 'Fee dues, instalment plans, refunds, late-fee waivers',
    sensitivity: 'Tier 2',
    icon: '💳',
    color: '#D97706',
  },
  {
    id: 'hostel-housing',
    num: 6,
    name: 'Hostel & Housing',
    shortName: 'Hostel & Housing',
    issues: 'Loss of accommodation, room disputes, emergency housing',
    sensitivity: 'Tier 2',
    icon: '🏠',
    color: '#EA580C',
  },
  {
    id: 'counselling',
    num: 7,
    name: 'Counselling & Mental Health',
    shortName: 'Counselling & Mental Health',
    issues: 'Stress, anxiety, burnout, crisis support',
    sensitivity: 'Tier 3 (restricted)',
    icon: '💚',
    color: '#10B981',
  },
  {
    id: 'medical-health',
    num: 8,
    name: 'Health Centre / Medical',
    shortName: 'Health Centre / Medical',
    issues: 'Illness, injury, medical leave certification',
    sensitivity: 'Tier 3 (restricted)',
    icon: '🏥',
    color: '#E11D48',
  },
  {
    id: 'accessibility',
    num: 9,
    name: 'Accessibility & Disability Services',
    shortName: 'Accessibility & Disability Services',
    issues: 'Accommodations, assistive needs, learning support',
    sensitivity: 'Tier 3 (restricted)',
    icon: '♿',
    color: '#0891B2',
  },
  {
    id: 'safety-icc',
    num: 10,
    name: 'Safety, Anti-Ragging & Harassment Cell (ICC)',
    shortName: 'Safety & ICC',
    issues: 'Harassment, ragging, discrimination, safety threats',
    sensitivity: 'Tier 3 (restricted)',
    icon: '🛡️',
    color: '#DC2626',
  },
  {
    id: 'career-placement',
    num: 11,
    name: 'Career & Placement',
    shortName: 'Career & Placement',
    issues: 'Placement eligibility, internship conflicts, career anxiety',
    sensitivity: 'Tier 1-2',
    icon: '💼',
    color: '#8B5CF6',
  },
  {
    id: 'student-welfare',
    num: 12,
    name: 'Student Welfare / Dean of Students',
    shortName: 'Student Welfare / Dean',
    issues: 'Personal crises, family emergencies, discipline, general coordination',
    sensitivity: 'Tier 2-3',
    icon: '🤝',
    color: '#475569',
  },
];

export function getDept(id) {
  if (!id) return DEPARTMENTS[0];
  const aliasMap = {
    'academic': 'academic-affairs',
    'registry': 'academic-affairs',
    'finance': 'financial-aid',
    'accommodation': 'hostel-housing',
    'wellbeing': 'counselling',
    'disability': 'accessibility',
    'careers': 'career-placement',
    'conduct': 'safety-icc',
    'success': 'student-welfare',
    'it': 'faculty-coord',
    'library': 'exam-cell',
    'international': 'student-welfare',
  };
  return DEPARTMENTS.find(d => d.id === id) || DEPARTMENTS.find(d => d.id === aliasMap[id]) || DEPARTMENTS[0];
}

// ── Cases ──
export const cases = [
  {
    id: 'STU-10482',
    student: { name: 'Alex Morgan', email: 'alex.morgan@uni.ac.uk', year: 2, course: 'BSc Psychology', avatar: 'AM' },
    title: 'Academic Probation Risk + Hardship Aid + Emergency Hostel + Counselling',
    summary: 'Student is experiencing academic credit shortfall and financial distress, affecting attendance and wellbeing. Urgent hostel accommodation support and confidential counselling check-in required.',
    status: 'in_progress',
    priority: 'high',
    created: '2026-09-24T10:24:00',
    updated: '2026-09-24T10:51:00',
    sentiment: { label: 'Concerned / Overwhelmed', level: 'moderate', confidence: 'High' },
    signals: ['Credit shortfall', 'Financial hardship', 'Hostel risk', 'Wellbeing burnout'],
    departments: ['academic-affairs', 'faculty-coord', 'financial-aid', 'hostel-housing', 'counselling'],
    tasks: [
      { id: 't1', dept: 'academic-affairs', title: 'Course load & credit shortfall audit', description: 'Review academic records, verify probation status, and arrange course restructuring.', assignee: 'Dr. Priya Shah (Registrar)', status: 'in_progress', lastUpdate: 'Probation review scheduled for tomorrow 11:00 AM.', updatedAt: '10:41 AM' },
      { id: 't2', dept: 'faculty-coord', title: 'Attendance record adjustment & extensions', description: 'Coordinate with Psychology department faculty for assignment deadline extensions.', assignee: 'Prof. Alan Miller', status: 'in_progress', lastUpdate: 'Faculty notified; 10-day extension granted for PSYC-204.', updatedAt: '10:48 AM' },
      { id: 't3', dept: 'financial-aid', title: 'Emergency hardship fund grant', description: 'Process emergency student hardship fund application and bursary review.', assignee: 'Anita Roy (Financial Aid)', status: 'waiting', lastUpdate: 'Hardship application form link dispatched to uni email.', updatedAt: '10:46 AM' },
      { id: 't4', dept: 'hostel-housing', title: 'Emergency room allocation & dispute review', description: 'Prevent room cancellation and assess emergency housing subsidy.', assignee: 'Hostel Warden Team', status: 'in_progress', lastUpdate: 'Eviction hold placed; emergency bursary tagged.', updatedAt: '10:38 AM' },
      { id: 't5', dept: 'counselling', title: 'Crisis support & burnout intake', description: 'Tier 3 Confidential: Arrange 1-on-1 mental health counselling check-in.', assignee: 'Dr. Sarah Jenkins (Counselling)', status: 'review', lastUpdate: 'Confidential appointment slot offered for Thursday.', updatedAt: '10:51 AM' },
    ],
    timeline: [
      { time: '10:24 AM', event: 'AI conversation completed', type: 'ai', detail: 'Student described credit shortfall, financial hardship, and hostel insecurity.' },
      { time: '10:25 AM', event: 'Case created', type: 'system', detail: 'Case #STU-10482 generated with 4 high-priority support signals.' },
      { time: '10:25 AM', event: 'Academic Affairs assigned', type: 'assign', dept: 'academic-affairs', detail: 'Routed to Dr. Priya Shah for course load review.' },
      { time: '10:26 AM', event: 'Faculty Coordination assigned', type: 'assign', dept: 'faculty-coord', detail: 'Routed to Prof. Alan Miller for deadline extensions.' },
      { time: '10:26 AM', event: 'Financial Aid assigned', type: 'assign', dept: 'financial-aid', detail: 'Routed to Anita Roy for emergency hardship grant.' },
      { time: '10:27 AM', event: 'Hostel & Housing assigned', type: 'assign', dept: 'hostel-housing', detail: 'Emergency housing hold applied.' },
      { time: '10:28 AM', event: 'Counselling & Mental Health notified', type: 'assign', dept: 'counselling', detail: 'Confidential Tier 3 intake initiated.' },
      { time: '10:38 AM', event: 'Hostel status updated', type: 'update', dept: 'hostel-housing', detail: 'Eviction hold confirmed by Hostel Warden.' },
      { time: '10:41 AM', event: 'Academic Affairs updated', type: 'update', dept: 'academic-affairs', detail: 'Appointment offered for tomorrow at 11:00 AM.' },
      { time: '10:46 AM', event: 'Financial Aid updated', type: 'update', dept: 'financial-aid', detail: 'Hardship grant documentation sent to student.' },
      { time: '10:51 AM', event: 'Student viewed plan', type: 'student', detail: 'Student accessed the OneLife consolidated support plan.' },
    ],
    journeyStep: 2,
  },
  {
    id: 'STU-10471',
    student: { name: 'Jordan Lee', email: 'jordan.lee@uni.ac.uk', year: 1, course: 'BA English Literature', avatar: 'JL' },
    title: 'Accessibility Accommodations + Special Exam Arrangements',
    summary: 'Student has newly verified sensory condition requiring assistive learning software and extra time for upcoming term tests.',
    status: 'new',
    priority: 'high',
    created: '2026-09-24T09:15:00',
    updated: '2026-09-24T09:15:00',
    sentiment: { label: 'Anxious', level: 'moderate', confidence: 'Medium' },
    signals: ['Accommodations', 'Assistive needs', 'Special exam arrangements'],
    departments: ['accessibility', 'faculty-coord', 'exam-cell'],
    tasks: [
      { id: 't6', dept: 'accessibility', title: 'Assistive tech & learning support plan', description: 'Review specialist documentation and calibrate screen reader licence.', assignee: 'David Thorne (Accessibility)', status: 'new', lastUpdate: 'Documentation uploaded; intake pending.', updatedAt: '09:20 AM' },
      { id: 't7', dept: 'faculty-coord', title: 'Classroom acoustic & seating adjustments', description: 'Notify module leaders to share lecture transcripts 24h prior.', assignee: 'English Dept Coordinator', status: 'new', lastUpdate: '', updatedAt: '' },
      { id: 't8', dept: 'exam-cell', title: 'Special exam arrangements (25% extra time)', description: 'Log accommodation on examination hall seating registry.', assignee: 'Exam Cell Special Needs Desk', status: 'in_progress', lastUpdate: 'Chamber allotment approved.', updatedAt: '09:35 AM' },
    ],
    timeline: [
      { time: '9:15 AM', event: 'AI conversation completed', type: 'ai', detail: 'Student requested disability accommodations and exam adjustments.' },
      { time: '9:16 AM', event: 'Case created', type: 'system', detail: 'Case #STU-10471 routed to Accessibility & Examination Cell.' },
    ],
    journeyStep: 0,
  },
  {
    id: 'STU-10465',
    student: { name: 'Sam Chen', email: 'sam.chen@uni.ac.uk', year: 3, course: 'MEng Computer Science', avatar: 'SC' },
    title: 'Missed Exam & Re-examination Application',
    summary: 'Student missed compulsory algorithms exam due to acute hospital admission. Requests official re-exam scheduling without academic penalty.',
    status: 'waiting',
    priority: 'medium',
    created: '2026-09-23T14:30:00',
    updated: '2026-09-24T08:20:00',
    sentiment: { label: 'Worried', level: 'mild', confidence: 'High' },
    signals: ['Missed exam', 'Re-exam request', 'Medical certificate'],
    departments: ['exam-cell', 'medical-health', 'academic-affairs'],
    tasks: [
      { id: 't9', dept: 'medical-health', title: 'Medical leave certificate verification', description: 'Verify hospital emergency room admission notes for exam waiver.', assignee: 'Dr. Kapoor (Health Centre)', status: 'resolved', lastUpdate: 'Medical certificate verified valid for 22-24 Sept.', updatedAt: 'Yesterday 3:10 PM' },
      { id: 't10', dept: 'exam-cell', title: 'Re-exam timetable scheduling', description: 'Allocate sitting in October supplementary examination block.', assignee: 'Exam Cell Controller', status: 'waiting', lastUpdate: 'Awaiting student confirmation of preferred exam date.', updatedAt: '8:20 AM' },
      { id: 't11', dept: 'academic-affairs', title: 'Academic records penalty exemption', description: 'Ensure cap of pass mark is waived per extenuating circumstances policy.', assignee: 'Registrar Records Desk', status: 'in_progress', lastUpdate: 'Zero cap waiver pending final committee sign-off.', updatedAt: '8:45 AM' },
    ],
    timeline: [
      { time: '2:30 PM', event: 'AI conversation completed', type: 'ai', detail: 'Student uploaded hospital admission slip for missed exam.' },
      { time: '2:31 PM', event: 'Case created', type: 'system', detail: 'Case #STU-10465 created.' },
    ],
    journeyStep: 1,
  },
  {
    id: 'STU-10458',
    student: { name: 'Maria Santos', email: 'maria.santos@uni.ac.uk', year: 4, course: 'BSc Biotechnology', avatar: 'MS' },
    title: 'Placement Eligibility & Corporate Internship Conflict',
    summary: 'Student shortlisted for corporate placement but requires attendance waiver for laboratory modules and Dean coordination.',
    status: 'in_progress',
    priority: 'medium',
    created: '2026-09-22T11:00:00',
    updated: '2026-09-24T09:00:00',
    sentiment: { label: 'Hopeful / Eager', level: 'mild', confidence: 'Medium' },
    signals: ['Placement eligibility', 'Internship conflict', 'Faculty coordination'],
    departments: ['career-placement', 'faculty-coord', 'student-welfare'],
    tasks: [
      { id: 't12', dept: 'career-placement', title: 'Placement eligibility & employer liaison', description: 'Verify company MOU and issue placement joining no-objection certificate.', assignee: 'Rajesh Nair (Career & Placement)', status: 'resolved', lastUpdate: 'NOC generated and sent to recruiting firm.', updatedAt: '9:00 AM' },
      { id: 't13', dept: 'faculty-coord', title: 'Laboratory schedule flex-hours', description: 'Coordinate alternative weekend laboratory batch for student.', assignee: 'Biotech Lab Head', status: 'in_progress', lastUpdate: 'Alternative weekend slot proposed.', updatedAt: '9:30 AM' },
      { id: 't14', dept: 'student-welfare', title: 'Dean of Students general approval', description: 'Expedite dual-enrollment internship approval.', assignee: 'Dean of Students Office', status: 'in_progress', lastUpdate: 'Under review by Associate Dean.', updatedAt: '10:00 AM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10450',
    student: { name: 'Aisha Patel', email: 'aisha.patel@uni.ac.uk', year: 2, course: 'LLB Law', avatar: 'AP' },
    title: 'Fee Dues Instalment Plan + Emergency Hardship Aid',
    summary: 'Unexpected family emergency caused severe liquidity crisis. Student faces fee default penalties and hostel eviction warning.',
    status: 'in_progress',
    priority: 'high',
    created: '2026-09-21T16:00:00',
    updated: '2026-09-24T10:10:00',
    sentiment: { label: 'Distressed', level: 'elevated', confidence: 'High' },
    signals: ['Fee dues', 'Late-fee waiver', 'Hardship funds', 'Emergency housing'],
    departments: ['fees-accounts', 'financial-aid', 'hostel-housing'],
    tasks: [
      { id: 't15', dept: 'fees-accounts', title: 'Instalment plan & late-fee waiver', description: 'Split semester tuition into 3 monthly instalments and waive £150 late surcharge.', assignee: 'Finance Accounts Officer', status: 'in_progress', lastUpdate: '3-part instalment schedule drafted.', updatedAt: '10:10 AM' },
      { id: 't16', dept: 'financial-aid', title: 'Emergency hardship bursary assessment', description: 'Evaluate student for non-repayable crisis hardship grant of £800.', assignee: 'Financial Aid Committee', status: 'in_progress', lastUpdate: 'Income verification documents received.', updatedAt: '10:15 AM' },
      { id: 't17', dept: 'hostel-housing', title: 'Hostel room retention security', description: 'Notify residence hall manager to suspend room de-allocation.', assignee: 'Hostel Administration', status: 'resolved', lastUpdate: 'Room confirmed secure through semester.', updatedAt: '9:45 AM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10445',
    student: { name: 'Tom Richards', email: 'tom.richards@uni.ac.uk', year: 3, course: 'BA History & Politics', avatar: 'TR' },
    title: 'Career Anxiety & Placement Eligibility Consultation',
    summary: 'Final year student experiencing panic regarding career placement tests, interviews, and postgraduate transition.',
    status: 'resolved',
    priority: 'low',
    created: '2026-09-20T09:00:00',
    updated: '2026-09-23T15:30:00',
    sentiment: { label: 'Relieved', level: 'positive', confidence: 'High' },
    signals: ['Career anxiety', 'Placement eligibility', 'Mentorship'],
    departments: ['career-placement', 'counselling'],
    tasks: [
      { id: 't18', dept: 'career-placement', title: '1-on-1 placement prep & CV mentoring', description: 'Mock technical interview and career strategy consultation.', assignee: 'Emma Clarke (Careers Advisor)', status: 'resolved', lastUpdate: '2-hour consultation completed; tailored action roadmap agreed.', updatedAt: '3:30 PM' },
      { id: 't19', dept: 'counselling', title: 'Performance anxiety workshop enrolment', description: 'Provide guided mindfulness and coping strategies for interview stress.', assignee: 'Counselling Team', status: 'resolved', lastUpdate: 'Student attended stress-management workshop.', updatedAt: '4:15 PM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10440',
    student: { name: 'Li Wei', email: 'li.wei@uni.ac.uk', year: 1, course: 'MSc Data Science', avatar: 'LW' },
    title: 'Acute Illness & Medical Leave Certification',
    summary: 'Student required inpatient medical care; needs medical leave certified to excuse mandatory lab attendance and re-schedule assessments.',
    status: 'in_progress',
    priority: 'medium',
    created: '2026-09-23T10:00:00',
    updated: '2026-09-24T08:00:00',
    sentiment: { label: 'Fatigued / Recovering', level: 'mild', confidence: 'Medium' },
    signals: ['Illness', 'Medical leave certification', 'Class-level adjustments'],
    departments: ['medical-health', 'faculty-coord', 'student-welfare'],
    tasks: [
      { id: 't20', dept: 'medical-health', title: 'Medical leave certification review', description: 'Verify physician notes and issue certified fitness certificate on return.', assignee: 'Dr. Evelyn Reed (Medical Centre)', status: 'resolved', lastUpdate: 'Medical certificate validated for 10-day leave.', updatedAt: '8:00 AM' },
      { id: 't21', dept: 'faculty-coord', title: 'Excused absence & asynchronous lab access', description: 'Provide recorded lectures and remote cloud lab access credentials.', assignee: 'Data Science Faculty Desk', status: 'in_progress', lastUpdate: 'VLE lecture recordings unlocked.', updatedAt: '10:30 AM' },
      { id: 't22', dept: 'student-welfare', title: 'Student Welfare wellbeing check', description: 'Confirm student has groceries and support while recovering at halls.', assignee: 'Welfare Officer Liam', status: 'waiting', lastUpdate: 'Call scheduled for this afternoon.', updatedAt: '11:00 AM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10435',
    student: { name: 'Emma Williams', email: 'emma.williams@uni.ac.uk', year: 2, course: 'BSc Nursing', avatar: 'EW' },
    title: 'Safety Threat / Anti-Ragging & Harassment Cell Report',
    summary: 'Confidential report concerning threatening behavior and harassment. Case handled with Tier 3 Restricted confidentiality protocols.',
    status: 'in_progress',
    priority: 'high',
    created: '2026-09-22T14:00:00',
    updated: '2026-09-24T09:30:00',
    sentiment: { label: 'Distressed / Fearful', level: 'elevated', confidence: 'High' },
    signals: ['Safety threats', 'Harassment', 'Crisis support', 'Tier 3 Restricted'],
    departments: ['safety-icc', 'counselling', 'student-welfare'],
    tasks: [
      { id: 't23', dept: 'safety-icc', title: 'ICC confidential preliminary fact-finding', description: 'Tier 3 Restricted: Immediate protective order and no-contact directive issued.', assignee: 'ICC Chairperson Prof. Vance', status: 'in_progress', lastUpdate: 'Protective directives served; witness hearings scheduled.', updatedAt: '9:30 AM' },
      { id: 't24', dept: 'counselling', title: 'Dedicated trauma & crisis support', description: 'Private, off-record trauma counselling with senior therapist.', assignee: 'Senior Clinical Psychologist', status: 'in_progress', lastUpdate: 'First private session completed; weekly support active.', updatedAt: '9:00 AM' },
      { id: 't25', dept: 'student-welfare', title: 'Dean of Students security escort & relocation', description: 'Provide campus security escort and offer confidential hostel relocation.', assignee: 'Dean of Students Welfare Lead', status: 'resolved', lastUpdate: 'Relocation to quiet hall completed.', updatedAt: 'Yesterday 5:00 PM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10430',
    student: { name: 'Ollie Thompson', email: 'ollie.thompson@uni.ac.uk', year: 1, course: 'BEng Mechanical Engineering', avatar: 'OT' },
    title: 'Academic Probation & Course Load Adjustment',
    summary: 'Student placed on academic warning due to credit shortfall in semester 1. Requires course load reduction and faculty mentor assignment.',
    status: 'waiting',
    priority: 'medium',
    created: '2026-09-23T11:00:00',
    updated: '2026-09-24T07:45:00',
    sentiment: { label: 'Frustrated', level: 'mild', confidence: 'High' },
    signals: ['Probation', 'Credit shortfall', 'Course load', 'Records'],
    departments: ['academic-affairs', 'faculty-coord', 'fees-accounts'],
    tasks: [
      { id: 't26', dept: 'academic-affairs', title: 'Course load reduction & academic records update', description: 'Re-register for 4 modules instead of 6 to remediate GPA.', assignee: 'Academic Affairs Registrar', status: 'waiting', lastUpdate: 'Awaiting student sign-off on remedial course plan.', updatedAt: '7:45 AM' },
      { id: 't27', dept: 'faculty-coord', title: 'Faculty mentor 1-on-1 tutoring coordination', description: 'Pair student with Engineering senior tutor for weekly monitoring.', assignee: 'Engineering Faculty Lead', status: 'in_progress', lastUpdate: 'Meeting booked for today 2:00 PM.', updatedAt: '8:00 AM' },
      { id: 't28', dept: 'fees-accounts', title: 'Tuition adjustment for reduced credits', description: 'Re-calculate per-credit tuition fee balance.', assignee: 'Accounts Bureau', status: 'new', lastUpdate: '', updatedAt: '' },
    ],
    timeline: [],
    journeyStep: 0,
  },
];

// ── Department stats (generated) ──
export function getDeptStats(deptId) {
  const targetId = getDept(deptId).id;
  const deptCases = cases.filter(c => c.departments.includes(targetId));
  const open = deptCases.filter(c => c.status !== 'resolved').length;
  const newToday = deptCases.filter(c => c.created.startsWith('2026-09-24')).length;
  const urgent = deptCases.filter(c => c.priority === 'high').length;
  const waiting = deptCases.filter(c => c.tasks.some(t => t.dept === targetId && t.status === 'waiting')).length;
  const waitingDept = deptCases.filter(c => c.tasks.some(t => t.dept === targetId && (t.status === 'review' || t.status === 'in_progress'))).length;
  const resolved = deptCases.filter(c => c.tasks.some(t => t.dept === targetId && t.status === 'resolved')).length;
  return { open, newToday, urgent, waiting, waitingDept, resolved, total: deptCases.length };
}

// ── Generate extra stats for admin dashboard ──
export const adminStats = {
  activeCases: 1284,
  newThisWeek: 187,
  assignedRate: 94,
  crossDeptRate: 78,
  awaitingFollowUp: 143,
  resolvedThisWeek: 312,
  avgResolutionDays: 2.8,
};

// ── Department matrix data for all 12 departments ──
export const deptMatrix = [
  { id: 'academic-affairs', open: 64, newToday: 12, waiting: 16, overdue: 4, avgRes: '1.9d', crossTeam: 48 },
  { id: 'faculty-coord', open: 52, newToday: 11, waiting: 14, overdue: 3, avgRes: '1.4d', crossTeam: 39 },
  { id: 'exam-cell', open: 38, newToday: 8, waiting: 9, overdue: 2, avgRes: '2.0d', crossTeam: 27 },
  { id: 'financial-aid', open: 41, newToday: 7, waiting: 11, overdue: 2, avgRes: '3.1d', crossTeam: 31 },
  { id: 'fees-accounts', open: 34, newToday: 6, waiting: 8, overdue: 1, avgRes: '2.5d', crossTeam: 22 },
  { id: 'hostel-housing', open: 29, newToday: 5, waiting: 7, overdue: 2, avgRes: '2.6d', crossTeam: 24 },
  { id: 'counselling', open: 45, newToday: 9, waiting: 10, overdue: 1, avgRes: '1.8d', crossTeam: 36 },
  { id: 'medical-health', open: 26, newToday: 6, waiting: 4, overdue: 0, avgRes: '1.1d', crossTeam: 18 },
  { id: 'accessibility', open: 23, newToday: 4, waiting: 6, overdue: 1, avgRes: '3.8d', crossTeam: 17 },
  { id: 'safety-icc', open: 9, newToday: 2, waiting: 2, overdue: 0, avgRes: '1.2d', crossTeam: 8 },
  { id: 'career-placement', open: 28, newToday: 5, waiting: 5, overdue: 0, avgRes: '1.6d', crossTeam: 14 },
  { id: 'student-welfare', open: 33, newToday: 7, waiting: 8, overdue: 2, avgRes: '2.4d', crossTeam: 29 },
];

// ── Support flow stages ──
export const supportFlow = [
  { stage: 'New', count: 47, color: '#3B82F6' },
  { stage: 'Triaged', count: 83, color: '#8B5CF6' },
  { stage: 'Assigned', count: 156, color: '#4F46E5' },
  { stage: 'In Progress', count: 412, color: '#F59E0B' },
  { stage: 'Waiting', count: 198, color: '#F97316' },
  { stage: 'Resolved', count: 388, color: '#10B981' },
];

// ── Emerging signals ──
export const emergingSignals = [
  { id: 's1', signal: 'Student has contacted 3 support services in the past 14 days.', action: 'Consider a coordinated check-in.', caseId: 'STU-10482', severity: 'moderate', type: 'Multiple support interactions' },
  { id: 's2', signal: 'Attendance has dropped below 60% in the last 3 weeks.', action: 'Review academic engagement and offer support.', caseId: 'STU-10471', severity: 'elevated', type: 'Attendance concern' },
  { id: 's3', signal: 'Repeated financial support requests over 2 months.', action: 'Consider long-term financial support plan.', caseId: 'STU-10450', severity: 'moderate', type: 'Repeated financial requests' },
  { id: 's4', signal: 'Academic engagement scores declining for 4 consecutive weeks.', action: 'Proactive academic check-in recommended.', caseId: null, severity: 'mild', type: 'Academic engagement dropping' },
  { id: 's5', signal: 'Student explicitly requested help via support chat.', action: 'Ensure timely response and follow-up.', caseId: 'STU-10482', severity: 'moderate', type: 'Student requested help' },
];

// ── Current navigation state ──
export const state = {
  currentView: 'student-landing',
  currentDept: null,
  currentCase: null,
  chatMessages: [],
  chatStep: 0,
  studentName: 'Alex',
};

export function navigateTo(view, params = {}) {
  state.currentView = view;
  if (params.dept) state.currentDept = params.dept;
  if (params.caseId) state.currentCase = params.caseId;
  emit('navigate', { view, ...params });
}

export function getCase(id) {
  return cases.find(c => c.id === id);
}

export function updateTaskStatus(caseId, taskId, newStatus) {
  const c = getCase(caseId);
  if (!c) return;
  const task = c.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
    emit('taskUpdated', { caseId, taskId, newStatus });
    emit('caseUpdated', { caseId });
  }
}

// ── Department Message Threads (Unified Student Communications) ──
export const messageThreads = [
  {
    id: 'msg-academic-affairs',
    deptId: 'academic-affairs',
    officer: 'Dr. Priya Shah',
    role: 'Senior Academic Registrar & Advisor',
    caseId: 'STU-10482',
    subject: 'Course load restructuring & credit shortfall review',
    unreadCount: 1,
    lastUpdated: '10:45 AM',
    messages: [
      {
        id: 'm1',
        sender: 'dept',
        name: 'Dr. Priya Shah',
        role: 'Academic Affairs / Registrar',
        avatar: 'PS',
        time: '10:41 AM',
        text: "Hello Alex, I've reviewed your credit shortfall in Psychology Year 2. To avoid formal probation, we can adjust your course load from 6 modules to 4, re-scheduling two elective credits for the summer semester. Does tomorrow at 11:00 AM work for a quick video check-in?",
        attachment: null,
      },
      {
        id: 'm2',
        sender: 'student',
        name: 'Alex Morgan',
        role: 'Student',
        avatar: 'AM',
        time: '10:43 AM',
        text: "Thank you Dr. Shah. Yes, 11:00 AM tomorrow works well for me. I'm really grateful for this option.",
        attachment: null,
      },
      {
        id: 'm3',
        sender: 'dept',
        name: 'Dr. Priya Shah',
        role: 'Academic Affairs / Registrar',
        avatar: 'PS',
        time: '10:45 AM',
        text: "Appointment confirmed on your student calendar. I've attached your preliminary restructured schedule below for you to review beforehand.",
        attachment: { name: 'Course_Restructuring_Plan_2026.pdf', size: '245 KB' },
      },
    ],
  },
  {
    id: 'msg-financial-aid',
    deptId: 'financial-aid',
    officer: 'Anita Roy',
    role: 'Student Financial Support Lead',
    caseId: 'STU-10482',
    subject: 'Emergency student hardship grant application',
    unreadCount: 1,
    lastUpdated: '10:52 AM',
    messages: [
      {
        id: 'm4',
        sender: 'dept',
        name: 'Anita Roy',
        role: 'Financial Aid & Scholarships',
        avatar: 'AR',
        time: '10:46 AM',
        text: "Hi Alex, we received the referral from your support assessment regarding accommodation cost pressures. We have an emergency non-repayable bursary of up to £800 available. I've sent the pre-filled application link to your student email.",
        attachment: null,
      },
      {
        id: 'm5',
        sender: 'student',
        name: 'Alex Morgan',
        role: 'Student',
        avatar: 'AM',
        time: '10:50 AM',
        text: "Thank you Anita, I just opened the link. Which bank statement months do I need to attach?",
        attachment: null,
      },
      {
        id: 'm6',
        sender: 'dept',
        name: 'Anita Roy',
        role: 'Financial Aid & Scholarships',
        avatar: 'AR',
        time: '10:52 AM',
        text: "Just your last 2 months of standard current account statements showing rent debits. Let us know if you need any help uploading them!",
        attachment: { name: 'Hardship_Grant_Checklist.pdf', size: '118 KB' },
      },
    ],
  },
  {
    id: 'msg-hostel-housing',
    deptId: 'hostel-housing',
    officer: 'Hostel Warden Team',
    role: 'Campus Housing & Residential Life',
    caseId: 'STU-10482',
    subject: 'Room allocation security & fee payment hold',
    unreadCount: 0,
    lastUpdated: '10:40 AM',
    messages: [
      {
        id: 'm7',
        sender: 'dept',
        name: 'Marcus Vance',
        role: 'Hostel & Housing Warden',
        avatar: 'MV',
        time: '10:38 AM',
        text: "Dear Alex, we have placed an official administrative hold on your room account. No room reallocation or late notices will proceed while your financial aid is being evaluated.",
        attachment: null,
      },
      {
        id: 'm8',
        sender: 'student',
        name: 'Alex Morgan',
        role: 'Student',
        avatar: 'AM',
        time: '10:40 AM',
        text: "That is such a relief to hear, thank you so much Marcus. I will follow up with the financial aid team today.",
        attachment: null,
      },
    ],
  },
  {
    id: 'msg-counselling',
    deptId: 'counselling',
    officer: 'Dr. Sarah Jenkins',
    role: 'Clinical Psychologist (Confidential)',
    caseId: 'STU-10482',
    subject: 'Confidential wellbeing check-in (Tier 3 Restricted)',
    unreadCount: 1,
    lastUpdated: '10:51 AM',
    messages: [
      {
        id: 'm9',
        sender: 'dept',
        name: 'Dr. Sarah Jenkins',
        role: 'Counselling & Mental Health',
        avatar: 'SJ',
        time: '10:51 AM',
        text: "Hello Alex, this is a strictly confidential message from the Counselling & Mental Health Service. We received a signal that you've been feeling overwhelmed and under heavy pressure. We have a private 1-to-1 session open this Thursday at 2:00 PM (in-person at Student Health Building, Room 204 or online). Would you like to take this slot?",
        attachment: null,
      },
    ],
  },
  {
    id: 'msg-faculty-coord',
    deptId: 'faculty-coord',
    officer: 'Prof. Alan Miller',
    role: 'Faculty Undergraduate Coordinator',
    caseId: 'STU-10482',
    subject: 'Assignment deadline extensions & attendance record',
    unreadCount: 0,
    lastUpdated: '10:48 AM',
    messages: [
      {
        id: 'm10',
        sender: 'dept',
        name: 'Prof. Alan Miller',
        role: 'Faculty Coordination',
        avatar: 'AM',
        time: '10:48 AM',
        text: "Alex, I've liaised with your module instructors. A 10-day extension has been granted for your PSYC-204 Research Methods coursework. Your lab attendance records have also been marked as excused.",
        attachment: { name: 'Coursework_Extension_Signed.pdf', size: '185 KB' },
      },
    ],
  },
  {
    id: 'msg-exam-cell',
    deptId: 'exam-cell',
    officer: 'Examination Cell Officer',
    role: 'Exam Logistics Desk',
    caseId: 'STU-10471',
    subject: 'Special Examination Seating Arrangements',
    unreadCount: 0,
    lastUpdated: '09:35 AM',
    messages: [
      {
        id: 'm11',
        sender: 'dept',
        name: 'Examination Cell',
        role: 'Exam Arrangements Desk',
        avatar: 'EC',
        time: '09:35 AM',
        text: "Dear Student, your special examination seating and 25% extra time allocation have been logged on the official exam register for upcoming midterms.",
        attachment: null,
      },
    ],
  },
  {
    id: 'msg-medical-health',
    deptId: 'medical-health',
    officer: 'Dr. Evelyn Reed',
    role: 'Medical Officer (Tier 3)',
    caseId: 'STU-10440',
    subject: 'Medical leave certificate verification',
    unreadCount: 0,
    lastUpdated: '08:00 AM',
    messages: [
      {
        id: 'm12',
        sender: 'dept',
        name: 'Dr. Evelyn Reed',
        role: 'Health Centre / Medical',
        avatar: 'ER',
        time: '08:00 AM',
        text: "Hi, your hospital discharge certificate has been validated for your excused leave period. Please collect your hard copy fitness certification when you feel ready.",
        attachment: null,
      },
    ],
  },
  {
    id: 'msg-career-placement',
    deptId: 'career-placement',
    officer: 'Rajesh Nair',
    role: 'Placement Officer',
    caseId: 'STU-10458',
    subject: 'Company NOC & Internship Dual Approval',
    unreadCount: 0,
    lastUpdated: '09:00 AM',
    messages: [
      {
        id: 'm13',
        sender: 'dept',
        name: 'Rajesh Nair',
        role: 'Career & Placement',
        avatar: 'RN',
        time: '09:00 AM',
        text: "Your No-Objection Certificate (NOC) has been dispatched directly to the placement employer. Best of luck with your internship interview block!",
        attachment: { name: 'Placement_NOC_Dispatched.pdf', size: '210 KB' },
      },
    ],
  },
];

export function getMessageThreads() {
  return messageThreads;
}

export function getMessageThread(deptId) {
  const actualDeptId = getDept(deptId).id;
  return messageThreads.find(t => t.deptId === actualDeptId) || messageThreads[0];
}

export function sendStudentMessage(deptId, text, attachment = null) {
  const actualDeptId = getDept(deptId).id;
  let thread = messageThreads.find(t => t.deptId === actualDeptId);
  if (!thread) {
    const d = getDept(actualDeptId);
    thread = {
      id: `msg-${actualDeptId}`,
      deptId: actualDeptId,
      officer: `${d.name} Officer`,
      role: d.name,
      caseId: 'STU-10482',
      subject: `Support consultation regarding ${d.issues.split(',')[0]}`,
      unreadCount: 0,
      lastUpdated: 'Just now',
      messages: [],
    };
    messageThreads.unshift(thread);
  }
  
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newMsg = {
    id: `m-${Date.now()}`,
    sender: 'student',
    name: 'Alex Morgan',
    role: 'Student',
    avatar: 'AM',
    time: timeStr,
    text: text,
    attachment: attachment,
  };
  thread.messages.push(newMsg);
  thread.lastUpdated = timeStr;
  emit('messageSent', { deptId: actualDeptId, message: newMsg });
  return newMsg;
}
