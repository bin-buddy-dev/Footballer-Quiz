import type { Player, PositionCode } from "../../domain/models.js";
import type { PlayerDataProvider, PlayerSourceRecord } from "../provider.js";

interface SportmonksResponse<T> {
  data: T[];
}

interface SportmonksPlayer {
  id: number;
  display_name?: string;
  firstname?: string;
  lastname?: string;
  date_of_birth?: string | null;
  position_id?: number | null;
}

interface SportmonksSquadEntry {
  player?: SportmonksPlayer;
  jersey_number?: number | null;
  in_squad?: boolean;
}

const POSITION_MAP: Record<number, PositionCode> = {
  1: "GK", 2: "RB", 3: "CB", 4: "LB", 5: "DM",
  6: "CM", 7: "RW", 8: "LW", 9: "AM", 10: "ST",
};

export interface SportmonksClientOptions {
  token: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export class SportmonksClient implements PlayerDataProvider {
  readonly name = "sportmonks";
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: SportmonksClientOptions) {
    if (!options.token.trim()) throw new Error("Sportmonks token is required.");
    this.token = options.token;
    this.baseUrl = (options.baseUrl ?? "https://api.sportmonks.com/v3/football").replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async fetchPlayers(): Promise<PlayerSourceRecord[]> {
    throw new Error(
      "Global discovery is intentionally not automatic: configure the competitions/teams to crawl for the selected subscription.",
    );
  }

  async fetchSquadPlayers(teamId: number, seasonId: number): Promise<PlayerSourceRecord[]> {
    const path = "/squads/seasons/" + seasonId + "/teams/" + teamId;
    const response = await this.request<SportmonksSquadEntry[]>(
      path + "?include=player;team;position",
    );

    return response.data
      .filter((entry) => entry.player && entry.in_squad !== false)
      .map((entry) => this.normaliseSquadEntry(entry));
  }

  private async request<T>(path: string): Promise<SportmonksResponse<T>> {
    const response = await this.fetchImpl(this.baseUrl + path, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + this.token,
      },
    });

    if (!response.ok) {
      throw new Error("Sportmonks request failed: HTTP " + response.status);
    }

    return response.json() as Promise<SportmonksResponse<T>>;
  }

  private normaliseSquadEntry(entry: SportmonksSquadEntry): PlayerSourceRecord {
    const raw = entry.player!;
    const displayName =
      raw.display_name ??
      [raw.firstname, raw.lastname].filter(Boolean).join(" ").trim();

    const positionCode = raw.position_id ? POSITION_MAP[raw.position_id] : undefined;

    const player: Player = {
      id: String(raw.id),
      providerKey: String(raw.id),
      firstName: raw.firstname ?? "",
      lastName: raw.lastname ?? "",
      displayName,
      dateOfBirth: raw.date_of_birth ?? undefined,
      positions: positionCode
        ? [{ code: positionCode, name: positionCode, primary: true }]
        : [],
      squadNumbers: entry.jersey_number == null
        ? []
        : [{ number: entry.jersey_number, current: true }],
      kitColours: [],
      nationalTeams: [],
      honours: [],
      aliases: [],
      isActive: entry.in_squad !== false,
    };

    return { sourceRecordKey: String(raw.id), player };
  }
}
