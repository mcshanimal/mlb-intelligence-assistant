import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-2",
});

export async function askBedrock(prompt: string) {
  const command = new ConverseCommand({
    modelId: "openai.gpt-6-astra",
    messages: [
      {
        role: "user",
        content: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const response = await bedrockClient.send(command);

  return response;
}