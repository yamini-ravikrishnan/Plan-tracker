/**
 * progress.js — Pure Progress Calculation, Validation & State Helpers
 * Works in both the browser (SkillTrack.Progress) and Node.js tests.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});

  function generateId(prefix) {
    const rand = Math.random().toString(36).slice(2, 8);
    return `${prefix}_${Date.now().toString(36)}_${rand}`;
  }

  function createDefaultState() {
    const now = new Date().toISOString();
    return {
      version: 1,
      profile: {
        displayName: 'Psychology Learner',
        learningGoal:
          'Build a strong 12-week foundation in psychological knowledge, research literacy, communication, and ethics.',
        currentWeek: 1,
        weeklyHoursTarget: '4–6 hours'
      },
      weeklyProgress: {}, // { "1": { completedTasks: ["w1-t1"], manualCompleted: false, updatedAt: iso } }
      reflections: [],    // [{ id, weekNumber, promptQuestion, content, moodTag, createdAt, updatedAt }]
      evidence: [],       // [{ id, weekNumber, title, url, category, notes, createdAt, updatedAt }]
      readingStatuses: {}, // { "book-psychology-2e": "reading" | "completed" | "want_to_read" }
      lastUpdated: now
    };
  }

  function clampWeek(weekNum) {
    const n = Number(weekNum);
    if (!Number.isFinite(n)) return 1;
    return Math.min(12, Math.max(1, Math.round(n)));
  }

  function isValidHttpUrl(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_err) {
      return false;
    }
  }

  /**
   * Computes stats for a single weekly module.
   */
  function calculateWeekStats(mod, weekEntry) {
    const validTaskIds = new Set((mod.tasks || []).map((t) => t.id));
    const rawCompleted = Array.isArray(weekEntry && weekEntry.completedTasks)
      ? weekEntry.completedTasks
      : [];

    // Deduplicate and only count task IDs that actually exist in this module
    const completedSet = new Set(rawCompleted.filter((id) => validTaskIds.has(id)));
    const totalTasks = validTaskIds.size;
    const completedCount = completedSet.size;
    const manualCompleted = Boolean(weekEntry && weekEntry.manualCompleted);

    let percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    if (manualCompleted && percentage < 100) {
      percentage = 100;
    }

    const isCompleted = manualCompleted || (totalTasks > 0 && completedCount === totalTasks);

    let status = 'not_started';
    if (isCompleted) {
      status = 'completed';
    } else if (completedCount > 0) {
      status = 'in_progress';
    }

    return {
      week: mod.week,
      title: mod.title,
      totalTasks,
      completedCount,
      completedTaskIds: Array.from(completedSet),
      manualCompleted,
      percentage,
      isCompleted,
      status
    };
  }

  /**
   * Computes overall 12-week progress, completed tasks, active week, and upcoming activities.
   */
  function calculateOverallStats(state, modules) {
    const safeState = state || createDefaultState();
    const wp = safeState.weeklyProgress || {};
    const weekStats = (modules || []).map((mod) =>
      calculateWeekStats(mod, wp[String(mod.week)] || wp[mod.week])
    );

    const totalTasks = weekStats.reduce((sum, w) => sum + w.totalTasks, 0);
    const completedTasks = weekStats.reduce((sum, w) => sum + w.completedCount, 0);
    const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const completedWeeks = weekStats.filter((w) => w.isCompleted).length;
    const inProgressWeeks = weekStats.filter((w) => w.status === 'in_progress').length;

    const preferredWeek = clampWeek(safeState.profile && safeState.profile.currentWeek);
    const firstIncomplete = weekStats.find((w) => !w.isCompleted);
    const activeWeek = preferredWeek || (firstIncomplete ? firstIncomplete.week : 12);

    // Gather upcoming uncompleted tasks starting from activeWeek (and next week if nearly done)
    const upcomingTasks = [];
    const activeMod = (modules || []).find((m) => m.week === activeWeek);
    const activeStats = weekStats.find((w) => w.week === activeWeek);

    if (activeMod && activeStats) {
      const doneSet = new Set(activeStats.completedTaskIds);
      for (const task of activeMod.tasks) {
        if (!doneSet.has(task.id)) {
          upcomingTasks.push({
            week: activeMod.week,
            weekTitle: activeMod.title,
            taskId: task.id,
            label: task.label,
            duration: task.duration
          });
        }
      }
    }

    if (upcomingTasks.length < 4 && activeWeek < 12) {
      const nextMod = (modules || []).find((m) => m.week === activeWeek + 1);
      const nextStats = weekStats.find((w) => w.week === activeWeek + 1);
      if (nextMod && nextStats) {
        const doneNext = new Set(nextStats.completedTaskIds);
        for (const task of nextMod.tasks) {
          if (!doneNext.has(task.id) && upcomingTasks.length < 5) {
            upcomingTasks.push({
              week: nextMod.week,
              weekTitle: nextMod.title,
              taskId: task.id,
              label: task.label,
              duration: task.duration
            });
          }
        }
      }
    }

    return {
      totalTasks,
      completedTasks,
      overallPercentage,
      completedWeeks,
      inProgressWeeks,
      activeWeek,
      upcomingTasks,
      weekStats
    };
  }

  /**
   * Normalises an imported or stored state object so missing fields never break the UI.
   */
  function normalizeState(raw, modules) {
    const base = createDefaultState();
    if (!raw || typeof raw !== 'object') return base;

    const profileRaw = raw.profile && typeof raw.profile === 'object' ? raw.profile : {};
    base.profile = {
      displayName:
        typeof profileRaw.displayName === 'string' && profileRaw.displayName.trim()
          ? profileRaw.displayName.trim().slice(0, 80)
          : base.profile.displayName,
      learningGoal:
        typeof profileRaw.learningGoal === 'string' && profileRaw.learningGoal.trim()
          ? profileRaw.learningGoal.trim().slice(0, 300)
          : base.profile.learningGoal,
      currentWeek: clampWeek(profileRaw.currentWeek),
      weeklyHoursTarget:
        typeof profileRaw.weeklyHoursTarget === 'string' && profileRaw.weeklyHoursTarget.trim()
          ? profileRaw.weeklyHoursTarget.trim().slice(0, 40)
          : '4–6 hours'
    };

    const validTasksByWeek = new Map();
    (modules || []).forEach((m) => {
      validTasksByWeek.set(String(m.week), new Set((m.tasks || []).map((t) => t.id)));
    });

    if (raw.weeklyProgress && typeof raw.weeklyProgress === 'object') {
      for (const [weekKey, entry] of Object.entries(raw.weeklyProgress)) {
        const weekNum = clampWeek(weekKey);
        const key = String(weekNum);
        const validSet = validTasksByWeek.get(key);
        if (!entry || typeof entry !== 'object') continue;
        const completedTasks = Array.isArray(entry.completedTasks)
          ? Array.from(
              new Set(
                entry.completedTasks.filter(
                  (id) => typeof id === 'string' && (!validSet || validSet.has(id))
                )
              )
            )
          : [];
        base.weeklyProgress[key] = {
          completedTasks,
          manualCompleted: Boolean(entry.manualCompleted),
          updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : base.lastUpdated
        };
      }
    }

    if (Array.isArray(raw.reflections)) {
      base.reflections = raw.reflections
        .filter((r) => r && typeof r === 'object' && typeof r.content === 'string' && r.content.trim())
        .map((r) => ({
          id: typeof r.id === 'string' && r.id ? r.id : generateId('ref'),
          weekNumber:
            r.weekNumber === null || r.weekNumber === undefined || r.weekNumber === ''
              ? null
              : clampWeek(r.weekNumber),
          promptQuestion: typeof r.promptQuestion === 'string' ? r.promptQuestion : '',
          content: r.content.trim(),
          moodTag: typeof r.moodTag === 'string' && r.moodTag.trim() ? r.moodTag.trim() : 'Reflective',
          createdAt: typeof r.createdAt === 'string' ? r.createdAt : base.lastUpdated,
          updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : base.lastUpdated
        }));
    }

    if (Array.isArray(raw.evidence)) {
      base.evidence = raw.evidence
        .filter(
          (e) =>
            e &&
            typeof e === 'object' &&
            typeof e.title === 'string' &&
            e.title.trim() &&
            isValidHttpUrl(e.url)
        )
        .map((e) => ({
          id: typeof e.id === 'string' && e.id ? e.id : generateId('ev'),
          weekNumber: clampWeek(e.weekNumber),
          title: e.title.trim(),
          url: e.url.trim(),
          category: typeof e.category === 'string' && e.category.trim() ? e.category.trim() : 'Study Notes',
          notes: typeof e.notes === 'string' ? e.notes.trim() : '',
          createdAt: typeof e.createdAt === 'string' ? e.createdAt : base.lastUpdated,
          updatedAt: typeof e.updatedAt === 'string' ? e.updatedAt : base.lastUpdated
        }));
    }

    if (raw.readingStatuses && typeof raw.readingStatuses === 'object') {
      const allowed = new Set(['want_to_read', 'reading', 'completed']);
      for (const [bookId, status] of Object.entries(raw.readingStatuses)) {
        if (typeof bookId === 'string' && allowed.has(status)) {
          base.readingStatuses[bookId] = status;
        }
      }
    }

    base.lastUpdated = typeof raw.lastUpdated === 'string' ? raw.lastUpdated : new Date().toISOString();
    return base;
  }

  /**
   * Validates a parsed JSON object before importing it.
   */
  function validateImportPayload(payload, modules) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return { ok: false, error: 'Invalid backup file: expected a JSON object.' };
    }
    const hasRecognizedKey =
      'weeklyProgress' in payload ||
      'reflections' in payload ||
      'evidence' in payload ||
      'profile' in payload;
    if (!hasRecognizedKey) {
      return {
        ok: false,
        error: 'This JSON file does not look like a Psychology SkillTrack export.'
      };
    }
    const normalized = normalizeState(payload, modules);
    normalized.lastUpdated = new Date().toISOString();
    return { ok: true, state: normalized };
  }

  function formatTimestamp(iso) {
    if (!iso) return 'Not updated yet';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Not updated yet';
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  SkillTrack.Progress = {
    generateId,
    createDefaultState,
    clampWeek,
    isValidHttpUrl,
    calculateWeekStats,
    calculateOverallStats,
    normalizeState,
    validateImportPayload,
    formatTimestamp
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillTrack.Progress;
  }
})(typeof window !== 'undefined' ? window : globalThis);
