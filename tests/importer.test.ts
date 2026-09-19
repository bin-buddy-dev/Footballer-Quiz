import assert from "node:assert/strict";
import test from "node:test";
import type { PlayerSourceRecord, PlayerDataProvider, PlayerRepository } from "../src/data/provider.js";
import { runPlayerImport } from "../src/data/importer.js";

const record: PlayerSourceRecord = {
  sourceRecordKey: "abc",
  player: {
    id: "abc",
    firstName: "Sample",
    lastName: "Player",
    displayName: "Sample Player",
    positions: [{ code: "CM", name: "Central Midfielder", primary: true }],
    squadNumbers: [],
    kitColours: [],
    nationalTeams: [],
    honours: [],
    aliases: [],
    isActive: true,
  },
};

test("imports valid records and reports counts", async () => {
  const provider: PlayerDataProvider = {
    name: "fixture",
    async fetchPlayers() { return [record]; },
  };
  const stored: PlayerSourceRecord[] = [];
  const repository: PlayerRepository = {
    async upsert(value) { stored.push(value); },
    async markMissingAsInactive() {},
  };

  const report = await runPlayerImport(provider, repository);

  assert.equal(report.imported, 1);
  assert.equal(report.rejected, 0);
  assert.equal(stored.length, 1);
});
