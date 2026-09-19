export interface StartGameResponse {
  gameId: string;
  clueNumber: number;
  clueText: string | null;
  scoreIfSolvedNow: number;
}

export interface GuessResponse {
  correct: boolean;
  completed: boolean;
  score: number;
  nextClueNumber: number | null;
  nextClueText: string | null;
}
