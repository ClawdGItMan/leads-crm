# Wormhole Ecosystem Research Report

**Compiled:** February 22, 2026
**Purpose:** Business development lead identification for cross-chain crypto projects

---

## Table of Contents

1. [Supported Chains](#1-supported-chains)
2. [NTT (Native Token Transfer) Partners](#2-ntt-native-token-transfer-partners)
3. [Recent Integrations (Last 3 Months)](#3-recent-integrations-last-3-months)
4. [Wormhole Gateway](#4-wormhole-gateway)
5. [Wormhole Bridge Activity](#5-wormhole-bridge-activity)
6. [Mayan Finance & Portal Swap](#6-mayan-finance--portal-swap)
7. [Wormhole SDK / Connect](#7-wormhole-sdk--connect)
8. [Competitors](#8-competitors)
9. [Recent News (Jan-Feb 2026)](#9-recent-news-jan-feb-2026)
10. [Key Wormhole Supported Assets](#10-key-wormhole-supported-assets)

---

## 1. Supported Chains

Wormhole currently supports **40+ blockchains** across 6 different runtimes (EVM, Solana/SVM, Move, Cosmos/IBC, Algorand, NEAR). As of February 2026, the confirmed supported chains are:

### Active Chains (as listed on wormhole.com/platform/blockchains)

| # | Chain | Runtime |
|---|-------|---------|
| 1 | Ethereum | EVM |
| 2 | Solana | SVM |
| 3 | Arbitrum | EVM (L2) |
| 4 | Optimism | EVM (L2) |
| 5 | Base | EVM (L2) |
| 6 | Polygon | EVM |
| 7 | Avalanche (C-Chain) | EVM |
| 8 | BNB Chain | EVM |
| 9 | Fantom | EVM |
| 10 | Sui | Move |
| 11 | Aptos | Move |
| 12 | Celo | EVM |
| 13 | Moonbeam | EVM |
| 14 | Klaytn | EVM |
| 15 | Blast | EVM (L2) |
| 16 | Scroll | EVM (L2) |
| 17 | Mantle | EVM (L2) |
| 18 | SEI | EVM / Cosmos |
| 19 | Injective | Cosmos |
| 20 | Osmosis | Cosmos |
| 21 | Neutron | Cosmos |
| 22 | Dymension | Cosmos |
| 23 | Stargaze | Cosmos |
| 24 | Celestia | Cosmos |
| 25 | Provenance | Cosmos |
| 26 | Algorand | Algorand |
| 27 | NEAR | NEAR |
| 28 | Polkadot | Substrate |
| 29 | PYTHNET | SVM |
| 30 | Snax Chain | EVM |
| 31 | World Chain | EVM |
| 32 | X Layer | EVM |
| 33 | Seda | Cosmos |
| 34 | Linea | EVM (L2) -- added Feb 13, 2026 |
| 35 | XRP Ledger EVM Sidechain | EVM -- added Feb 11, 2026 |
| 36 | Mezo | EVM (Bitcoin L2) |
| 37 | Unichain | EVM (L2) |

### Recently Deprecated (Summer 2025)

The following chains were fully deprecated -- Guardian Network disconnected full nodes:

- **Terra Classic** -- low activity post-collapse
- **Terra 2.0** -- low transaction volume
- **Oasis (Emerald)** -- insufficient usage
- **Aurora** -- low demand
- **Acala** -- low demand
- **Karura** -- low demand
- **XPLA** -- low volume

### Transitioned to Community-Supported

These Cosmos chains lost Wormhole-subsidized IBC relaying and Portal frontend hosting. They are still technically connected but community-maintained:

- Injective
- Osmosis
- Evmos
- Kujira

### BD Takeaway

Wormhole's chain coverage is strong for EVM and non-EVM ecosystems. Key gaps relative to competitors: no TON support (LayerZero has this), limited Bitcoin L2 coverage beyond Mezo/Stacks. New chain additions like Linea and XRPL EVM show continued expansion.

---

## 2. NTT (Native Token Transfer) Partners

NTT is Wormhole's flagship framework for making tokens natively multichain. It uses a burn-and-mint or lock-and-mint model where the token issuer retains full control. No liquidity pools, no LP fees, no slippage, no MEV risk.

### Key Stats

- **100+ tokens** launched via NTT across 40+ chains
- **$170 billion** combined market cap of NTT-powered tokens
- Open-source framework on GitHub

### Major NTT Deployments

| Project | Token(s) | Chains Deployed | Notes |
|---------|----------|-----------------|-------|
| **Lido** | wstETH | Ethereum, BNB Chain | Largest ETH staking protocol (~$26B TVL). wstETH multichain via NTT. |
| **ether.fi** | ETHFI | Ethereum, Arbitrum | Cross-chain restaking token |
| **Puffer Finance** | pufETH | Ethereum, multiple L2s | Liquid restaking protocol |
| **Sky (MakerDAO)** | USDS | Ethereum, Solana | $880M+ transferred via NTT. Major stablecoin expansion. |
| **Ripple** | RLUSD | Ethereum, Base, Optimism, Ink, Unichain | $1.3B stablecoin going multichain via NTT. Pending NYDFS approval for wider rollout. |
| **M0** | M | Ethereum, Arbitrum, Base, Solana, Optimism | Decentralized stablecoin infrastructure |
| **Stacks** | sBTC, STX | Stacks, Solana, Sui | $1.5B in combined value. First decentralized BTC peg going multichain. |
| **Dogecoin Foundation** | DOGE | Dogecoin, Solana | $35B market cap asset going multichain via NTT |
| **Hyperliquid** | HYPE | Hyperliquid, Base, Solana, Unichain | Fast-growing DEX token |
| **RedStone** | RED | Ethereum, Solana, Base | Oracle protocol token |
| **Wormhole** | W | Ethereum, Solana, Arbitrum, Optimism, Base | Protocol's own governance token |
| **Algorand / Folks Finance** | FOLKS | Algorand, cross-chain | Lending and liquid staking protocol |
| **Agora** | AUSD | Multiple chains | Stablecoin |
| **Transfero** | BRZ, ARZ, CLZ | Multiple chains | Latin American stablecoins |
| **DeepBlue** | DBUSD | Multiple chains | Stablecoin |
| **StakeWise** | sETH2 | Ethereum, multiple | Liquid staking |
| **Jito** | JitoSOL | Solana, multiple | Liquid staking on Solana |
| **PIKE** | PIKE | Multiple chains | Cross-chain lending |
| **GateToken** | GT | EVM, Sui | Exchange token via NTT on Sui |
| **MEXC Token** | MX | EVM, Sui | Exchange token via NTT on Sui |
| **Bonk** | BONK | Solana, Sui | Memecoin expanding via NTT |

### BD Takeaway

NTT is Wormhole's strongest competitive moat. The framework has attracted tier-1 DeFi protocols, major stablecoin issuers, and institutional-grade tokens. Projects that want to launch multichain tokens without fragmenting liquidity are prime NTT candidates. Target: any protocol considering multichain expansion for their native token.

---

## 3. Recent Integrations (Last 3 Months)

### December 2025

- **Ripple RLUSD** -- Expanded to Base, Optimism, Ink, and Unichain via NTT
- **Ondo Finance** -- (Note: Ondo went with LayerZero for OUSG cross-chain bridge for tokenized securities)
- **Wormhole 2025 wrap-up** -- Recorded $17.6B total volume for the year

### January 2026

- **W Token unlock** -- 40.32 million W tokens unlocked on January 9
- **Governor token list update** -- Refreshed monitored asset list for governance
- **Wormhole governance launch** -- 50M token reward plan announced

### February 2026

- **Linea Mainnet** -- Watcher support added Feb 13, expanding to this zkEVM L2
- **XRP Ledger EVM Sidechain** -- Cross-chain messaging and token transfers enabled Feb 11
- **Haedal Protocol** -- Sui's largest liquid staking protocol adopted Wormhole bridge (Feb 17)
- **Jumper gasless routing** -- Expanded on Feb 18, enhancing cross-chain swaps via Wormhole
- **Wormhole ranked top bridge** -- Industry reviews place it among leading bridges (Feb 12)

### Notable 2025 Institutional Integrations (for context)

- **BlackRock BUIDL** -- $1.9B fund selected Wormhole for interoperability. Expanded to Solana and BNB Chain.
- **Apollo Global (ACRED)** -- Tokenized credit fund deployed via Securitize + Wormhole to Sei and other chains
- **VanEck VBILL** -- First tokenized treasury fund, Wormhole as official interoperability provider across Avalanche, BNB Chain, Ethereum, Solana
- **Hamilton Lane SCOPE** -- Expanded to Optimism and Ethereum via Securitize with Wormhole as exclusive interop provider
- **Mercado Bitcoin** -- Latin American platform ($200M+ assets) partnered exclusively with Wormhole (April 2025)
- **Mezo** -- Bitcoin economic layer selected Wormhole as official interop provider (March 2025), MUSD stablecoin live on NTT (August 2025)
- **Algorand / Folks Finance** -- NTT deployed on Algorand (July 2025)
- **Momentum on Sui** -- First DEX to support NTT-powered assets on Sui (June 2025)

### BD Takeaway

The institutional tokenization partnerships (BlackRock, Apollo, VanEck, Hamilton Lane) represent a major new revenue category for Wormhole. Any tokenized fund or RWA (Real World Asset) platform is a high-value target. The Linea and XRPL EVM integrations show Wormhole is still actively adding new chains.

---

## 4. Wormhole Gateway

### What It Is

Wormhole Gateway is a **Cosmos SDK-powered application-specific blockchain** (appchain) that acts as a liquidity router connecting Wormhole's 40+ chains to the entire Cosmos/IBC ecosystem.

### How It Works

- Built on the Cosmos SDK
- Uses the **ICS-20 standard** for IBC-native token bridging
- Operates as a hub: all 40+ Wormhole-connected chains connect to any IBC-enabled chain via a single integration
- Zero additional bridging fees for users
- Ensures asset fungibility across the Cosmos ecosystem

### Purpose

- Bring liquidity from Ethereum, Solana, and 30+ other chains into Cosmos
- Enable Cosmos-native chains to access deep liquidity pools outside their ecosystem
- Improve security via Wormhole Guardian Network validation before IBC routing

### Chains Using Gateway

All IBC-enabled Cosmos chains can access Wormhole's connected networks through Gateway, including:
- Osmosis
- Neutron
- Injective
- Dymension
- Stargaze
- Celestia
- SEI
- Provenance

### 2025-2026 Context

- Ethereum was added to the IBC network in 2025
- In 2026, the roadmap targets adding dozens more networks to IBC via Gateway
- Ripple's XRP Ledger integration also supports institutional demand for cross-chain movement
- Some Cosmos chains (Injective, Osmosis, Evmos, Kujira) transitioned to community-supported frontends after Wormhole ended subsidized IBC relaying

### BD Takeaway

Gateway is Wormhole's strategic play for the Cosmos ecosystem. Any Cosmos chain or IBC-enabled protocol that needs access to Ethereum/Solana/EVM liquidity should be targeted. The transition of some chains to community-supported status may create opportunities for competitors in the Cosmos space.

---

## 5. Wormhole Bridge Activity

### Volume Statistics

| Metric | Value |
|--------|-------|
| 2025 Annual Volume | **$17.6 billion** |
| Cumulative All-Time Volume | **$70+ billion** |
| All-Time Messages | **1.09 billion** (industry #1) |
| 30-Day Volume (Jan 28, 2026) | **$1.413 billion** |
| Portal All-Time Volume | **$55+ billion** |

### Top Corridors

- **Ethereum <-> Solana**: Wormhole handles ~38% of non-custodial volume on this route, making it the most popular option
- **Ethereum** is the #1 destination by inflows: $4.5 billion in 2025
- **Solana and BNB Chain** are secondary major destinations

### Key Infrastructure

- **19 Guardian validators** including Google Cloud and other top-tier firms
- Sub-second messaging with fees under $0.01 for micro-transfers
- Portal Bridge is the primary user-facing transfer application

### Wormhole Settlement (launched Feb 2025)

A next-generation suite of intents protocols for fast, institutional-scale transfers:

1. **Mayan Swift** -- Sub-10-second transfers via competitive auctions on Solana
2. **Wormhole Liquidity Layer** -- Hub-and-spoke architecture, under 2 minutes, ideal for large amounts
3. **Mayan MCTP** -- Wraps Circle's CCTP for native USDC bridging

Currently supports: Ethereum, Optimism, Arbitrum, Base, Avalanche, Unichain, Polygon, Solana, and Sui.

### BD Takeaway

$17.6B in 2025 volume demonstrates strong market position. The Ethereum-Solana corridor is the highest value target. Wormhole Settlement's institutional focus is a differentiation point vs. competitors. Projects handling large cross-chain volumes should be priority targets.

---

## 6. Mayan Finance & Portal Swap

### What Mayan Is

Mayan Finance is a **cross-chain swap auction protocol** built on top of Wormhole. It uses Solana as the settlement layer for fast, competitive-price swaps.

### How It Uses Wormhole

- Uses Wormhole Token Bridge for mint-and-burn cross-chain transfers
- Swap details embedded in Wormhole generic messages
- Relayers deliver messages to Solana for atomic flash swaps
- No intermediary risk -- simultaneous execution

### Key Stats

| Metric | Value |
|--------|-------|
| Total Volume Processed | **$12+ billion** |
| Total Users | **2+ million** |
| Funding Raised | **$3 million** |

### Supported Networks

Ethereum, Solana, Sui, Avalanche, Polygon, BNB Chain, Arbitrum, Base, Optimism, and more.

### Portal Swap (launched October 2025)

Wormhole relaunched Portal as **Portal Swap, powered by Mayan**, transforming it from a simple bridge into a full DEX:

- Cross-chain swaps AND same-chain swaps in one interface
- Directly from wallets, no separate DEX needed
- Combines Portal's $55B volume history with Mayan's $12B and 2M users

### BD Takeaway

Mayan/Portal Swap is the primary retail-facing product in the Wormhole ecosystem. Any DEX, wallet, or DeFi aggregator looking to add cross-chain swap functionality is a target for Wormhole Connect or direct integration with Mayan's protocols.

---

## 7. Wormhole SDK / Connect

### Wormhole Connect

A **customizable React widget** for embedding cross-chain transfers directly into any app. Add bridging to your dApp with just 3 lines of code.

### Key Features

- Powered by the Wormhole TypeScript SDK
- Aggregates all Wormhole products (Token Bridge, CCTP, NTT, Settlement) under one widget
- Supports native swaps, fast transfers, and token bridging
- Fully customizable UI theming

### Production Integrations

Apps currently using Wormhole Connect or the SDK include:

| App | Category | Integration Type |
|-----|----------|-----------------|
| **Drift** | Perpetual DEX | Wormhole Connect widget (first app to integrate) |
| **Jupiter** | DEX Aggregator (Solana) | SDK / Cross-chain routing |
| **Backpack** | Wallet | Cross-chain swaps via SDK |
| **Phantom** | Wallet | Cross-chain functionality |
| **PancakeSwap** | DEX | Cross-chain bridging |
| **Safe (Gnosis Safe)** | Multisig Wallet | Cross-chain management |
| **Squads** | Multisig (Solana) | Cross-chain management |
| **Uniswap** | DEX | Approved cross-chain protocol (only unconditionally approved by Uniswap Bridge Assessment Committee) |
| **Pyth** | Oracle | Cross-chain data delivery |
| **Lido** | Liquid Staking | wstETH cross-chain via NTT |
| **Circle** | Stablecoin Issuer | CCTP integration for native USDC |
| **Clone Protocol** | Synthetic Assets | Cross-chain synthetics |
| **DackieSwap** | DEX | Cross-chain bridging |
| **Rango Exchange** | DEX Aggregator | Cross-chain routing |

### Wormhole TypeScript SDK

- Full-featured SDK for building custom cross-chain applications
- Supports all Wormhole products and chains
- Open source on GitHub

### Wormhole Solidity SDK

- For EVM-based smart contract integrations
- Build cross-chain dApps with Solidity

### BD Takeaway

Wormhole Connect's ease of integration (3 lines of code) makes it attractive for any app wanting to add cross-chain functionality without building from scratch. Target: wallets, DEXes, DeFi dashboards, and portfolio trackers that lack cross-chain support. Uniswap's unconditional approval is a strong trust signal.

---

## 8. Competitors

### Overview Comparison

| Feature | Wormhole | LayerZero | Axelar | Chainlink CCIP |
|---------|----------|-----------|--------|----------------|
| **Supported Chains** | 40+ | 150+ | 70+ | 60+ |
| **All-Time Volume** | $70B+ | $80B+ (with Stargate) | $8.7B+ | N/A (newer) |
| **2025 Volume** | $17.6B | Dominant via Stargate (85% market share claim) | Higher 30-day than Wormhole (per Binance Research) | Growing, lower than peers |
| **Security Model** | 19 Guardian validators (incl. Google Cloud) | Modular: oracle + relayer, app-configurable | PoS validator set (most decentralized) | Dual DON verification + Risk Management Network |
| **Key Advantage** | NTT framework, institutional adoption | Chain count, developer experience, Stargate DEX | Cosmos-EVM bridge, GMP, decentralization | Oracle network trust, institutional security |
| **Developer Experience** | 6.2/10 (per comparison) | 8.9/10 (per comparison) | More config required (17 settings vs 9) | Middle complexity |
| **Token** | W | ZRO | AXL | LINK |
| **Institutional Focus** | Very strong (BlackRock, Apollo, VanEck) | Growing (Ondo, institutional L1 planned) | Moderate | Very strong (Coinbase, Lido partnership) |

### LayerZero -- Key Competitive Threat

- **150+ chains** vs Wormhole's 40+ -- significantly wider coverage
- Acquired Stargate bridge in August 2025, now claims 85% of cross-chain transaction volume
- 2,600+ applications connected
- Launching its own institutional L1 blockchain ("Zero") with TradFi backing, testnet fall 2026
- TON blockchain integration (Wormhole lacks TON support)
- Cardano integration with $80B in omnichain assets
- Ondo Finance chose LayerZero for OUSG tokenized securities bridge (December 2025)
- Developer experience rated significantly higher than Wormhole

### Axelar -- Cosmos Specialist

- 70+ chains, strong Cosmos-EVM bridge via GMP (General Message Passing)
- Most decentralized validator set among competitors
- axlUSDC is the standard wrapped USDC in Cosmos ecosystem
- 30-day volume was 2x Wormhole's (per Binance Research, Feb 2025)
- Stacks integration brings Bitcoin to 70+ chains

### Chainlink CCIP -- Institutional Security Play

- 60+ chains including recently added Solana
- Dual oracle network verification + Risk Management Network for security
- **Coinbase selected CCIP as exclusive bridge for all Coinbase Wrapped Assets** ($7B aggregate market cap, Dec 2025) -- cbBTC, cbETH, cbDOGE, cbLTC, cbADA, cbXRP
- **Lido chose CCIP** as official cross-chain infrastructure for wstETH across all chains (note: Lido also uses Wormhole NTT for specific deployments -- dual approach)
- CCIP 2.0 launching Q4 2025 with configurable risk levels for institutional use
- Leverages Chainlink's existing oracle network trust and massive ecosystem

### Where Wormhole Wins

1. **NTT framework** -- No competitor has an equivalent native token transfer standard this widely adopted
2. **Institutional tokenization** -- BlackRock, Apollo, VanEck, Hamilton Lane via Securitize is unmatched
3. **Solana ecosystem depth** -- Deepest integration with Jupiter, Drift, Phantom, Backpack
4. **Non-EVM support** -- One of few protocols connecting Solana, Aptos, Sui, Algorand alongside EVM
5. **Mayan/Portal Swap** -- Integrated DEX experience

### Where Wormhole Lags

1. **Chain count** -- 40+ vs LayerZero's 150+ is a significant gap
2. **Developer experience** -- Rated lower than LayerZero
3. **Cosmos positioning** -- Axelar has stronger native Cosmos integration
4. **wstETH standardization** -- Lido chose Chainlink CCIP as the "official" cross-chain standard for wstETH
5. **Coinbase wrapped assets** -- Lost to Chainlink CCIP for $7B in cbBTC, cbETH, etc.
6. **Volume market share** -- Stargate/LayerZero claims 85% of cross-chain volume

### BD Takeaway

Wormhole's competitive advantages are in NTT (token issuance), institutional tokenization (RWA), and Solana ecosystem depth. For BD, focus on projects that need: (a) native multichain token launches (NTT), (b) institutional-grade asset movement (Securitize pipeline), or (c) Solana cross-chain connectivity. Avoid head-to-head competition on pure chain count or developer tooling where LayerZero has an edge.

---

## 9. Recent News (Jan-Feb 2026)

### February 2026

| Date | Event | Significance |
|------|-------|--------------|
| Feb 18 | Jumper expands gasless routing | Enhances cross-chain swap UX, reduces friction for users |
| Feb 17 | Haedal Protocol adopts Wormhole | Sui's largest liquid staking protocol using Wormhole bridge |
| Feb 13 | Linea mainnet watcher support | New zkEVM L2 chain added to Wormhole network |
| Feb 12 | Wormhole ranked among top bridges | Industry review recognition |
| Feb 11 | XRP Ledger EVM sidechain support | Cross-chain messaging for XRPL's new EVM sidechain |
| Feb 10 | Governor token list update | Governance monitoring refresh |

### January 2026

| Date | Event | Significance |
|------|-------|--------------|
| Jan 9 | 40.32M W token unlock | Bi-weekly unlock schedule (part of W 2.0 tokenomics) |
| Jan 2026 | Governance launch with 50M token reward plan | Wormhole DAO taking more active role |

### Key Context From Late 2025

- **W 2.0 tokenomics** launched September 2025 -- strategic reserve funded by protocol revenue, 4% base staking yield, no inflation, 10B total supply cap
- **Portal Swap** launched October 2025 -- full DEX powered by Mayan
- **RLUSD multichain expansion** announced December 2025 via NTT
- **Coinbase chose Chainlink CCIP** over Wormhole for wrapped assets (December 2025) -- competitive loss
- **Ondo chose LayerZero** for tokenized securities bridge (December 2025) -- competitive loss

### BD Takeaway

Wormhole's news cadence shows continued expansion (new chains, new protocol adoptions) but also notable competitive losses (Coinbase, Ondo, Lido official standard). The W 2.0 tokenomics and governance launch signal maturation of the protocol. Projects on Linea and XRP Ledger EVM are new potential targets.

---

## 10. Key Wormhole Supported Assets

### Stablecoins

| Asset | Issuer | Cross-Chain Method | Notes |
|-------|--------|-------------------|-------|
| **USDC** | Circle | CCTP (native) + Token Bridge (wrapped) | CCTP integration for native USDC transfers. Also USDC.e on Fantom. |
| **USDT** | Tether | Token Bridge (wrapped) | Wrapped via Portal Bridge |
| **USDS** | Sky (MakerDAO) | NTT (native) | $880M+ transferred. Expanded to Solana. |
| **RLUSD** | Ripple | NTT (native) | Expanding to Base, Optimism, Ink, Unichain |
| **AUSD** | Agora | NTT (native) | Multichain stablecoin |
| **M** | M0 | NTT (native) | Decentralized stablecoin infra on Arbitrum, Base, Solana, Optimism |
| **BRZ/ARZ/CLZ** | Transfero | NTT (native) | Latin American stablecoins |
| **DBUSD** | DeepBlue | NTT (native) | Stablecoin |
| **MUSD** | Mezo | NTT (native) | Bitcoin-backed stablecoin (100% BTC collateral) |

### Governance & Utility Tokens

| Asset | Project | Cross-Chain Method | Notes |
|-------|---------|-------------------|-------|
| **W** | Wormhole | NTT (native) | On Ethereum, Solana, Arbitrum, Optimism, Base. 10B total supply. |
| **wstETH** | Lido | NTT (native) | Expanded to BNB Chain. (Note: Lido also adopted Chainlink CCIP as official standard) |
| **ETHFI** | ether.fi | NTT (native) | Cross-chain restaking token |
| **pufETH** | Puffer Finance | NTT (native) | Liquid restaking |
| **HYPE** | Hyperliquid | NTT (native) | On Base, Solana, Unichain |
| **RED** | RedStone | NTT (native) | Oracle token on Ethereum, Solana, Base |
| **STX** | Stacks | NTT (native) | On Solana, Sui ($1.5B combined with sBTC) |
| **GT** | GateToken | NTT (native) | Exchange token on Sui |
| **MX** | MEXC Token | NTT (native) | Exchange token on Sui |
| **BONK** | Bonk | NTT (native) | Memecoin expanding to Sui |
| **JitoSOL** | Jito | NTT (native) | Liquid staking on Solana |
| **sETH2** | StakeWise | NTT (native) | Liquid staking |
| **FOLKS** | Folks Finance | NTT (native) | Algorand lending/staking protocol |

### Bitcoin & Major Crypto Assets

| Asset | Cross-Chain Method | Notes |
|-------|--------------------|-------|
| **DOGE** | NTT (native) | $35B market cap asset going multichain starting with Solana |
| **sBTC** | NTT (native) | Decentralized BTC peg via Stacks. On Solana, Sui. |
| **ETH** | Token Bridge (wrapped) | Wrapped ETH available across all supported chains |
| **SOL** | Token Bridge (wrapped) | Solana native token bridged to EVM chains |

### Institutional / Tokenized Assets

| Asset | Issuer | Notes |
|-------|--------|-------|
| **BUIDL** | BlackRock (via Securitize) | $1.9B tokenized fund. Wormhole powers multichain access. On Solana, BNB Chain. |
| **ACRED** | Apollo Global (via Securitize) | Diversified credit fund. Expanded to Sei. |
| **VBILL** | VanEck (via Securitize) | Treasury fund on Avalanche, BNB Chain, Ethereum, Solana. |
| **SCOPE** | Hamilton Lane (via Securitize) | Flagship fund on Optimism, Ethereum. Wormhole is exclusive interop provider. |

### BD Takeaway

Wormhole's asset coverage is broad and growing. The NTT standard is becoming the default for token issuers who want native multichain presence. The institutional tokenized assets (BUIDL, ACRED, VBILL, SCOPE) represent a high-growth category. Any stablecoin issuer, liquid staking protocol, or token project considering multichain launch is a strong BD target.

---

## Appendix: Key Links

- Wormhole Platform: https://wormhole.com
- Supported Chains: https://wormhole.com/platform/blockchains
- NTT Framework: https://wormhole.com/products/native-token-transfers
- Wormhole Connect: https://wormhole.com/products/sdk
- Portal Bridge / Swap: https://portalbridge.com
- Wormhole Settlement: https://wormhole.com/products/settlement
- WormholeScan Explorer: https://wormholescan.io
- W Token Dashboard: https://w.wormhole.com
- MultiGov Governance: https://multigov.tech
- Wormhole Docs: https://wormhole.com/docs
- GitHub: https://github.com/wormhole-foundation

## Appendix: Guardian Validators

Wormhole's security is maintained by 19 Guardian validators, including:
- Google Cloud
- Other globally recognized validator firms

The Guardian Network validates and signs all cross-chain messages before they can be processed on destination chains.

## Appendix: Key Funding

- **Borderless Capital** launched a $50 million fund supporting Wormhole-based applications
- **Wormhole Reserve** accumulates on-chain and off-chain protocol revenue to back the W token
- Growth target: 10x message and asset transfer volume within 1-2 years

---

*Sources: wormhole.com, CoinMarketCap, The Block, Blockworks, CoinDesk, Blockonomi, BitcoinEthereumNews, Binance Research, Messari, LayerZero, Axelar, Chainlink, and other public sources. Data current as of February 22, 2026.*
