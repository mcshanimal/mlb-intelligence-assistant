import { askBedrock } from "./services/bedrockService.js";

const response = await askBedrock(
  "In one sentence, explain what OPS means in baseball.",
);

console.dir(response, {
  depth: null,
});