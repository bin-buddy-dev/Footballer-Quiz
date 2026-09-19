import { validatePlayerRecord } from "./validation.js";
import type { ImportRunResult, PlayerDataProvider, PlayerRepository } from "./provider.js";

export interface ImportOptions {
  since?: Date;
  stopOnValidationError?: boolean;
}

export interface ImportReport extends ImportRunResult {
  rejected: number;
  issues: Array<{ sourceRecordKey: string; field: string; message: string }>;
}

export async function runPlayerImport(
  provider: PlayerDataProvider,
  repository: PlayerRepository,
  options: ImportOptions = {},
): Promise<ImportReport> {
  const records = await provider.fetchPlayers(options.since);
  const issues: ImportReport["issues"] = [];
  let imported = 0;
  let rejected = 0;

  for (const record of records) {
    const validationIssues = validatePlayerRecord(record);

    if (validationIssues.length) {
      rejected += 1;
      for (const issue of validationIssues) {
        issues.push({ sourceRecordKey: record.sourceRecordKey, ...issue });
      }
      if (options.stopOnValidationError) break;
      continue;
    }

    await repository.upsert(record);
    imported += 1;
  }

  return {
    provider: provider.name,
    imported,
    rejected,
    issues,
    completedAt: new Date().toISOString(),
  };
}
