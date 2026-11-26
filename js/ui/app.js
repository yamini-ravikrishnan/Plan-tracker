/**
 * app.js — Main Application Controller, Router & Event Orchestration
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});
  const Modules = SkillTrack.Curriculum.MODULES;
  const Books = SkillTrack.Library.BOOKS;
  const Progress = SkillTrack.Progress;
  const Auth = SkillTrack.Auth;
  const Storage = SkillTrack.Storage;
  const Renderers = SkillTrack.Renderers;

  const VIEW_TITLES = {
    dashboard: 'Learning Dashboard',
    curriculum: '12-Week Psychology Plan',
    module: 'Weekly Learning Module',
    journal: 'Personal Reflection Journal',
    library: 'Psychology Reading Library',
    evidence: 'Evidence & Assignments Vault',
    settings: 'Account, Cloud Sync & Backup'
  };

  const appState = {
    activeView: 'dashboard',
    selectedWeek: 1,
    user: null,
    authMode: 'signin',
    data: Progress.createDefaultState(),
    filters: {
      curriculumQuery: '',
      curriculumStatus: 'all',
      journalQuery: '',
      journalWeek: 'all',
      journalFormWeek: 1,
      editingReflectionId: null,
      libraryQuery: '',
      libraryWeek: 'all',
      libraryAccess: 'all',
      evidenceQuery: '',
      evidenceWeek: 'all',
      editingEvidenceId: null
    }
  };

  // DOM References
  let els = {};

  function showToast(message, type) {
    if (!els.toastRegion) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type ? `is-${type}` : ''}`;
    toast.innerHTML = `<span>${Renderers.escapeHtml(message)}</span>`;
    els.toastRegion.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3400);
  }

  function setSyncIndicator(statusText, mode) {
    if (els.sidebarSyncDot) {
      els.sidebarSyncDot.className = 'status-dot';
      if (mode === 'local') els.sidebarSyncDot.classList.add('is-local');
      if (mode === 'syncing') els.sidebarSyncDot.classList.add('is-syncing');
    }
    if (els.sidebarSyncLabel) els.sidebarSyncLabel.textContent = statusText;
  }

  function updateChrome() {
    const stats = Progress.calculateOverallStats(appState.data, Modules);

    if (els.navOverallPill) els.navOverallPill.textContent = `${stats.overallPercentage}%`;
    if (els.navWeeksPill) els.navWeeksPill.textContent = `${stats.completedWeeks}/12`;
    if (els.navCurrentWeekPill) els.navCurrentWeekPill.textContent = `W${stats.activeWeek}`;
    if (els.navJournalPill) els.navJournalPill.textContent = String(appState.data.reflections.length);
    if (els.navEvidencePill) els.navEvidencePill.textContent = String(appState.data.evidence.length);
    if (els.topbarLastUpdated) {
      els.topbarLastUpdated.textContent = Progress.formatTimestamp(appState.data.lastUpdated);
    }

    if (appState.user) {
      setSyncIndicator('Cloud Synced (Supabase)', 'cloud');
      if (els.sidebarUserEmail) els.sidebarUserEmail.textContent = appState.user.email || 'Signed in';
      if (els.sidebarAuthBtn) els.sidebarAuthBtn.textContent = 'Account & Sync';
      if (els.topbarAuthBtn) els.topbarAuthBtn.textContent = appState.data.profile.displayName;
    } else {
      const cfg = Auth.getConfigSummary();
      setSyncIndicator(cfg.configured ? 'Local Mode (Not Signed In)' : 'Local Fallback Mode', 'local');
      if (els.sidebarUserEmail) {
        els.sidebarUserEmail.textContent = cfg.configured
          ? 'Sign in to sync across devices'
          : 'Saved in browser · Connect Supabase anytime';
      }
      if (els.sidebarAuthBtn) els.sidebarAuthBtn.textContent = 'Sign In / Sync Account';
      if (els.topbarAuthBtn) els.topbarAuthBtn.textContent = 'Sign In';
    }
  }

  function renderActiveView(options) {
    const opts = options || {};
    const stats = Progress.calculateOverallStats(appState.data, Modules);
    const ctx = {
      state: appState.data,
      stats,
      modules: Modules,
      books: Books,
      selectedWeek: appState.selectedWeek,
      filters: appState.filters,
      user: appState.user,
      authConfig: Auth.getConfigSummary()
    };

    // Preserve active input focus & cursor position during live search filtering
    const activeEl = document.activeElement;
    const preserveId = opts.preserveFocus && activeEl && activeEl.id ? activeEl.id : null;
    const selStart = preserveId && typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null;
    const selEnd = preserveId && typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null;

    const panel = document.getElementById(`view-${appState.activeView}`);
    if (panel) {
      if (appState.activeView === 'dashboard') panel.innerHTML = Renderers.renderDashboard(ctx);
      if (appState.activeView === 'curriculum') panel.innerHTML = Renderers.renderCurriculum(ctx);
      if (appState.activeView === 'module') panel.innerHTML = Renderers.renderModuleDetail(ctx);
      if (appState.activeView === 'journal') panel.innerHTML = Renderers.renderJournal(ctx);
      if (appState.activeView === 'library') panel.innerHTML = Renderers.renderLibrary(ctx);
      if (appState.activeView === 'evidence') panel.innerHTML = Renderers.renderEvidence(ctx);
      if (appState.activeView === 'settings') panel.innerHTML = Renderers.renderSettings(ctx);
    }

    updateChrome();

    if (preserveId) {
      const restored = document.getElementById(preserveId);
      if (restored) {
        restored.focus();
        if (selStart !== null && typeof restored.setSelectionRange === 'function') {
          restored.setSelectionRange(selStart, selEnd);
        }
      }
    }
  }

  function navigateTo(viewName, options) {
    const opts = options || {};
    if (!VIEW_TITLES[viewName]) return;
    appState.activeView = viewName;

    if (opts.week) {
      appState.selectedWeek = Progress.clampWeek(opts.week);
    }

    document.querySelectorAll('.view-panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === `view-${viewName}`);
    });

    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-nav') === viewName);
    });

    if (els.topbarTitle) {
      els.topbarTitle.textContent =
        viewName === 'module'
          ? `Week ${appState.selectedWeek}: ${(Modules.find((m) => m.week === appState.selectedWeek) || {}).title || ''}`
          : VIEW_TITLES[viewName];
    }

    closeMobileDrawer();
    renderActiveView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openMobileDrawer() {
    els.sidebar.classList.add('is-open');
    els.sidebarBackdrop.classList.add('is-open');
  }

  function closeMobileDrawer() {
    els.sidebar.classList.remove('is-open');
    els.sidebarBackdrop.classList.remove('is-open');
  }

  /* ========================================================================
     DATA MUTATIONS (Optimistic UI + Cloud/Local Persistence)
     ======================================================================== */

  async function toggleTask(weekNumber, taskId, isChecked) {
    const key = String(Progress.clampWeek(weekNumber));
    const current = appState.data.weeklyProgress[key] || {
      completedTasks: [],
      manualCompleted: false,
      updatedAt: new Date().toISOString()
    };

    const nextSet = new Set(current.completedTasks || []);
    if (isChecked) {
      nextSet.add(taskId);
    } else {
      nextSet.delete(taskId);
    }

    const mod = Modules.find((m) => String(m.week) === key);
    const allTasksDone = mod ? mod.tasks.every((t) => nextSet.has(t.id)) : false;

    const updatedEntry = {
      completedTasks: Array.from(nextSet),
      manualCompleted: allTasksDone ? current.manualCompleted : false,
      updatedAt: new Date().toISOString()
    };

    appState.data.weeklyProgress[key] = updatedEntry;
    renderActiveView();

    try {
      setSyncIndicator('Saving...', 'syncing');
      await Storage.saveWeekProgress(appState.user, key, updatedEntry, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Could not sync task to cloud: ${err.message}`, 'error');
      updateChrome();
    }
  }

  async function toggleWeekManualComplete(weekNumber) {
    const key = String(Progress.clampWeek(weekNumber));
    const mod = Modules.find((m) => String(m.week) === key);
    if (!mod) return;

    const current = appState.data.weeklyProgress[key] || {
      completedTasks: [],
      manualCompleted: false
    };
    const wStat = Progress.calculateWeekStats(mod, current);
    const nextComplete = !wStat.isCompleted;

    const updatedEntry = {
      completedTasks: nextComplete ? mod.tasks.map((t) => t.id) : [],
      manualCompleted: nextComplete,
      updatedAt: new Date().toISOString()
    };

    appState.data.weeklyProgress[key] = updatedEntry;
    renderActiveView();
    showToast(
      nextComplete ? `Week ${weekNumber} marked complete!` : `Week ${weekNumber} reopened.`,
      'success'
    );

    try {
      await Storage.saveWeekProgress(appState.user, key, updatedEntry, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud save error: ${err.message}`, 'error');
    }
  }

  async function setCurrentActiveWeek(weekNumber) {
    const w = Progress.clampWeek(weekNumber);
    appState.data.profile.currentWeek = w;
    appState.selectedWeek = w;
    renderActiveView();
    showToast(`Active learning week set to Week ${w}.`, 'success');
    try {
      await Storage.saveProfileAndMeta(appState.user, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud save error: ${err.message}`, 'error');
    }
  }

  async function saveReflectionEntry(payload) {
    const now = new Date().toISOString();
    const existingIdx = payload.id
      ? appState.data.reflections.findIndex((r) => r.id === payload.id)
      : -1;

    let entry;
    if (existingIdx >= 0) {
      entry = {
        ...appState.data.reflections[existingIdx],
        weekNumber: payload.weekNumber,
        promptQuestion: payload.promptQuestion,
        content: payload.content,
        moodTag: payload.moodTag || 'Reflective',
        updatedAt: now
      };
      appState.data.reflections[existingIdx] = entry;
    } else {
      entry = {
        id: Progress.generateId('ref'),
        weekNumber: payload.weekNumber,
        promptQuestion: payload.promptQuestion,
        content: payload.content,
        moodTag: payload.moodTag || 'Reflective',
        createdAt: now,
        updatedAt: now
      };
      appState.data.reflections.unshift(entry);
    }

    appState.filters.editingReflectionId = null;
    renderActiveView();
    showToast('Reflection saved to your journal.', 'success');

    try {
      await Storage.upsertReflection(appState.user, entry, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud save error: ${err.message}`, 'error');
    }
  }

  async function removeReflectionEntry(id) {
    appState.data.reflections = appState.data.reflections.filter((r) => r.id !== id);
    if (appState.filters.editingReflectionId === id) {
      appState.filters.editingReflectionId = null;
    }
    renderActiveView();
    showToast('Reflection deleted.');

    try {
      await Storage.deleteReflection(appState.user, id, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud delete error: ${err.message}`, 'error');
    }
  }

  async function saveEvidenceItem(payload) {
    if (!Progress.isValidHttpUrl(payload.url)) {
      showToast('Please enter a valid URL starting with https:// or http://', 'error');
      return false;
    }

    const now = new Date().toISOString();
    const existingIdx = payload.id
      ? appState.data.evidence.findIndex((e) => e.id === payload.id)
      : -1;

    let item;
    if (existingIdx >= 0) {
      item = {
        ...appState.data.evidence[existingIdx],
        weekNumber: Progress.clampWeek(payload.weekNumber),
        title: payload.title.trim(),
        url: payload.url.trim(),
        category: payload.category || 'Study Notes',
        notes: (payload.notes || '').trim(),
        updatedAt: now
      };
      appState.data.evidence[existingIdx] = item;
    } else {
      item = {
        id: Progress.generateId('ev'),
        weekNumber: Progress.clampWeek(payload.weekNumber),
        title: payload.title.trim(),
        url: payload.url.trim(),
        category: payload.category || 'Study Notes',
        notes: (payload.notes || '').trim(),
        createdAt: now,
        updatedAt: now
      };
      appState.data.evidence.unshift(item);
    }

    appState.filters.editingEvidenceId = null;
    renderActiveView();
    showToast('Evidence link saved.', 'success');

    try {
      await Storage.upsertEvidence(appState.user, item, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud save error: ${err.message}`, 'error');
    }
    return true;
  }

  async function removeEvidenceItem(id) {
    appState.data.evidence = appState.data.evidence.filter((e) => e.id !== id);
    if (appState.filters.editingEvidenceId === id) {
      appState.filters.editingEvidenceId = null;
    }
    renderActiveView();
    showToast('Evidence link removed.');

    try {
      await Storage.deleteEvidence(appState.user, id, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud delete error: ${err.message}`, 'error');
    }
  }

  async function updateBookReadingStatus(bookId, status) {
    appState.data.readingStatuses[bookId] = status;
    updateChrome();
    showToast('Reading status updated.', 'success');
    try {
      await Storage.saveProfileAndMeta(appState.user, appState.data);
      updateChrome();
    } catch (err) {
      showToast(`Cloud save error: ${err.message}`, 'error');
    }
  }

  /* ========================================================================
     EXPORT & IMPORT JSON
     ======================================================================== */

  function exportBackupJson() {
    const payload = {
      ...appState.data,
      exportedAt: new Date().toISOString(),
      app: SkillTrack.Config.APP_NAME
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `psychology-skilltrack-backup-${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded.', 'success');
  }

  async function importBackupFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = Progress.validateImportPayload(parsed, Modules);
      if (!result.ok) {
        showToast(result.error, 'error');
        return;
      }
      appState.data = result.state;
      appState.selectedWeek = appState.data.profile.currentWeek;
      renderActiveView();
      await Storage.syncFullStateToCloud(appState.user, appState.data);
      updateChrome();
      showToast('Progress backup imported successfully!', 'success');
    } catch (err) {
      showToast(`Could not import file: ${err.message}`, 'error');
    }
  }

  /* ========================================================================
     AUTH MODAL & CLOUD SESSION LIFECYCLE
     ======================================================================== */

  function openAuthModal(mode) {
    appState.authMode = mode || 'signin';
    const cfg = Auth.getConfigSummary();
    els.authUnconfiguredNotice.style.display = cfg.configured ? 'none' : 'flex';
    els.authFeedback.textContent = '';

    document.querySelectorAll('[data-auth-tab]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-auth-tab') === appState.authMode);
    });

    els.authNameGroup.style.display = appState.authMode === 'signup' ? 'flex' : 'none';
    els.authPasswordGroup.style.display = appState.authMode === 'reset' ? 'none' : 'flex';
    els.authPasswordInput.required = appState.authMode !== 'reset';

    if (appState.authMode === 'signin') els.authSubmitBtn.textContent = 'Sign In';
    if (appState.authMode === 'signup') els.authSubmitBtn.textContent = 'Create Account';
    if (appState.authMode === 'reset') els.authSubmitBtn.textContent = 'Send Reset Link';

    els.authModal.classList.add('is-open');
  }

  function closeAuthModal() {
    els.authModal.classList.remove('is-open');
  }

  async function hydrateSessionUser(user) {
    appState.user = user;
    if (user) {
      try {
        setSyncIndicator('Syncing from cloud...', 'syncing');
        const cloudData = await Storage.loadCloudState(user, Modules);
        // If cloud profile is brand-new & empty, preserve any guest progress from before sign-in
        const guestData = Storage.readLocalState(null, Modules);
        if (!Storage.hasMeaningfulData(cloudData) && Storage.hasMeaningfulData(guestData)) {
          guestData.profile.displayName =
            cloudData.profile.displayName || guestData.profile.displayName;
          appState.data = guestData;
          await Storage.syncFullStateToCloud(user, appState.data);
          showToast('Your local progress was synced to your new cloud account!', 'success');
        } else {
          appState.data = cloudData;
        }
      } catch (err) {
        const cached = Storage.readLocalState(user.id, Modules);
        appState.data = cached || Progress.createDefaultState();
        showToast(`Loaded offline cache (${err.message}).`, 'error');
      }
    } else {
      appState.data = Storage.readLocalState(null, Modules) || Progress.createDefaultState();
    }

    appState.selectedWeek = Progress.clampWeek(appState.data.profile.currentWeek);
    renderActiveView();
  }

  /* ========================================================================
     EVENT DELEGATION
     ======================================================================== */

  function bindGlobalEvents() {
    // Sidebar & bottom nav clicks
    document.addEventListener('click', (e) => {
      const navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        navigateTo(navBtn.getAttribute('data-nav'));
        return;
      }

      const jumpBtn = e.target.closest('[data-nav-jump]');
      if (jumpBtn) {
        navigateTo(jumpBtn.getAttribute('data-nav-jump'));
        return;
      }

      const openWeekBtn = e.target.closest('[data-open-week]');
      if (openWeekBtn) {
        navigateTo('module', { week: Number(openWeekBtn.getAttribute('data-open-week')) });
        return;
      }

      const setCurrBtn = e.target.closest('[data-set-current-week]');
      if (setCurrBtn) {
        setCurrentActiveWeek(Number(setCurrBtn.getAttribute('data-set-current-week')));
        return;
      }

      const toggleWeekBtn = e.target.closest('[data-toggle-week-complete]');
      if (toggleWeekBtn) {
        toggleWeekManualComplete(Number(toggleWeekBtn.getAttribute('data-toggle-week-complete')));
        return;
      }

      const editRefBtn = e.target.closest('[data-edit-reflection]');
      if (editRefBtn) {
        appState.filters.editingReflectionId = editRefBtn.getAttribute('data-edit-reflection');
        renderActiveView();
        return;
      }

      const delRefBtn = e.target.closest('[data-delete-reflection]');
      if (delRefBtn) {
        removeReflectionEntry(delRefBtn.getAttribute('data-delete-reflection'));
        return;
      }

      const editEvBtn = e.target.closest('[data-edit-evidence]');
      if (editEvBtn) {
        appState.filters.editingEvidenceId = editEvBtn.getAttribute('data-edit-evidence');
        renderActiveView();
        return;
      }

      const delEvBtn = e.target.closest('[data-delete-evidence]');
      if (delEvBtn) {
        removeEvidenceItem(delEvBtn.getAttribute('data-delete-evidence'));
        return;
      }

      if (e.target.id === 'journal-cancel-edit') {
        appState.filters.editingReflectionId = null;
        renderActiveView();
        return;
      }

      if (e.target.id === 'ev-cancel-edit') {
        appState.filters.editingEvidenceId = null;
        renderActiveView();
        return;
      }

      if (e.target.id === 'export-json-btn') {
        exportBackupJson();
        return;
      }

      if (e.target.id === 'reset-local-btn') {
        if (global.confirm('Reset all 12-week tasks, reflections, and evidence? Export a backup first if needed.')) {
          appState.data = Progress.createDefaultState();
          appState.selectedWeek = 1;
          renderActiveView();
          Storage.syncFullStateToCloud(appState.user, appState.data).catch(() => {});
          showToast('Progress reset to a fresh start.');
        }
        return;
      }

      if (e.target.id === 'settings-open-auth-btn') {
        openAuthModal('signin');
        return;
      }

      if (e.target.id === 'settings-signout-btn') {
        Auth.signOut()
          .then(() => {
            showToast('Signed out.');
            return hydrateSessionUser(null);
          })
          .catch((err) => showToast(err.message, 'error'));
        return;
      }

      if (e.target.id === 'settings-sync-now-btn') {
        Storage.syncFullStateToCloud(appState.user, appState.data)
          .then(() => {
            updateChrome();
            showToast('All data pushed to Supabase cloud.', 'success');
          })
          .catch((err) => showToast(`Sync failed: ${err.message}`, 'error'));
        return;
      }

      if (e.target.id === 'sb-clear-btn') {
        Auth.clearCustomCredentials();
        hydrateSessionUser(null);
        showToast('Cleared browser Supabase keys.');
        return;
      }
    });

    // Checkbox & Select Changes
    document.addEventListener('change', (e) => {
      const taskCheckbox = e.target.closest('[data-toggle-task]');
      if (taskCheckbox) {
        toggleTask(
          Number(taskCheckbox.getAttribute('data-task-week')),
          taskCheckbox.getAttribute('data-toggle-task'),
          taskCheckbox.checked
        );
        return;
      }

      if (e.target.id === 'dashboard-active-week-select') {
        setCurrentActiveWeek(Number(e.target.value));
        return;
      }

      if (e.target.id === 'curriculum-status-filter') {
        appState.filters.curriculumStatus = e.target.value;
        renderActiveView();
        return;
      }

      if (e.target.id === 'journal-week-filter') {
        appState.filters.journalWeek = e.target.value;
        renderActiveView();
        return;
      }

      if (e.target.id === 'journal-form-week') {
        appState.filters.journalFormWeek = e.target.value;
        const mod = Modules.find((m) => String(m.week) === String(e.target.value));
        const datalist = document.getElementById('journal-prompt-suggestions');
        const promptInput = document.getElementById('journal-form-prompt');
        if (datalist && mod) {
          datalist.innerHTML = mod.reflectionQuestions
            .map((q) => `<option value="${Renderers.escapeHtml(q)}"></option>`)
            .join('');
          if (promptInput && !promptInput.value) {
            promptInput.value = mod.reflectionQuestions[0] || '';
          }
        }
        return;
      }

      if (e.target.id === 'library-week-filter') {
        appState.filters.libraryWeek = e.target.value;
        renderActiveView();
        return;
      }

      if (e.target.id === 'library-access-filter') {
        appState.filters.libraryAccess = e.target.value;
        renderActiveView();
        return;
      }

      if (e.target.matches('[data-book-status]')) {
        updateBookReadingStatus(e.target.getAttribute('data-book-status'), e.target.value);
        return;
      }

      if (e.target.id === 'evidence-week-filter') {
        appState.filters.evidenceWeek = e.target.value;
        renderActiveView();
        return;
      }

      if (e.target.id === 'import-json-input' && e.target.files && e.target.files[0]) {
        importBackupFile(e.target.files[0]);
        e.target.value = '';
      }
    });

    // Live Search Inputs
    document.addEventListener('input', (e) => {
      if (e.target.id === 'curriculum-search-input') {
        appState.filters.curriculumQuery = e.target.value;
        renderActiveView({ preserveFocus: true });
      } else if (e.target.id === 'journal-search-input') {
        appState.filters.journalQuery = e.target.value;
        renderActiveView({ preserveFocus: true });
      } else if (e.target.id === 'library-search-input') {
        appState.filters.libraryQuery = e.target.value;
        renderActiveView({ preserveFocus: true });
      } else if (e.target.id === 'evidence-search-input') {
        appState.filters.evidenceQuery = e.target.value;
        renderActiveView({ preserveFocus: true });
      }
    });

    // Forms Submission
    document.addEventListener('submit', async (e) => {
      if (e.target.id === 'module-reflection-form') {
        e.preventDefault();
        const week = Number(e.target.getAttribute('data-week'));
        const promptQuestion = document.getElementById('mod-ref-prompt').value;
        const content = document.getElementById('mod-ref-content').value.trim();
        if (!content) return;
        await saveReflectionEntry({ weekNumber: week, promptQuestion, content, moodTag: 'Reflective' });
        return;
      }

      if (e.target.id === 'module-evidence-form') {
        e.preventDefault();
        const week = Number(e.target.getAttribute('data-week'));
        await saveEvidenceItem({
          weekNumber: week,
          title: document.getElementById('mod-ev-title').value,
          url: document.getElementById('mod-ev-url').value,
          category: document.getElementById('mod-ev-category').value,
          notes: ''
        });
        return;
      }

      if (e.target.id === 'journal-form') {
        e.preventDefault();
        const rawWeek = document.getElementById('journal-form-week').value;
        const content = document.getElementById('journal-form-content').value.trim();
        if (!content) return;
        await saveReflectionEntry({
          id: document.getElementById('journal-entry-id').value || null,
          weekNumber: rawWeek ? Number(rawWeek) : null,
          promptQuestion: document.getElementById('journal-form-prompt').value.trim(),
          content,
          moodTag: document.getElementById('journal-form-mood').value
        });
        return;
      }

      if (e.target.id === 'evidence-form') {
        e.preventDefault();
        await saveEvidenceItem({
          id: document.getElementById('ev-id').value || null,
          weekNumber: Number(document.getElementById('ev-week').value),
          title: document.getElementById('ev-title').value,
          url: document.getElementById('ev-url').value,
          category: document.getElementById('ev-category').value,
          notes: document.getElementById('ev-notes').value
        });
        return;
      }

      if (e.target.id === 'profile-form') {
        e.preventDefault();
        appState.data.profile.displayName = document.getElementById('prof-name').value.trim() || 'Psychology Learner';
        appState.data.profile.learningGoal = document.getElementById('prof-goal').value.trim();
        appState.data.profile.currentWeek = Progress.clampWeek(document.getElementById('prof-week').value);
        appState.selectedWeek = appState.data.profile.currentWeek;
        renderActiveView();
        try {
          await Storage.saveProfileAndMeta(appState.user, appState.data);
          updateChrome();
          showToast('Profile saved.', 'success');
        } catch (err) {
          showToast(`Cloud save error: ${err.message}`, 'error');
        }
        return;
      }

      if (e.target.id === 'supabase-config-form') {
        e.preventDefault();
        const url = document.getElementById('sb-url-input').value;
        let anon = document.getElementById('sb-anon-input').value.trim();
        if (!anon) {
          try {
            const saved = JSON.parse(global.localStorage.getItem(SkillTrack.Config.CUSTOM_SUPABASE_CONFIG_KEY) || '{}');
            if (saved && saved.anonKey) anon = saved.anonKey;
          } catch (_err) {
            anon = '';
          }
        }
        try {
          Auth.saveCustomCredentials(url, anon);
          Auth.onAuthStateChange((_ev, session) => {
            hydrateSessionUser(session ? session.user : null);
          });
          renderActiveView();
          showToast('Supabase connected! You can now Sign In or Create an Account.', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  }

  function bindShellControls() {
    els.mobileMenuBtn.addEventListener('click', openMobileDrawer);
    els.sidebarBackdrop.addEventListener('click', closeMobileDrawer);
    els.closeAuthModal.addEventListener('click', closeAuthModal);

    els.authModal.addEventListener('click', (e) => {
      if (e.target === els.authModal) closeAuthModal();
    });

    const handleAuthTrigger = () => {
      if (appState.user) {
        navigateTo('settings');
      } else {
        openAuthModal('signin');
      }
    };
    els.sidebarAuthBtn.addEventListener('click', handleAuthTrigger);
    els.topbarAuthBtn.addEventListener('click', handleAuthTrigger);

    els.authOpenSettingsBtn.addEventListener('click', () => {
      closeAuthModal();
      navigateTo('settings');
    });

    document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        openAuthModal(tab.getAttribute('data-auth-tab'));
      });
    });

    els.authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Auth.isConfigured()) {
        els.authFeedback.style.color = 'var(--status-danger)';
        els.authFeedback.textContent = 'Connect your Supabase URL and Anon Key in Account & Backup first.';
        return;
      }

      const email = els.authEmailInput.value.trim();
      const password = els.authPasswordInput.value;
      const displayName = els.authNameInput.value.trim();

      els.authSubmitBtn.disabled = true;
      els.authFeedback.style.color = 'var(--text-secondary)';
      els.authFeedback.textContent = 'Working...';

      try {
        if (appState.authMode === 'signin') {
          const data = await Auth.signIn(email, password);
          closeAuthModal();
          await hydrateSessionUser(data.user);
          showToast('Signed in! Cloud sync active.', 'success');
        } else if (appState.authMode === 'signup') {
          const data = await Auth.signUp(email, password, displayName);
          if (data.session && data.user) {
            closeAuthModal();
            await hydrateSessionUser(data.user);
            showToast('Account created & signed in!', 'success');
          } else {
            els.authFeedback.style.color = 'var(--status-success)';
            els.authFeedback.textContent =
              'Account created! Check your email inbox to confirm your address, then sign in.';
          }
        } else if (appState.authMode === 'reset') {
          await Auth.sendPasswordReset(email);
          els.authFeedback.style.color = 'var(--status-success)';
          els.authFeedback.textContent = 'Password reset link sent! Check your email.';
        }
      } catch (err) {
        els.authFeedback.style.color = 'var(--status-danger)';
        els.authFeedback.textContent = err.message || 'Authentication error.';
      } finally {
        els.authSubmitBtn.disabled = false;
      }
    });
  }

  async function init() {
    els = {
      sidebar: document.getElementById('sidebar'),
      sidebarBackdrop: document.getElementById('sidebar-backdrop'),
      mobileMenuBtn: document.getElementById('mobile-menu-btn'),
      topbarTitle: document.getElementById('topbar-title'),
      topbarLastUpdated: document.getElementById('topbar-last-updated'),
      topbarAuthBtn: document.getElementById('topbar-auth-btn'),
      sidebarAuthBtn: document.getElementById('sidebar-auth-btn'),
      sidebarSyncDot: document.getElementById('sidebar-sync-dot'),
      sidebarSyncLabel: document.getElementById('sidebar-sync-label'),
      sidebarUserEmail: document.getElementById('sidebar-user-email'),
      navOverallPill: document.getElementById('nav-overall-pill'),
      navWeeksPill: document.getElementById('nav-weeks-pill'),
      navCurrentWeekPill: document.getElementById('nav-current-week-pill'),
      navJournalPill: document.getElementById('nav-journal-pill'),
      navEvidencePill: document.getElementById('nav-evidence-pill'),
      authModal: document.getElementById('auth-modal'),
      closeAuthModal: document.getElementById('close-auth-modal'),
      authUnconfiguredNotice: document.getElementById('auth-unconfigured-notice'),
      authForm: document.getElementById('auth-form'),
      authNameGroup: document.getElementById('auth-name-group'),
      authPasswordGroup: document.getElementById('auth-password-group'),
      authNameInput: document.getElementById('auth-display-name'),
      authEmailInput: document.getElementById('auth-email'),
      authPasswordInput: document.getElementById('auth-password'),
      authFeedback: document.getElementById('auth-feedback'),
      authSubmitBtn: document.getElementById('auth-submit-btn'),
      authOpenSettingsBtn: document.getElementById('auth-open-settings-btn'),
      toastRegion: document.getElementById('toast-region')
    };

    bindShellControls();
    bindGlobalEvents();

    Auth.initClient();
    const user = await Auth.getCurrentUser();
    await hydrateSessionUser(user);

    Auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        hydrateSessionUser(null);
      } else if (event === 'SIGNED_IN' && session && session.user) {
        if (!appState.user || appState.user.id !== session.user.id) {
          hydrateSessionUser(session.user);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
