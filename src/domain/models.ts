export type PositionCode =
  | "GK" | "CB" | "LB" | "RB" | "LWB" | "RWB"
  | "DM" | "CM" | "AM" | "LW" | "RW" | "ST" | "CF";

export interface Country {
  id: string;
  name: string;
  iso2?: string;
  iso3?: string;
}

export interface Club {
  id: string;
  name: string;
  country?: Country;
  isActive: boolean;
}

export interface PlayerPosition {
  code: PositionCode;
  name: string;
  primary: boolean;
}

export interface SquadNumber {
  clubId?: string;
  season?: string;
  number: number;
  current: boolean;
}

export interface KitColours {
  season: string;
  kitType: "home" | "away" | "third" | "goalkeeper" | "other";
  primary?: string;
  secondary?: string;
  accent?: string;
}

export interface NationalTeamRecord {
  country: Country;
  level: "senior" | "u23" | "u21" | "u20" | "u19" | "u18" | "youth" | "other";
  caps?: number;
  goals?: number;
  debutDate?: string;
  lastAppearanceDate?: string;
}

export interface Honour {
  name: string;
  category: "club" | "international" | "individual" | "continental" | "other";
  season?: string;
  club?: Club;
  country?: Country;
}

export interface Player {
  id: string;
  providerKey?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth?: string;
  nationality?: Country;
  positions: PlayerPosition[];
  currentClub?: Club;
  squadNumbers: SquadNumber[];
  kitColours: KitColours[];
  nationalTeams: NationalTeamRecord[];
  honours: Honour[];
  aliases: string[];
  isActive: boolean;
}
