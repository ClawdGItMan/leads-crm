# Leads

Leads is a focused CRM built for small teams that want a clean pipeline without the baggage of a heavily customized vertical tool.

The MVP is centered on:

- Dashboard
- Leads
- Contacts
- Summaries
- Settings

## Stack

- Next.js App Router
- Supabase auth and Postgres
- Tailwind CSS
- Anthropic summaries with a local fallback when no API key is configured

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Optional Environment Variables

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_SUMMARY_MODEL`

## Notes

- The database schema is workspace-aware, but the MVP exposes a single default workspace in the UI.
- Legacy crypto, Wormhole, sentiment, scraper, and digest workflows have been removed from the active product surface.
- CSV import and on-demand summaries are the only automated workflows in v1.
