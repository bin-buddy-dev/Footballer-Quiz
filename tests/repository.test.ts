import assert from "node:assert/strict";
import test from "node:test";
import { PostgresPlayerRepository } from "../src/data/postgres-repository.js";

test("repository upserts the core player fields", async () => {
  let capturedSql = "";
  let capturedParams: unknown[] = [];

  const db = {
    async query(sql: string, params: unknown[] = []) {
      capturedSql = sql;
      capturedParams = params;
      return { rows: [] };
    },
  };

  const repository = new PostgresPlayerRepository(db);
  await repository.upsert({
    sourceRecordKey: "42",
    player: {
      id: "42",
      firstName: "Sample",
      lastName: "Player",
      displayName: "Sample Player",
      positions: [{ code: "ST", name: "Striker", primary: true }],
      squadNumbers: [],
      kitColours: [],
      nationalTeams: [],
      honours: [],
      aliases: [],
      isActive: true,
    },
  });

  assert.match(capturedSql, /INSERT INTO players/);
  assert.equal(capturedParams[0], "42");
  assert.equal(capturedParams[3], "Sample Player");
});
