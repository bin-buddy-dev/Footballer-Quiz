import assert from "node:assert/strict";
import test from "node:test";
import type { Player } from "../src/domain/models.js";
import { createGame, revealNextClue, submitGuess } from "../src/quiz/game.js";

const player: Player = {
  id: "1",
  firstName: "Test",
  lastName: "Player",
  displayName: "Test Player",
  positions: [{ code: "ST", name: "Striker", primary: true }],
  squadNumbers: [{ number: 9, current: true }],
  kitColours: [],
  nationalTeams: [],
  honours: [],
  aliases: [],
  isActive: true,
};

test("game reveals clues and accepts the correct answer", () => {
  const game = createGame(player, [player]);
  assert.equal(game.completed, false);
  assert.ok(revealNextClue(game));
  assert.equal(submitGuess(game, player, "Test Player"), true);
  assert.equal(game.completed, true);
  assert.equal(game.score, 100);
});
