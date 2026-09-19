export type ProviderName = "sportmonks" | "api-football" | "football-data-org";

export interface ProviderConfig {
  name: ProviderName;
  baseUrl: string;
  apiKeyEnvVar: string;
  notes: string;
}

export const providerCatalog: ProviderConfig[] = [
  {
    name: "sportmonks",
    baseUrl: "https://api.sportmonks.com/v3/football",
    apiKeyEnvVar: "SPORTMONKS_API_TOKEN",
    notes: "Broad league/player/squad coverage; licensing must be agreed for the intended product use.",
  },
  {
    name: "api-football",
    baseUrl: "https://v3.football.api-sports.io",
    apiKeyEnvVar: "API_FOOTBALL_KEY",
    notes: "Broad football API; verify publication/storage rights for each field before production use.",
  },
  {
    name: "football-data-org",
    baseUrl: "https://api.football-data.org/v4",
    apiKeyEnvVar: "FOOTBALL_DATA_API_KEY",
    notes: "Useful competition/person data, but coverage is not intended as the sole global player source.",
  },
];
