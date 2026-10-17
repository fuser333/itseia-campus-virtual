// ============================================================
// ITSEIA Academy — AI Lab Avanzado: Constantes
// Feature: 010-ai-lab-advanced
// ============================================================

/** URLs para abrir modelos externos con la pregunta precargada */
export const EXTERNAL_MODEL_URLS = {
  chatgpt: (query: string) =>
    `https://chatgpt.com/?q=${encodeURIComponent(query)}`,
  claude: (query: string) =>
    `https://claude.ai/new?q=${encodeURIComponent(query)}`,
  perplexity: (query: string) =>
    `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`,
} as const;

export type ExternalModelId = keyof typeof EXTERNAL_MODEL_URLS;

export const EXTERNAL_MODELS: {
  id: ExternalModelId;
  name: string;
  color: string;
}[] = [
  { id: "chatgpt", name: "ChatGPT", color: "#10A37F" },
  { id: "claude", name: "Claude", color: "#CC785C" },
  { id: "perplexity", name: "Perplexity", color: "#20B2AA" },
];

/** Numero de conversaciones por pagina en el historial */
export const CONVERSATIONS_PAGE_SIZE = 20;

/** Maximo de mensajes por conversacion antes de iniciar una nueva */
export const MAX_MESSAGES_PER_CONVERSATION = 50;

/** Timeout en ms para la ejecucion de codigo en el Playground */
export const PLAYGROUND_TIMEOUT_MS = 10_000;
