import type { PlayerSourceRecord } from "./provider.js";

export interface ValidationIssue {
  field: string;
  message: string;
}

export function validatePlayerRecord(record: PlayerSourceRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const player = record.player;

  if (!record.sourceRecordKey.trim()) {
    issues.push({ field: "sourceRecordKey", message: "Provider record key is required." });
  }
  if (!player.displayName.trim()) {
    issues.push({ field: "displayName", message: "Display name is required." });
  }
  if (!player.firstName.trim() && !player.lastName.trim()) {
    issues.push({ field: "name", message: "At least one player name component is required." });
  }
  if (!player.positions.length) {
    issues.push({ field: "positions", message: "At least one position is required." });
  }

  return issues;
}
