import type { PlayerRepository, PlayerSourceRecord } from "./provider.js";

export interface SqlExecutor {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export class PostgresPlayerRepository implements PlayerRepository {
  constructor(private readonly db: SqlExecutor) {}

  async upsert(record: PlayerSourceRecord): Promise<void> {
    const p = record.player;
    await this.db.query(
      `INSERT INTO players
       (provider_key, first_name, last_name, display_name, date_of_birth, is_active)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (provider_key) DO UPDATE SET
         first_name=EXCLUDED.first_name,
         last_name=EXCLUDED.last_name,
         display_name=EXCLUDED.display_name,
         date_of_birth=EXCLUDED.date_of_birth,
         is_active=EXCLUDED.is_active,
         updated_at=NOW()`,
      [record.sourceRecordKey, p.firstName, p.lastName, p.displayName, p.dateOfBirth ?? null, p.isActive],
    );
  }

  async markMissingAsInactive(sourceName: string, seenAt: Date): Promise<void> {
    // Source-aware reconciliation is deliberately left to the import job.
    // A player missing from one provider must not automatically be disabled
    // when another provider still reports them.
    void sourceName;
    void seenAt;
  }
}
