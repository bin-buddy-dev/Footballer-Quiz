import assert from "node:assert/strict";
import test from "node:test";
import type { PlayerSourceRecord } from "../src/data/provider.js";
import { validatePlayerRecord } from "../src/data/validation.js";

const validRecord: PlayerSourceRecord = {
  sourceRecordKey: "123",
  player: {
    id: "123",
    firstName: "Test",
    lastName: "Player",
    displayName: "Test Player",
    positions: [{ code: "ST", name: "Striker", primary: true }],
    squadNumbers: [],
    kitColours: [],
    nationalTeams: [],
    honours: [],
    aliases: [],
    isActive: true,
  },
};

test("accepts a minimally valid player record", () => {
  assert.deepEqual(validatePlayerRecord(validRecord), []);
});

test("rejects a record without a provider key", () => {
  const issues = validatePlayerRecord({ ...validRecord, sourceRecordKey: " " });
  assert.equal(issues.some((x) => x.field === "sourceRecordKey"), true);
});

test("rejects a record without a position", () => {
  const issues = validatePlayerRecord({
    ...validRecord,
    player: { ...validRecord.player, positions: [] },
  });
  assert.equal(issues.some((x) => x.field === "positions"), true);
});
