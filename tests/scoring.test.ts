import assert from "node:assert/strict";
import test from "node:test";
import { scoreForClue } from "../src/quiz/scoring.js";

test("score decreases as clues are revealed", () => {
  assert.equal(scoreForClue(1), 100);
  assert.equal(scoreForClue(2), 80);
  assert.equal(scoreForClue(10), 0);
});

test("invalid clue numbers score zero", () => {
  assert.equal(scoreForClue(0), 0);
  assert.equal(scoreForClue(99), 0);
});
