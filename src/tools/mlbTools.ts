import {
  getPlayerHittingStats,
  searchPlayer,
} from "../services/mlbService.js";

export async function getPlayerHittingStatsTool(
  playerName: string,
  season: number,
) {
  const players = await searchPlayer(playerName);

  if (players.length === 0) {
    throw new Error(`Player not found: ${playerName}`);
  }

  const player = players[0];

  if (!player) {
    throw new Error(`Player not found: ${playerName}`);
  }

  const stats = await getPlayerHittingStats(player.id, season);

  return {
    player: {
      id: player.id,
      name: player.fullName,
    },
    season,
    stats,
  };
}