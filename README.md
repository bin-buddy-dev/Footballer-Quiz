# Footballer Quiz

A mobile-first footballer identification quiz backed by a structured, refreshable player database.

## Phase 1 — Foundation

The repository now contains the initial database schema, TypeScript domain model, provider/import framework, answer normalisation, information-value clue engine, tests and environment template.

### Data scope

This project will ultimately support a broad, refreshable database of active professional footballers. It intentionally does **not** claim that a complete global player dataset has been imported yet. A global database needs a reliable source whose licence permits the required storage and app use. The ingestion layer is therefore provider-neutral.

## Architecture

```
Data provider(s)
      |
      v
Provider adapter -> Normaliser -> Validation -> PostgreSQL
                                             |
                                             v
                                      Clue engine
                                             |
                                             v
                                     Quiz API / PWA
```

## Playable prototype

The mobile-first PWA is also available from the repository root for simple GitHub Pages setup. The prototype uses clearly labelled fictional demo data while the real licensed player feed is being integrated.

## Current structure

- `database/schema.sql` — relational data model
- `src/domain/models.ts` — application types
- `src/data/provider.ts` — provider adapter contract
- `src/data/normalise.ts` — player-name normalisation
- `src/quiz/answer-matching.ts` — guess matching
- `src/quiz/clue-engine.ts` — progressive clue foundation
- `tests/` — automated tests
- `.env.example` — configuration template

## Active-player rule

Players have `is_active`, `active_from` and `active_until`. Each data provider must document how it determines active professional status.

## Next phases

1. Select and integrate a data provider with suitable usage rights.
2. Build the import/validation pipeline and populate the database.
3. Build the quiz API and scoring system.
4. Build the mobile-first PWA with Daily Player and Endless modes.
5. Add accounts, streaks, statistics and leaderboards.
