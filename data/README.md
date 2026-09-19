# Football data ingestion

Phase 2 uses a provider-neutral ingestion design.

## Provider assessment

Sportmonks currently documents player/team data across 2,200+ leagues, including squads, careers and transfers. Its published enterprise material describes building apps and games, storing data in your own database and displaying it to users, subject to the agreement. It is therefore a strong candidate for the production provider, pending confirmation of the appropriate plan and commercial terms.

API-Football provides broad football data and supports applications and games, but its terms state that publication/licensing of supplied data remains the user's responsibility. It is an alternative provider, not an automatic selection.

football-data.org exposes competitions, teams, persons and match data. Its documentation demonstrates player records, but its coverage is better suited to selected competitions than a single global professional-player source.

## Build decision

The application will not hard-code a provider. The first production import should use a provider after the required account/plan and publication rights have been confirmed.

The database schema is designed so a provider can be replaced or supplemented later.

## Required credentials

Add the selected provider token to the local environment only. Never commit API keys to GitHub.

## Data quality rules

Every imported player should have:
- stable provider key
- display name
- date of birth when supplied
- nationality when supplied
- position
- current club/squad status
- source record and last-seen timestamp

Missing or conflicting fields must be recorded as unknown rather than invented.
