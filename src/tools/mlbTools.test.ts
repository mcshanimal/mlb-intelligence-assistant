import { describe, expect, it, vi } from "vitest";
import * as mlbService from "../services/mlbService.js";
import { getPlayerHittingStatsTool } from "./mlbTools.js";

describe("getPlayerHittingStatsTool", () => {
    it("finds the player and returns their hitting stats", async () => {
        vi.spyOn(mlbService, "searchPlayer").mockResolvedValue([
            {
                id: 660670,
                fullName: "Ronald Acuña Jr.",
                primaryNumber: "13",
                primaryPosition: {
                    name: "Outfielder",
                    abbreviation: "RF",
                },
                batSide: {
                    description: "Right",
                },
                pitchHand: {
                    description: "Right",
                },
            },
        ]);

        vi.spyOn(mlbService, "getPlayerHittingStats").mockResolvedValue({
            gamesPlayed: 100,
            plateAppearances: 440,
            atBats: 382,
            runs: 58,
            hits: 98,
            homeRuns: 18,
            rbi: 49,
            stolenBases: 20,
            walks: 50,
            strikeouts: 99,
            battingAverage: ".257",
            onBasePercentage: ".348",
            sluggingPercentage: ".450",
            ops: ".798",
        });

        const result = await getPlayerHittingStatsTool(
            "Ronald Acuna",
            2026,
        );

        expect(mlbService.searchPlayer).toHaveBeenCalledWith(
            "Ronald Acuna",
        );

        expect(mlbService.getPlayerHittingStats).toHaveBeenCalledWith(
            660670,
            2026,
        );

        expect(result.player.name).toBe("Ronald Acuña Jr.");
        expect(result.season).toBe(2026);
        expect(result.stats.ops).toBe(".798");
    });
});