import type { Player } from "../domain/models.js";
import { createGame, revealNextClue, submitGuess, type QuizGame } from "../quiz/game.js";
import { scoreForClue } from "../quiz/scoring.js";
import type { GuessResponse, StartGameResponse } from "./types.js";

export class InMemoryGameService {
  private readonly games = new Map<string, QuizGame>();

  start(players: Player[]): StartGameResponse {
    if (!players.length) throw new Error("No active players are available.");

    const target = players[Math.floor(Math.random() * players.length)];
    const game = createGame(target, players);
    this.games.set(game.id, game);

    const clue = revealNextClue(game);
    return {
      gameId: game.id,
      clueNumber: clue ? game.revealed : 0,
      clueText: clue?.text ?? null,
      scoreIfSolvedNow: scoreForClue(game.revealed),
    };
  }

  guess(gameId: string, guess: string, players: Player[]): GuessResponse {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found.");

    const target = players.find((p) => p.id === game.playerId);
    if (!target) throw new Error("Target player is not available.");

    const correct = submitGuess(game, target, guess);
    if (correct) {
      return {
        correct: true,
        completed: true,
        score: game.score,
        nextClueNumber: null,
        nextClueText: null,
      };
    }

    const next = revealNextClue(game);
    return {
      correct: false,
      completed: game.completed,
      score: game.score,
      nextClueNumber: next ? game.revealed : null,
      nextClueText: next?.text ?? null,
    };
  }
}
