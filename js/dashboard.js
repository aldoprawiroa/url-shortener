/**
 * dashboard.js — Dashboard Page Logic
 * Slice v2.0 | ES Module
 *
 * Handles: Chart.js initialization, nav active state,
 * table action event delegation (copy + delete).
 */

import { showToast, copyToClipboard } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Chart.js: Traffic Overview ─────────────────────────────────────────

  const chartCanvas = document.getElementById('trafficChart');

  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
    gradientFill.addColorStop(1, 'rgba(147, 51, 234, 0.0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label:              'Total Clicks',
          data:               [1200, 1900, 1500, 2200, 3100, 2800, 3800],
          borderColor:        '#9333ea',
          backgroundColor:    gradientFill,
          borderWidth:        3,
          pointBackgroundColor: '#09090b',
          pointBorderColor:   '#3b82f6',
          pointBorderWidth:   2,
          pointRadius:        4,
          pointHoverRadius:   6,
          fill:               true,
          tension:            0.4,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(9, 9, 11, 0.9)',
            titleColor:      '#94a3b8',
            bodyColor:       '#f8fafc',
            borderColor:     'rgba(255, 255, 255, 0.1)',
            borderWidth:     1,
            padding:         12,
            displayColors:   false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y.toLocaleString()} clicks`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              // FIX: drawBorder is removed in Chart.js v3+.
              // Use the border sub-object instead.
              border: { display: false },
            },
            ticks: {
              color: '#94a3b8',
              font: { family: "'Plus Jakarta Sans', sans-serif" },
            },
          },
          x: {
            grid: {
              display: false,
              border: { display: false },
            },
            ticks: {
              color: '#94a3b8',
              font: { family: "'Plus Jakarta Sans', sans-serif" },
            },
          },
        },
        interaction: { intersect: false, mode: 'index' },
      },
    });
  }

  // ─── Nav: Active State (Event Delegation) ───────────────────────────────

  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) {
    navMenu.addEventListener('click', (e) => {
      const item = e.target.closest('.nav-item:not(.logout-btn)');
      if (!item) return;
      e.preventDefault();
      navMenu.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  }

  // ─── Table: Copy & Delete (Event Delegation) ─────────────────────────────

  const tableBody = document.querySelector('.links-table tbody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {

      // Copy button
      const copyBtn = e.target.closest('.icon-btn--copy');
      if (copyBtn) {
        const url = copyBtn.dataset.url;
        if (url) copyToClipboard(url, null);
        return;
      }

      // Delete button
      const deleteBtn = e.target.closest('.icon-btn--delete');
      if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        if (!row) return;

        // Animate row out before removing
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity    = '0';
        row.style.transform  = 'translateX(16px)';

        setTimeout(() => {
          row.remove();
          // Check if table is now empty
          if (!tableBody.querySelector('tr')) {
            tableBody.innerHTML = `
              <tr>
                <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px 16px;">
                  No links yet. <a href="index.html" style="color: var(--accent-blue);">Create your first link →</a>
                </td>
              </tr>`;
          }
        }, 300);

        showToast('Link deleted.', 'info');
      }
    });
  }

});
