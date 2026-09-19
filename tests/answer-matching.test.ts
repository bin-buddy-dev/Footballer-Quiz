import assert from "node:assert/strict";
import test from "node:test";
import type { Player } from "../src/domain/models.js";
import { isCorrectGuess } from "../src/quiz/answer-matching.js";

const player: Player = {
  id: "1",
  firstName: "Kylian",
  lastName: "Mbappé",
  displayName: "Kylian Mbappé",
  positions: [{ code: "ST", name: "Striker", primary: true }],
  squadNumbers: [],
  kitColours: [],
  nationalTeams: [],
  honours: [],
  aliases: ["Mbappe"],
  isActive: true,
};

test("accepts full name with accents removed", () => {
  assert.equal(isCorrectGuess(player, "Kylian Mbappe"), true);
});

test("accepts configured alias", () => {
  assert.equal(isCorrectGuess(player, "Mbappe"), true);
});

test("rejects unrelated name", () => {
  assert.equal(isCorrectGuess(player, "Erling Haaland"), false);
});
