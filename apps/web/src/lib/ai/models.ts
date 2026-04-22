// ============================================================
// ITSEIA Academy — AI Model Configuration
// Multi-provider: Gemini (directo) + OpenRouter (ChatGPT, Claude, Llama, Mistral)
// ============================================================

export interface AIModelConfig {
  name: string;
  provider: "google" | "openrouter";
  modelId: string; // ID real del modelo en la API del provider
  description: string;
  costPer1kIn: number;
  costPer1kOut: number;
  icon: string;
  color: string;
  maxTokens: number;
}

export const AI_MODELS = {
  "gemini-2.0-flash": {
    name: "Gemini 2.0 Flash",
    provider: "google",
    modelId: "gemini-2.0-flash",
    description: "Rapido y economico",
    costPer1kIn: 0.0001,
    costPer1kOut: 0.0004,
    icon: "\u26A1",
    color: "#73B8E7",
    maxTokens: 8192,
  },
  "chatgpt-4o": {
    name: "ChatGPT-4o",
    provider: "openrouter",
    modelId: "openai/gpt-4o",
    description: "OpenAI — el mas popular",
    costPer1kIn: 0.0025,
    costPer1kOut: 0.01,
    icon: "\uD83E\uDDE0",
    color: "#10A37F",
    maxTokens: 4096,
  },
  "claude-sonnet": {
    name: "Claude Sonnet 4.5",
    provider: "openrouter",
    modelId: "anthropic/claude-sonnet-4.5",
    description: "Anthropic — mejor en analisis",
    costPer1kIn: 0.003,
    costPer1kOut: 0.015,
    icon: "\uD83C\uDFAF",
    color: "#CC785C",
    maxTokens: 4096,
  },
  "llama-3.1": {
    name: "Llama 3.1 70B",
    provider: "openrouter",
    modelId: "meta-llama/llama-3.1-70b-instruct",
    description: "Meta — open source potente",
    costPer1kIn: 0.0004,
    costPer1kOut: 0.0004,
    icon: "\uD83E\uDD99",
    color: "#0668E1",
    maxTokens: 4096,
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    provider: "google",
    modelId: "gemini-2.5-flash",
    description: "Google — ultimo modelo",
    costPer1kIn: 0.00015,
    costPer1kOut: 0.0006,
    icon: "\u2728",
    color: "#FBBC0C",
    maxTokens: 8192,
  },
  "mistral-large": {
    name: "Mistral Large",
    provider: "openrouter",
    modelId: "mistralai/mistral-large",
    description: "Mistral — europeo, rapido",
    costPer1kIn: 0.002,
    costPer1kOut: 0.006,
    icon: "\uD83C\uDF0A",
    color: "#F97316",
    maxTokens: 4096,
  },
} as const;

export type AIModelId = keyof typeof AI_MODELS;

export const DEFAULT_MODEL: AIModelId = "gemini-2.0-flash";

export const MODEL_IDS = Object.keys(AI_MODELS) as AIModelId[];

export function isValidModel(model: string): model is AIModelId {
  return model in AI_MODELS;
}

export function getCostIndicator(modelId: AIModelId): string {
  const model = AI_MODELS[modelId];
  const avgCost = (model.costPer1kIn + model.costPer1kOut) / 2;
  if (avgCost < 0.0003) return "$";
  if (avgCost < 0.003) return "$$";
  return "$$$";
}

export function estimateModelCost(
  modelId: AIModelId,
  tokensIn: number,
  tokensOut: number
): number {
  const model = AI_MODELS[modelId];
  const inputCost = (tokensIn / 1000) * model.costPer1kIn;
  const outputCost = (tokensOut / 1000) * model.costPer1kOut;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

export function getGeminiStreamUrl(modelId: AIModelId, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${apiKey}`;
}

export function getGeminiUrl(modelId: AIModelId, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
}
