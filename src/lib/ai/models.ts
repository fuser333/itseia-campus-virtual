// ============================================================
// ITSEIA Academy — AI Model Configuration
// Multi-modelo: todos usan Gemini API con la misma key
// ============================================================

export interface AIModelConfig {
  name: string;
  provider: "google";
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
    description: "Rapido y economico",
    costPer1kIn: 0.0001,
    costPer1kOut: 0.0004,
    icon: "\u26A1",
    color: "#73B8E7",
    maxTokens: 8192,
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Ultimo modelo Google",
    costPer1kIn: 0.00015,
    costPer1kOut: 0.0006,
    icon: "\uD83E\uDDE0",
    color: "#FBBC0C",
    maxTokens: 8192,
  },
  "gemini-2.0-flash-lite": {
    name: "Gemini Flash Lite",
    provider: "google",
    description: "El mas barato",
    costPer1kIn: 0.0000375,
    costPer1kOut: 0.00015,
    icon: "\uD83D\uDCA8",
    color: "#F0846D",
    maxTokens: 8192,
  },
} as const;

export type AIModelId = keyof typeof AI_MODELS;

export const DEFAULT_MODEL: AIModelId = "gemini-2.0-flash";

export const MODEL_IDS = Object.keys(AI_MODELS) as AIModelId[];

/**
 * Valida que un string sea un model ID valido.
 */
export function isValidModel(model: string): model is AIModelId {
  return model in AI_MODELS;
}

/**
 * Retorna el indicador de costo visual ($ a $$$) para un modelo.
 */
export function getCostIndicator(modelId: AIModelId): string {
  const model = AI_MODELS[modelId];
  const avgCost = (model.costPer1kIn + model.costPer1kOut) / 2;
  if (avgCost < 0.0001) return "$";
  if (avgCost < 0.0003) return "$$";
  return "$$$";
}

/**
 * Calcula el costo estimado en USD para un modelo especifico.
 */
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

/**
 * Construye la URL de la API de Gemini para un modelo dado.
 */
export function getGeminiStreamUrl(modelId: AIModelId, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${apiKey}`;
}

export function getGeminiUrl(modelId: AIModelId, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
}
