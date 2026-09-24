// ============================================
// OneLife — Toast Notifications
// ============================================

import { icon } from './icons.js';

let toastId = 0;

export function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  const id = `toast-${++toastId}`;
  
  const iconMap = {
    success: `<span style="color:var(--success)">${icon('checkCircle')}</span>`,
    warning: `<span style="color:var(--warning)">${icon('alertCircle')}</span>`,
    error: `<span style="color:var(--danger)">${icon('alertCircle')}</span>`,
    info: `<span style="color:var(--primary)">${icon('bell')}</span>`,
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = id;
  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">${icon('x', 14)}</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
