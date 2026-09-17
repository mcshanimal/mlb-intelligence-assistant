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