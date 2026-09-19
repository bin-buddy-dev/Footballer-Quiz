import type { Player } from "../domain/models.js";
import { normalisePlayerName } from "../data/normalise.js";

export function isCorrectGuess(player: Player, guess: string): boolean {
  const candidate = normalisePlayerName(guess);
  if (!candidate) return false;

  const accepted = [
    player.displayName,
    player.firstName + " " + player.lastName,
    player.lastName,
    ...player.aliases,
  ].map(normalisePlayerName);

  return accepted.includes(candidate);
}
