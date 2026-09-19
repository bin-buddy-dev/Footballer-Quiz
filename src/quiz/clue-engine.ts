import type { Player } from "../domain/models.js";

export type ClueType =
  | "position" | "nationality" | "club" | "shirt-number"
  | "honour" | "international" | "age-range";

export interface Clue {
  type: ClueType;
  text: string;
  difficulty: number;
  matches: (player: Player) => boolean;
}

export interface ClueCandidate {
  clue: Clue;
  expectedMatchRate: number;
  informationScore: number;
}

export function informationValue(matchRate: number): number {
  if (matchRate <= 0 || matchRate >= 1) return 0;
  return -(matchRate * Math.log2(matchRate) + (1 - matchRate) * Math.log2(1 - matchRate));
}

export function rankClues(candidates: Player[], clues: Clue[]): ClueCandidate[] {
  if (candidates.length === 0) return [];

  return clues
    .map((clue) => {
      const matches = candidates.filter(clue.matches).length;
      const rate = matches / candidates.length;
      return {
        clue,
        expectedMatchRate: rate,
        informationScore: informationValue(rate),
      };
    })
    .sort((a, b) => b.informationScore - a.informationScore);
}

export function buildBasicClues(player: Player): Clue[] {
  const primary = player.positions.find((p) => p.primary)?.name ?? player.positions[0]?.name;
  const clues: Clue[] = [];

  if (primary) {
    clues.push({
      type: "position",
      text: `The player primarily plays as a ${primary}.`,
      difficulty: 1,
      matches: (p) => p.positions.some((x) => x.name === primary),
    });
  }

  if (player.nationality) {
    const country = player.nationality.name;
    clues.push({
      type: "nationality",
      text: `The player is associated with ${country}.`,
      difficulty: 2,
      matches: (p) => p.nationality?.name === country,
    });
  }

  if (player.currentClub) {
    const club = player.currentClub.name;
    clues.push({
      type: "club",
      text: `The player currently plays for ${club}.`,
      difficulty: 3,
      matches: (p) => p.currentClub?.name === club,
    });
  }

  const currentNumber = player.squadNumbers.find((n) => n.current)?.number;
  if (currentNumber !== undefined) {
    clues.push({
      type: "shirt-number",
      text: `The player's current squad number is ${currentNumber}.`,
      difficulty: 4,
      matches: (p) => p.squadNumbers.some((n) => n.current && n.number === currentNumber),
    });
  }

  if (player.honours.length) {
    const honour = player.honours[0].name;
    clues.push({
      type: "honour",
      text: `The player has won ${honour}.`,
      difficulty: 5,
      matches: (p) => p.honours.some((h) => h.name === honour),
    });
  }

  return clues;
}
