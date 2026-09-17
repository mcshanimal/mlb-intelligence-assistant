import express from "express";
import {
    searchPlayer,
    getPlayerHittingStats,
} from "./services/mlbService.js";

export const app = express();

app.get("/health", (request, response) => {
    response.json({
        status: "ok",
        application: "MLB Intelligence Assistant",
    });
});

app.get("/api/players/search", async (request, response) => {
    const name = request.query.name;

    if (typeof name !== "string") {
        return response.status(400).json({
            error: "Player name is required",
        });
    }

    try {
        const players = await searchPlayer(name);

        if (players.length === 0) {
            return response.status(404).json({
                error: "Player not found",
            });
        }

        return response.json(players);
    } catch (error) {
        return response.status(500).json({
            error: "Failed to search for player",
        });
    }
});

app.get("/api/players/:playerId/stats", async (request, response) => {
    const playerId = Number(request.params.playerId);
    const season = Number(request.query.season);

    if (!Number.isInteger(playerId) || !Number.isInteger(season)) {
        return response.status(400).json({
            error: "Valid player ID and season are required",
        });
    }

    try {
        const stats = await getPlayerHittingStats(playerId, season);

        return response.json(stats);
    } catch (error) {
        return response.status(500).json({
            error: "Failed to retrieve player stats",
        });
    }
});