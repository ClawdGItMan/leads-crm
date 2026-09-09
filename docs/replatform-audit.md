# CRM Replatform Audit

## What already exists

- Next.js app router frontend with a protected dashboard shell and reusable UI components.
- Supabase-backed data model for organizations, contacts, announcements, daily summaries, sentiment data, scrape logs, and Wormhole integrations.
- Trigger.dev job pipeline for scraping, enrichment, sentiment collection, summary generation, and digest sending.
- Core CRM views for dashboard, leads, lead detail, contacts, summaries, settings, and a dedicated Wormhole analytics page.
- Contact enrichment via Apollo and Hunter plus CSV export and email digest scaffolding.

## What is reusable

- General lead and contact management structure.
- Dashboard, table, detail, summary, settings, and auth page patterns.
- Supabase + Trigger.dev + Resend integration pattern.
- Announcement tracking, scrape logging, and AI summary workflow.
- UI component library and app layout structure.

## What is tightly coupled to crypto and Wormhole

- Organization taxonomy is hard-coded to crypto categories.
- Lead scoring prioritizes Wormhole usage, multi-chain activity, TVL, and token metadata.
- Database schema stores crypto-specific fields directly on `organizations`.
- Dedicated `wormhole_integrations` table and full Wormhole analytics route.
- Ingestion sources are specific to DeFi and crypto social data providers.
- AI summary prompt is written for a Wormhole BD team, not a general CRM use case.
- Branding, metadata, login copy, CSV filename, and page descriptions still say "Crypto Leads".

## What is missing for a sellable multi-company product

- Multi-tenant account model: workspaces, organizations/teams, memberships, roles, permissions.
- Real access control on dashboard routes and write APIs.
- Configurable pipeline stages, categories, scoring rules, and data source connectors.
- Standard CRM objects beyond leads and contacts: companies/accounts, deals/opportunities, activities/tasks, notes history.
- CRUD completeness for leads and companies; the leads page links to `/leads/new`, but that route does not exist yet.
- User/admin settings that actually persist to the database.
- Import/export flows for generic customer data, not just crypto-shaped exports.
- Tests, CI, deployment docs, and product documentation.
- Dependency installation in this zip snapshot; local `build` and `lint` cannot run until packages are installed.

## Recommended rebuild path

### Phase 1: Productize the foundation

- Rename the app and strip crypto/Wormhole language from global metadata, auth, sidebar, settings, and empty states.
- Replace crypto categories and scoring constants with configurable CRM settings stored in the database.
- Move crypto-specific fields off `organizations` into optional source-specific extension tables.
- Introduce `workspaces`, `workspace_memberships`, and workspace-scoped row ownership.

### Phase 2: Preserve the structure, generalize the product

- Keep the current route structure: dashboard, leads, contacts, summaries, settings.
- Replace the Wormhole page with a generic analytics or signals page.
- Keep Trigger.dev, but turn source jobs into pluggable connectors with per-workspace configuration.
- Keep AI summaries, but rewrite prompts around pipeline health, lead movement, notable signals, and recommended next actions.

### Phase 3: Fill the product gaps

- Add create/edit flows for leads, companies, contacts, and activities.
- Add customizable statuses, scoring weights, saved filters, imports, exports, and workspace settings.
- Add audit logging, tests, seed data, and deployment/setup docs.

## Suggested next implementation order

1. Rebrand the app shell and remove hard-coded "Crypto Leads" / Wormhole copy.
2. Redesign the schema for multi-tenant CRM core plus optional connector-specific data.
3. Replace Wormhole and crypto scoring logic with configurable scoring and generic signals.
4. Convert data ingestion jobs into optional connectors instead of core product assumptions.
5. Add missing CRUD flows and admin settings persistence.
