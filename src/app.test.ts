import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import * as mlbService from "./services/mlbService.js";

describe("GET /health", () => {
    it("returns the application health status", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "ok",
            application: "MLB Intelligence Assistant",
        });
    });
});

describe("GET /api/players/search", () => {
    it("returns 400 when the player name is missing", async () => {
        const response = await request(app).get("/api/players/search");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Player name is required",
        });
    });

    it("returns matching players", async () => {
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

        const response = await request(app)
            .get("/api/players/search")
            .query({ name: "Ronald Acuna" });

        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe(660670);
        expect(response.body[0].fullName).toBe("Ronald Acuña Jr.");
    });

    it("returns 404 when no player is found", async () => {
        vi.spyOn(mlbService, "searchPlayer").mockResolvedValue([]);

        const response = await request(app)
            .get("/api/players/search")
            .query({ name: "Fake Player" });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "Player not found",
        });
    });
});