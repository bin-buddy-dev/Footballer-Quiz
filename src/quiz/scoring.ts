export const DEFAULT_SCORES = [100, 80, 60, 40, 30, 20, 15, 10, 5, 0];

export function scoreForClue(clueNumber: number, maxClues = DEFAULT_SCORES.length): number {
  if (clueNumber < 1) return 0;
  if (clueNumber > maxClues) return 0;
  return DEFAULT_SCORES[clueNumber - 1] ?? 0;
}
