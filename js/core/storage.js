/**
 * storage.js — Cloud-First Data Persistence (Supabase) + Scoped Local Fallback
 *
 * When a user is authenticated with Supabase:
 * - Reads & writes go directly to Supabase tables (profiles, weekly_progress,
 *   reflections, evidence_items) protected by Row Level Security (RLS).
 * - localStorage is used strictly as a per-user offline cache / fallback.
 *
 * When not signed in (or before Supabase is configured):
 * - Saves to a dedicated guest localStorage key so the app works immediately.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});
  const Config = SkillTrack.Config;
  const Progress = SkillTrack.Progress;

  function getLocalKey(userId) {
    return userId ? `${Config.STORAGE_KEY}_${userId}` : `${Config.STORAGE_KEY}_guest`;
  }

  function readLocalState(userId, modules) {
    try {
      const raw = global.localStorage.getItem(getLocalKey(userId));
      if (!raw) return null;
      return Progress.normalizeState(JSON.parse(raw), modules);
    } catch (_err) {
      return null;
    }
  }

  function writeLocalState(userId, state) {
    try {
      global.localStorage.setItem(getLocalKey(userId), JSON.stringify(state));
    } catch (_err) {
      // Ignore quota errors gracefully
    }
  }

  function hasMeaningfulData(state) {
    if (!state) return false;
    const hasTasks = Object.values(state.weeklyProgress || {}).some(
      (w) => (w.completedTasks && w.completedTasks.length > 0) || w.manualCompleted
    );
    return (
      hasTasks ||
      (state.reflections && state.reflections.length > 0) ||
      (state.evidence && state.evidence.length > 0) ||
      Object.keys(state.readingStatuses || {}).length > 0
    );
  }

  /**
   * Loads the full user state from Supabase (and caches locally).
   */
  async function loadCloudState(user, modules) {
    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) {
      return readLocalState(null, modules) || Progress.createDefaultState();
    }

    const userId = user.id;

    const [profileRes, progressRes, reflectionsRes, evidenceRes] = await Promise.all([
      sb.from('profiles').select('*').eq('id', userId).maybeSingle(),
      sb.from('weekly_progress').select('*').eq('user_id', userId),
      sb.from('reflections').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
      sb.from('evidence_items').select('*').eq('user_id', userId).order('updated_at', { ascending: false })
    ]);

    if (profileRes.error) throw profileRes.error;
    if (progressRes.error) throw progressRes.error;
    if (reflectionsRes.error) throw reflectionsRes.error;
    if (evidenceRes.error) throw evidenceRes.error;

    const state = Progress.createDefaultState();
    const fallbackName =
      (user.user_metadata && user.user_metadata.display_name) ||
      (user.email ? user.email.split('@')[0] : 'Psychology Learner');

    if (profileRes.data) {
      state.profile = {
        displayName: profileRes.data.display_name || fallbackName,
        learningGoal: profileRes.data.learning_goal || state.profile.learningGoal,
        currentWeek: Progress.clampWeek(profileRes.data.current_week),
        weeklyHoursTarget: profileRes.data.weekly_hours_target || '4–6 hours'
      };
      state.readingStatuses = profileRes.data.reading_statuses || {};
      state.lastUpdated = profileRes.data.last_synced_at || profileRes.data.updated_at || state.lastUpdated;
    } else {
      // Ensure profile row exists if user signed up before trigger ran
      state.profile.displayName = fallbackName;
      await sb.from('profiles').upsert({
        id: userId,
        display_name: state.profile.displayName,
        learning_goal: state.profile.learningGoal,
        current_week: state.profile.currentWeek,
        weekly_hours_target: state.profile.weeklyHoursTarget,
        reading_statuses: state.readingStatuses,
        last_synced_at: state.lastUpdated
      });
    }

    let latestTimestamp = new Date(state.lastUpdated).getTime() || 0;

    (progressRes.data || []).forEach((row) => {
      state.weeklyProgress[String(row.week_number)] = {
        completedTasks: Array.isArray(row.completed_tasks) ? row.completed_tasks : [],
        manualCompleted: Boolean(row.manual_completed),
        updatedAt: row.updated_at
      };
      const t = new Date(row.updated_at).getTime();
      if (t > latestTimestamp) {
        latestTimestamp = t;
        state.lastUpdated = row.updated_at;
      }
    });

    state.reflections = (reflectionsRes.data || []).map((row) => {
      const t = new Date(row.updated_at).getTime();
      if (t > latestTimestamp) {
        latestTimestamp = t;
        state.lastUpdated = row.updated_at;
      }
      return {
        id: row.client_id || row.id,
        weekNumber: row.week_number,
        promptQuestion: row.prompt_question || '',
        content: row.content,
        moodTag: row.mood_tag || 'Reflective',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    state.evidence = (evidenceRes.data || []).map((row) => {
      const t = new Date(row.updated_at).getTime();
      if (t > latestTimestamp) {
        latestTimestamp = t;
        state.lastUpdated = row.updated_at;
      }
      return {
        id: row.client_id || row.id,
        weekNumber: row.week_number,
        title: row.title,
        url: row.url,
        category: row.category || 'Study Notes',
        notes: row.notes || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    const normalized = Progress.normalizeState(state, modules);
    writeLocalState(userId, normalized);
    return normalized;
  }

  /**
   * Saves profile & reading status updates.
   */
  async function saveProfileAndMeta(user, state) {
    state.lastUpdated = new Date().toISOString();
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    const { error } = await sb.from('profiles').upsert({
      id: user.id,
      display_name: state.profile.displayName,
      learning_goal: state.profile.learningGoal,
      current_week: state.profile.currentWeek,
      weekly_hours_target: state.profile.weeklyHoursTarget,
      reading_statuses: state.readingStatuses,
      last_synced_at: state.lastUpdated
    });
    if (error) throw error;
    return { mode: 'cloud' };
  }

  /**
   * Saves one week's task checklist & completion state.
   */
  async function saveWeekProgress(user, weekNumber, weekEntry, state) {
    const now = new Date().toISOString();
    state.lastUpdated = now;
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    const { error: wpErr } = await sb.from('weekly_progress').upsert(
      {
        user_id: user.id,
        week_number: Number(weekNumber),
        completed_tasks: weekEntry.completedTasks || [],
        manual_completed: Boolean(weekEntry.manualCompleted)
      },
      { onConflict: 'user_id,week_number' }
    );
    if (wpErr) throw wpErr;

    await sb
      .from('profiles')
      .update({ last_synced_at: now })
      .eq('id', user.id);

    return { mode: 'cloud' };
  }

  /**
   * Creates or updates a reflection journal entry.
   */
  async function upsertReflection(user, entry, state) {
    const now = new Date().toISOString();
    state.lastUpdated = now;
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    const { error } = await sb.from('reflections').upsert(
      {
        user_id: user.id,
        client_id: entry.id,
        week_number: entry.weekNumber,
        prompt_question: entry.promptQuestion || '',
        content: entry.content,
        mood_tag: entry.moodTag || 'Reflective'
      },
      { onConflict: 'user_id,client_id' }
    );
    if (error) throw error;

    await sb.from('profiles').update({ last_synced_at: now }).eq('id', user.id);
    return { mode: 'cloud' };
  }

  async function deleteReflection(user, reflectionId, state) {
    const now = new Date().toISOString();
    state.lastUpdated = now;
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    const { error } = await sb
      .from('reflections')
      .delete()
      .eq('user_id', user.id)
      .eq('client_id', reflectionId);
    if (error) throw error;

    await sb.from('profiles').update({ last_synced_at: now }).eq('id', user.id);
    return { mode: 'cloud' };
  }

  /**
   * Creates or updates an evidence link item.
   */
  async function upsertEvidence(user, item, state) {
    const now = new Date().toISOString();
    state.lastUpdated = now;
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    const { error } = await sb.from('evidence_items').upsert(
      {
        user_id: user.id,
        client_id: item.id,
        week_number: Number(item.weekNumber),
        title: item.title,
        url: item.url,
        category: item.category || 'Study Notes',
        notes: item.notes || ''
      },
      { onConflict: 'user_id,client_id' }
    );
    if (error) throw error;

    await sb.from('profiles').update({ last_synced_at: now }).eq('id', user.id);
    return { mode: 'cloud' };
  }

  async function deleteEvidence(user, evidenceId, state) {
    const now = new Date().toISOString();
    state.lastUpdated = now;
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    const { error } = await sb
      .from('evidence_items')
      .delete()
      .eq('user_id', user.id)
      .eq('client_id', evidenceId);
    if (error) throw error;

    await sb.from('profiles').update({ last_synced_at: now }).eq('id', user.id);
    return { mode: 'cloud' };
  }

  /**
   * Pushes an entire state snapshot to Supabase (used for JSON import or guest->cloud migration).
   */
  async function syncFullStateToCloud(user, state) {
    state.lastUpdated = new Date().toISOString();
    writeLocalState(user ? user.id : null, state);

    const sb = SkillTrack.Auth.getClient();
    if (!sb || !user) return { mode: 'local' };

    // 1. Update profile
    const { error: profErr } = await sb.from('profiles').upsert({
      id: user.id,
      display_name: state.profile.displayName,
      learning_goal: state.profile.learningGoal,
      current_week: state.profile.currentWeek,
      weekly_hours_target: state.profile.weeklyHoursTarget,
      reading_statuses: state.readingStatuses,
      last_synced_at: state.lastUpdated
    });
    if (profErr) throw profErr;

    // 2. Replace weekly progress rows cleanly
    await sb.from('weekly_progress').delete().eq('user_id', user.id);
    const wpRows = Object.entries(state.weeklyProgress || {}).map(([weekKey, entry]) => ({
      user_id: user.id,
      week_number: Number(weekKey),
      completed_tasks: entry.completedTasks || [],
      manual_completed: Boolean(entry.manualCompleted)
    }));
    if (wpRows.length > 0) {
      const { error: wpErr } = await sb.from('weekly_progress').insert(wpRows);
      if (wpErr) throw wpErr;
    }

    // 3. Replace reflections
    await sb.from('reflections').delete().eq('user_id', user.id);
    const refRows = (state.reflections || []).map((r) => ({
      user_id: user.id,
      client_id: r.id,
      week_number: r.weekNumber,
      prompt_question: r.promptQuestion || '',
      content: r.content,
      mood_tag: r.moodTag || 'Reflective'
    }));
    if (refRows.length > 0) {
      const { error: refErr } = await sb.from('reflections').insert(refRows);
      if (refErr) throw refErr;
    }

    // 4. Replace evidence items
    await sb.from('evidence_items').delete().eq('user_id', user.id);
    const evRows = (state.evidence || []).map((e) => ({
      user_id: user.id,
      client_id: e.id,
      week_number: Number(e.weekNumber),
      title: e.title,
      url: e.url,
      category: e.category || 'Study Notes',
      notes: e.notes || ''
    }));
    if (evRows.length > 0) {
      const { error: evErr } = await sb.from('evidence_items').insert(evRows);
      if (evErr) throw evErr;
    }

    return { mode: 'cloud' };
  }

  SkillTrack.Storage = {
    readLocalState,
    writeLocalState,
    hasMeaningfulData,
    loadCloudState,
    saveProfileAndMeta,
    saveWeekProgress,
    upsertReflection,
    deleteReflection,
    upsertEvidence,
    deleteEvidence,
    syncFullStateToCloud
  };
})(window);
