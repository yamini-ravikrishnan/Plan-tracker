/**
 * auth.js — Supabase Client Initialisation & Authentication Wrapper
 * Supports Email/Password Sign Up, Sign In, Sign Out, Password Reset,
 * plus safe Local/Guest Mode when Supabase credentials are not configured yet.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});
  const Config = SkillTrack.Config;

  let client = null;
  let activeConfig = { url: '', anonKey: '' };

  function readSavedCredentials() {
    try {
      const raw = global.localStorage.getItem(Config.CUSTOM_SUPABASE_CONFIG_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.url === 'string' && typeof parsed.anonKey === 'string') {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    } catch (_err) {
      return null;
    }
    return null;
  }

  function resolveCredentials() {
    const fileUrl = (Config.SUPABASE_URL || '').trim();
    const fileKey = (Config.SUPABASE_ANON_KEY || '').trim();
    if (fileUrl && fileKey) {
      return { url: fileUrl, anonKey: fileKey, source: 'config.js' };
    }
    const saved = readSavedCredentials();
    if (saved && saved.url && saved.anonKey) {
      return { url: saved.url, anonKey: saved.anonKey, source: 'browser-settings' };
    }
    return { url: '', anonKey: '', source: 'none' };
  }

  function looksLikeServiceRoleKey(key) {
    // Basic safety check: JWT payload containing "service_role" must never be accepted on frontend
    try {
      const parts = key.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload && payload.role === 'service_role';
    } catch (_err) {
      return false;
    }
  }

  function initClient() {
    const creds = resolveCredentials();
    activeConfig = creds;

    if (!creds.url || !creds.anonKey) {
      client = null;
      return null;
    }

    if (looksLikeServiceRoleKey(creds.anonKey)) {
      client = null;
      console.error('Blocked unsafe service_role key in frontend configuration.');
      return null;
    }

    if (!global.supabase || typeof global.supabase.createClient !== 'function') {
      client = null;
      return null;
    }

    client = global.supabase.createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return client;
  }

  function isConfigured() {
    if (!client) initClient();
    return Boolean(client);
  }

  function getClient() {
    if (!client) initClient();
    return client;
  }

  function getConfigSummary() {
    const creds = resolveCredentials();
    return {
      configured: Boolean(creds.url && creds.anonKey && global.supabase),
      url: creds.url,
      hasAnonKey: Boolean(creds.anonKey),
      source: creds.source
    };
  }

  function saveCustomCredentials(url, anonKey) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (anonKey || '').trim();

    if (!cleanUrl || !cleanKey) {
      throw new Error('Please enter both your Supabase Project URL and public Anon Key.');
    }
    if (!cleanUrl.startsWith('https://')) {
      throw new Error('Supabase Project URL must start with https://');
    }
    if (looksLikeServiceRoleKey(cleanKey)) {
      throw new Error(
        'Security stop: You pasted a service_role key! Only use the public "anon" key in the browser.'
      );
    }

    global.localStorage.setItem(
      Config.CUSTOM_SUPABASE_CONFIG_KEY,
      JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
    );
    initClient();
    return getConfigSummary();
  }

  function clearCustomCredentials() {
    global.localStorage.removeItem(Config.CUSTOM_SUPABASE_CONFIG_KEY);
    initClient();
  }

  async function getCurrentUser() {
    const sb = getClient();
    if (!sb) return null;
    const { data, error } = await sb.auth.getUser();
    if (error) return null;
    return data ? data.user : null;
  }

  async function signUp(email, password, displayName) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase is not connected yet.');
    const { data, error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: (displayName || '').trim() || 'Psychology Learner'
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase is not connected yet.');
    const { data, error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const sb = getClient();
    if (!sb) return;
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  }

  async function sendPasswordReset(email) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase is not connected yet.');
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: global.location.href.split('#')[0]
    });
    if (error) throw error;
  }

  function onAuthStateChange(callback) {
    const sb = getClient();
    if (!sb) return { unsubscribe: function () {} };
    const { data } = sb.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data && data.subscription ? data.subscription : { unsubscribe: function () {} };
  }

  SkillTrack.Auth = {
    initClient,
    isConfigured,
    getClient,
    getConfigSummary,
    saveCustomCredentials,
    clearCustomCredentials,
    getCurrentUser,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    onAuthStateChange
  };
})(window);
