# Plan Tracker – Individual Psychology Skill Learning Tracker

A calm, structured **12-week psychology learning dashboard and portfolio tracker** built for complete beginners aspiring to become professional psychologists.

Built with **HTML5**, **CSS3**, and **Vanilla JavaScript**, with optional **Supabase** cloud authentication and PostgreSQL persistence (plus automatic `localStorage` fallback so it works right out of the box) and ready for free hosting on **GitHub Pages**.

---

## Project Folder Structure & File Guide

```text
Plan tracker/
├── index.html                  # Main single-page app shell, navigation & modals
├── css/
│   ├── tokens.css              # Design palette (#F7F7F0, #6F9584, #527F78, #D99A68), fonts, radii & shadows
│   ├── layout.css              # Responsive desktop sidebar, mobile drawer, bottom nav & grids
│   └── components.css          # Cards, progress ring, progress bars, checklists, forms, modals & toasts
├── js/
│   ├── config.js               # Public Supabase URL & Anon Key placeholders + storage key names
│   ├── data/
│   │   ├── curriculum.js       # Complete 12-week psychology curriculum (all 10 sections per week)
│   │   └── library.js          # Curated Reading Library (all 8 core books + OpenStax free textbook first)
│   ├── core/
│   │   ├── progress.js         # Pure progress calculation, URL validation & JSON import/export validation
│   │   ├── auth.js             # Supabase authentication wrapper & frontend safety check against service_role keys
│   │   └── storage.js          # Cloud-first Supabase persistence + scoped per-user localStorage fallback
│   └── ui/
│       ├── renderers.js        # Safe HTML renderers (escaped text) for all 7 views
│       └── app.js              # App controller, router, search/filter state & event handlers
├── supabase/
│   └── schema.sql              # Complete Supabase Postgres tables, triggers & Row Level Security (RLS)
├── tests/
│   └── test-runner.html        # Browser-based automated unit & data-integrity test suite
├── docs/
│   └── SETUP_AND_DEPLOY.md     # Step-by-step Supabase, GitHub Pages & Testing guide
└── README.md                   # This overview and quick-start guide
```

### What Each File Does (Beginner Overview)

- **`index.html`**: Defines the page structure—the sidebar, top bar with last-updated timestamp, 7 view containers, mobile bottom navigation, and the Sign In / Create Account modal.
- **`css/tokens.css`**: Holds all design variables in one place (warm cream `#F7F7F0`, sage green `#6F9584`, muted blue `#527F78`, soft terracotta `#D99A68`, white cards, spacing, shadows).
- **`css/layout.css`**: Controls how the sidebar and main content arrange on desktop, tablet, and mobile screens.
- **`css/components.css`**: Styles reusable visual parts: progress ring, linear bars, interactive checklists, badges, buttons, forms, and toast notifications.
- **`js/config.js`**: Stores the public Supabase URL and public `anon` key (never a secret/service key).
- **`js/data/curriculum.js`**: Holds all 12 beginner psychology modules (4–6 hrs/week), each with learning objectives, detailed topics, study sessions, recommended reading, practical exercises, interactive tasks, deliverables, and reflection questions.
- **`js/data/library.js`**: Holds the 8 requested psychology books plus free open-access resources, prioritising *OpenStax Psychology 2e*.
- **`js/core/progress.js`**: Calculates overall progress %, completed task counts, weekly completion statuses, upcoming tasks, and validates imported JSON backups.
- **`js/core/auth.js`**: Connects to Supabase Auth (`signUp`, `signIn`, `signOut`, `sendPasswordReset`) and refuses accidental `service_role` keys.
- **`js/core/storage.js`**: Reads and writes user progress to Supabase (`profiles`, `weekly_progress`, `reflections`, `evidence_items`), using `localStorage` only as an offline cache or when in Local Mode.
- **`js/ui/renderers.js`**: Generates the HTML for Dashboard, 12-Week Plan, Weekly Module, Reflection Journal, Reading Library, Evidence Vault, and Account & Backup.
- **`js/ui/app.js`**: Coordinates navigation, checkbox updates, search/filtering, JSON export/import, and cloud sync.
- **`supabase/schema.sql`**: SQL script you paste into Supabase once to create secure user-isolated database tables.

---

## Quick Start (Local)

1. Open `index.html` in your web browser (or run a local static server such as VS Code Live Server or `npx serve .`).
2. Start ticking off tasks in **Week 1**, writing reflections, and adding evidence links—progress saves automatically!
3. Open `tests/test-runner.html` in your browser to run the built-in automated checks.
4. When ready for multi-device cloud sync and GitHub Pages hosting, follow [docs/SETUP_AND_DEPLOY.md](docs/SETUP_AND_DEPLOY.md).
