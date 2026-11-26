/**
 * config.js — Application & Supabase Public Configuration
 *
 * SECURITY NOTE:
 * Only put your Supabase Project URL and public "anon" key here.
 * NEVER place a Supabase "service_role" or secret key in frontend code!
 * Row Level Security (RLS) in supabase/schema.sql protects user data.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});

  SkillTrack.Config = {
    APP_NAME: 'Plan Tracker – Psychology SkillTrack',
    APP_VERSION: '1.0.0',

    // Replace these two placeholders with your Supabase Project URL & Anon Key,
    // OR configure them directly inside the app's Settings -> Cloud Connection panel.
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',

    // LocalStorage keys (used for offline/guest fallback & caching)
    STORAGE_KEY: 'psych_skilltrack_state_v1',
    CUSTOM_SUPABASE_CONFIG_KEY: 'psych_skilltrack_supabase_cfg_v1'
  };
})(typeof window !== 'undefined' ? window : globalThis);
