const MLB_API_BASE_URL = "https://statsapi.mlb.com/api/v1";

export interface MlbPlayer {
    id: number;
    fullName: string;
    primaryNumber?: string;
    primaryPosition?: {
        name: string;
        abbreviation: string;
    };
    batSide?: {
        description: string;
    };
    pitchHand?: {
        description: string;
    };
}

export interface HittingStats {
    gamesPlayed: number;
    plateAppearances: number;
    atBats: number;
    runs: number;
    hits: number;
    homeRuns: number;
    rbi: number;
    stolenBases: number;
    walks: number;
    strikeouts: number;
    battingAverage: string;
    onBasePercentage: string;
    sluggingPercentage: string;
    ops: string;
}

interface MlbHittingStatsResponse {
    stats: {
        splits: {
            stat: {
                gamesPlayed: number;
                plateAppearances: number;
                atBats: number;
                runs: number;
                hits: number;
                homeRuns: number;
                rbi: number;
                stolenBases: number;
                baseOnBalls: number;
                strikeOuts: number;
                avg: string;
                obp: string;
                slg: string;
                ops: string;
            };
        }[];
    }[];
}

interface MlbPlayerSearchResponse {
    people: MlbPlayer[];
}

export async function searchPlayer(name: string) {
    const url =
        `${MLB_API_BASE_URL}/people/search?names=${encodeURIComponent(name)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`MLB API request failed: ${response.status}`);
    }

    const data = (await response.json()) as MlbPlayerSearchResponse;

    return data.people.map((player) => ({
        id: player.id,
        fullName: player.fullName,
        primaryNumber: player.primaryNumber,
        primaryPosition: player.primaryPosition,
        batSide: player.batSide,
        pitchHand: player.pitchHand,
    }));
}

export async function getPlayerHittingStats(
    playerId: number,
    season: number,
) {
    const url =
        `${MLB_API_BASE_URL}/people/${playerId}/stats?stats=season&group=hitting&season=${season}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`MLB API request failed: ${response.status}`);
    }

    const data = (await response.json()) as MlbHittingStatsResponse;

    const stat = data.stats[0]?.splits[0]?.stat;

    if (!stat) {
        throw new Error("No hitting stats found for this player and season");
    }

    const hittingStats: HittingStats = {
        gamesPlayed: stat.gamesPlayed,
        plateAppearances: stat.plateAppearances,
        atBats: stat.atBats,
        runs: stat.runs,
        hits: stat.hits,
        homeRuns: stat.homeRuns,
        rbi: stat.rbi,
        stolenBases: stat.stolenBases,
        walks: stat.baseOnBalls,
        strikeouts: stat.strikeOuts,
        battingAverage: stat.avg,
        onBasePercentage: stat.obp,
        sluggingPercentage: stat.slg,
        ops: stat.ops,
    };

    return hittingStats;;
}