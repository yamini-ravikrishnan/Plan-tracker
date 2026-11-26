-- ============================================================================
-- Plan Tracker: Psychology SkillTrack — Supabase PostgreSQL Schema & RLS
-- Run this script once inside your Supabase Project -> SQL Editor -> New query.
-- Safe to re-run (uses IF NOT EXISTS and DROP POLICY IF EXISTS).
-- ============================================================================

-- 1. Enable UUID extension (already enabled on most Supabase projects)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. PROFILES TABLE (User preferences, active learning week, display name)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Psychology Learner',
  learning_goal TEXT NOT NULL DEFAULT 'Build a strong 12-week foundation toward a professional career in psychology.',
  current_week INTEGER NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 12),
  weekly_hours_target TEXT NOT NULL DEFAULT '4–6 hours',
  reading_statuses JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. WEEKLY PROGRESS TABLE (Tracks per-week status & completed task IDs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.weekly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  manual_completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, week_number)
);

-- ============================================================================
-- 4. REFLECTIONS TABLE (Personal reflection journal entries per week or general)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  week_number INTEGER CHECK (week_number IS NULL OR (week_number BETWEEN 1 AND 12)),
  prompt_question TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  mood_tag TEXT NOT NULL DEFAULT 'Curious',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, client_id)
);

-- ============================================================================
-- 5. EVIDENCE ITEMS TABLE (Assignment links, study notes, presentations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Study Notes',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, client_id)
);

-- ============================================================================
-- 6. AUTOMATIC updated_at TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_weekly_progress_updated_at ON public.weekly_progress;
CREATE TRIGGER trg_weekly_progress_updated_at
  BEFORE UPDATE ON public.weekly_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reflections_updated_at ON public.reflections;
CREATE TRIGGER trg_reflections_updated_at
  BEFORE UPDATE ON public.reflections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_evidence_items_updated_at ON public.evidence_items;
CREATE TRIGGER trg_evidence_items_updated_at
  BEFORE UPDATE ON public.evidence_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 7. AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''), split_part(NEW.email, '@', 1), 'Psychology Learner')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) — Users can ONLY access their own data
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Weekly progress policies
DROP POLICY IF EXISTS "Users read own weekly progress" ON public.weekly_progress;
CREATE POLICY "Users read own weekly progress" ON public.weekly_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own weekly progress" ON public.weekly_progress;
CREATE POLICY "Users insert own weekly progress" ON public.weekly_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own weekly progress" ON public.weekly_progress;
CREATE POLICY "Users update own weekly progress" ON public.weekly_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own weekly progress" ON public.weekly_progress;
CREATE POLICY "Users delete own weekly progress" ON public.weekly_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Reflections policies
DROP POLICY IF EXISTS "Users read own reflections" ON public.reflections;
CREATE POLICY "Users read own reflections" ON public.reflections
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own reflections" ON public.reflections;
CREATE POLICY "Users insert own reflections" ON public.reflections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own reflections" ON public.reflections;
CREATE POLICY "Users update own reflections" ON public.reflections
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own reflections" ON public.reflections;
CREATE POLICY "Users delete own reflections" ON public.reflections
  FOR DELETE USING (auth.uid() = user_id);

-- Evidence items policies
DROP POLICY IF EXISTS "Users read own evidence" ON public.evidence_items;
CREATE POLICY "Users read own evidence" ON public.evidence_items
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own evidence" ON public.evidence_items;
CREATE POLICY "Users insert own evidence" ON public.evidence_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own evidence" ON public.evidence_items;
CREATE POLICY "Users update own evidence" ON public.evidence_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own evidence" ON public.evidence_items;
CREATE POLICY "Users delete own evidence" ON public.evidence_items
  FOR DELETE USING (auth.uid() = user_id);
