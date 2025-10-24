import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

import { inngest } from "./client";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: process.env.OPENAI_URL!,
});

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: lmstudioSteps } = await step.ai.wrap(
      "OpenAI Compatible (LMStudio) Genearate Text",
      generateText,
      {
        system: "You are a helpful assistant that can generate text.",
        prompt: "What is 2 + 2?",
        model: lmstudio("meta-llama_-_llama-3.2-1b"),
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return { lmstudioSteps };
  }
);
