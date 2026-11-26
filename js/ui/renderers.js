/**
 * renderers.js — Clean HTML Template Renderers for Every View
 * Escapes all user-supplied text before rendering into the DOM.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});
  const Progress = SkillTrack.Progress;

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusBadge(status) {
    if (status === 'completed') return '<span class="badge badge-success">Completed</span>';
    if (status === 'in_progress') return '<span class="badge badge-terracotta">In Progress</span>';
    return '<span class="badge badge-neutral">Not Started</span>';
  }

  /**
   * 1. DASHBOARD VIEW
   */
  function renderDashboard(ctx) {
    const { state, stats, modules, books, user } = ctx;
    const activeMod = modules.find((m) => m.week === stats.activeWeek) || modules[0];
    const activeWeekStats = stats.weekStats.find((w) => w.week === activeMod.week);

    // SVG Progress Ring Geometry (r = 58 -> C = 2 * pi * 58 = 364.42)
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (stats.overallPercentage / 100) * circumference;

    const featuredBooks = books.filter((b) => b.isFree).slice(0, 2).concat(
      books.filter((b) => !b.isFree).slice(0, 2)
    );

    const journeyHtml = stats.weekStats
      .map((w) => {
        const mod = modules.find((m) => m.week === w.week);
        const cls = [
          'journey-node',
          w.isCompleted ? 'is-completed' : '',
          w.week === stats.activeWeek ? 'is-current' : ''
        ]
          .filter(Boolean)
          .join(' ');
        return `
          <button type="button" class="${cls}" data-open-week="${w.week}">
            <div class="journey-node-top">
              <span>Week ${w.week}</span>
              <span>${w.isCompleted ? '✓ Done' : w.week === stats.activeWeek ? '● Active' : `${w.percentage}%`}</span>
            </div>
            <div class="journey-node-title">${escapeHtml(mod.title)}</div>
            <div class="progress-bar-track is-sm">
              <div class="progress-bar-fill ${w.isCompleted ? 'is-complete' : ''}" style="width: ${w.percentage}%"></div>
            </div>
            <div class="journey-node-meta">
              <span>${w.completedCount}/${w.totalTasks} tasks</span>
              <span>${escapeHtml(mod.estimatedHours)}</span>
            </div>
          </button>
        `;
      })
      .join('');

    const upcomingHtml = stats.upcomingTasks.length
      ? `<ul class="checklist">
          ${stats.upcomingTasks
            .map(
              (item) => `
              <li class="check-item">
                <input
                  type="checkbox"
                  id="dash-task-${escapeHtml(item.taskId)}"
                  data-toggle-task="${escapeHtml(item.taskId)}"
                  data-task-week="${item.week}"
                />
                <div class="check-item-body">
                  <label class="check-item-label" for="dash-task-${escapeHtml(item.taskId)}">
                    ${escapeHtml(item.label)}
                  </label>
                  <div class="check-item-sub">
                    Week ${item.week}: ${escapeHtml(item.weekTitle)} · Est. ${escapeHtml(item.duration)}
                  </div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" data-open-week="${item.week}">Open</button>
              </li>
            `
            )
            .join('')}
        </ul>`
      : `<div class="empty-state">
          <strong>Wonderful work!</strong> You have completed all tasks in your active modules. Visit Week 12 to review your portfolio and export your work.
        </div>`;

    const weeklyIndicatorsHtml = stats.weekStats
      .map(
        (w) => `
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.35rem 0.75rem; align-items: center; padding: 0.45rem 0; border-bottom: 1px solid var(--border-subtle);">
          <div style="min-width: 0;">
            <button type="button" data-open-week="${w.week}" style="background: none; border: none; padding: 0; font-weight: 600; font-size: 0.85rem; color: var(--text-primary); text-align: left;">
              W${w.week}: ${escapeHtml(w.title)}
            </button>
            <div class="progress-bar-track is-sm" style="margin-top: 0.3rem;">
              <div class="progress-bar-fill ${w.isCompleted ? 'is-complete' : ''}" style="width: ${w.percentage}%"></div>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--muted-blue-dark);">${w.percentage}%</span>
          </div>
        </div>
      `
      )
      .join('');

    return `
      <!-- 1. Welcome Message & 4. Overall Learning Progress -->
      <div class="hero-banner">
        <div style="flex: 1; min-width: 0;">
          <div class="hero-eyebrow">
            <span>12-Week Psychology Foundation</span>
            <span>·</span>
            <span>${user ? 'Cloud Synced' : 'Local Mode'}</span>
          </div>
          <h2 class="hero-title">Welcome back, ${escapeHtml(state.profile.displayName)}</h2>
          <p class="hero-desc">
            ${escapeHtml(state.profile.learningGoal)}
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" data-open-week="${activeMod.week}">
              Continue Week ${activeMod.week}: ${escapeHtml(activeMod.title)}
            </button>
            <button type="button" class="btn btn-secondary" data-nav-jump="curriculum">
              View All 12 Weeks
            </button>
            <button type="button" class="btn btn-terracotta" data-nav-jump="journal">
              Write Reflection
            </button>
          </div>
        </div>

        <div class="progress-ring-wrap" aria-label="Overall progress ${stats.overallPercentage}%">
          <svg class="progress-ring-svg" viewBox="0 0 144 144">
            <circle class="progress-ring-track" cx="72" cy="72" r="${radius}"></circle>
            <circle
              class="progress-ring-fill"
              cx="72"
              cy="72"
              r="${radius}"
              stroke-dasharray="${circumference.toFixed(2)}"
              stroke-dashoffset="${offset.toFixed(2)}"
            ></circle>
          </svg>
          <div class="progress-ring-center">
            <div class="progress-ring-pct">${stats.overallPercentage}%</div>
            <div class="progress-ring-label">Overall</div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Row: 3. Total Tasks, 4. Overall %, 5. Current Week, 9. Last Updated -->
      <div class="grid-4" style="margin-bottom: 1.35rem;">
        <div class="card stat-card">
          <div class="stat-label">Total Tasks Completed</div>
          <div class="stat-value">${stats.completedTasks} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">/ ${stats.totalTasks}</span></div>
          <div class="stat-foot">${stats.completedWeeks} of 12 modules completed</div>
        </div>

        <div class="card stat-card">
          <div class="stat-label">Overall Learning Progress</div>
          <div class="stat-value" style="color: var(--muted-blue);">${stats.overallPercentage}%</div>
          <div class="progress-bar-track is-sm" style="margin-top: 0.55rem;">
            <div class="progress-bar-fill" style="width: ${stats.overallPercentage}%"></div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-label">Current Learning Week</div>
          <div class="stat-value">Week ${activeMod.week}</div>
          <div class="stat-foot">${escapeHtml(activeMod.title)} (${activeWeekStats ? activeWeekStats.percentage : 0}%)</div>
        </div>

        <div class="card stat-card">
          <div class="stat-label">Last Updated</div>
          <div class="stat-value" style="font-size: 1.02rem; line-height: 1.35;">${escapeHtml(Progress.formatTimestamp(state.lastUpdated))}</div>
          <div class="stat-foot">${state.reflections.length} reflections · ${state.evidence.length} evidence links</div>
        </div>
      </div>

      <!-- 2. My 12-Week Learning Journey -->
      <div class="card" style="margin-bottom: 1.35rem;">
        <div class="card-header">
          <div>
            <h3 class="card-title">My 12-Week Learning Journey</h3>
            <p class="card-subtitle">Click any week to open its study guide, checklist, exercises, and reflection prompts (4–6 hrs/week).</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label for="dashboard-active-week-select" style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Active Week:</label>
            <select id="dashboard-active-week-select" class="select" style="min-width: 130px; padding: 0.35rem 0.65rem; font-size: 0.84rem;">
              ${modules
                .map(
                  (m) =>
                    `<option value="${m.week}" ${m.week === stats.activeWeek ? 'selected' : ''}>Week ${m.week}: ${escapeHtml(m.title)}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>
        <div class="journey-grid">
          ${journeyHtml}
        </div>
      </div>

      <!-- Lower Split: 6. Upcoming Activities + 8. Quick Resources | 7. Weekly Progress Indicators -->
      <div class="dashboard-split">
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- 6. Upcoming Learning Activities -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Upcoming Learning Activities</h3>
                <p class="card-subtitle">Check off tasks directly as you finish each study session.</p>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" data-open-week="${activeMod.week}">Week ${activeMod.week} Guide</button>
            </div>
            ${upcomingHtml}
          </div>

          <!-- 8. Quick Access to Learning Resources -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Quick Access to Learning Resources</h3>
                <p class="card-subtitle">Free open textbooks are prioritised so you can start immediately.</p>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" data-nav-jump="library">Full Library</button>
            </div>
            <div class="grid-2">
              ${featuredBooks
                .map(
                  (book) => `
                  <div class="topic-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 0.6rem;">
                    <div>
                      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.35rem;">
                        <span class="badge ${book.isFree ? 'badge-sage' : 'badge-neutral'}">${book.isFree ? 'Free Resource' : escapeHtml(book.category)}</span>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">Weeks ${escapeHtml(book.weeks.join(', '))}</span>
                      </div>
                      <strong>${escapeHtml(book.title)}</strong>
                      <p style="font-size: 0.8rem;">${escapeHtml(book.author)}</p>
                    </div>
                    <a href="${escapeHtml(book.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="align-self: flex-start;">
                      Open Official Link ↗
                    </a>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- 7. Weekly Progress Indicators -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Weekly Progress Indicators</h3>
              <p class="card-subtitle">Live completion across all 12 modules.</p>
            </div>
          </div>
          <div>
            ${weeklyIndicatorsHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 2. 12-WEEK CURRICULUM OVERVIEW VIEW
   */
  function renderCurriculum(ctx) {
    const { modules, stats, filters } = ctx;
    const query = (filters.curriculumQuery || '').trim().toLowerCase();
    const statusFilter = filters.curriculumStatus || 'all';

    const filtered = modules.filter((mod) => {
      const wStat = stats.weekStats.find((w) => w.week === mod.week);
      if (statusFilter !== 'all' && wStat && wStat.status !== statusFilter) return false;
      if (!query) return true;
      const haystack = [
        `week ${mod.week}`,
        mod.title,
        mod.pillar,
        mod.summary,
        ...mod.topics.map((t) => `${t.title} ${t.detail}`)
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

    const cardsHtml = filtered.length
      ? `<div class="grid-3">
          ${filtered
            .map((mod) => {
              const w = stats.weekStats.find((item) => item.week === mod.week);
              return `
                <article class="card card-interactive" style="display: flex; flex-direction: column; gap: 0.8rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                    <span class="badge badge-blue">Week ${mod.week} · ${escapeHtml(mod.estimatedHours)}</span>
                    ${statusBadge(w.status)}
                  </div>
                  <div>
                    <h3 class="card-title" style="font-size: 1.08rem;">${escapeHtml(mod.title)}</h3>
                    <p style="font-size: 0.85rem; margin: 0.35rem 0 0;">${escapeHtml(mod.summary)}</p>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary);">
                    <strong>Topics:</strong> ${escapeHtml(mod.topics.map((t) => t.title).join(' · '))}
                  </div>
                  <div style="margin-top: auto;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.3rem;">
                      <span>${w.completedCount} of ${w.totalTasks} tasks</span>
                      <strong>${w.percentage}%</strong>
                    </div>
                    <div class="progress-bar-track is-sm" style="margin-bottom: 0.85rem;">
                      <div class="progress-bar-fill ${w.isCompleted ? 'is-complete' : ''}" style="width: ${w.percentage}%"></div>
                    </div>
                    <button type="button" class="btn btn-primary btn-sm" style="width: 100%;" data-open-week="${mod.week}">
                      Open Week ${mod.week} Module
                    </button>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>`
      : `<div class="empty-state">No weekly modules match your search or status filter.</div>`;

    return `
      <div class="card" style="margin-bottom: 1.25rem;">
        <div class="card-header" style="margin-bottom: 0.75rem;">
          <div>
            <h2 class="serif-title" style="font-size: 1.5rem; margin: 0;">12-Week Psychology Learning Plan</h2>
            <p class="card-subtitle">Estimated pace: 4–6 hours per week. Search topics or filter by completion status.</p>
          </div>
          <span class="badge badge-sage">${stats.completedWeeks}/12 Weeks Done</span>
        </div>

        <div class="toolbar" style="margin-bottom: 0;">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              id="curriculum-search-input"
              class="input"
              type="search"
              placeholder="Search modules or topics (e.g., neurons, empathy, Big Five, ethics)..."
              value="${escapeHtml(filters.curriculumQuery || '')}"
            />
          </div>
          <select id="curriculum-status-filter" class="select" aria-label="Filter by completion status">
            <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="not_started" ${statusFilter === 'not_started' ? 'selected' : ''}>Not Started</option>
            <option value="in_progress" ${statusFilter === 'in_progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>

      ${cardsHtml}
    `;
  }

  /**
   * 3. WEEKLY MODULE DETAIL VIEW (All 10 Required Sections)
   */
  function renderModuleDetail(ctx) {
    const { state, modules, stats, selectedWeek } = ctx;
    const mod = modules.find((m) => m.week === selectedWeek) || modules[0];
    const wStat = stats.weekStats.find((w) => w.week === mod.week);
    const doneSet = new Set(wStat.completedTaskIds);

    const weekReflections = state.reflections.filter((r) => Number(r.weekNumber) === mod.week);
    const weekEvidence = state.evidence.filter((e) => Number(e.weekNumber) === mod.week);

    const pillsHtml = modules
      .map((m) => {
        const st = stats.weekStats.find((w) => w.week === m.week);
        const cls = [
          'week-pill-btn',
          m.week === mod.week ? 'is-active' : '',
          st && st.isCompleted ? 'is-complete' : ''
        ]
          .filter(Boolean)
          .join(' ');
        return `<button type="button" class="${cls}" data-open-week="${m.week}">Week ${m.week}</button>`;
      })
      .join('');

    return `
      <!-- Quick Week Switcher -->
      <div class="week-pills-strip" role="navigation" aria-label="Select learning week">
        ${pillsHtml}
      </div>

      <!-- Module Hero & Completion Status -->
      <div class="module-hero">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 1rem;">
          <div style="flex: 1; min-width: 260px;">
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
              <span class="badge badge-blue">Week ${mod.week} of 12</span>
              <span class="badge badge-sage">${escapeHtml(mod.pillar)}</span>
              <span class="badge badge-neutral">Est. ${escapeHtml(mod.estimatedHours)} / week</span>
              ${statusBadge(wStat.status)}
            </div>
            <h2 class="serif-title" style="font-size: 1.65rem; margin-bottom: 0.4rem;">${escapeHtml(mod.title)}</h2>
            <p style="margin: 0; max-width: 720px;">${escapeHtml(mod.summary)}</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 210px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.84rem;">
              <span>Module Progress</span>
              <strong>${wStat.percentage}% (${wStat.completedCount}/${wStat.totalTasks})</strong>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${wStat.isCompleted ? 'is-complete' : ''}" style="width: ${wStat.percentage}%"></div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.35rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-set-current-week" data-set-current-week="${mod.week}">
                ${state.profile.currentWeek === mod.week ? '★ Current Active Week' : 'Set as Current Week'}
              </button>
              <button type="button" class="btn ${wStat.manualCompleted ? 'btn-sage' : 'btn-terracotta'} btn-sm" id="btn-toggle-week-complete" data-toggle-week-complete="${mod.week}">
                ${wStat.isCompleted ? '✓ Week Complete' : 'Mark Week Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="module-detail-grid">
        <!-- LEFT COLUMN: Objectives, Topics, Activities, Exercises, Reading -->
        <div>
          <!-- Learning Objectives -->
          <div class="card module-section-card">
            <h3 class="card-title">1. Learning Objectives</h3>
            <p class="card-subtitle" style="margin-bottom: 0.75rem;">What you will be able to understand and apply by the end of Week ${mod.week}.</p>
            <ul style="display: grid; gap: 0.45rem; color: var(--text-secondary);">
              ${mod.objectives.map((obj) => `<li>${escapeHtml(obj)}</li>`).join('')}
            </ul>
          </div>

          <!-- Detailed Topics to Study -->
          <div class="card module-section-card">
            <h3 class="card-title">2. Detailed Topics to Study</h3>
            <p class="card-subtitle" style="margin-bottom: 0.75rem;">Core concepts covered in this module.</p>
            <ul class="topic-list">
              ${mod.topics
                .map(
                  (t) => `
                  <li class="topic-card">
                    <strong>${escapeHtml(t.title)}</strong>
                    <p>${escapeHtml(t.detail)}</p>
                  </li>
                `
                )
                .join('')}
            </ul>
          </div>

          <!-- Weekly Study Activities -->
          <div class="card module-section-card">
            <h3 class="card-title">3. Weekly Study Plan (${escapeHtml(mod.estimatedHours)})</h3>
            <p class="card-subtitle" style="margin-bottom: 0.75rem;">Suggested step-by-step pacing across 4 calm study sessions.</p>
            <ol style="display: grid; gap: 0.5rem; color: var(--text-secondary);">
              ${mod.activities.map((act) => `<li>${escapeHtml(act)}</li>`).join('')}
            </ol>
          </div>

          <!-- Recommended Reading -->
          <div class="card module-section-card">
            <div class="card-header" style="margin-bottom: 0.65rem;">
              <div>
                <h3 class="card-title">4. Recommended Reading</h3>
                <p class="card-subtitle">Open-access textbooks are highlighted first.</p>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" data-nav-jump="library">Open Library</button>
            </div>
            <ul style="display: grid; gap: 0.45rem; color: var(--text-secondary);">
              ${mod.recommendedReading.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>

          <!-- Practical Learning Exercises -->
          <div class="card module-section-card">
            <h3 class="card-title">5. Practical Learning Exercises</h3>
            <p class="card-subtitle" style="margin-bottom: 0.75rem;">Active exercises to move beyond passive reading.</p>
            <ul style="display: grid; gap: 0.6rem; list-style: none; padding: 0;">
              ${mod.practicalExercises
                .map(
                  (ex) => `
                  <li class="topic-card" style="background: var(--terracotta-light); border-color: rgba(217, 154, 104, 0.3);">
                    <p style="color: var(--text-primary);">${escapeHtml(ex)}</p>
                  </li>
                `
                )
                .join('')}
            </ul>
          </div>
        </div>

        <!-- RIGHT COLUMN: Checklist, Deliverables, Reflection Questions & Quick Journal, Evidence Submission -->
        <div>
          <!-- Interactive Task Checklist -->
          <div class="card module-section-card">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <div>
                <h3 class="card-title">6. Task Checklist</h3>
                <p class="card-subtitle">Ticking items automatically updates your overall progress.</p>
              </div>
              <span class="badge badge-sage">${wStat.completedCount}/${wStat.totalTasks}</span>
            </div>
            <ul class="checklist">
              ${mod.tasks
                .map((task) => {
                  const checked = doneSet.has(task.id);
                  return `
                    <li class="check-item ${checked ? 'is-done' : ''}">
                      <input
                        type="checkbox"
                        id="mod-task-${escapeHtml(task.id)}"
                        data-toggle-task="${escapeHtml(task.id)}"
                        data-task-week="${mod.week}"
                        ${checked ? 'checked' : ''}
                      />
                      <div class="check-item-body">
                        <label class="check-item-label" for="mod-task-${escapeHtml(task.id)}">
                          ${escapeHtml(task.label)}
                        </label>
                        <div class="check-item-sub">Estimated time: ${escapeHtml(task.duration)}</div>
                      </div>
                    </li>
                  `;
                })
                .join('')}
            </ul>
          </div>

          <!-- Expected Deliverables -->
          <div class="card module-section-card">
            <h3 class="card-title">7. Expected Deliverables</h3>
            <p class="card-subtitle" style="margin-bottom: 0.7rem;">Outputs to create and link as learning evidence.</p>
            <ul style="display: grid; gap: 0.4rem; color: var(--text-secondary);">
              ${mod.deliverables.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}
            </ul>
          </div>

          <!-- Reflection Questions + Inline Journal Entry -->
          <div class="card module-section-card">
            <h3 class="card-title">8. Reflection Questions</h3>
            <p class="card-subtitle" style="margin-bottom: 0.7rem;">Reflect deeply on what you learned and how it shapes your goals.</p>
            <ol style="display: grid; gap: 0.45rem; color: var(--text-secondary); margin-bottom: 1rem;">
              ${mod.reflectionQuestions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}
            </ol>

            <form id="module-reflection-form" data-week="${mod.week}" style="border-top: 1px solid var(--border-subtle); padding-top: 0.9rem;">
              <div class="field-group">
                <label class="field-label" for="mod-ref-prompt">Prompt to Reflect On</label>
                <select id="mod-ref-prompt" class="select" style="width: 100%;">
                  ${mod.reflectionQuestions.map((q) => `<option value="${escapeHtml(q)}">${escapeHtml(q)}</option>`).join('')}
                  <option value="Open personal reflection">Open personal reflection</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label" for="mod-ref-content">Your Week ${mod.week} Reflection</label>
                <textarea id="mod-ref-content" class="textarea" required placeholder="Write your thoughts, questions, or insights from this week..."></textarea>
              </div>
              <button type="submit" class="btn btn-sage btn-sm">Save to Reflection Journal</button>
            </form>

            ${
              weekReflections.length
                ? `<div style="margin-top: 1rem; display: grid; gap: 0.55rem;">
                    <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">SAVED WEEK ${mod.week} REFLECTIONS (${weekReflections.length})</div>
                    ${weekReflections
                      .map(
                        (r) => `
                        <div class="entry-item">
                          <div style="font-size: 0.78rem; font-weight: 600; color: var(--muted-blue-dark);">${escapeHtml(r.promptQuestion || 'Personal Reflection')}</div>
                          <div style="font-size: 0.86rem; white-space: pre-wrap;">${escapeHtml(r.content)}</div>
                          <div style="font-size: 0.74rem; color: var(--text-muted);">${escapeHtml(Progress.formatTimestamp(r.updatedAt))}</div>
                        </div>
                      `
                      )
                      .join('')}
                  </div>`
                : ''
            }
          </div>

          <!-- Evidence Submission Section -->
          <div class="card module-section-card">
            <h3 class="card-title">9. Evidence Submission</h3>
            <p class="card-subtitle" style="margin-bottom: 0.85rem;">Save links to your notes, slides, worksheets, or study documents (e.g., Google Docs, Notion, GitHub, Drive).</p>

            <form id="module-evidence-form" data-week="${mod.week}">
              <div class="field-group">
                <label class="field-label" for="mod-ev-title">Evidence Title</label>
                <input id="mod-ev-title" class="input" type="text" required placeholder="e.g., Week ${mod.week} Study Summary" />
              </div>
              <div class="field-group">
                <label class="field-label" for="mod-ev-url">Resource Link (https://...)</label>
                <input id="mod-ev-url" class="input" type="url" required placeholder="https://docs.google.com/..." />
              </div>
              <div class="field-group">
                <label class="field-label" for="mod-ev-category">Type</label>
                <select id="mod-ev-category" class="select" style="width: 100%;">
                  <option value="Study Notes">Study Notes</option>
                  <option value="Assignment / Worksheet">Assignment / Worksheet</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Research Breakdown">Research Breakdown</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-sm">Add Week ${mod.week} Evidence Link</button>
            </form>

            ${
              weekEvidence.length
                ? `<div style="margin-top: 1rem; display: grid; gap: 0.55rem;">
                    ${weekEvidence
                      .map(
                        (e) => `
                        <div class="entry-item">
                          <div class="entry-header">
                            <a href="${escapeHtml(e.url)}" target="_blank" rel="noopener noreferrer" style="font-weight: 700; font-size: 0.88rem;">
                              ${escapeHtml(e.title)} ↗
                            </a>
                            <button type="button" class="btn btn-danger-soft btn-sm" data-delete-evidence="${escapeHtml(e.id)}">Remove</button>
                          </div>
                          <span class="badge badge-neutral" style="align-self: flex-start;">${escapeHtml(e.category)}</span>
                        </div>
                      `
                      )
                      .join('')}
                  </div>`
                : `<p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.85rem; margin-bottom: 0;">No evidence links added for Week ${mod.week} yet.</p>`
            }
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 4. REFLECTION JOURNAL VIEW
   */
  function renderJournal(ctx) {
    const { state, modules, filters } = ctx;
    const query = (filters.journalQuery || '').trim().toLowerCase();
    const weekFilter = filters.journalWeek || 'all';
    const editingId = filters.editingReflectionId || null;
    const editingEntry = editingId ? state.reflections.find((r) => r.id === editingId) : null;

    const filtered = state.reflections.filter((r) => {
      if (weekFilter !== 'all') {
        if (weekFilter === 'general' && r.weekNumber !== null) return false;
        if (weekFilter !== 'general' && String(r.weekNumber) !== String(weekFilter)) return false;
      }
      if (!query) return true;
      return `${r.promptQuestion} ${r.content} ${r.moodTag}`.toLowerCase().includes(query);
    });

    const selectedFormWeek = editingEntry
      ? editingEntry.weekNumber || ''
      : filters.journalFormWeek || state.profile.currentWeek || 1;

    const selectedMod = modules.find((m) => String(m.week) === String(selectedFormWeek));
    const promptSuggestions = selectedMod ? selectedMod.reflectionQuestions : [];

    return `
      <div class="dashboard-split">
        <!-- Left: Reflection Entries List -->
        <div>
          <div class="card" style="margin-bottom: 1.15rem;">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <div>
                <h2 class="serif-title" style="font-size: 1.45rem; margin: 0;">Personal Reflection Journal</h2>
                <p class="card-subtitle">Capture insights, ethical questions, and personal growth across your 12-week journey.</p>
              </div>
              <span class="badge badge-sage">${state.reflections.length} Entries</span>
            </div>

            <div class="toolbar" style="margin-bottom: 0;">
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input id="journal-search-input" class="input" type="search" placeholder="Search reflections..." value="${escapeHtml(filters.journalQuery || '')}" />
              </div>
              <select id="journal-week-filter" class="select">
                <option value="all" ${weekFilter === 'all' ? 'selected' : ''}>All Weeks</option>
                ${modules
                  .map(
                    (m) =>
                      `<option value="${m.week}" ${String(weekFilter) === String(m.week) ? 'selected' : ''}>Week ${m.week}: ${escapeHtml(m.title)}</option>`
                  )
                  .join('')}
                <option value="general" ${weekFilter === 'general' ? 'selected' : ''}>General Reflection</option>
              </select>
            </div>
          </div>

          <div style="display: grid; gap: 0.85rem;">
            ${
              filtered.length
                ? filtered
                    .map((r) => {
                      const modTitle = r.weekNumber
                        ? `Week ${r.weekNumber}: ${(modules.find((m) => m.week === r.weekNumber) || {}).title || ''}`
                        : 'General Reflection';
                      return `
                        <article class="card">
                          <div class="entry-header" style="margin-bottom: 0.5rem;">
                            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center;">
                              <span class="badge badge-blue">${escapeHtml(modTitle)}</span>
                              <span class="badge badge-terracotta">${escapeHtml(r.moodTag)}</span>
                            </div>
                            <span style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(Progress.formatTimestamp(r.updatedAt))}</span>
                          </div>
                          ${
                            r.promptQuestion
                              ? `<div style="font-size: 0.84rem; font-weight: 700; color: var(--muted-blue-dark); margin-bottom: 0.45rem;">Prompt: ${escapeHtml(r.promptQuestion)}</div>`
                              : ''
                          }
                          <p style="white-space: pre-wrap; color: var(--text-primary); margin-bottom: 0.85rem;">${escapeHtml(r.content)}</p>
                          <div style="display: flex; gap: 0.5rem;">
                            <button type="button" class="btn btn-secondary btn-sm" data-edit-reflection="${escapeHtml(r.id)}">Edit</button>
                            <button type="button" class="btn btn-danger-soft btn-sm" data-delete-reflection="${escapeHtml(r.id)}">Delete</button>
                          </div>
                        </article>
                      `;
                    })
                    .join('')
                : `<div class="empty-state">No reflection entries yet. Use the journal form to record your first insight!</div>`
            }
          </div>
        </div>

        <!-- Right: Add / Edit Reflection Form -->
        <div class="card" style="position: sticky; top: 88px;">
          <h3 class="card-title">${editingEntry ? 'Edit Reflection Entry' : 'New Reflection Entry'}</h3>
          <p class="card-subtitle" style="margin-bottom: 1rem;">Guided reflection deepens memory and professional self-awareness.</p>

          <form id="journal-form">
            <input type="hidden" id="journal-entry-id" value="${editingEntry ? escapeHtml(editingEntry.id) : ''}" />

            <div class="field-group">
              <label class="field-label" for="journal-form-week">Related Module</label>
              <select id="journal-form-week" class="select" style="width: 100%;">
                ${modules
                  .map(
                    (m) =>
                      `<option value="${m.week}" ${String(selectedFormWeek) === String(m.week) ? 'selected' : ''}>Week ${m.week}: ${escapeHtml(m.title)}</option>`
                  )
                  .join('')}
                <option value="" ${selectedFormWeek === '' ? 'selected' : ''}>General Reflection</option>
              </select>
            </div>

            <div class="field-group">
              <label class="field-label" for="journal-form-prompt">Reflection Question / Title</label>
              <input
                id="journal-form-prompt"
                class="input"
                type="text"
                list="journal-prompt-suggestions"
                placeholder="Choose a week prompt or write your own focus..."
                value="${escapeHtml(editingEntry ? editingEntry.promptQuestion : (promptSuggestions[0] || ''))}"
              />
              <datalist id="journal-prompt-suggestions">
                ${promptSuggestions.map((q) => `<option value="${escapeHtml(q)}"></option>`).join('')}
              </datalist>
            </div>

            <div class="field-group">
              <label class="field-label" for="journal-form-mood">Learning Mindset Tag</label>
              <select id="journal-form-mood" class="select" style="width: 100%;">
                ${['Curious', 'Reflective', 'Inspired', 'Challenged', 'Confident']
                  .map(
                    (tag) =>
                      `<option value="${tag}" ${editingEntry && editingEntry.moodTag === tag ? 'selected' : ''}>${tag}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="field-group">
              <label class="field-label" for="journal-form-content">Your Reflection</label>
              <textarea id="journal-form-content" class="textarea" required placeholder="What clicked for you? What questions remain?">${escapeHtml(editingEntry ? editingEntry.content : '')}</textarea>
            </div>

            <div style="display: flex; gap: 0.6rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">
                ${editingEntry ? 'Update Entry' : 'Save Reflection'}
              </button>
              ${
                editingEntry
                  ? `<button type="button" id="journal-cancel-edit" class="btn btn-secondary">Cancel</button>`
                  : ''
              }
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * 5. READING LIBRARY VIEW
   */
  function renderLibrary(ctx) {
    const { state, books, filters } = ctx;
    const query = (filters.libraryQuery || '').trim().toLowerCase();
    const weekFilter = filters.libraryWeek || 'all';
    const accessFilter = filters.libraryAccess || 'all';

    // Sort free resources first (OpenStax Psychology 2e at #1), then by book number
    const sorted = books.slice().sort((a, b) => {
      if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
      return a.number - b.number;
    });

    const filtered = sorted.filter((b) => {
      if (accessFilter === 'free' && !b.isFree) return false;
      if (weekFilter !== 'all' && !b.weeks.includes(Number(weekFilter))) return false;
      if (!query) return true;
      return `${b.title} ${b.author} ${b.description} ${b.category}`.toLowerCase().includes(query);
    });

    return `
      <div class="card" style="margin-bottom: 1.25rem;">
        <div class="card-header" style="margin-bottom: 0.75rem;">
          <div>
            <h2 class="serif-title" style="font-size: 1.5rem; margin: 0;">Psychology Reading Library</h2>
            <p class="card-subtitle">Core beginner-to-professional book references. Free open-access resources like <strong>OpenStax Psychology 2e</strong> are prioritised first.</p>
          </div>
          <span class="badge badge-sage">${books.filter((b) => b.isFree).length} Free Open Resources</span>
        </div>

        <div class="toolbar" style="margin-bottom: 0;">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input id="library-search-input" class="input" type="search" placeholder="Search by title, author, or topic..." value="${escapeHtml(filters.libraryQuery || '')}" />
          </div>
          <select id="library-week-filter" class="select">
            <option value="all" ${weekFilter === 'all' ? 'selected' : ''}>All Learning Weeks</option>
            ${Array.from({ length: 12 }, (_, i) => i + 1)
              .map((w) => `<option value="${w}" ${String(weekFilter) === String(w) ? 'selected' : ''}>Week ${w}</option>`)
              .join('')}
          </select>
          <select id="library-access-filter" class="select">
            <option value="all" ${accessFilter === 'all' ? 'selected' : ''}>All Resources</option>
            <option value="free" ${accessFilter === 'free' ? 'selected' : ''}>Free / Open Access Only</option>
          </select>
        </div>
      </div>

      ${
        filtered.length
          ? `<div class="grid-2">
              ${filtered
                .map((b) => {
                  const readingStatus = state.readingStatuses[b.id] || 'want_to_read';
                  return `
                    <article class="card book-card ${b.isFree ? 'is-featured' : ''}">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.65rem; margin-bottom: 0.6rem; flex-wrap: wrap;">
                        <span class="badge ${b.isFree ? 'badge-sage' : 'badge-neutral'}">
                          ${b.isFree ? '★ Free Open Resource' : escapeHtml(b.category)}
                        </span>
                        <span class="badge badge-blue">Relevant: Weeks ${escapeHtml(b.weeks.join(', '))}</span>
                      </div>

                      <h3 class="card-title" style="font-size: 1.12rem;">${b.number}. ${escapeHtml(b.title)}</h3>
                      <p style="font-size: 0.85rem; font-weight: 600; color: var(--muted-blue-dark); margin: 0.25rem 0 0.6rem;">
                        by ${escapeHtml(b.author)}
                      </p>
                      <p style="font-size: 0.88rem; margin-bottom: 0.75rem;">${escapeHtml(b.description)}</p>
                      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.9rem;">
                        Publisher / Source: <strong>${escapeHtml(b.publisher)}</strong> (${escapeHtml(b.accessLabel)})
                      </p>

                      <div class="book-footer">
                        <select class="select" data-book-status="${escapeHtml(b.id)}" style="min-width: 145px; padding: 0.4rem 0.65rem; font-size: 0.82rem;" aria-label="Reading status for ${escapeHtml(b.title)}">
                          <option value="want_to_read" ${readingStatus === 'want_to_read' ? 'selected' : ''}>Want to Read</option>
                          <option value="reading" ${readingStatus === 'reading' ? 'selected' : ''}>Currently Reading</option>
                          <option value="completed" ${readingStatus === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                        <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" class="btn ${b.isFree ? 'btn-sage' : 'btn-secondary'} btn-sm">
                          Official Info ↗
                        </a>
                      </div>
                    </article>
                  `;
                })
                .join('')}
            </div>`
          : `<div class="empty-state">No books match your search or filters.</div>`
      }
    `;
  }

  /**
   * 6. EVIDENCE VAULT VIEW
   */
  function renderEvidence(ctx) {
    const { state, modules, filters } = ctx;
    const query = (filters.evidenceQuery || '').trim().toLowerCase();
    const weekFilter = filters.evidenceWeek || 'all';
    const editingId = filters.editingEvidenceId || null;
    const editingItem = editingId ? state.evidence.find((e) => e.id === editingId) : null;

    const filtered = state.evidence.filter((e) => {
      if (weekFilter !== 'all' && String(e.weekNumber) !== String(weekFilter)) return false;
      if (!query) return true;
      return `${e.title} ${e.category} ${e.notes} ${e.url}`.toLowerCase().includes(query);
    });

    return `
      <div class="dashboard-split">
        <div>
          <div class="card" style="margin-bottom: 1.15rem;">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <div>
                <h2 class="serif-title" style="font-size: 1.45rem; margin: 0;">Evidence &amp; Assignments Vault</h2>
                <p class="card-subtitle">Store links to your study summaries, worksheets, and Week 12 capstone presentation.</p>
              </div>
              <span class="badge badge-blue">${state.evidence.length} Items</span>
            </div>
            <div class="toolbar" style="margin-bottom: 0;">
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input id="evidence-search-input" class="input" type="search" placeholder="Search evidence title or notes..." value="${escapeHtml(filters.evidenceQuery || '')}" />
              </div>
              <select id="evidence-week-filter" class="select">
                <option value="all" ${weekFilter === 'all' ? 'selected' : ''}>All Weeks</option>
                ${modules
                  .map(
                    (m) =>
                      `<option value="${m.week}" ${String(weekFilter) === String(m.week) ? 'selected' : ''}>Week ${m.week}: ${escapeHtml(m.title)}</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; gap: 0.85rem;">
            ${
              filtered.length
                ? filtered
                    .map((item) => {
                      const mod = modules.find((m) => m.week === item.weekNumber);
                      return `
                        <article class="card">
                          <div class="entry-header" style="margin-bottom: 0.45rem;">
                            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                              <span class="badge badge-blue">Week ${item.weekNumber}${mod ? `: ${escapeHtml(mod.title)}` : ''}</span>
                              <span class="badge badge-sage">${escapeHtml(item.category)}</span>
                            </div>
                            <span style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(Progress.formatTimestamp(item.updatedAt))}</span>
                          </div>
                          <h3 class="card-title" style="margin-bottom: 0.25rem;">
                            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)} ↗</a>
                          </h3>
                          <p style="font-size: 0.78rem; color: var(--text-muted); word-break: break-all; margin-bottom: 0.45rem;">${escapeHtml(item.url)}</p>
                          ${item.notes ? `<p style="font-size: 0.88rem; margin-bottom: 0.75rem;">${escapeHtml(item.notes)}</p>` : ''}
                          <div style="display: flex; gap: 0.5rem;">
                            <button type="button" class="btn btn-secondary btn-sm" data-edit-evidence="${escapeHtml(item.id)}">Edit</button>
                            <button type="button" class="btn btn-danger-soft btn-sm" data-delete-evidence="${escapeHtml(item.id)}">Delete</button>
                          </div>
                        </article>
                      `;
                    })
                    .join('')
                : `<div class="empty-state">No evidence links saved yet. Add links to your Google Docs, Notion pages, PDFs, or slides!</div>`
            }
          </div>
        </div>

        <div class="card" style="position: sticky; top: 88px;">
          <h3 class="card-title">${editingItem ? 'Edit Evidence Link' : 'Add Learning Evidence'}</h3>
          <p class="card-subtitle" style="margin-bottom: 1rem;">Only valid http:// or https:// links are accepted.</p>

          <form id="evidence-form">
            <input type="hidden" id="ev-id" value="${editingItem ? escapeHtml(editingItem.id) : ''}" />
            <div class="field-group">
              <label class="field-label" for="ev-week">Learning Week</label>
              <select id="ev-week" class="select" style="width: 100%;">
                ${modules
                  .map((m) => {
                    const chosen = editingItem ? editingItem.weekNumber : state.profile.currentWeek;
                    return `<option value="${m.week}" ${Number(chosen) === m.week ? 'selected' : ''}>Week ${m.week}: ${escapeHtml(m.title)}</option>`;
                  })
                  .join('')}
              </select>
            </div>
            <div class="field-group">
              <label class="field-label" for="ev-title">Title</label>
              <input id="ev-title" class="input" type="text" required placeholder="e.g., Week 3 Brain & Neuron Diagram" value="${escapeHtml(editingItem ? editingItem.title : '')}" />
            </div>
            <div class="field-group">
              <label class="field-label" for="ev-url">URL</label>
              <input id="ev-url" class="input" type="url" required placeholder="https://..." value="${escapeHtml(editingItem ? editingItem.url : '')}" />
            </div>
            <div class="field-group">
              <label class="field-label" for="ev-category">Category</label>
              <select id="ev-category" class="select" style="width: 100%;">
                ${['Study Notes', 'Assignment / Worksheet', 'Presentation', 'Research Breakdown', 'Continuation Plan']
                  .map(
                    (cat) =>
                      `<option value="${cat}" ${editingItem && editingItem.category === cat ? 'selected' : ''}>${cat}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="field-group">
              <label class="field-label" for="ev-notes">Summary / Notes (optional)</label>
              <textarea id="ev-notes" class="textarea" style="min-height: 85px;" placeholder="What did you create or learn in this deliverable?">${escapeHtml(editingItem ? editingItem.notes : '')}</textarea>
            </div>
            <div style="display: flex; gap: 0.6rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">
                ${editingItem ? 'Update Evidence' : 'Save Evidence Link'}
              </button>
              ${editingItem ? `<button type="button" id="ev-cancel-edit" class="btn btn-secondary">Cancel</button>` : ''}
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * 7. ACCOUNT, CLOUD CONNECTION & BACKUP SETTINGS VIEW
   */
  function renderSettings(ctx) {
    const { state, user, authConfig } = ctx;
    return `
      <div class="grid-2">
        <!-- Learner Profile -->
        <div class="card">
          <h2 class="serif-title" style="font-size: 1.35rem;">Learner Profile</h2>
          <p class="card-subtitle" style="margin-bottom: 1rem;">Personalise your learning dashboard and active week.</p>
          <form id="profile-form">
            <div class="field-group">
              <label class="field-label" for="prof-name">Your Display Name</label>
              <input id="prof-name" class="input" type="text" required value="${escapeHtml(state.profile.displayName)}" />
            </div>
            <div class="field-group">
              <label class="field-label" for="prof-goal">Long-Term Psychology Goal</label>
              <textarea id="prof-goal" class="textarea" style="min-height: 88px;" required>${escapeHtml(state.profile.learningGoal)}</textarea>
            </div>
            <div class="field-group">
              <label class="field-label" for="prof-week">Current Active Week</label>
              <select id="prof-week" class="select" style="width: 100%;">
                ${Array.from({ length: 12 }, (_, i) => i + 1)
                  .map(
                    (w) =>
                      `<option value="${w}" ${state.profile.currentWeek === w ? 'selected' : ''}>Week ${w}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Profile</button>
          </form>
        </div>

        <!-- Account & Cloud Sync -->
        <div class="card">
          <h2 class="serif-title" style="font-size: 1.35rem;">Supabase Cloud Sync &amp; Account</h2>
          <p class="card-subtitle" style="margin-bottom: 1rem;">
            ${user ? `Signed in as <strong>${escapeHtml(user.email)}</strong>.` : 'Currently using Local Fallback Mode in this browser.'}
          </p>

          <div class="callout ${user ? 'callout-info' : 'callout-warm'}">
            <div>
              ${
                user
                  ? '<strong>Cloud persistence active.</strong> Every task, reflection, and evidence link syncs to your Supabase database protected by Row Level Security.'
                  : authConfig.configured
                  ? '<strong>Supabase connected!</strong> Sign in or create an account so your progress persists across logout/login and different devices.'
                  : '<strong>Not connected to Supabase yet.</strong> Paste your Supabase Project URL and public Anon Key below (or edit <code>js/config.js</code>) to enable cloud accounts.'
              }
            </div>
          </div>

          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1.15rem;">
            ${
              user
                ? `<button type="button" id="settings-sync-now-btn" class="btn btn-sage">Push Local Backup to Cloud</button>
                   <button type="button" id="settings-signout-btn" class="btn btn-danger-soft">Sign Out</button>`
                : `<button type="button" id="settings-open-auth-btn" class="btn btn-primary">Sign In / Create Account</button>`
            }
          </div>

          <form id="supabase-config-form" style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <div style="font-size: 0.82rem; font-weight: 700; margin-bottom: 0.65rem;">Supabase Public Connection (Safe Frontend Keys Only)</div>
            <div class="field-group">
              <label class="field-label" for="sb-url-input">Supabase Project URL</label>
              <input id="sb-url-input" class="input" type="url" placeholder="https://your-project-id.supabase.co" value="${escapeHtml(authConfig.url || '')}" />
            </div>
            <div class="field-group">
              <label class="field-label" for="sb-anon-input">Supabase Public Anon Key</label>
              <input id="sb-anon-input" class="input" type="text" placeholder="${authConfig.hasAnonKey ? 'Public Anon Key saved — paste a new key to replace' : 'eyJhbGciOi...'}" value="" />
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="submit" class="btn btn-secondary btn-sm">Save Connection</button>
              <button type="button" id="sb-clear-btn" class="btn btn-danger-soft btn-sm">Clear Browser Keys</button>
            </div>
          </form>
        </div>

        <!-- Data Export & Import -->
        <div class="card" style="grid-column: 1 / -1;">
          <h2 class="serif-title" style="font-size: 1.35rem;">Data Export &amp; Import</h2>
          <p class="card-subtitle" style="margin-bottom: 1rem;">
            Download a portable JSON backup of your 12-week progress, reflection journal, reading statuses, and evidence links—or restore from a previous backup file.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <button type="button" id="export-json-btn" class="btn btn-sage">
              Download Progress Backup (.json)
            </button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              Import Backup (.json)
              <input id="import-json-input" type="file" accept=".json,application/json" style="display: none;" />
            </label>
            <button type="button" id="reset-local-btn" class="btn btn-danger-soft" style="margin-left: auto;">
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    `;
  }

  SkillTrack.Renderers = {
    escapeHtml,
    renderDashboard,
    renderCurriculum,
    renderModuleDetail,
    renderJournal,
    renderLibrary,
    renderEvidence,
    renderSettings
  };
})(window);
