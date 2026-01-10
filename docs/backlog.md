# General Project Backlog

**Central Tracking for Releases and Work Items**

## 1. Releases Log
Tracks the delivery of versions to production (Main Branch).

| Version | Date | Status | Description | PR / Commit |
|---------|------|--------|-------------|-------------|
| **v1.0.0** | 2026-01-10 | Released | Unified Search & CI/CD Pipeline | PR #25 |
| **v0.5.0** | 2026-01-09 | Released | CNPq Sync Enhanced & Fixes | PR #19, #20 |
| **v0.4.0** | 2026-01-09 | Released | CNPq Sync Base (US-009) | PR #18 |
| **v0.3.0** | 2026-01-07 | Released | SigPesq Enhancements, ResearcherID & Granular Strategy Pattern | PR #13 |
| **v0.2.0** | 2026-01-06 | Released | Research Group Ingestion & Local Infrastructure | Main |
| **v0.0.0** | 2026-01-01 | Released | Project Initiation | - |

## 2. In Progress Items (Current Sprint)
Reflecting active work from `SI.3 Product Backlog`.

- **Epic 1: Extração SigPesq (Release 1)**
    - [x] US-001 [Extração Projetos SigPesq](https://github.com/ifesserra-lab/horizon_etl/issues/2) (Merged)
    - [Release v1.0.2](https://github.com/ifesserra-lab/horizon_dashboard/releases/tag/v1.0.2) | 2026-01-10
    - [PR #11](https://github.com/ifesserra-lab/horizon_dashboard/pull/11) - Fix UI Contrast & Dark Mode Conflict (Merged)
    - [Issue #9](https://github.com/ifesserra-lab/horizon_dashboard/issues/9) - Apply CSS Strategy to Group Details (Closed)
    - [Release v1.0.1](https://github.com/ifesserra-lab/horizon_dashboard/releases/tag/v1.0.1) | 2026-01-10
    - [PR #7](https://github.com/ifesserra-lab/horizon_dashboard/pull/7) - Fix CSS Dark Mode Strategy (Merged)
    - [Issue #6](https://github.com/ifesserra-lab/horizon_dashboard/issues/6) - Fix CSS Dark Mode Mismatch (Closed)
- [Release v1.0.0](https://github.com/ifesserra-lab/horizon_dashboard/releases/tag/v1.0.0) | 2026-01-10
    - [PR #1](https://github.com/ifesserra-lab/horizon_dashboard/pull/1) - Initialize Project
    - [Issue #3](https://github.com/ifesserra-lab/horizon_dashboard/issues/3) - Fix Breadcrumb Navigation (Closed)
    - [Issue #4](https://github.com/ifesserra-lab/horizon_dashboard/issues/4) - Fix CSS Contrast Light Mode (Closed)
    - [Issue #5](https://github.com/ifesserra-lab/horizon_dashboard/issues/5) - Update README & Docs (Closed)
    - [x] US-007 [Ingestão Grupos de Pesquisa] (PR #4 - Merged)
    - [x] T-Leaders [Implementação de Líderes] (PR #7 - Merged)
    - [x] T-ResearcherID [E-mail como identification_id] (PR #10 - Merged)
    - [x] T-StrategyPattern [Refatoração Strategy Pattern] (PR #11 - Merged)
    - [x] T-GranularStrategy [Refatoração Granular Pattern] (PR #12 - Merged)
    - [x] US-005 Observabilidade e Idempotência (Implemented)
    - [x] US-008 [Exportação JSON Canônico e Grupos] (PR #15 - Merged)
    
- **Epic 2: Horizon Dashboard (Release 1)**
    - [x] US-Dashboard-01 [Unified Smart Search] (Implemented)
    - [x] US-Dashboard-02 [CI/CD Pipeline] (Implemented)
    
- **Epic 6: Atualização Base CNPq (Release v0.4.0)**
    - [x] US-009 [Sincronização de Grupos CNPq] (PR #18, #19 - Merged)
    - [x] US-010 [Sincronização de Egressos CNPq] (PR #21 - Merged)

- **Epic 3: Dados de Execução FAPES (Release 3)**
    - [ ] US-006 [Extração de Editais FAPES (PDF)](https://github.com/ifesserra-lab/horizon_etl/issues/1)

## 3. Hierarchical Status
Mapping Epics -> User Stories -> Tasks status.

### R1 - SigPesq
- **US-001**: Done (Merged)
- **US-007**: Done (Merged)
- **US-005**: Done (Implemented)

### R3 - SigFapes
- **US-006**: Ready
    - T-006 [Dev] Scraper: Pending
    - T-007 [Dev] Parser: Pending
    - T-008 [Dev] Matcher: Pending
    - T-009 [Ops] Flow: Pending
