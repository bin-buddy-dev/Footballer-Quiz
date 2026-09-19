import assert from "node:assert/strict";
import test from "node:test";
import type { Player } from "../src/domain/models.js";
import { InMemoryGameService } from "../src/api/game-service.js";

const player: Player = {
  id: "1",
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
};

test("service starts a game and accepts a guess", () => {
  const service = new InMemoryGameService();
  const started = service.start([player]);

  assert.equal(started.clueNumber, 1);
  const result = service.guess(started.gameId, "Test Player", [player]);

  assert.equal(result.correct, true);
  assert.equal(result.completed, true);
  assert.equal(result.score, 100);
});
