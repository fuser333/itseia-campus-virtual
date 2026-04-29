"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  X,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Assignment, Submission } from "@/types/database";

interface AssignmentPanelProps {
  assignmentId: string;
  sessionId: string;
  onSubmitted?: () => void;
  className?: string;
}

export default function AssignmentPanel({
  assignmentId,
  sessionId,
  onSubmitted,
  className,
}: AssignmentPanelProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: assignmentData } = await supabase
      .from("assignments")
      .select("*")
      .eq("id", assignmentId)
      .single();

    if (assignmentData) {
      setAssignment(assignmentData);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: submissionData } = await supabase
        .from("submissions")
        .select("*")
        .eq("assignment_id", assignmentId)
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();

      if (submissionData) {
        setSubmission(submissionData);
      }
    }

    setLoading(false);
  }, [assignmentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  }

  function validateAndSetFile(file: File) {
    if (!assignment) return;

    const maxBytes = assignment.max_file_size_mb * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(
        `El archivo excede el tamaño máximo de ${assignment.max_file_size_mb}MB.`
      );
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedTypes = assignment.allowed_file_types || [];
    if (
      allowedTypes.length > 0 &&
      !allowedTypes.includes(ext) &&
      !allowedTypes.includes("." + ext)
    ) {
      setError(
        `Tipo de archivo no permitido. Tipos aceptados: ${allowedTypes.join(", ")}`
      );
      return;
    }

    setError(null);
    setSelectedFile(file);
  }

  async function handleSubmit() {
    if (!selectedFile || !assignment || uploading) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sessionId", sessionId);

      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error al enviar la entrega.");
        setUploading(false);
        return;
      }

      const data = await response.json();
      setSubmission(data.submission);
      setSelectedFile(null);
      onSubmitted?.();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#FBBC0C]" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <FileText className="size-8 text-[#F9F6E7]/25" />
        <p className="text-sm text-[#F9F6E7]/50">
          Ejercicio no disponible aún.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Assignment header */}
      <div>
        <h3 className="text-base font-semibold text-[#FBBC0C]">
          {assignment.title}
        </h3>
        {assignment.due_date && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#F9F6E7]/60">
            <Clock className="size-3" />
            Fecha límite:{" "}
            {new Date(assignment.due_date).toLocaleDateString("es-EC", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Instructions — dark prose */}
      <div className="rounded-xl border border-[#1F2F58]/50 bg-[#1F2F58]/30 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#73B8E7]">
          Instrucciones
        </p>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#FBBC0C] prose-p:text-[#F9F6E7] prose-li:text-[#F9F6E7] prose-strong:text-[#FBBC0C] prose-code:text-[#F0846D] prose-code:bg-[#0D1B30] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown>{assignment.instructions_markdown || "No hay instrucciones disponibles."}</ReactMarkdown>
        </div>
      </div>

      {/* Existing submission */}
      {submission && (
        <div
          className={cn(
            "rounded-xl border p-4",
            submission.status === "graded"
              ? "border-emerald-500/30 bg-emerald-500/10"
              : submission.status === "returned"
              ? "border-[#F0846D]/30 bg-[#F0846D]/10"
              : "border-[#73B8E7]/25 bg-[#73B8E7]/10"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-[#F9F6E7]/50" />
              <div>
                <p className="text-sm font-medium text-[#F9F6E7]">
                  {submission.file_name || "Archivo enviado"}
                </p>
                <p className="text-xs text-[#F9F6E7]/40">
                  Enviado el{" "}
                  {new Date(submission.submitted_at).toLocaleDateString(
                    "es-EC",
                    { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }
                  )}
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                "border-none text-[10px] font-semibold uppercase tracking-wider",
                submission.status === "graded"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : submission.status === "returned"
                  ? "bg-[#F0846D]/20 text-[#F0846D]"
                  : "bg-[#73B8E7]/15 text-[#73B8E7]"
              )}
            >
              {submission.status === "graded"
                ? "Calificado"
                : submission.status === "returned"
                ? "Devuelto"
                : "Enviado"}
            </Badge>
          </div>

          {/* Grade */}
          {submission.status === "graded" && submission.grade !== null && (
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-[#0D1B30] p-3">
              <Star className="size-5 text-[#FBBC0C]" />
              <div>
                <p className="text-lg font-bold text-[#FBBC0C] font-[family-name:var(--font-space-grotesk)]">
                  {submission.grade}/{assignment.max_grade}
                </p>
                <p className="text-xs text-[#F9F6E7]/40">Calificación</p>
              </div>
            </div>
          )}

          {/* Feedback */}
          {submission.feedback && (
            <div className="mt-3 rounded-lg bg-[#0D1B30] p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FBBC0C] mb-1">
                Retroalimentación del docente
              </p>
              <p className="text-sm text-[#F9F6E7]/70">{submission.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Upload area (only if not submitted or returned) */}
      {(!submission || submission.status === "returned") && (
        <div className="space-y-3">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
              dragActive
                ? "border-[#FBBC0C] bg-[#FBBC0C]/10"
                : "border-white/15 bg-[#1F2F58]/20 hover:border-[#73B8E7]/40 hover:bg-[#1F2F58]/30"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={(assignment.allowed_file_types || []).map(t => t.startsWith('.') ? t : '.' + t).join(",")}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="size-6 text-[#73B8E7]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#F9F6E7]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#F9F6E7]/50">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="rounded-lg p-1 text-[#F9F6E7]/50 hover:bg-white/10 hover:text-[#F9F6E7]"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto size-8 text-[#F9F6E7]/30" />
                <p className="mt-3 text-sm font-medium text-[#F9F6E7]">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="mt-1 text-xs text-[#F9F6E7]/50">
                  Tipos: {(assignment.allowed_file_types || []).join(", ")} | Máx:{" "}
                  {assignment.max_file_size_mb}MB
                </p>
              </>
            )}
          </div>

          {/* Submit button */}
          {selectedFile && (
            <Button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full gap-2 bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 shadow-md shadow-[#FBBC0C]/20"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? "Enviando..." : "Enviar entrega"}
            </Button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-[#F0846D]/10 border border-[#F0846D]/30 p-3">
          <AlertCircle className="size-4 mt-0.5 shrink-0 text-[#F0846D]" />
          <p className="text-sm text-[#F0846D]">{error}</p>
        </div>
      )}
    </div>
  );
}
