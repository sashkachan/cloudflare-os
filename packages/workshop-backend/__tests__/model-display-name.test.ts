import { describe, expect, it } from "vitest";
import { modelDisplayName, modelDisplaySuffix } from "@gadgets/workshop-shared/api";

describe("modelDisplayName", () => {
  it("labels each provider with its vendor, mirroring the Add Model dialog", () => {
    expect(modelDisplaySuffix("openai")).toBe("(OpenAI)");
    expect(modelDisplaySuffix("anthropic")).toBe("(Anthropic)");
    expect(modelDisplaySuffix("google")).toBe("(Google)");
    expect(modelDisplaySuffix("cloudflare")).toBe("(Workers AI)");
    expect(modelDisplaySuffix("openrouter")).toBe("(OpenRouter)");
    expect(modelDisplaySuffix("ollama")).toBe("(Ollama)");
    // The deepseek provider route runs on Cloudflare Unified Billing in this deployment, so
    // those models keep the label coined for them by hand.
    expect(modelDisplaySuffix("deepseek")).toBe("(Cloudflare Hosted)");
  });

  it("appends the suffix to bare, hand-typed names", () => {
    expect(modelDisplayName("DeepSeek V4 Pro", "openrouter")).toBe("DeepSeek V4 Pro (OpenRouter)");
    expect(modelDisplayName("DeepSeek V4 Pro", "deepseek")).toBe("DeepSeek V4 Pro (Cloudflare Hosted)");
    expect(modelDisplayName("Qwen 3 Max", "openai")).toBe("Qwen 3 Max (OpenAI)");
    expect(modelDisplayName("GPT 5.6 Sol", "openai")).toBe("GPT 5.6 Sol (OpenAI)");
  });

  it("replaces legacy suffixes instead of duplicating them", () => {
    // Suggested catalog name written before normalization.
    expect(modelDisplayName("GLM 5.2 (Workers AI)", "cloudflare"))
        .toBe("GLM 5.2 (Workers AI)");
    // Already-canonical suffixes stay stable.
    expect(modelDisplayName("DeepSeek V4 Flash (OpenRouter)", "openrouter"))
        .toBe("DeepSeek V4 Flash (OpenRouter)");
    expect(modelDisplayName("GPT 5.6 Sol (OpenAI)", "openai"))
        .toBe("GPT 5.6 Sol (OpenAI)");
    // Hand-typed names that embedded the suffix without parentheses.
    expect(modelDisplayName("DeepSeek V4 Flash Cloudflare Hosted", "deepseek"))
        .toBe("DeepSeek V4 Flash (Cloudflare Hosted)");
    // A hand-typed label is rewritten when the provider's canonical label differs.
    expect(modelDisplayName("GPT 5.6 Sol (Cloudflare Hosted)", "openai"))
        .toBe("GPT 5.6 Sol (OpenAI)");
  });

  it("leaves unrelated trailing text intact", () => {
    expect(modelDisplayName("Gemma 4 31B (preview)", "ollama")).toBe("Gemma 4 31B (preview) (Ollama)");
  });
});
