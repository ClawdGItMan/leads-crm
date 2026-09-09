# Scrape Results - February 22, 2026

## Summary

All scraper scripts were run against live APIs and data was inserted/updated in Supabase. Four data sources were scraped plus a HubSpot CRM import.

## Database Totals (after all scrapers)

| Table | Count |
|---|---|
| Organizations | 1,867 |
| Wormhole Integrations | 15 |
| Sentiment Records | 15 |
| Contacts | 0 |
| Scrape Logs | 19 |

### Organizations by Source

| Source | Count |
|---|---|
| HubSpot | 1,403 |
| DeFiLlama | 444 |
| CoinGecko | 20 |

### Organizations by Lead Status

| Status | Count |
|---|---|
| New | 672 |
| Researching | 455 |
| Qualified | 353 |
| Disqualified | 214 |
| Responded | 117 |
| Contacted | 56 |

### Wormhole Users

639 organizations are flagged as Wormhole users.

---

## Scraper Results (This Run)

### 1. DeFiLlama (run-scrapers.cjs)

- **Status**: Partially successful
- **Protocols**: 7,119 total found, filtered to 2,561 relevant (multi-chain or >$1M TVL), top 200 by TVL processed
- **Results**: 2 created, 198 updated
- **Stablecoins**: FAILED - the API endpoint `api.llama.fi/stablecoins` is returning 404
  - **Fix applied**: Updated URL to `stablecoins.llama.fi/stablecoins` in all three scripts
  - After fix, stablecoins endpoint returns 338 assets (0 new created since they were already in the DB from a prior run)

### 2. CoinGecko (run-scrapers.cjs)

- **Status**: Successful
- **Trending coins found**: 15
- **Results**: 7 created, 8 updated
- **Duration**: 38.7 seconds
- **New coins added**: pippin, Dogecoin, LayerZero, Lighter, Morpho, Monad, Polkadot
- **Updated coins**: Bitcoin, Bittensor, Punch, Solana, Pudgy Penguins, XRP, Internet Computer, Pi Network
- **Rate limiting**: 2.2s delay between calls (CoinGecko free tier = 30 calls/min)

### 3. Wormholescan (run-scrapers.cjs)

- **Status**: Successful
- **Operations found**: 50 recent cross-chain operations
- **Results**: 2 new integrations created, 48 existing updated
- **Duration**: 10.9 seconds
- **What it does**: Tracks bridge operations and links them to organizations by token symbol. Also flags organizations as Wormhole users.

### 4. LunarCrush Sentiment (run-scrapers.cjs)

- **Status**: FAILED - API fully rate limited
- **Records created**: 0
- **Errors**: All 50 token requests returned 402 (Payment Required) or 429 (Too Many Requests)
- **Duration**: 110.6 seconds (due to 2.1s delays between calls)
- **Root cause**: The LunarCrush API key appears to be expired or the free tier quota is exhausted. All endpoints (v1, v2, v3, list) return 402/429.
- **Note**: 15 sentiment records exist from previous successful runs.

### 5. HubSpot Import (import-hubspot.cjs)

- **Status**: Successful
- **CSV file**: hubspot-crm-exports-all-deals-2026-02-22.csv (1,967 deals)
- **Results**: 0 created, 1,967 updated (all matched existing organizations)
- **Deal stages imported**:
  - On Hold: 490
  - Live: 444
  - (empty): 318
  - Closed Lost: 241
  - Prospect: 154
  - Strong Interest: 78
  - Meeting Scheduled: 57
  - Sprint - Invited: 57
  - Negotiation: 48
  - Developing: 39
  - Pre-Launch: 29
  - Sprint - Participating: 12

---

## Scripts Run

| Script | What It Does | Outcome |
|---|---|---|
| `run-scrapers.cjs` | Main scraper: DeFiLlama, CoinGecko, Wormholescan, LunarCrush | 3 of 4 sources succeeded |
| `run-extras.cjs` | Stablecoins + LunarCrush (top 10 known tokens) | Stablecoins fixed, LunarCrush rate limited |
| `run-fixes.cjs` | Stablecoins (chunked) + LunarCrush (fallback endpoints) | Stablecoins fixed, LunarCrush rate limited |
| `import-hubspot.cjs` | Import HubSpot CRM deals from CSV | All 1,967 deals updated |

---

## Bugs Fixed

1. **Stablecoins API URL**: The DeFiLlama stablecoins endpoint moved from `api.llama.fi/stablecoins` to `stablecoins.llama.fi/stablecoins`. The old URL returns 404. Fixed in all three scripts:
   - `run-scrapers.cjs` (line 157)
   - `run-extras.cjs` (line 52)
   - `run-fixes.cjs` (line 41)

---

## Issues Requiring Attention

1. **LunarCrush API key expired/exhausted**: All LunarCrush API endpoints return 402 or 429. A new API key or a paid plan is needed to resume sentiment data collection. No new sentiment records were created this run.

2. **No contacts in database**: The contacts table is empty (0 records). None of the scrapers populate contacts -- this would need a separate enrichment step (e.g., scraping team pages, LinkedIn, or using an enrichment API).
