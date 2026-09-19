import type { PlayerRepository } from "./provider.js";

export async function reconcileActivePlayers(
  repository: PlayerRepository,
  providerName: string,
  seenAt = new Date(),
): Promise<void> {
  await repository.markMissingAsInactive(providerName, seenAt);
}
