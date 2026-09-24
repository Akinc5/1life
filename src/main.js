// ============================================
// OneLife — Main Application
// ============================================

import './styles.css';
import './app.css';
import { state, on, emit, navigateTo, DEPARTMENTS, getDept, cases, getCase, getDeptStats, updateTaskStatus, adminStats, deptMatrix, supportFlow, emergingSignals } from './state.js';
import { icon } from './icons.js';
import { showToast } from './toast.js';

const app = document.getElementById('app');

// ── Router ──
function initRouter() {
  on('navigate', () => render());
  window.addEventListener('hashchange', handleHash);
  handleHash();
}

function handleHash() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  
  if (parts[0] === 'chat') navigateTo('student-chat');
  else if (parts[0] === 'case' && parts[1]) navigateTo('case-detail', { caseId: parts[1] });
  else if (parts[0] === 'dept' && parts[1]) navigateTo('dept-dashboard', { dept: parts[1] });
  else if (parts[0] === 'admin') navigateTo('admin-overview');
  else if (parts[0] === 'case-created') navigateTo('case-created');
  else if (parts[0] === 'support-plan') navigateTo('support-plan');
  else if (parts[0] === 'network') navigateTo('network');
  else if (parts[0] === 'signals') navigateTo('signals');
  else if (parts[0] === 'track') navigateTo('support-plan');
  else if (parts[0] === 'browse') navigateTo('browse-support');
  else navigateTo('student-landing');
}

// ── Render ──
function render() {
  const view = state.currentView;
  app.innerHTML = '';
  
  switch(view) {
    case 'student-landing': renderStudentLanding(); break;
    case 'student-chat': renderStudentChat(); break;
    case 'case-created': renderCaseCreated(); break;
    case 'support-plan': renderSupportPlan(); break;
    case 'browse-support': renderBrowseSupport(); break;
    case 'case-detail': renderCaseDetail(); break;
    case 'dept-dashboard': renderDeptDashboard(); break;
    case 'admin-overview': renderAdminOverview(); break;
    case 'network': renderNetwork(); break;
    case 'signals': renderSignals(); break;
    default: renderStudentLanding();
  }
}

// ── Helper ──
function h(tag, attrs = {}, children = '') {
  const attrStr = Object.entries(attrs).map(([k, v]) => {
    if (k === 'onclick' || k === 'oninput') return '';
    return `${k}="${v}"`;
  }).join(' ');
  return `<${tag} ${attrStr}>${children}</${tag}>`;
}

function statusBadge(status) {
  const map = {
    'new': ['NEW', 'status-new'],
    'in_progress': ['IN PROGRESS', 'status-progress'],
    'waiting': ['WAITING', 'status-waiting'],
    'review': ['PENDING REVIEW', 'status-review'],
    'resolved': ['RESOLVED', 'status-resolved'],
    'urgent': ['URGENT', 'status-urgent'],
  };
  const [label, cls] = map[status] || ['UNKNOWN', 'status-new'];
  return `<span class="status ${cls}">${label}</span>`;
}

function priorityBadge(p) {
  const map = { high: 'badge-danger', medium: 'badge-warning', low: 'badge-neutral' };
  return `<span class="badge ${map[p] || 'badge-neutral'}">${p.charAt(0).toUpperCase() + p.slice(1)}</span>`;
}

function deptBadge(deptId) {
  const d = getDept(deptId);
  if (!d) return '';
  return `<span class="badge badge-primary" style="background:${d.color}15;color:${d.color}">${d.icon} ${d.name}</span>`;
}

function globalNav(mode = 'student') {
  const isStudent = mode === 'student';
  const isDept = mode === 'dept';
  const isAdmin = mode === 'admin';
  
  return `
    <header class="global-header">
      <div class="header-inner">
        <div class="header-left">
          <button class="mobile-menu-btn" id="mobileMenuBtn">${icon('menu')}</button>
          <a href="#/" class="logo-link">
            <div class="logo">
              <div class="logo-icon">
                <svg width="28" height="28" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="var(--primary)"/><path d="M16 8a6 6 0 0 1 6 6c0 4-6 10-6 10S10 18 10 14a6 6 0 0 1 6-6z" fill="white"/><circle cx="16" cy="14" r="2.5" fill="var(--primary)"/></svg>
              </div>
              <span class="logo-text">OneLife</span>
            </div>
          </a>
        </div>
        <nav class="header-nav" id="headerNav">
          ${isStudent ? `
            <a href="#/" class="nav-item ${state.currentView === 'student-landing' ? 'active' : ''}">${icon('home', 18)}<span>Home</span></a>
            <a href="#/chat" class="nav-item ${state.currentView === 'student-chat' ? 'active' : ''}">${icon('chat', 18)}<span>Chat</span></a>
            <a href="#/support-plan" class="nav-item ${state.currentView === 'support-plan' ? 'active' : ''}">${icon('clipboard', 18)}<span>My Support</span></a>
            <a href="#/track" class="nav-item">${icon('mail', 18)}<span>Messages</span></a>
          ` : isDept ? `
            <a href="#/dept/${state.currentDept}" class="nav-item active">${icon('grid', 18)}<span>Dashboard</span></a>
            <a href="#/dept/${state.currentDept}" class="nav-item">${icon('list', 18)}<span>My Queue</span></a>
            <a href="#/admin" class="nav-item">${icon('folder', 18)}<span>All Cases</span></a>
            <a href="#/network" class="nav-item">${icon('share', 18)}<span>Shared Cases</span></a>
            <a href="#/admin" class="nav-item">${icon('barChart', 18)}<span>Analytics</span></a>
          ` : `
            <a href="#/admin" class="nav-item ${state.currentView === 'admin-overview' ? 'active' : ''}">${icon('grid', 18)}<span>Overview</span></a>
            <a href="#/admin" class="nav-item">${icon('folder', 18)}<span>Cases</span></a>
            <a href="#/admin" class="nav-item">${icon('users', 18)}<span>Departments</span></a>
            <a href="#/network" class="nav-item ${state.currentView === 'network' ? 'active' : ''}">${icon('share', 18)}<span>Network</span></a>
            <a href="#/signals" class="nav-item ${state.currentView === 'signals' ? 'active' : ''}">${icon('activity', 18)}<span>Signals</span></a>
            <a href="#/admin" class="nav-item">${icon('barChart', 18)}<span>Analytics</span></a>
          `}
        </nav>
        <div class="header-right">
          <div class="header-mode-switch">
            <a href="#/" class="mode-btn ${isStudent ? 'active' : ''}" data-tooltip="Student View">S</a>
            <a href="#/dept/academic" class="mode-btn ${isDept ? 'active' : ''}" data-tooltip="Department View">D</a>
            <a href="#/admin" class="mode-btn ${isAdmin ? 'active' : ''}" data-tooltip="Admin View">A</a>
          </div>
          <button class="btn-icon header-bell" id="notifBtn">${icon('bell')}<span class="notif-dot"></span></button>
          <div class="avatar" style="background:var(--primary-gradient);font-size:13px;">AM</div>
        </div>
      </div>
    </header>
  `;
}

// ============================================
// STUDENT LANDING PAGE
// ============================================
function renderStudentLanding() {
  app.innerHTML = `
    ${globalNav('student')}
    <main class="landing-page">
      <div class="landing-hero">
        <div class="landing-hero-bg"></div>
        <div class="landing-content animate-in">
          <div class="landing-badge">🤝 Student Support</div>
          <h1 class="landing-title">How can we help?</h1>
          <p class="landing-subtitle">You don't need to know who to contact. Tell us what's going on, and we'll help you find the right support.</p>
          <div class="landing-actions">
            <a href="#/chat" class="btn btn-primary btn-xl landing-cta" id="startChatBtn">
              ${icon('chat', 20)}
              Start a conversation
            </a>
            <div class="landing-secondary">
              <a href="#/browse" class="btn btn-secondary" id="browseSupportBtn">${icon('grid', 18)} Browse support</a>
              <a href="#/support-plan" class="btn btn-secondary" id="trackSupportBtn">${icon('clipboard', 18)} Track my support</a>
            </div>
          </div>
        </div>
        <div class="landing-features animate-in-delay-2">
          <div class="feature-card">
            <div class="feature-icon" style="background:var(--primary-lightest);color:var(--primary)">💬</div>
            <h3>Tell us what's happening</h3>
            <p>Have a conversation with our AI support assistant — no forms, no jargon.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:var(--success-light);color:var(--success-dark)">🔗</div>
            <h3>We connect the dots</h3>
            <p>We find the right teams to help, so you don't have to figure out where to go.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#FDF4FF;color:#A855F7">📋</div>
            <h3>One plan, one view</h3>
            <p>Track all your support in one place. Everyone working together for you.</p>
          </div>
        </div>
      </div>
      <div class="landing-trust animate-in-delay-3">
        <p>🔒 Private and confidential. Your information is only shared with the teams supporting you.</p>
      </div>
    </main>
  `;
  
  // Mobile menu
  setupMobileMenu();
  setupNotifications();
}

// ============================================
// BROWSE SUPPORT
// ============================================
function renderBrowseSupport() {
  app.innerHTML = `
    ${globalNav('student')}
    <main class="page-content">
      <div class="container">
        <div class="page-header animate-in">
          <a href="#/" class="btn btn-ghost btn-sm">${icon('arrowLeft', 16)} Back</a>
          <h1>Browse Support Services</h1>
          <p class="text-secondary">Find the right support for your situation</p>
        </div>
        <div class="dept-grid animate-in-delay-1">
          ${DEPARTMENTS.map(d => `
            <div class="dept-browse-card card card-interactive" onclick="location.hash='#/chat'">
              <div class="dept-browse-icon" style="background:${d.color}15;color:${d.color}">${d.icon}</div>
              <h3>${d.name}</h3>
              <p class="text-sm text-secondary">Get support from our ${d.name.toLowerCase()} team</p>
            </div>
          `).join('')}
        </div>
      </div>
    </main>
  `;
  setupMobileMenu();
}

// ============================================
// STUDENT CHAT
// ============================================
function renderStudentChat() {
  state.chatMessages = [];
  state.chatStep = 0;
  
  app.innerHTML = `
    ${globalNav('student')}
    <main class="chat-page">
      <div class="chat-container">
        <div class="chat-header">
          <div class="chat-header-left">
            <a href="#/" class="btn btn-ghost btn-icon">${icon('arrowLeft')}</a>
            <div class="chat-header-info">
              <div class="chat-header-title">OneLife Support</div>
              <div class="chat-header-status"><span class="online-dot"></span> Available now</div>
            </div>
          </div>
          <div class="chat-header-right">
            <button class="btn btn-secondary btn-sm" id="talkToPersonBtn">${icon('phone', 16)} Talk to a person</button>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-progress" id="chatProgress">
          <div class="progress-steps">
            <div class="progress-step active" id="pStep1"><span class="progress-dot"></span><span>Understanding</span></div>
            <div class="progress-step" id="pStep2"><span class="progress-dot"></span><span>Finding support</span></div>
            <div class="progress-step" id="pStep3"><span class="progress-dot"></span><span>Connecting you</span></div>
          </div>
        </div>
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <input type="text" id="chatInput" placeholder="Type your message..." autocomplete="off" />
            <button class="btn btn-primary btn-icon" id="chatSendBtn">${icon('send', 18)}</button>
          </div>
        </div>
      </div>
    </main>
  `;
  
  setupMobileMenu();
  setupNotifications();
  initChat();
}

// ── Chat Engine ──
const chatFlow = [
  {
    ai: `Hi ${state.studentName} 👋 I'm here to help you find the right support.\n\nWhat's going on?`,
    quickReplies: [
      "I'm struggling with my studies",
      "I'm worried about money",
      "I'm feeling overwhelmed",
      "I have a problem with accommodation",
      "Something else"
    ],
  },
  {
    // After they pick
    ai: null, // dynamic based on choice
    quickReplies: null,
  }
];

// Conversation tree based on user input
const conversationTree = {
  "I'm feeling overwhelmed": [
    { ai: "Thanks for telling me. You don't have to figure this out alone.\n\nWhat's been making things difficult lately?", quickReplies: ["Academic pressure", "Money", "Family or personal issues", "Feeling isolated", "I'm not sure"] },
    { ai: "I understand. How is this affecting your day-to-day life?\n\nFor example, is it affecting your sleep, attendance, or ability to focus?", quickReplies: ["I've been missing classes", "I can't concentrate", "I'm not sleeping well", "All of the above"] },
    { ai: "Thank you for sharing that. One more question — is there anything else going on that you'd like us to know about?\n\nSometimes things are connected, and it helps us get the full picture.", quickReplies: ["I'm also worried about money", "My accommodation is an issue", "That covers it", "I'd rather not say"] },
    { ai: "summary" },
  ],
  "I'm struggling with my studies": [
    { ai: "I hear you. Studies can feel really tough sometimes.\n\nCan you tell me a bit more about what's happening?", quickReplies: ["I'm falling behind", "I have exams coming up", "I don't understand the material", "I'm thinking about dropping out"] },
    { ai: "That sounds difficult. Is anything else going on that might be making this harder?\n\nSometimes other things in life can affect how we manage our studies.", quickReplies: ["I'm also stressed about money", "Personal issues", "Health concerns", "No, just the studies"] },
    { ai: "summary" },
  ],
  "I'm worried about money": [
    { ai: "Money worries can be really stressful. You're right to reach out.\n\nCan you tell me a bit more about your situation?", quickReplies: ["I can't afford my rent", "I'm struggling with living costs", "I have unexpected expenses", "I'm not sure what support is available"] },
    { ai: "Thank you. Is the financial situation affecting other parts of your university life?", quickReplies: ["It's affecting my studies", "I'm worried about accommodation", "It's affecting my wellbeing", "Not really, just the money"] },
    { ai: "summary" },
  ],
  "I have a problem with accommodation": [
    { ai: "I'm sorry to hear that. Accommodation issues can be really unsettling.\n\nWhat kind of problem are you experiencing?", quickReplies: ["I can't afford my accommodation", "Issues with my living situation", "I need to find new accommodation", "Maintenance or safety issue"] },
    { ai: "Is this affecting other areas of your university experience?", quickReplies: ["It's affecting my studies", "It's affecting my wellbeing", "I'm also struggling financially", "Just the accommodation"] },
    { ai: "summary" },
  ],
  "Something else": [
    { ai: "No problem — whatever it is, we're here to help.\n\nCan you tell me a bit about what's on your mind?", quickReplies: null },
    { ai: "Thanks for sharing that. Is there anything else you'd like support with?", quickReplies: ["That's everything", "I also need academic support", "I'm worried about money too"] },
    { ai: "summary" },
  ],
};

let currentBranch = null;
let branchStep = 0;
let collectedSignals = [];

function initChat() {
  const messagesEl = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const talkBtn = document.getElementById('talkToPersonBtn');
  
  // Initial AI message
  setTimeout(() => addAiMessage(chatFlow[0].ai, chatFlow[0].quickReplies), 600);
  
  // Talk to person
  talkBtn.addEventListener('click', () => {
    showToast('Connecting you', 'A support advisor will be with you shortly.', 'info');
  });
  
  // Send
  sendBtn.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  handleUserMessage(msg);
}

function handleUserMessage(text) {
  addUserMessage(text);
  
  // First message — determine branch
  if (!currentBranch) {
    // Find closest branch
    const branches = Object.keys(conversationTree);
    currentBranch = branches.find(b => b === text) || branches.find(b => text.toLowerCase().includes(b.toLowerCase().split(' ')[1])) || "I'm feeling overwhelmed";
    branchStep = 0;
    
    // Collect initial signal
    collectSignal(text);
    
    // Show next AI message
    const next = conversationTree[currentBranch][branchStep];
    setTimeout(() => addAiMessage(next.ai, next.quickReplies), 800 + Math.random() * 500);
    return;
  }
  
  // Collect signals from responses
  collectSignal(text);
  branchStep++;
  
  const branch = conversationTree[currentBranch];
  if (branchStep >= branch.length || branch[branchStep].ai === 'summary') {
    // Show summary
    showSummary();
    return;
  }
  
  const next = branch[branchStep];
  if (next.ai === 'summary') {
    showSummary();
    return;
  }
  
  // Update progress
  if (branchStep >= 1) document.getElementById('pStep2')?.classList.add('active');
  
  setTimeout(() => addAiMessage(next.ai, next.quickReplies), 800 + Math.random() * 500);
}

function collectSignal(text) {
  const t = text.toLowerCase();
  if (t.includes('study') || t.includes('academic') || t.includes('class') || t.includes('exam') || t.includes('concentrate') || t.includes('falling behind')) {
    if (!collectedSignals.includes('Academic pressure')) collectedSignals.push('Academic pressure');
  }
  if (t.includes('money') || t.includes('financial') || t.includes('afford') || t.includes('rent') || t.includes('cost')) {
    if (!collectedSignals.includes('Financial concern')) collectedSignals.push('Financial concern');
  }
  if (t.includes('overwhelm') || t.includes('wellbeing') || t.includes('sleep') || t.includes('stressed') || t.includes('mental') || t.includes('health')) {
    if (!collectedSignals.includes('Wellbeing concern')) collectedSignals.push('Wellbeing concern');
  }
  if (t.includes('accommodation') || t.includes('housing') || t.includes('living')) {
    if (!collectedSignals.includes('Accommodation concern')) collectedSignals.push('Accommodation concern');
  }
  if (t.includes('missing') || t.includes('attendance') || t.includes('missed')) {
    if (!collectedSignals.includes('Attendance concern')) collectedSignals.push('Attendance concern');
  }
  if (t.includes('isolat') || t.includes('lonely') || t.includes('alone')) {
    if (!collectedSignals.includes('Social isolation')) collectedSignals.push('Social isolation');
  }
  if (t.includes('personal') || t.includes('family')) {
    if (!collectedSignals.includes('Personal/family issues')) collectedSignals.push('Personal/family issues');
  }
  // Ensure at least some signals
  if (collectedSignals.length === 0) {
    collectedSignals.push('General support request');
  }
}

function showSummary() {
  document.getElementById('pStep2')?.classList.add('active');
  document.getElementById('pStep3')?.classList.add('active');
  
  if (collectedSignals.length < 2) {
    collectedSignals = ['Academic pressure', 'Financial concern', 'Wellbeing concern', 'Accommodation concern'];
  }
  
  const summaryText = `Thanks. I've got a clearer picture now.\n\nHere's what I've understood:\n\n• ${collectedSignals.join('\n• ')}\n\nDoes that sound right? I'll create a support plan based on this.`;
  
  setTimeout(() => {
    addAiMessage(summaryText, ["Yes, that's right", "I'd like to add something", "Can I change something?"]);
    
    // After user confirms, show case creation
    const confirmHandler = (text) => {
      addUserMessage(text);
      setTimeout(() => {
        addAiMessage("Great. I'm creating your support plan now. Our teams will be in touch soon.\n\nYou'll be able to see your plan and track everything in one place. 💙", null);
        setTimeout(() => {
          location.hash = '#/case-created';
        }, 2000);
      }, 500);
    };
    
    // Override next handler
    window._chatConfirmHandler = confirmHandler;
  }, 800);
}

function addAiMessage(text, quickReplies) {
  const messagesEl = document.getElementById('chatMessages');
  if (!messagesEl) return;
  
  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg ai-msg typing-indicator';
  typing.innerHTML = `
    <div class="msg-avatar"><svg width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="var(--primary)"/><path d="M16 8a6 6 0 0 1 6 6c0 4-6 10-6 10S10 18 10 14a6 6 0 0 1 6-6z" fill="white"/><circle cx="16" cy="14" r="2.5" fill="var(--primary)"/></svg></div>
    <div class="msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
  `;
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  setTimeout(() => {
    typing.remove();
    const msg = document.createElement('div');
    msg.className = 'chat-msg ai-msg animate-in';
    
    const formattedText = text.replace(/\n/g, '<br>');
    
    msg.innerHTML = `
      <div class="msg-avatar"><svg width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="var(--primary)"/><path d="M16 8a6 6 0 0 1 6 6c0 4-6 10-6 10S10 18 10 14a6 6 0 0 1 6-6z" fill="white"/><circle cx="16" cy="14" r="2.5" fill="var(--primary)"/></svg></div>
      <div class="msg-content">
        <div class="msg-bubble">${formattedText}</div>
        ${quickReplies ? `<div class="quick-replies">${quickReplies.map(r => `<button class="quick-reply-btn">${r}</button>`).join('')}</div>` : ''}
      </div>
    `;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // Quick reply handlers
    msg.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Disable all quick replies
        msg.querySelectorAll('.quick-reply-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
        btn.style.opacity = '1';
        btn.style.background = 'var(--primary-lightest)';
        btn.style.borderColor = 'var(--primary)';
        
        if (window._chatConfirmHandler) {
          window._chatConfirmHandler(btn.textContent);
          window._chatConfirmHandler = null;
        } else {
          handleUserMessage(btn.textContent);
        }
      });
    });
  }, 1000 + Math.random() * 500);
}

function addUserMessage(text) {
  const messagesEl = document.getElementById('chatMessages');
  if (!messagesEl) return;
  
  const msg = document.createElement('div');
  msg.className = 'chat-msg user-msg animate-in';
  msg.innerHTML = `
    <div class="msg-content">
      <div class="msg-bubble">${text}</div>
    </div>
  `;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ============================================
// CASE CREATED
// ============================================
function renderCaseCreated() {
  const c = getCase('STU-10482');
  
  app.innerHTML = `
    ${globalNav('student')}
    <main class="case-created-page">
      <div class="container">
        <div class="case-created-hero animate-in">
          <div class="case-created-check">
            <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="var(--success-light)" stroke="var(--success)" stroke-width="2"/><polyline points="15 24 21 30 33 18" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p class="case-created-subtitle">Thanks. I've got a clearer picture now.</p>
          <h1>Your support case has been created</h1>
        </div>
        
        <div class="case-summary-card card animate-in-delay-1">
          <div class="case-summary-header">
            <span class="badge badge-primary">Case ${c.id}</span>
            ${statusBadge(c.status)}
          </div>
          <p class="case-summary-text">${c.summary}</p>
          
          <div class="case-signals">
            <h4>Support signals identified</h4>
            <div class="signal-tags">
              ${c.signals.map(s => `<span class="signal-tag">${s}</span>`).join('')}
            </div>
          </div>
          
          <div class="case-sentiment">
            <div class="sentiment-row">
              <div><span class="text-secondary text-sm">Sentiment:</span> <strong>${c.sentiment.label}</strong></div>
              <div><span class="text-secondary text-sm">Confidence:</span> <strong>${c.sentiment.confidence}</strong></div>
            </div>
            <p class="text-xs text-tertiary" style="margin-top:var(--space-2)">This is a support signal, not a diagnosis. Trained staff will review your case.</p>
          </div>
        </div>
        
        <div class="case-next animate-in-delay-2">
          <h2>Here's what we'll do next</h2>
          <div class="tasks-grid">
            ${c.tasks.map((t, i) => {
              const d = getDept(t.dept);
              return `
                <div class="task-card card animate-in-delay-${i + 2}" style="animation-delay:${0.2 + i * 0.1}s">
                  <div class="task-number">TASK ${String(i + 1).padStart(2, '0')}</div>
                  <h3>${t.title}</h3>
                  <div class="task-meta">
                    <div class="task-owner"><span class="text-secondary">Owner:</span> <span style="color:${d.color}">${d.icon} ${d.name}</span></div>
                    <div class="task-status">${statusBadge(t.status)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="case-created-cta animate-in-delay-4">
          <a href="#/support-plan" class="btn btn-primary btn-xl" id="seeSupportPlanBtn">${icon('clipboard', 20)} See my support plan</a>
          <a href="#/case/STU-10482" class="btn btn-secondary" id="viewCaseDetailBtn">${icon('eye', 18)} View full case</a>
        </div>
      </div>
    </main>
  `;
  
  setupMobileMenu();
  setupNotifications();
  showToast('Case created', 'Case #STU-10482 has been created and routed to 4 departments.', 'success');
}

// ============================================
// STUDENT SUPPORT PLAN
// ============================================
function renderSupportPlan() {
  const c = getCase('STU-10482');
  const completedTasks = c.tasks.filter(t => t.status === 'resolved').length;
  const totalTasks = c.tasks.length + 1; // +1 for follow-up
  
  app.innerHTML = `
    ${globalNav('student')}
    <main class="page-content support-plan-page">
      <div class="container">
        <div class="page-header animate-in">
          <a href="#/" class="btn btn-ghost btn-sm">${icon('arrowLeft', 16)} Back</a>
          <h1>Your support plan</h1>
          <p class="text-secondary">${completedTasks} of ${totalTasks} steps completed</p>
          <div class="progress-bar" style="max-width:400px;margin-top:var(--space-3)">
            <div class="progress-fill" style="width:${(completedTasks / totalTasks) * 100}%"></div>
          </div>
        </div>
        
        <!-- Journey gamification -->
        <div class="journey-tracker card animate-in-delay-1">
          <h3>Your Support Journey</h3>
          <div class="journey-steps">
            <div class="journey-step completed">
              <div class="journey-dot">${icon('check', 14)}</div>
              <div class="journey-label">Tell us what's happening</div>
              <div class="journey-sublabel text-xs text-tertiary">Completed</div>
            </div>
            <div class="journey-line completed"></div>
            <div class="journey-step completed">
              <div class="journey-dot">${icon('check', 14)}</div>
              <div class="journey-label">Find the right support</div>
              <div class="journey-sublabel text-xs text-tertiary">4 teams identified</div>
            </div>
            <div class="journey-line active"></div>
            <div class="journey-step active">
              <div class="journey-dot">●</div>
              <div class="journey-label">Connect with your support team</div>
              <div class="journey-sublabel text-xs text-tertiary">In progress</div>
            </div>
            <div class="journey-line"></div>
            <div class="journey-step">
              <div class="journey-dot">○</div>
              <div class="journey-label">Get things sorted</div>
              <div class="journey-sublabel text-xs text-tertiary">Coming soon</div>
            </div>
          </div>
          <p class="journey-encouragement">You're making progress. One step at a time. 💙</p>
        </div>
        
        <!-- Milestones -->
        <div class="milestones animate-in-delay-2">
          <div class="milestone achieved"><span class="milestone-icon">🌟</span><span>First step taken</span></div>
          <div class="milestone achieved"><span class="milestone-icon">🤝</span><span>You connected with support</span></div>
          <div class="milestone achieved"><span class="milestone-icon">📋</span><span>Support plan created</span></div>
          <div class="milestone"><span class="milestone-icon">✨</span><span>Follow-up completed</span></div>
        </div>
        
        <!-- Support cards -->
        <div class="support-cards animate-in-delay-2">
          ${c.tasks.map(t => {
            const d = getDept(t.dept);
            const isComplete = t.status === 'resolved';
            const isActive = t.status === 'in_progress' || t.status === 'waiting';
            return `
              <div class="support-card card ${isComplete ? 'support-card-complete' : ''}">
                <div class="support-card-status">
                  ${isComplete ? `<span class="sc-check">${icon('checkCircle', 20)}</span>` : isActive ? '<span class="sc-active">●</span>' : '<span class="sc-pending">○</span>'}
                </div>
                <div class="support-card-content">
                  <h3>${t.title}</h3>
                  <p class="text-sm text-secondary">${t.lastUpdate || t.description}</p>
                  <div class="support-card-dept" style="color:${d.color}">${d.icon} ${d.name}</div>
                </div>
                ${statusBadge(t.status)}
              </div>
            `;
          }).join('')}
          <div class="support-card card support-card-upcoming">
            <div class="support-card-status"><span class="sc-pending">○</span></div>
            <div class="support-card-content">
              <h3>Follow-up</h3>
              <p class="text-sm text-secondary">Coming next week</p>
            </div>
            <span class="status status-new">UPCOMING</span>
          </div>
        </div>
        
        <!-- Who's helping -->
        <div class="helpers-section card animate-in-delay-3">
          <h3>Who is helping you?</h3>
          <div class="helpers-list">
            ${c.tasks.map(t => {
              const d = getDept(t.dept);
              return `
                <div class="helper-item">
                  <div class="avatar" style="background:${d.color}">${d.icon}</div>
                  <div>
                    <div class="font-medium">${d.name}</div>
                    <div class="text-xs text-secondary">${t.assignee}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="support-plan-cta animate-in-delay-4">
          <a href="#/chat" class="btn btn-primary" id="askQuestionBtn">${icon('chat', 18)} Ask a question</a>
          <a href="#/case/STU-10482" class="btn btn-secondary" id="viewFullCaseBtn">${icon('eye', 18)} View full case details</a>
        </div>
      </div>
    </main>
  `;
  
  setupMobileMenu();
  setupNotifications();
}

// ============================================
// CASE DETAIL (Shared View)
// ============================================
function renderCaseDetail() {
  const caseId = state.currentCase || 'STU-10482';
  const c = getCase(caseId);
  if (!c) { renderStudentLanding(); return; }
  
  app.innerHTML = `
    ${globalNav('admin')}
    <main class="page-content case-detail-page">
      <div class="container">
        <!-- Header -->
        <div class="case-detail-header animate-in">
          <div class="case-detail-header-top">
            <a href="#/admin" class="btn btn-ghost btn-sm">${icon('arrowLeft', 16)} Back</a>
            <div class="case-detail-actions">
              <button class="btn btn-secondary btn-sm" onclick="document.getElementById('activitySection').scrollIntoView({behavior:'smooth'})">${icon('clock', 16)} Activity</button>
              <button class="btn btn-primary btn-sm" id="updateCaseBtn">${icon('check', 16)} Update</button>
            </div>
          </div>
          <div class="case-detail-title-row">
            <div>
              <div class="flex items-center gap-3">
                <h1>Case #${c.id}</h1>
                ${statusBadge(c.status)}
                ${priorityBadge(c.priority)}
              </div>
              <p class="text-secondary">${c.title}</p>
            </div>
          </div>
          <div class="case-detail-meta">
            <div class="meta-item">
              <span class="text-secondary text-sm">Student</span>
              <div class="flex items-center gap-2">
                <div class="avatar avatar-sm" style="background:var(--primary-gradient)">${c.student.avatar}</div>
                <strong>${c.student.name}</strong>
              </div>
            </div>
            <div class="meta-item">
              <span class="text-secondary text-sm">Created</span>
              <strong>Today, 10:24 AM</strong>
            </div>
            <div class="meta-item">
              <span class="text-secondary text-sm">Priority</span>
              ${priorityBadge(c.priority)}
            </div>
            <div class="meta-item">
              <span class="text-secondary text-sm">Departments</span>
              <strong>${c.departments.length} collaborating</strong>
            </div>
          </div>
        </div>
        
        <div class="case-detail-grid">
          <!-- Left: Journey + Tasks -->
          <div class="case-detail-main">
            <!-- Case Journey -->
            <div class="card case-journey-card animate-in-delay-1">
              <h2>Case Journey</h2>
              <div class="case-journey">
                <div class="journey-node completed"><div class="jn-dot">${icon('check', 14)}</div><span>Student conversation</span></div>
                <div class="journey-connector completed"></div>
                <div class="journey-node completed"><div class="jn-dot">${icon('check', 14)}</div><span>AI understanding</span></div>
                <div class="journey-connector completed"></div>
                <div class="journey-node completed"><div class="jn-dot">${icon('check', 14)}</div><span>Case created</span></div>
                <div class="journey-connector completed"></div>
                <div class="journey-node completed"><div class="jn-dot">${icon('check', 14)}</div><span>Tasks generated</span></div>
                <div class="journey-connector active"></div>
                <div class="journey-dept-group">
                  ${c.tasks.map(t => {
                    const d = getDept(t.dept);
                    return `<div class="journey-dept-node" style="border-color:${d.color}" data-dept="${t.dept}" data-task="${t.id}"><span style="color:${d.color}">${d.icon}</span> ${d.name}</div>`;
                  }).join('')}
                </div>
                <div class="journey-connector"></div>
                <div class="journey-node"><div class="jn-dot">●</div><span>Coordinated response</span></div>
                <div class="journey-connector"></div>
                <div class="journey-node"><div class="jn-dot">○</div><span>Follow-up</span></div>
                <div class="journey-connector"></div>
                <div class="journey-node"><div class="jn-dot">○</div><span>Resolved</span></div>
              </div>
            </div>
            
            <!-- Cross-department visibility -->
            <div class="card cross-dept-card animate-in-delay-2">
              <div class="cross-dept-header">
                <h2>${c.departments.length} departments collaborating on this case</h2>
                <span class="text-sm text-secondary">Last updated 12 minutes ago</span>
              </div>
              <div class="dept-relationship-map" id="deptRelMap">
                <div class="drm-center">
                  <div class="drm-case-node">
                    <div class="drm-student">
                      <div class="avatar avatar-sm" style="background:var(--primary-gradient)">${c.student.avatar}</div>
                      <span>${c.student.name}</span>
                    </div>
                    <div class="drm-case-label">CASE #${c.id}</div>
                  </div>
                </div>
                <div class="drm-departments">
                  ${c.tasks.map(t => {
                    const d = getDept(t.dept);
                    return `
                      <div class="drm-dept-node" style="--dept-color:${d.color}" onclick="location.hash='#/dept/${t.dept}'">
                        <div class="drm-dept-icon">${d.icon}</div>
                        <div class="drm-dept-name">${d.name}</div>
                        <div class="drm-dept-status">${statusBadge(t.status)}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
            
            <!-- Tasks -->
            <div class="card tasks-detail-card animate-in-delay-3">
              <h2>Tasks</h2>
              <div class="tasks-detail-list" id="tasksDetailList">
                ${c.tasks.map(t => {
                  const d = getDept(t.dept);
                  return `
                    <div class="task-detail-item" id="task-${t.id}">
                      <div class="task-detail-header">
                        <div class="task-detail-dept" style="color:${d.color}">${d.icon} ${d.name}</div>
                        ${statusBadge(t.status)}
                      </div>
                      <h3>${t.title}</h3>
                      <p class="text-sm text-secondary">${t.description}</p>
                      <div class="task-detail-meta">
                        <span class="text-sm"><strong>Assigned to:</strong> ${t.assignee}</span>
                        ${t.lastUpdate ? `<span class="text-sm text-secondary">${icon('clock', 14)} ${t.lastUpdate}</span>` : ''}
                      </div>
                      <div class="task-detail-actions">
                        <select class="task-status-select" data-case="${c.id}" data-task="${t.id}">
                          <option value="new" ${t.status === 'new' ? 'selected' : ''}>New</option>
                          <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                          <option value="waiting" ${t.status === 'waiting' ? 'selected' : ''}>Waiting</option>
                          <option value="review" ${t.status === 'review' ? 'selected' : ''}>Pending Review</option>
                          <option value="resolved" ${t.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
          
          <!-- Right sidebar -->
          <div class="case-detail-sidebar">
            <!-- Summary -->
            <div class="card animate-in-delay-1">
              <h3>Summary</h3>
              <p class="text-sm">${c.summary}</p>
              <div class="case-signals" style="margin-top:var(--space-4)">
                <h4 class="text-sm text-secondary">Support Signals</h4>
                <div class="signal-tags">${c.signals.map(s => `<span class="signal-tag">${s}</span>`).join('')}</div>
              </div>
              <div style="margin-top:var(--space-4)">
                <h4 class="text-sm text-secondary">Sentiment</h4>
                <p class="font-medium">${c.sentiment.label}</p>
                <p class="text-xs text-tertiary">Confidence: ${c.sentiment.confidence}</p>
                <p class="text-xs text-tertiary" style="margin-top:var(--space-2)">Support signal — not a diagnosis</p>
              </div>
            </div>
            
            <!-- Activity Timeline -->
            <div class="card animate-in-delay-2" id="activitySection">
              <h3>Activity</h3>
              <div class="activity-timeline">
                ${c.timeline.map(ev => {
                  const typeIcon = { ai: '🤖', system: '⚡', assign: '📋', update: '✏️', student: '👤' };
                  return `
                    <div class="timeline-event" onclick="this.classList.toggle('expanded')">
                      <div class="timeline-dot">${typeIcon[ev.type] || '●'}</div>
                      <div class="timeline-content">
                        <div class="timeline-time">${ev.time}</div>
                        <div class="timeline-event-text">${ev.event}</div>
                        <div class="timeline-detail">${ev.detail}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <!-- Student info -->
            <div class="card animate-in-delay-3">
              <h3>Student</h3>
              <div class="student-info">
                <div class="avatar avatar-lg" style="background:var(--primary-gradient)">${c.student.avatar}</div>
                <div>
                  <div class="font-semibold">${c.student.name}</div>
                  <div class="text-sm text-secondary">${c.student.course}</div>
                  <div class="text-sm text-secondary">Year ${c.student.year}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  
  // Task status change handlers
  document.querySelectorAll('.task-status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const cId = e.target.dataset.case;
      const tId = e.target.dataset.task;
      updateTaskStatus(cId, tId, e.target.value);
      showToast('Task updated', `Status changed to ${e.target.value.replace('_', ' ')}`, 'success');
      renderCaseDetail(); // re-render
    });
  });
  
  // Dept node click in journey
  document.querySelectorAll('.journey-dept-node').forEach(node => {
    node.addEventListener('click', () => {
      const taskId = node.dataset.task;
      const el = document.getElementById(`task-${taskId}`);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('highlight'); setTimeout(() => el.classList.remove('highlight'), 2000); }
    });
  });
  
  setupMobileMenu();
  setupNotifications();
  
  document.getElementById('updateCaseBtn')?.addEventListener('click', () => {
    showToast('Case updated', 'All changes have been saved.', 'success');
  });
}

// ============================================
// DEPARTMENT DASHBOARD
// ============================================
function renderDeptDashboard() {
  const deptId = state.currentDept || 'academic';
  const dept = getDept(deptId);
  if (!dept) { renderStudentLanding(); return; }
  
  const stats = getDeptStats(deptId);
  const deptCases = cases.filter(c => c.departments.includes(deptId));
  
  app.innerHTML = `
    ${globalNav('dept')}
    <main class="page-content dept-page">
      <div class="container">
        <!-- Dept selector -->
        <div class="dept-selector animate-in">
          <div class="dept-selector-current">
            <span style="font-size:1.5em">${dept.icon}</span>
            <div>
              <h1>${dept.name}</h1>
              <p class="text-secondary">Department Dashboard</p>
            </div>
          </div>
          <div class="dept-selector-pills">
            ${DEPARTMENTS.map(d => `
              <a href="#/dept/${d.id}" class="dept-pill ${d.id === deptId ? 'active' : ''}" style="${d.id === deptId ? `background:${d.color}15;color:${d.color};border-color:${d.color}40` : ''}">${d.icon} <span class="hide-mobile">${d.name.split(' ')[0]}</span></a>
            `).join('')}
          </div>
        </div>
        
        <!-- Metrics -->
        <div class="metrics-grid animate-in-delay-1">
          <div class="metric-card"><div class="metric-value">${stats.open}</div><div class="metric-label">Open cases</div></div>
          <div class="metric-card"><div class="metric-value">${stats.newToday}</div><div class="metric-label">New today</div></div>
          <div class="metric-card"><div class="metric-value">${stats.urgent}</div><div class="metric-label">Urgent</div><div class="metric-change ${stats.urgent > 0 ? 'up' : ''}">${stats.urgent > 0 ? '⚠️ Needs attention' : '✅ None'}</div></div>
          <div class="metric-card"><div class="metric-value">${stats.waiting}</div><div class="metric-label">Waiting for student</div></div>
          <div class="metric-card"><div class="metric-value">${stats.waitingDept}</div><div class="metric-label">Waiting for dept</div></div>
          <div class="metric-card"><div class="metric-value">${stats.resolved}</div><div class="metric-label">Resolved</div></div>
        </div>
        
        <!-- Search & Filter -->
        <div class="queue-controls animate-in-delay-2">
          <h2>My Queue</h2>
          <div class="queue-toolbar">
            <div class="search-input">
              ${icon('search')}
              <input type="text" placeholder="Search cases..." id="deptSearchInput" />
            </div>
            <div class="filter-pills">
              <button class="filter-pill active" data-filter="all">All</button>
              <button class="filter-pill" data-filter="new">New</button>
              <button class="filter-pill" data-filter="in_progress">In Progress</button>
              <button class="filter-pill" data-filter="waiting">Waiting</button>
              <button class="filter-pill" data-filter="high">High Priority</button>
            </div>
          </div>
        </div>
        
        <!-- Queue -->
        <div class="case-queue animate-in-delay-3" id="caseQueue">
          ${deptCases.map(c => {
            const task = c.tasks.find(t => t.dept === deptId);
            const sharedDepts = c.departments.filter(d => d !== deptId);
            return `
              <div class="case-queue-card card card-interactive" onclick="location.hash='#/case/${c.id}'" data-status="${task?.status || c.status}" data-priority="${c.priority}">
                <div class="cq-header">
                  <span class="cq-id">#${c.id}</span>
                  ${statusBadge(task?.status || c.status)}
                  ${priorityBadge(c.priority)}
                </div>
                <h3 class="cq-title">${task?.title || c.title}</h3>
                <p class="text-sm text-secondary">${c.student.name} · ${c.student.course}</p>
                ${sharedDepts.length > 0 ? `
                  <div class="cq-shared">
                    <span class="text-xs text-secondary">Shared with:</span>
                    ${sharedDepts.map(d => {
                      const sd = getDept(d);
                      return `<span class="badge badge-neutral text-xs">${sd.icon} ${sd.name.split(' ').slice(0, 2).join(' ')}</span>`;
                    }).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
          ${deptCases.length === 0 ? '<div class="empty-state"><p class="text-secondary">No cases in this queue.</p></div>' : ''}
        </div>
      </div>
    </main>
  `;
  
  // Filter functionality
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      document.querySelectorAll('.case-queue-card').forEach(card => {
        if (filter === 'all') { card.style.display = ''; return; }
        if (filter === 'high') { card.style.display = card.dataset.priority === 'high' ? '' : 'none'; return; }
        card.style.display = card.dataset.status === filter ? '' : 'none';
      });
    });
  });
  
  // Search
  document.getElementById('deptSearchInput')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.case-queue-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
  
  setupMobileMenu();
  setupNotifications();
}

// ============================================
// ADMIN OVERVIEW
// ============================================
function renderAdminOverview() {
  app.innerHTML = `
    ${globalNav('admin')}
    <main class="page-content admin-page">
      <div class="container">
        <div class="admin-header animate-in">
          <div>
            <h1>University Support Overview</h1>
            <p class="text-secondary">One view of how student support is moving across the university.</p>
          </div>
          <div class="admin-header-actions">
            <a href="#/network" class="btn btn-secondary">${icon('share', 18)} Network View</a>
            <a href="#/signals" class="btn btn-secondary">${icon('activity', 18)} Signals</a>
          </div>
        </div>
        
        <!-- Top metrics -->
        <div class="admin-metrics animate-in-delay-1">
          <div class="metric-card" onclick="this.classList.toggle('expanded')">
            <div class="metric-value">${adminStats.activeCases.toLocaleString()}</div>
            <div class="metric-label">Active cases</div>
            <div class="metric-change up">${icon('trendingUp', 14)} 8% from last week</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${adminStats.newThisWeek}</div>
            <div class="metric-label">New this week</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${adminStats.assignedRate}%</div>
            <div class="metric-label">Cases with assigned owner</div>
            <div class="progress-bar" style="margin-top:var(--space-2)"><div class="progress-fill" style="width:${adminStats.assignedRate}%"></div></div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${adminStats.crossDeptRate}%</div>
            <div class="metric-label">Cross-department coordination</div>
            <div class="progress-bar" style="margin-top:var(--space-2)"><div class="progress-fill" style="width:${adminStats.crossDeptRate}%;background:linear-gradient(90deg,#8B5CF6,#EC4899)"></div></div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${adminStats.awaitingFollowUp}</div>
            <div class="metric-label">Awaiting follow-up</div>
            <div class="metric-change down">⚠️ Needs attention</div>
          </div>
        </div>
        
        <!-- Live Support Flow -->
        <div class="card support-flow-card animate-in-delay-2">
          <h2>Live Support Flow</h2>
          <p class="text-sm text-secondary" style="margin-bottom:var(--space-6)">Cases moving through the support pipeline</p>
          <div class="support-flow" id="supportFlow">
            ${supportFlow.map((s, i) => `
              <div class="flow-stage" onclick="this.classList.toggle('expanded')">
                <div class="flow-bar" style="height:${Math.max(40, (s.count / 412) * 180)}px;background:${s.color}"></div>
                <div class="flow-count">${s.count}</div>
                <div class="flow-label">${s.stage}</div>
              </div>
              ${i < supportFlow.length - 1 ? '<div class="flow-arrow">→</div>' : ''}
            `).join('')}
          </div>
        </div>
        
        <!-- Department Matrix -->
        <div class="card dept-matrix-card animate-in-delay-3">
          <h2>Department Matrix</h2>
          <p class="text-sm text-secondary" style="margin-bottom:var(--space-4)">All 12 departments at a glance</p>
          <div class="dept-matrix-table">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Open</th>
                  <th>New Today</th>
                  <th>Waiting</th>
                  <th>Overdue</th>
                  <th>Avg. Resolution</th>
                  <th>Cross-team</th>
                </tr>
              </thead>
              <tbody>
                ${deptMatrix.map(row => {
                  const d = getDept(row.id);
                  return `
                    <tr onclick="location.hash='#/dept/${row.id}'" class="matrix-row">
                      <td class="dept-cell"><span>${d.icon}</span> ${d.name}</td>
                      <td><strong>${row.open}</strong></td>
                      <td>${row.newToday}</td>
                      <td>${row.waiting}</td>
                      <td class="${row.overdue > 0 ? 'overdue-cell' : ''}">${row.overdue}</td>
                      <td>${row.avgRes}</td>
                      <td>${row.crossTeam}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Recent Cases -->
        <div class="card recent-cases-card animate-in-delay-4">
          <div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">
            <h2>Recent Cases</h2>
            <div class="search-input" style="max-width:260px">
              ${icon('search')}
              <input type="text" placeholder="Search cases..." id="adminSearchInput" />
            </div>
          </div>
          <div class="recent-cases-list" id="recentCasesList">
            ${cases.slice(0, 6).map(c => `
              <div class="recent-case-row" onclick="location.hash='#/case/${c.id}'">
                <div class="rc-left">
                  <div class="avatar avatar-sm" style="background:var(--primary-gradient)">${c.student.avatar}</div>
                  <div>
                    <div class="font-medium">#${c.id} · ${c.student.name}</div>
                    <div class="text-sm text-secondary">${c.title}</div>
                  </div>
                </div>
                <div class="rc-right">
                  <div class="rc-depts">${c.departments.map(d => getDept(d).icon).join(' ')}</div>
                  ${statusBadge(c.status)}
                  ${priorityBadge(c.priority)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </main>
  `;
  
  // Admin search
  document.getElementById('adminSearchInput')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.recent-case-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
  
  setupMobileMenu();
  setupNotifications();
}

// ============================================
// CASE NETWORK VISUALIZATION
// ============================================
function renderNetwork() {
  app.innerHTML = `
    ${globalNav('admin')}
    <main class="page-content network-page">
      <div class="container">
        <div class="network-header animate-in">
          <div>
            <h1>Case Network</h1>
            <p class="text-secondary">Visualizing how support is connected across departments</p>
          </div>
        </div>
        <div class="network-controls animate-in-delay-1">
          <div class="filter-pills">
            <button class="filter-pill active" data-nfilter="all">All cases</button>
            <button class="filter-pill" data-nfilter="high">High priority</button>
            <button class="filter-pill" data-nfilter="cross">Cross-department</button>
            <button class="filter-pill" data-nfilter="waiting">Waiting</button>
            <button class="filter-pill" data-nfilter="new">New today</button>
          </div>
        </div>
        <div class="network-canvas-wrapper card animate-in-delay-2">
          <canvas id="networkCanvas"></canvas>
          <div class="network-tooltip" id="networkTooltip"></div>
        </div>
        <div class="network-legend animate-in-delay-3">
          <div class="legend-item"><div class="legend-dot" style="background:var(--primary)"></div> Case</div>
          ${DEPARTMENTS.slice(0, 6).map(d => `<div class="legend-item"><div class="legend-dot" style="background:${d.color}"></div> ${d.name.split(' ')[0]}</div>`).join('')}
        </div>
      </div>
    </main>
  `;
  
  setupMobileMenu();
  setupNotifications();
  
  // Draw network
  setTimeout(() => drawNetwork(), 100);
  
  // Filter
  document.querySelectorAll('[data-nfilter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-nfilter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawNetwork(btn.dataset.nfilter);
    });
  });
}

function drawNetwork(filter = 'all') {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrapper = canvas.parentElement;
  
  canvas.width = wrapper.clientWidth;
  canvas.height = 500;
  
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  
  ctx.clearRect(0, 0, w, h);
  
  // Filter cases
  let filteredCases = [...cases];
  if (filter === 'high') filteredCases = cases.filter(c => c.priority === 'high');
  else if (filter === 'cross') filteredCases = cases.filter(c => c.departments.length > 1);
  else if (filter === 'waiting') filteredCases = cases.filter(c => c.status === 'waiting');
  else if (filter === 'new') filteredCases = cases.filter(c => c.status === 'new');
  
  // Position departments in a circle
  const deptPositions = {};
  const radius = Math.min(w, h) * 0.38;
  DEPARTMENTS.forEach((d, i) => {
    const angle = (i / DEPARTMENTS.length) * Math.PI * 2 - Math.PI / 2;
    deptPositions[d.id] = {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      dept: d,
    };
  });
  
  // Position cases near center
  const casePositions = {};
  const caseRadius = radius * 0.4;
  filteredCases.forEach((c, i) => {
    const angle = (i / filteredCases.length) * Math.PI * 2 - Math.PI / 2;
    const r = caseRadius * (0.5 + Math.random() * 0.5);
    casePositions[c.id] = {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      case: c,
    };
  });
  
  // Draw connections
  filteredCases.forEach(c => {
    const cp = casePositions[c.id];
    c.departments.forEach(dId => {
      const dp = deptPositions[dId];
      if (!dp) return;
      ctx.beginPath();
      ctx.moveTo(cp.x, cp.y);
      ctx.lineTo(dp.x, dp.y);
      ctx.strokeStyle = getDept(dId).color + '30';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  });
  
  // Draw department nodes
  Object.values(deptPositions).forEach(dp => {
    ctx.beginPath();
    ctx.arc(dp.x, dp.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = dp.dept.color + '20';
    ctx.fill();
    ctx.strokeStyle = dp.dept.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dp.dept.icon, dp.x, dp.y);
    
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(dp.dept.name.split(' ')[0], dp.x, dp.y + 32);
  });
  
  // Draw case nodes
  Object.values(casePositions).forEach(cp => {
    const priorityColor = cp.case.priority === 'high' ? '#EF4444' : cp.case.priority === 'medium' ? '#F59E0B' : '#4F46E5';
    
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = priorityColor;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 11, 0, Math.PI * 2);
    ctx.strokeStyle = priorityColor + '40';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Click handling
  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Check case nodes
    for (const [id, cp] of Object.entries(casePositions)) {
      const dist = Math.sqrt((mx - cp.x) ** 2 + (my - cp.y) ** 2);
      if (dist < 12) {
        location.hash = `#/case/${id}`;
        return;
      }
    }
    
    // Check dept nodes
    for (const [id, dp] of Object.entries(deptPositions)) {
      const dist = Math.sqrt((mx - dp.x) ** 2 + (my - dp.y) ** 2);
      if (dist < 25) {
        location.hash = `#/dept/${id}`;
        return;
      }
    }
  };
  
  // Hover tooltip
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const tooltip = document.getElementById('networkTooltip');
    
    for (const [id, cp] of Object.entries(casePositions)) {
      const dist = Math.sqrt((mx - cp.x) ** 2 + (my - cp.y) ** 2);
      if (dist < 12) {
        tooltip.innerHTML = `<strong>#${id}</strong><br>${cp.case.student.name}<br>${cp.case.title}`;
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        canvas.style.cursor = 'pointer';
        return;
      }
    }
    
    for (const [id, dp] of Object.entries(deptPositions)) {
      const dist = Math.sqrt((mx - dp.x) ** 2 + (my - dp.y) ** 2);
      if (dist < 25) {
        tooltip.innerHTML = `<strong>${dp.dept.name}</strong><br>Click to view dashboard`;
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        canvas.style.cursor = 'pointer';
        return;
      }
    }
    
    tooltip.style.display = 'none';
    canvas.style.cursor = 'default';
  };
}

// ============================================
// EMERGING SIGNALS
// ============================================
function renderSignals() {
  app.innerHTML = `
    ${globalNav('admin')}
    <main class="page-content signals-page">
      <div class="container">
        <div class="page-header animate-in">
          <a href="#/admin" class="btn btn-ghost btn-sm">${icon('arrowLeft', 16)} Back to Overview</a>
          <h1>Emerging Support Signals</h1>
          <p class="text-secondary">Signals for trained staff to review — not predictions or diagnoses</p>
        </div>
        
        <div class="signals-disclaimer card animate-in-delay-1" style="border-left:3px solid var(--warning);background:var(--warning-light)">
          <p class="text-sm"><strong>⚠️ Important:</strong> These are signals for trained staff to review. They are not predictions, diagnoses, or automated decisions. Human review is always required.</p>
        </div>
        
        <div class="signals-grid animate-in-delay-2">
          ${emergingSignals.map(s => `
            <div class="signal-card card">
              <div class="signal-card-header">
                <span class="badge ${s.severity === 'elevated' ? 'badge-danger' : s.severity === 'moderate' ? 'badge-warning' : 'badge-info'} badge-dot">${s.type}</span>
              </div>
              <p class="signal-text">"${s.signal}"</p>
              <div class="signal-action">
                <span class="text-sm text-secondary"><strong>Suggested action:</strong> ${s.action}</span>
              </div>
              ${s.caseId ? `<a href="#/case/${s.caseId}" class="btn btn-secondary btn-sm" style="margin-top:var(--space-3)">${icon('eye', 16)} Review case</a>` : '<span class="text-xs text-tertiary" style="margin-top:var(--space-3)">No specific case linked</span>'}
            </div>
          `).join('')}
        </div>
      </div>
    </main>
  `;
  
  setupMobileMenu();
  setupNotifications();
}

// ============================================
// UTILITIES
// ============================================
function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('headerNav');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('mobile-open'));
  }
}

function setupNotifications() {
  const btn = document.getElementById('notifBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      showToast('Notifications', '3 new updates on your cases', 'info');
    });
  }
}

// ── Window resize handler for network ──
window.addEventListener('resize', () => {
  if (state.currentView === 'network') {
    drawNetwork();
  }
});

// ── Initialize ──
initRouter();
