# Setup, Database, GitHub Pages Deployment & Testing Guide

This guide walks you step by step through connecting **Supabase** (cloud database + authentication), publishing your app on **GitHub Pages**, and running the **Testing Checklist**.

---

## Part 1: Run Locally (Instant Start)

You can use the app immediately in **Local Fallback Mode**:

1. **Option A (Simplest):** Open `d:\Plan tracker\index.html` directly in Chrome, Edge, or Firefox.
2. **Option B (Recommended local server — required if testing Supabase email/redirect auth):**
   - In VS Code, install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.
   - Or in a terminal inside the project folder, run any static server (for example `npx serve .` or `python -m http.server 8080`) and open `http://localhost:8080`.

---

## Part 2: Supabase Database & Authentication Setup

Supabase gives you a free PostgreSQL database, user sign-up/sign-in, and **Row Level Security (RLS)** so each learner can only read and modify their own progress.

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose a name (e.g., `psychology-skilltrack`), set a strong database password, and pick the region closest to you.
3. Wait ~1–2 minutes for the database to finish provisioning.

### Step 2: Create the Database Tables & RLS Policies
1. In your Supabase Dashboard left sidebar, click **SQL Editor** → **New query**.
2. Open the file `supabase/schema.sql` from this project, copy **all** of its contents, and paste it into the SQL Editor.
3. Click **Run** (or press `Ctrl + Enter`).
4. Verify it succeeded with no errors. This creates:
   - `public.profiles`
   - `public.weekly_progress`
   - `public.reflections`
   - `public.evidence_items`
   - Automatic `updated_at` triggers and `handle_new_user()` profile trigger
   - Strict Row Level Security policies (`auth.uid() = id` / `auth.uid() = user_id`)

### Step 3: Configure Authentication URLs
1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your GitHub Pages URL (e.g., `https://YOUR-USERNAME.github.io/psychology-skilltrack/`) or `http://localhost:8080` while testing locally.
3. Under **Redirect URLs**, add both:
   - `http://localhost:8080/*` (or your Live Server port)
   - `https://YOUR-USERNAME.github.io/psychology-skilltrack/*`
4. *(Optional for quicker testing)*: Under **Authentication** → **Providers** → **Email**, you can toggle **Confirm email** off while practicing, or keep it on for production and check your inbox when signing up.

### Step 4: Connect the Frontend (Safely!)
1. Go to **Project Settings** (gear icon) → **API** (or **Data API** / **API Keys**).
2. Copy ONLY these two **public** values:
   - **Project URL** (looks like `https://abcdefghijkl.supabase.co`)
   - **anon / public** key (starts with `eyJ...`)
   > ⚠️ **NEVER copy or expose the `service_role` or secret key in `js/config.js` or any frontend file.** The app even includes a built-in guard that blocks accidental `service_role` keys.
3. Paste them into `js/config.js`:
   ```js
   SUPABASE_URL: 'https://YOUR-PROJECT-ID.supabase.co',
   SUPABASE_ANON_KEY: 'YOUR-PUBLIC-ANON-KEY',
   ```
   *(Alternatively, you can paste them inside the app under **Account & Backup → Supabase Public Connection** without editing code.)*

---

## Part 3: GitHub Repository & GitHub Pages Deployment

### Step 1: Create a GitHub Repository
1. Log in to [https://github.com](https://github.com) and click **New repository**.
2. Name it `psychology-skilltrack` (or `plan-tracker`), keep it **Public** (for free GitHub Pages), and click **Create repository**.

### Step 2: Upload or Push Your Files
If using Git in your terminal inside `d:\Plan tracker`:
```bash
git init
git add .
git commit -m "Initial release: Plan Tracker Psychology SkillTrack"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/psychology-skilltrack.git
git push -u origin main
```
*(Or click **uploading an existing file** on GitHub.com and drag in all folders/files.)*

### Step 3: Enable GitHub Pages
1. Open your repository on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Wait ~1–2 minutes and refresh the page. GitHub will display your live URL:
   `https://YOUR-USERNAME.github.io/psychology-skilltrack/`

---

## Part 4: Testing Checklist

### A. Automated Logic & Integrity Tests
Open `tests/test-runner.html` in your browser and confirm **all 9 automated checks pass**:
- [ ] All 12 modules exist with 4–6 hours estimate and all 10 required sections
- [ ] All 8 required books + OpenStax Psychology 2e exist in the Reading Library
- [ ] Overall progress starts at 0% (60 total tasks across 12 weeks)
- [ ] Partial week completion calculates accurately and ignores invalid task IDs
- [ ] Completing all tasks in a week marks the week as Completed (100%)
- [ ] URL validator accepts `https://` and blocks `javascript:` URLs
- [ ] JSON import validator rejects malformed backups and normalises valid backups

### B. Manual End-to-End Verification
- [ ] **Navigation & Responsiveness:** Test Dashboard, 12-Week Plan, Weekly Module, Reflection Journal, Reading Library, Evidence Vault, and Account & Backup on desktop and mobile widths (`375px`, `768px`, `1280px`).
- [ ] **Dashboard Widgets:** Confirm welcome message, 12-week journey map, total tasks completed, overall %, current week, upcoming activities, weekly progress indicators, quick resources, and last updated timestamp all update live when checking off a task.
- [ ] **Checklist & Progress Persistence:** Tick 2 tasks in Week 1, refresh the page (`F5`), and verify tasks + percentages remain saved.
- [ ] **Reflection Journal:** Add a reflection from Week 1 module, edit it in Reflection Journal, filter by Week 1, and search by keyword.
- [ ] **Evidence Vault:** Add a valid `https://` link, verify invalid URLs are rejected cleanly, and delete a test entry.
- [ ] **Reading Library:** Search for "Rogers" or filter by "Free / Open Access Only", change reading status, and verify OpenStax Psychology 2e links open in a new tab.
- [ ] **Export & Import:** Click **Download Progress Backup (.json)**, reset progress, then import the `.json` file and verify all tasks, reflections, and evidence return.
- [ ] **Cloud Sync & Cross-Device Persistence (with Supabase):**
  1. Sign up with an email & password.
  2. Tick tasks, add a reflection, and add an evidence link.
  3. Sign out, sign back in (or open an Incognito window / another device), and confirm all data reloads from Supabase.
