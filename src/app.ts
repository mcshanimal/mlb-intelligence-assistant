import express from "express";

export const app = express();

app.get("/health", (request, response) => {
  response.json({
    status: "ok",
    application: "MLB Intelligence Assistant",
  });
});