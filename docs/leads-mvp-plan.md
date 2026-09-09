# Leads MVP Plan

## Working Product Direction

**Working name:** Leads

This rebuild keeps the strongest parts of the existing app:

- Dashboard
- Leads
- Contacts
- Summaries
- Settings only where needed to support the above

This rebuild removes the old crypto-specific positioning and turns the app into a clean, focused CRM for finding, organizing, and prioritizing companies and people for outreach.

The goal is not to build a bloated all-in-one CRM. The goal is to build a sharp, fast, dependable pipeline tool that feels polished and easy to sell.

## Core Product Principles

- Clean and calm interface over noisy analytics
- Fast daily workflow over feature sprawl
- Great lead review and contact management over niche data feeds
- Strong defaults with minimal setup
- Easy to re-theme and customize later

## What We Are Keeping

- Next.js app structure
- Supabase backend
- Dashboard shell and navigation pattern
- Lead list and lead detail pattern
- Contacts list pattern
- AI summary/report concept
- Shared UI component library

## What We Are Removing

- Wormhole page and Wormhole-specific analytics
- Crypto-specific categories and labels
- Token, chain, TVL, market cap, and sentiment as first-class CRM concepts
- DeFi and crypto source assumptions across the UI
- Crypto-branded copy, metadata, icons, filenames, and exports
- Old imported contacts and any legacy company-specific data

## MVP Scope

### 1. Dashboard

The dashboard should answer four questions quickly:

- How many leads are in the pipeline?
- Which leads need attention today?
- How many contacts do we have for active leads?
- What changed recently?

MVP dashboard blocks:

- Total leads
- Active leads
- Contacts count
- New leads in the last 7 or 30 days
- Recently added or recently updated leads
- Recent activity feed
- Shortcut actions like "Add lead" and "Add contact"

The dashboard should feel operational, not overly analytical.

### 2. Leads

The leads area becomes the center of the product.

MVP capabilities:

- Leads table with search
- Filter by status
- Filter by source
- Filter by owner later if we add ownership
- Sort by score, name, date added, last updated
- Create lead
- View lead detail
- Edit lead
- Archive or mark unqualified
- Add notes
- Tag leads

Lead detail should include:

- Company name
- Website
- Description
- Status
- Priority or score
- Source
- Tags
- Notes
- Related contacts
- Recent summary mentions if available

### 3. Contacts

Contacts should support simple outreach preparation.

MVP capabilities:

- Contacts table with search
- Filter by company
- Filter by role
- Create contact
- Edit contact
- Link contact to lead
- Show email, title, LinkedIn, phone if available, notes

The page should help a user answer:

- Who works at this company?
- Who should I reach out to?
- Do we already have enough contact coverage?

### 4. Summaries

Summaries remain useful, but they should be generalized.

MVP summaries should describe:

- New leads added
- Leads that changed status
- Contacts added
- Important notes or patterns
- Suggested next actions

This should become a pipeline summary, not a market intelligence report.

## Non-Goals for This Version

- Full deal/opportunity management
- Complex automations
- Deep reporting suite
- Multi-tenant billing
- Public integrations marketplace
- Highly customizable dashboards
- Advanced permissions model

We can plan for these, but they should not slow down the first clean rebuild.

## Clean Brand Direction

### Name

Use `Leads` as the working product name for now.

It is intentionally simple and neutral. We can rename later without changing the core structure again.

### Visual Direction

- Minimal, premium, calm
- High contrast but not harsh
- Neutral palette with one strong accent color
- Strong typography hierarchy
- Plenty of whitespace
- Clear table density and polished empty states

### Tone

- Clear
- Professional
- Helpful
- Direct
- Not salesy
- Not crypto-native

Example copy direction:

- `Crypto Leads` becomes `Leads`
- `Wormhole Integrations` becomes `Recent Activity` or `Priority Pipeline`
- `AI-generated daily reports on your lead pipeline` becomes `Daily pipeline summaries and suggested next actions`

## Information Architecture

Primary nav for MVP:

- Dashboard
- Leads
- Contacts
- Summaries
- Settings

What disappears:

- Wormhole
- Sentiment, unless we later repurpose it into a generic signals page

## Data Model Direction

The current schema is too crypto-shaped. We should simplify it around generic CRM records.

### Core tables for MVP

`companies` or keep `organizations`

- id
- name
- slug
- website
- description
- status
- priority_score
- source
- notes
- tags
- created_at
- updated_at

`contacts`

- id
- organization_id
- first_name
- last_name
- full_name
- title
- role
- email
- phone
- linkedin_url
- notes
- created_at
- updated_at

`activity_logs`

- id
- organization_id nullable
- contact_id nullable
- type
- summary
- metadata
- created_at

`daily_summaries`

- id
- summary_date
- executive_summary
- lead_changes_summary
- contact_changes_summary
- action_items
- raw_data
- created_at

### Fields to remove from core CRM tables

- chain
- chains
- telegram
- discord
- github
- tvl
- tvl_change_24h
- token_symbol
- token_price
- market_cap
- uses_wormhole
- wormhole_integration_type
- wormhole_first_seen
- defillama_slug
- coingecko_id

### Data reset strategy

- Start with a clean database for the new CRM
- Do not migrate old contacts
- Keep only schema ideas and reusable code patterns
- Seed with a few generic sample leads and contacts later for demos

## Functional Plan

### Phase 1: Rebrand and simplify

- Rename app metadata, sidebar, login, settings text, export filenames, and page copy to `Leads`
- Remove Wormhole nav item and route
- Hide or remove sentiment page for now
- Clean empty states and descriptions
- Remove crypto-specific labels from tables and cards

### Phase 2: Reshape the data model

- Simplify `organizations` into a generic company record or rename it to `leads`
- Remove crypto-specific columns from UI usage
- Add missing generic fields like phone and activity log support
- Define clear status values for a normal sales pipeline

Suggested status set:

- new
- researching
- ready_to_contact
- contacted
- follow_up
- qualified
- archived

### Phase 3: Complete the lead workflow

- Build create lead page
- Build edit lead flow
- Improve lead detail page
- Support notes and tags cleanly
- Add recent activity on the lead detail page

### Phase 4: Complete the contact workflow

- Build create contact flow
- Build edit contact flow
- Improve linking between leads and contacts
- Surface best contact information cleanly

### Phase 5: Generalize summaries

- Rewrite summary prompt and summary schema usage
- Base summaries on lead movement and contact additions
- Remove crypto, market, and Wormhole language entirely
- Keep recommended next actions as the most useful output

### Phase 6: Polish

- Improve spacing, typography, and states
- Add confirmation flows and toasts
- Make tables feel smoother and more consistent
- Improve loading states
- Add a clean demo data seed

## Technical Plan

### Frontend

- Keep the App Router structure
- Keep shadcn UI foundations
- Reduce pages to the core navigation
- Standardize page header patterns and empty states

### Backend

- Keep Supabase auth and database
- Stop treating service-role write access as the default app model
- Move toward proper authenticated CRUD routes
- Use simple server actions or route handlers where helpful

### AI

- Keep summaries
- Remove crypto-market analysis
- Focus on operational summaries and next actions
- Keep prompts structured so outputs remain predictable

## Design Goals for Each Screen

### Dashboard

- Feels calm and useful in under 5 seconds
- No clutter
- Strong hierarchy
- Short cards and concise activity list

### Leads

- Feels like the app's home base
- Fast scanning
- Great filtering
- Easy add and edit flow

### Contacts

- Clear relationship to companies
- Easy to assess contact quality
- Easy to add and update

### Summaries

- Clear daily recap
- Quick to skim
- Actionable without feeling robotic

## Acceptance Criteria for MVP

- App is fully branded as `Leads`
- No visible crypto or Wormhole copy remains in the main experience
- Navigation only includes the core sections
- A user can add, edit, view, and filter leads
- A user can add, edit, view, and filter contacts
- A user can read daily summaries written for pipeline management
- The interface feels polished and consistent on desktop and mobile
- The app loads cleanly with no broken routes in the main workflow

## Recommended Build Order

1. Rebrand the app shell to `Leads`
2. Remove Wormhole and crypto-specific navigation and pages from the primary flow
3. Simplify the schema and types around generic lead/contact records
4. Build missing lead create and edit flows
5. Build contact create and edit improvements
6. Rewrite summaries for general CRM use
7. Polish UI and seed demo data

## Immediate Next Step

Start with a focused foundation pass:

- rename the app to `Leads`
- remove Wormhole from navigation
- remove or hide the sentiment and Wormhole pages
- rewrite dashboard, summaries, and settings copy to generic CRM language

That gives us a cleaner product shell before we reshape the data model.
