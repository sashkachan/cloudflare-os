import { describe, expect, it } from "vitest";
import { modelDisplayName, modelDisplaySuffix } from "@gadgets/workshop-shared/api";

describe("modelDisplayName", () => {
  it("suffixes OpenRouter models with OpenRouter and everything else with Cloudflare Hosted", () => {
    expect(modelDisplaySuffix("openrouter")).toBe("(OpenRouter)");
    for (const provider of ["cloudflare", "openai", "anthropic", "google", "deepseek", "ollama"] as const) {
      expect(modelDisplaySuffix(provider)).toBe("(Cloudflare Hosted)");
    }
  });

  it("appends the suffix to bare, hand-typed names", () => {
    expect(modelDisplayName("DeepSeek V4 Pro", "openrouter")).toBe("DeepSeek V4 Pro (OpenRouter)");
    expect(modelDisplayName("DeepSeek V4 Pro", "deepseek")).toBe("DeepSeek V4 Pro (Cloudflare Hosted)");
    expect(modelDisplayName("Qwen 3 Max", "openai")).toBe("Qwen 3 Max (Cloudflare Hosted)");
  });

  it("replaces legacy suffixes instead of duplicating them", () => {
    // Suggested catalog name written before normalization.
    expect(modelDisplayName("GLM 5.2 (Workers AI)", "cloudflare"))
        .toBe("GLM 5.2 (Cloudflare Hosted)");
    // Already-canonical OpenRouter name stays stable.
    expect(modelDisplayName("DeepSeek V4 Flash (OpenRouter)", "openrouter"))
        .toBe("DeepSeek V4 Flash (OpenRouter)");
    // Hand-typed names that embedded the suffix without parentheses.
    expect(modelDisplayName("DeepSeek V4 Flash Cloudflare Hosted", "deepseek"))
        .toBe("DeepSeek V4 Flash (Cloudflare Hosted)");
    // A hand-typed OpenRouter label is rewritten when the provider hosts elsewhere.
    expect(modelDisplayName("DeepSeek V4 Flash (OpenRouter)", "deepseek"))
        .toBe("DeepSeek V4 Flash (Cloudflare Hosted)");
  });

  it("leaves unrelated trailing text intact", () => {
    expect(modelDisplayName("Gemma 4 31B (preview)", "ollama")).toBe("Gemma 4 31B (preview) (Cloudflare Hosted)");
  });
});
