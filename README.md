# Leads

A small CRM for teams that want one clean place for leads, contacts and a weekly pipeline summary, without adopting a platform.

## Status (April 2026)

Working MVP. Dashboard, leads (list, detail, create, edit, notes, tags), contacts, CSV import, on-demand AI pipeline summaries, settings. Runs against a real Supabase project and deploys to Vercel. Not in use by a customer; built to test whether the rebuild described below was worth doing.

## Why it exists

This started life as an internal lead tool for cross-chain BD outreach: crypto-specific categories, token and TVL fields on every company, a scraper pipeline and a scoring model tuned to one partner's ecosystem. It worked for that one job and was unsellable for any other.

I ran a replatform audit ([`docs/replatform-audit.md`](docs/replatform-audit.md)) to separate what was reusable (the app shell, the lead/contact/summary patterns, the Supabase integration) from what was welded to the original use case (the taxonomy, the schema, the ingestion, the prompts, the branding). The MVP plan ([`docs/leads-mvp-plan.md`](docs/leads-mvp-plan.md)) then rebuilt the product around the reusable half with a workspace-aware schema, and the GTM plan ([`docs/leads-gtm-plan.md`](docs/leads-gtm-plan.md)) worked out who would buy it and at what price. All three were written before the code.

The legacy crypto pages, scrapers and imported data were removed from the product surface. `/wormhole` and `/sentiment` remain only as redirects to the dashboard.

## What it does

- **Dashboard.** Totals, active leads, contacts, new leads in the last 7 or 30 days, a recent-activity feed and shortcut actions.
- **Leads.** Table with search, status and source filters, sorting by priority score; a detail view with related contacts, notes and tags; create and edit forms validated with Zod.
- **Contacts.** Searchable table, linked to leads, with role, title, email, LinkedIn and notes.
- **CSV import.** Upload a spreadsheet of companies; columns are normalized and statuses and sources mapped to the app's values.
- **Summaries.** Generates a pipeline summary (executive summary, lead changes, contact changes, action items) from recent activity. Uses Claude when `ANTHROPIC_API_KEY` is set and a deterministic local fallback when it is not, so the feature demos without a key.

## Stack

Next.js 16 App Router, TypeScript strict, Tailwind CSS 4, shadcn/ui, Supabase (Postgres + Auth), Anthropic SDK, Zod.

The schema (`supabase/migrations/001_initial_schema.sql`) is workspace-aware: `workspaces`, `workspace_memberships`, and every data table carries a `workspace_id` with row-level security policies keyed on membership. The MVP exposes a single default workspace in the UI.

A note on access: the app ships with `APP_ACCESS_MODE = "protected_preview"` (`src/lib/constants.ts`), which serves the default workspace through the server-side service client so a preview deployment can sit behind Vercel's own protection without per-user sign-in. The membership-based RLS policies are in place for when that flag is flipped to real auth. Do not deploy it in preview mode on a public URL.

## How to run

You need a Supabase project.

1. Create a project at [supabase.com](https://supabase.com) and run `supabase/migrations/001_initial_schema.sql` in the SQL editor (or `supabase db push` with the CLI).
2. Install and configure:

   ```bash
   npm install
   cp .env.example .env.local
   ```

   Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from the project's API settings. `ANTHROPIC_API_KEY` is optional; without it summaries use the local fallback.

3. Start it:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The first visit creates the default workspace.

## What I learned

- Writing the audit before touching code was the right order. It turned "rebuild the CRM" into a short list of things to keep and a longer list of things to cut, and the cut list was most of the original app.
- A local fallback for the AI feature is worth more than it looks. It means the product demos, tests and screenshots do not depend on a paid key, and it forced the summary format to be explicit rather than whatever the model felt like.
- Getting the workspace model into the schema on day one cost almost nothing; retrofitting it onto the original single-tenant tables would have been the entire project.

## Built with AI

The audit, the MVP plan and the GTM plan were the specification. Claude Code built the app from them in April 2026; I judged it by clicking through the flows and reading the generated summaries.
