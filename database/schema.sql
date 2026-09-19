CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE countries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  iso2 CHAR(2),
  iso3 CHAR(3)
);

CREATE TABLE clubs (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country_id BIGINT REFERENCES countries(id),
  founded_year INT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(name, country_id)
);

CREATE TABLE competitions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country_id BIGINT REFERENCES countries(id),
  tier INT,
  is_international BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(name, country_id)
);

CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  provider_key TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  date_of_birth DATE,
  nationality_country_id BIGINT REFERENCES countries(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  active_from DATE,
  active_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider_key)
);

CREATE TABLE player_aliases (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  UNIQUE(player_id, alias)
);

CREATE TABLE positions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE player_positions (
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  position_id BIGINT NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(player_id, position_id)
);

CREATE TABLE player_clubs (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id BIGINT NOT NULL REFERENCES clubs(id),
  season TEXT,
  joined_on DATE,
  left_on DATE,
  shirt_number INT,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(player_id, club_id, season)
);

CREATE TABLE player_numbers (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id BIGINT REFERENCES clubs(id),
  season TEXT,
  shirt_number INT NOT NULL,
  UNIQUE(player_id, club_id, season, shirt_number)
);

CREATE TABLE club_kits (
  id BIGSERIAL PRIMARY KEY,
  club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  kit_type TEXT NOT NULL CHECK (kit_type IN ('home','away','third','goalkeeper','other')),
  primary_colour TEXT,
  secondary_colour TEXT,
  accent_colour TEXT,
  UNIQUE(club_id, season, kit_type)
);

CREATE TABLE player_national_teams (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  country_id BIGINT NOT NULL REFERENCES countries(id),
  team_level TEXT NOT NULL DEFAULT 'senior',
  caps INT,
  goals INT,
  debut_date DATE,
  last_appearance_date DATE,
  UNIQUE(player_id, country_id, team_level)
);

CREATE TABLE honours (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  competition_id BIGINT REFERENCES competitions(id),
  UNIQUE(name, category, competition_id)
);

CREATE TABLE player_honours (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  honour_id BIGINT NOT NULL REFERENCES honours(id),
  season TEXT,
  club_id BIGINT REFERENCES clubs(id),
  country_id BIGINT REFERENCES countries(id),
  award_scope TEXT NOT NULL DEFAULT 'team',
  UNIQUE(player_id, honour_id, season, club_id, country_id)
);

CREATE TABLE data_sources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  provider_type TEXT NOT NULL,
  licence_notes TEXT,
  last_imported_at TIMESTAMPTZ
);

CREATE TABLE player_source_records (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  source_id BIGINT NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  source_record_key TEXT NOT NULL,
  source_url TEXT,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_hash TEXT,
  UNIQUE(source_id, source_record_key)
);

CREATE INDEX idx_players_active ON players(is_active);
CREATE INDEX idx_players_name_trgm ON players USING GIN (display_name gin_trgm_ops);
CREATE INDEX idx_aliases_alias_trgm ON player_aliases USING GIN (alias gin_trgm_ops);
CREATE INDEX idx_player_clubs_current ON player_clubs(player_id, is_current);
CREATE INDEX idx_player_honours_player ON player_honours(player_id);
