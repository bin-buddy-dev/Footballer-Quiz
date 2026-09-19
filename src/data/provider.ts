import type { Player } from "../domain/models.js";

export interface PlayerSourceRecord {
  sourceRecordKey: string;
  player: Player;
  sourceUrl?: string;
  rawHash?: string;
}

export interface PlayerDataProvider {
  readonly name: string;
  fetchPlayers(since?: Date): Promise<PlayerSourceRecord[]>;
}

export interface PlayerRepository {
  upsert(record: PlayerSourceRecord): Promise<void>;
  markMissingAsInactive(sourceName: string, seenAt: Date): Promise<void>;
}

export async function importPlayers(
  provider: PlayerDataProvider,
  repository: PlayerRepository,
): Promise<number> {
  const records = await provider.fetchPlayers();
  for (const record of records) await repository.upsert(record);
  return records.length;
}
