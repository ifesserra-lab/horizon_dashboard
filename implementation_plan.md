# Implementation Plan - Publications Dashboard

## Goal Description
Create a "Publications Dashboard" to visualize academic production metrics: quantity per person and temporal evolution.

## User Review Required
> [!IMPORTANT]
> **Data Source Missing**: The current `src/data` does not contain publication data.
> **Proposed Solution**: I will create a `PublicationRepository` interface. I need to know if I should implement a Mock adapter or if there is a JSON file I should ingest.
> **Scope**: Initially implementing a Mock data source to validate the UI.

## Proposed Changes
### Frontend
#### [NEW] `src/types/publications.ts`
Define `Publication` and `PublicationMetrics` interfaces.

#### [NEW] `src/data/mock/publications.ts`
Mock data for development.

#### [NEW] `src/components/charts/PublicationsBarChart.astro`
Sales/Production by Person.

#### [NEW] `src/components/charts/PublicationsEvolutionChart.astro`
Timeline chart.

#### [NEW] `src/pages/publications/index.astro`
Main dashboard page.

## Verification Plan
### Automated Tests
- Run `npm run build` to verify SSG.
- Run `npm run check` for type safety.

### Manual Verification
- Check responsiveness on Mobile (375px) and Desktop.
- Check WCAG contrast.
