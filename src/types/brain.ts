// ============================================================
// ITSEIA Academy — Segundo Cerebro Types
// Feature: segundo-cerebro-mvp
// ============================================================

export interface BrainNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  session_id?: string | null;
  subject_id?: string | null;
  embedding?: number[] | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BrainSource {
  id: string;
  user_id: string;
  source_type: "pdf" | "url" | "youtube" | "text";
  title: string;
  url?: string | null;
  content: string;
  embedding?: number[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BrainDelta {
  id: string;
  user_id: string;
  source_id?: string | null;
  delta_content: string;
  known_content?: string | null;
  flashcards: Flashcard[];
  summary?: string | null;
  created_at: string;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface SemanticSearchResult {
  id: string;
  title: string;
  content: string;
  similarity: number;
  source_type?: string;
}

export interface DeltaResult {
  delta_content: string;
  known_content: string;
  flashcards: Flashcard[];
  summary: string;
}

export interface StudyMaterial {
  type: "flashcards" | "summary" | "quiz" | "comparison";
  content: string;
  flashcards?: Flashcard[];
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export type IngestType = "pdf" | "url" | "youtube";
