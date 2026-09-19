import type { Player } from "../domain/models.js";
import { isCorrectGuess } from "./answer-matching.js";
import { buildBasicClues, rankClues, type Clue } from "./clue-engine.js";
import { scoreForClue } from "./scoring.js";

export interface QuizGame {
  id: string;
  playerId: string;
  clues: Clue[];
  revealed: number;
  guesses: string[];
  score: number;
  completed: boolean;
}

export function createGame(player: Player, pool: Player[]): QuizGame {
  const basic = buildBasicClues(player);
  const ranked = rankClues(pool, basic).map((x) => x.clue);
  return {
    id: crypto.randomUUID(),
    playerId: player.id,
    clues: ranked,
    revealed: 0,
    guesses: [],
    score: 0,
    completed: false,
  };
}

export function revealNextClue(game: QuizGame): Clue | undefined {
  if (game.completed) return undefined;
  const clue = game.clues[game.revealed];
  if (clue) game.revealed += 1;
  return clue;
}

export function submitGuess(game: QuizGame, player: Player, guess: string): boolean {
  if (game.completed) return false;
  game.guesses.push(guess);

  if (!isCorrectGuess(player, guess)) return false;

  game.score = scoreForClue(Math.max(game.revealed, 1));
  game.completed = true;
  return true;
}
