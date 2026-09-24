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
  { id: 'wellbeing', name: 'Student Wellbeing', icon: '💚', color: '#10B981' },
  { id: 'academic', name: 'Academic Advising', icon: '📚', color: '#4F46E5' },
  { id: 'finance', name: 'Student Finance', icon: '💰', color: '#F59E0B' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏠', color: '#8B5CF6' },
  { id: 'careers', name: 'Careers & Employability', icon: '💼', color: '#EC4899' },
  { id: 'disability', name: 'Disability & Accessibility', icon: '♿', color: '#06B6D4' },
  { id: 'international', name: 'International Student Support', icon: '🌍', color: '#14B8A6' },
  { id: 'success', name: 'Student Success', icon: '🎯', color: '#F97316' },
  { id: 'library', name: 'Library & Learning Support', icon: '📖', color: '#6366F1' },
  { id: 'it', name: 'IT & Digital Support', icon: '💻', color: '#64748B' },
  { id: 'conduct', name: 'Student Conduct & Safeguarding', icon: '🛡️', color: '#DC2626' },
  { id: 'registry', name: 'Registry & Administration', icon: '📋', color: '#78716C' },
];

export function getDept(id) {
  return DEPARTMENTS.find(d => d.id === id);
}

// ── Cases ──
export const cases = [
  {
    id: 'STU-10482',
    student: { name: 'Alex Morgan', email: 'alex.morgan@uni.ac.uk', year: 2, course: 'BSc Psychology', avatar: 'AM' },
    title: 'Academic + Financial + Wellbeing Support',
    summary: 'Student is experiencing academic pressure and financial difficulty, which is affecting attendance and wellbeing. Accommodation costs are a contributing factor.',
    status: 'in_progress',
    priority: 'medium',
    created: '2026-09-24T10:24:00',
    updated: '2026-09-24T10:51:00',
    sentiment: { label: 'Concerned / Overwhelmed', level: 'moderate', confidence: 'High' },
    signals: ['Academic pressure', 'Financial concern', 'Wellbeing concern', 'Accommodation concern'],
    departments: ['academic', 'finance', 'wellbeing', 'accommodation'],
    tasks: [
      { id: 't1', dept: 'academic', title: 'Academic support', description: 'Review academic difficulties and arrange academic support appointment.', assignee: 'Dr. Priya Shah', status: 'in_progress', lastUpdate: 'Appointment offered for tomorrow at 11:00.', updatedAt: '10:41 AM' },
      { id: 't2', dept: 'finance', title: 'Financial guidance', description: 'Review financial-support options and send application link.', assignee: 'Finance Support Team', status: 'waiting', lastUpdate: 'Financial support application link sent.', updatedAt: '10:46 AM' },
      { id: 't3', dept: 'wellbeing', title: 'Wellbeing check-in', description: 'Offer wellbeing check-in appointment.', assignee: 'Wellbeing Team', status: 'review', lastUpdate: 'Optional wellbeing appointment offered.', updatedAt: '10:51 AM' },
      { id: 't4', dept: 'accommodation', title: 'Accommodation review', description: 'Emergency accommodation review and cost assessment.', assignee: 'Accommodation Team', status: 'in_progress', lastUpdate: 'Emergency accommodation review started.', updatedAt: '10:38 AM' },
    ],
    timeline: [
      { time: '10:24 AM', event: 'AI conversation completed', type: 'ai', detail: 'Student described academic pressure, financial difficulty, and accommodation concerns.' },
      { time: '10:25 AM', event: 'Case created', type: 'system', detail: 'Case #STU-10482 created with 4 support signals identified.' },
      { time: '10:25 AM', event: 'Academic Advising assigned', type: 'assign', dept: 'academic', detail: 'Task routed to Dr. Priya Shah.' },
      { time: '10:26 AM', event: 'Student Finance assigned', type: 'assign', dept: 'finance', detail: 'Task routed to Finance Support Team.' },
      { time: '10:27 AM', event: 'Student Wellbeing notified', type: 'assign', dept: 'wellbeing', detail: 'Wellbeing check-in flagged for human review.' },
      { time: '10:28 AM', event: 'Accommodation assigned', type: 'assign', dept: 'accommodation', detail: 'Emergency accommodation review initiated.' },
      { time: '10:38 AM', event: 'Accommodation updated', type: 'update', dept: 'accommodation', detail: 'Emergency accommodation review started.' },
      { time: '10:41 AM', event: 'Academic Advising updated', type: 'update', dept: 'academic', detail: 'Appointment offered for tomorrow at 11:00.' },
      { time: '10:46 AM', event: 'Student Finance updated', type: 'update', dept: 'finance', detail: 'Financial support application link sent to student.' },
      { time: '10:51 AM', event: 'Student viewed support plan', type: 'student', detail: 'Student accessed their support plan page.' },
    ],
    journeyStep: 2, // 0-indexed, how many support actions completed out of tasks
  },
  {
    id: 'STU-10471', student: { name: 'Jordan Lee', email: 'jordan.lee@uni.ac.uk', year: 1, course: 'BA English', avatar: 'JL' },
    title: 'Accessibility Support Request', summary: 'Student has a newly diagnosed condition requiring learning accommodations.', status: 'new', priority: 'high',
    created: '2026-09-24T09:15:00', updated: '2026-09-24T09:15:00',
    sentiment: { label: 'Anxious', level: 'moderate', confidence: 'Medium' },
    signals: ['Accessibility need', 'Academic concern'],
    departments: ['disability', 'academic', 'library'],
    tasks: [
      { id: 't5', dept: 'disability', title: 'Accessibility assessment', description: 'Review documentation and arrange needs assessment.', assignee: 'Accessibility Team', status: 'new', lastUpdate: '', updatedAt: '' },
      { id: 't6', dept: 'academic', title: 'Academic adjustment', description: 'Coordinate with faculty on reasonable adjustments.', assignee: 'Pending', status: 'new', lastUpdate: '', updatedAt: '' },
      { id: 't7', dept: 'library', title: 'Learning support', description: 'Provide assistive technology guidance.', assignee: 'Library Support', status: 'new', lastUpdate: '', updatedAt: '' },
    ],
    timeline: [
      { time: '9:15 AM', event: 'AI conversation completed', type: 'ai', detail: 'Student described newly diagnosed condition.' },
      { time: '9:16 AM', event: 'Case created', type: 'system', detail: 'Case #STU-10471 created with accessibility needs.' },
    ],
    journeyStep: 0,
  },
  {
    id: 'STU-10465', student: { name: 'Sam Chen', email: 'sam.chen@uni.ac.uk', year: 3, course: 'MEng Computer Science', avatar: 'SC' },
    title: 'Exam Resit Support', summary: 'Student needs support with exam resit process and study skills.', status: 'waiting', priority: 'low',
    created: '2026-09-23T14:30:00', updated: '2026-09-24T08:20:00',
    sentiment: { label: 'Worried', level: 'mild', confidence: 'High' },
    signals: ['Academic concern', 'Exam support'],
    departments: ['academic', 'library'],
    tasks: [
      { id: 't8', dept: 'academic', title: 'Exam resit guidance', description: 'Guide through resit application process.', assignee: 'Dr. James Wilson', status: 'waiting', lastUpdate: 'Awaiting student exam form submission.', updatedAt: '8:20 AM' },
      { id: 't9', dept: 'library', title: 'Study skills session', description: 'Book 1:1 study skills support.', assignee: 'Library Support', status: 'resolved', lastUpdate: 'Session booked for Thursday.', updatedAt: '3:10 PM' },
    ],
    timeline: [
      { time: '2:30 PM', event: 'AI conversation completed', type: 'ai', detail: 'Student needs exam resit support.' },
      { time: '2:31 PM', event: 'Case created', type: 'system', detail: 'Case #STU-10465 created.' },
    ],
    journeyStep: 1,
  },
  {
    id: 'STU-10458', student: { name: 'Maria Santos', email: 'maria.santos@uni.ac.uk', year: 1, course: 'BSc Biology', avatar: 'MS' },
    title: 'International Student Orientation', summary: 'New international student needing visa guidance and social integration support.', status: 'in_progress', priority: 'medium',
    created: '2026-09-22T11:00:00', updated: '2026-09-24T09:00:00',
    sentiment: { label: 'Hopeful', level: 'mild', confidence: 'Medium' },
    signals: ['International support', 'Social integration'],
    departments: ['international', 'success', 'careers'],
    tasks: [
      { id: 't10', dept: 'international', title: 'Visa guidance', description: 'Confirm visa status and provide orientation materials.', assignee: 'International Office', status: 'resolved', lastUpdate: 'Visa confirmed, orientation pack sent.', updatedAt: '9:00 AM' },
      { id: 't11', dept: 'success', title: 'Peer mentor match', description: 'Match with peer mentor from same programme.', assignee: 'Success Team', status: 'in_progress', lastUpdate: 'Mentor identified, introduction email pending.', updatedAt: '9:30 AM' },
      { id: 't12', dept: 'careers', title: 'Work rights briefing', description: 'Inform about part-time work eligibility.', assignee: 'Careers Team', status: 'new', lastUpdate: '', updatedAt: '' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10450', student: { name: 'Aisha Patel', email: 'aisha.patel@uni.ac.uk', year: 2, course: 'LLB Law', avatar: 'AP' },
    title: 'Financial Hardship + Accommodation', summary: 'Student facing unexpected financial hardship affecting ability to maintain accommodation.', status: 'in_progress', priority: 'high',
    created: '2026-09-21T16:00:00', updated: '2026-09-24T10:10:00',
    sentiment: { label: 'Distressed', level: 'elevated', confidence: 'High' },
    signals: ['Financial hardship', 'Accommodation risk', 'Wellbeing concern'],
    departments: ['finance', 'accommodation', 'wellbeing'],
    tasks: [
      { id: 't13', dept: 'finance', title: 'Emergency fund application', description: 'Process emergency hardship fund application.', assignee: 'Finance Support Team', status: 'in_progress', lastUpdate: 'Application under review.', updatedAt: '10:10 AM' },
      { id: 't14', dept: 'accommodation', title: 'Accommodation protection', description: 'Ensure accommodation is secured during financial review.', assignee: 'Accommodation Team', status: 'in_progress', lastUpdate: 'Accommodation secured pending review.', updatedAt: '9:45 AM' },
      { id: 't15', dept: 'wellbeing', title: 'Wellbeing check-in', description: 'Check on student wellbeing during difficult period.', assignee: 'Wellbeing Team', status: 'review', lastUpdate: 'Waiting for student to confirm check-in time.', updatedAt: '10:00 AM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10445', student: { name: 'Tom Richards', email: 'tom.richards@uni.ac.uk', year: 3, course: 'BA History', avatar: 'TR' },
    title: 'Career Planning Support', summary: 'Final year student seeking career guidance and CV support.', status: 'resolved', priority: 'low',
    created: '2026-09-20T09:00:00', updated: '2026-09-23T15:30:00',
    sentiment: { label: 'Motivated', level: 'positive', confidence: 'High' },
    signals: ['Career planning'],
    departments: ['careers'],
    tasks: [
      { id: 't16', dept: 'careers', title: 'Career consultation', description: 'Book career consultation and CV review.', assignee: 'Careers Team', status: 'resolved', lastUpdate: 'Consultation completed, CV reviewed.', updatedAt: '3:30 PM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10440', student: { name: 'Li Wei', email: 'li.wei@uni.ac.uk', year: 1, course: 'MSc Data Science', avatar: 'LW' },
    title: 'IT Access + Library Induction', summary: 'Student having trouble accessing university systems and needs library orientation.', status: 'in_progress', priority: 'low',
    created: '2026-09-23T10:00:00', updated: '2026-09-24T08:00:00',
    sentiment: { label: 'Frustrated', level: 'mild', confidence: 'Medium' },
    signals: ['IT access issue', 'Library support'],
    departments: ['it', 'library'],
    tasks: [
      { id: 't17', dept: 'it', title: 'System access', description: 'Resolve account access issues for VLE and email.', assignee: 'IT Helpdesk', status: 'in_progress', lastUpdate: 'Password reset completed, VLE access being restored.', updatedAt: '8:00 AM' },
      { id: 't18', dept: 'library', title: 'Library induction', description: 'Schedule library induction session.', assignee: 'Library Support', status: 'resolved', lastUpdate: 'Induction booked for Friday.', updatedAt: '10:30 AM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10435', student: { name: 'Emma Williams', email: 'emma.williams@uni.ac.uk', year: 2, course: 'BSc Nursing', avatar: 'EW' },
    title: 'Conduct Concern + Wellbeing', summary: 'Student reported an incident and needs support through the process.', status: 'in_progress', priority: 'high',
    created: '2026-09-22T14:00:00', updated: '2026-09-24T09:30:00',
    sentiment: { label: 'Distressed', level: 'elevated', confidence: 'High' },
    signals: ['Safeguarding concern', 'Wellbeing concern'],
    departments: ['conduct', 'wellbeing'],
    tasks: [
      { id: 't19', dept: 'conduct', title: 'Incident review', description: 'Review reported incident and determine next steps.', assignee: 'Safeguarding Officer', status: 'in_progress', lastUpdate: 'Initial review completed, meeting scheduled.', updatedAt: '9:30 AM' },
      { id: 't20', dept: 'wellbeing', title: 'Wellbeing support', description: 'Provide ongoing wellbeing support during investigation.', assignee: 'Wellbeing Team', status: 'in_progress', lastUpdate: 'Regular check-ins arranged.', updatedAt: '9:00 AM' },
    ],
    timeline: [],
    journeyStep: 1,
  },
  {
    id: 'STU-10430', student: { name: 'Ollie Thompson', email: 'ollie.thompson@uni.ac.uk', year: 1, course: 'BEng Mechanical Engineering', avatar: 'OT' },
    title: 'Registration Issue', summary: 'Student has a module registration error preventing enrollment.', status: 'waiting', priority: 'medium',
    created: '2026-09-23T11:00:00', updated: '2026-09-24T07:45:00',
    sentiment: { label: 'Frustrated', level: 'mild', confidence: 'High' },
    signals: ['Registration issue'],
    departments: ['registry', 'academic'],
    tasks: [
      { id: 't21', dept: 'registry', title: 'Registration fix', description: 'Correct module registration error in student records.', assignee: 'Registry Team', status: 'waiting', lastUpdate: 'Awaiting department confirmation of correct modules.', updatedAt: '7:45 AM' },
      { id: 't22', dept: 'academic', title: 'Module confirmation', description: 'Confirm correct module selections with academic advisor.', assignee: 'Academic Advisor', status: 'in_progress', lastUpdate: 'Meeting scheduled for today.', updatedAt: '8:00 AM' },
    ],
    timeline: [],
    journeyStep: 0,
  },
];

// ── Department stats (generated) ──
export function getDeptStats(deptId) {
  const deptCases = cases.filter(c => c.departments.includes(deptId));
  const open = deptCases.filter(c => c.status !== 'resolved').length;
  const newToday = deptCases.filter(c => c.created.startsWith('2026-09-24')).length;
  const urgent = deptCases.filter(c => c.priority === 'high').length;
  const waiting = deptCases.filter(c => c.tasks.some(t => t.dept === deptId && t.status === 'waiting')).length;
  const waitingDept = deptCases.filter(c => c.tasks.some(t => t.dept === deptId && t.status === 'review')).length;
  const resolved = deptCases.filter(c => c.tasks.some(t => t.dept === deptId && t.status === 'resolved')).length;
  return { open, newToday, urgent, waiting, waitingDept, resolved, total: deptCases.length };
}

// ── Generate extra stats for admin dashboard ──
export const adminStats = {
  activeCases: 1284,
  newThisWeek: 187,
  assignedRate: 92,
  crossDeptRate: 76,
  awaitingFollowUp: 143,
  resolvedThisWeek: 312,
  avgResolutionDays: 3.2,
};

// ── Department matrix data ──
export const deptMatrix = [
  { id: 'wellbeing', open: 48, newToday: 9, waiting: 12, overdue: 3, avgRes: '2.1d', crossTeam: 34 },
  { id: 'academic', open: 72, newToday: 14, waiting: 18, overdue: 5, avgRes: '1.8d', crossTeam: 52 },
  { id: 'finance', open: 39, newToday: 7, waiting: 9, overdue: 2, avgRes: '3.4d', crossTeam: 28 },
  { id: 'accommodation', open: 31, newToday: 5, waiting: 6, overdue: 1, avgRes: '2.7d', crossTeam: 19 },
  { id: 'careers', open: 27, newToday: 6, waiting: 4, overdue: 0, avgRes: '1.5d', crossTeam: 12 },
  { id: 'disability', open: 22, newToday: 3, waiting: 8, overdue: 2, avgRes: '4.1d', crossTeam: 16 },
  { id: 'international', open: 18, newToday: 4, waiting: 3, overdue: 1, avgRes: '2.3d', crossTeam: 11 },
  { id: 'success', open: 35, newToday: 8, waiting: 5, overdue: 2, avgRes: '1.9d', crossTeam: 24 },
  { id: 'library', open: 15, newToday: 3, waiting: 2, overdue: 0, avgRes: '0.8d', crossTeam: 9 },
  { id: 'it', open: 42, newToday: 11, waiting: 7, overdue: 4, avgRes: '0.5d', crossTeam: 8 },
  { id: 'conduct', open: 8, newToday: 1, waiting: 3, overdue: 1, avgRes: '5.2d', crossTeam: 6 },
  { id: 'registry', open: 29, newToday: 5, waiting: 9, overdue: 3, avgRes: '1.2d', crossTeam: 14 },
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
