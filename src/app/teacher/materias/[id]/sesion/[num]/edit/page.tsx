"use client";

import { useEffect, useState, useCallback, use } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Save,
  CheckCircle2,
  Video,
  FileText,
  BookOpenText,
  HelpCircle,
  ClipboardList,
  Link2,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  MonitorPlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import QuizBuilder from "@/components/teacher/QuizBuilder";
import LiveClassPanel from "@/components/session/LiveClassPanel";
import ScheduleClassForm from "@/components/session/ScheduleClassForm";
import type {
  Session,
  Subject,
  Assignment,
  SessionResource,
  ResourceType,
} from "@/types/database";

export default function SessionEditPage({
  params,
}: {
  params: Promise<{ id: string; num: string }>;
}) {
  const { id: subjectId, num } = use(params);
  const sessionNumber = parseInt(num, 10);
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Video tab
  const [videoUrl, setVideoUrl] = useState("");

  // Slides tab
  const [slidesUrl, setSlidesUrl] = useState("");
  const [slidesType, setSlidesType] = useState<"pdf" | "google_slides" | "canva">("pdf");
  const [uploading, setUploading] = useState(false);

  // Theory tab
  const [theoryMarkdown, setTheoryMarkdown] = useState("");

  // Assignment tab
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentInstructions, setAssignmentInstructions] = useState("");
  const [assignmentFileTypes, setAssignmentFileTypes] = useState("pdf,zip,py,ipynb,docx");
  const [assignmentMaxGrade, setAssignmentMaxGrade] = useState("100");

  // Resources tab
  const [resources, setResources] = useState<SessionResource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [newResourceType, setNewResourceType] = useState<ResourceType>("link");

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      // Subject
      const { data: subjectData } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      setSubject(subjectData);

      // Session
      const { data: sessionData } = await supabase
        .from("sessions")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("number", sessionNumber)
        .single();

      if (sessionData) {
        setSession(sessionData);
        setVideoUrl(sessionData.video_url || "");
        setSlidesUrl(sessionData.slides_url || "");
        setSlidesType(sessionData.slides_type || "pdf");
        setTheoryMarkdown(sessionData.theory_markdown || "");

        // Fetch assignment
        const { data: assignmentData } = await supabase
          .from("assignments")
          .select("*")
          .eq("session_id", sessionData.id)
          .limit(1)
          .maybeSingle();

        if (assignmentData) {
          setAssignment(assignmentData);
          setAssignmentTitle(assignmentData.title);
          setAssignmentInstructions(assignmentData.instructions_markdown || "");
          setAssignmentFileTypes(
            (assignmentData.allowed_file_types || []).join(",")
          );
          setAssignmentMaxGrade(
            assignmentData.max_grade?.toString() || "100"
          );
        }

        // Fetch resources
        const { data: resourcesData } = await supabase
          .from("session_resources")
          .select("*")
          .eq("session_id", sessionData.id)
          .order("order_index");

        setResources(resourcesData || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [subjectId, sessionNumber]);

  function showSaved(tab: string) {
    setSaved(tab);
    setTimeout(() => setSaved(null), 2000);
  }

  // Save Video
  async function saveVideo() {
    if (!session) return;
    setSaving("video");

    await supabase
      .from("sessions")
      .update({
        video_url: videoUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    setSaving(null);
    showSaved("video");
  }

  // Save Slides
  async function saveSlides() {
    if (!session) return;
    setSaving("slides");

    await supabase
      .from("sessions")
      .update({
        slides_url: slidesUrl.trim() || null,
        slides_type: slidesUrl.trim() ? slidesType : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    setSaving(null);
    showSaved("slides");
  }

  // Upload PDF to Supabase Storage
  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `slides/${subjectId}/${session.id}.${ext}`;

    const { error } = await supabase.storage
      .from("slides")
      .upload(path, file, { upsert: true });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("slides").getPublicUrl(path);

      setSlidesUrl(publicUrl);
      setSlidesType("pdf");
    }

    setUploading(false);
  }

  // Save Theory
  async function saveTheory() {
    if (!session) return;
    setSaving("theory");

    await supabase
      .from("sessions")
      .update({
        theory_markdown: theoryMarkdown.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    setSaving(null);
    showSaved("theory");
  }

  // Save Assignment
  async function saveAssignment() {
    if (!session) return;
    setSaving("assignment");

    const payload = {
      session_id: session.id,
      title: assignmentTitle.trim() || `Ejercicio Sesion ${sessionNumber}`,
      instructions_markdown: assignmentInstructions.trim() || null,
      allowed_file_types: assignmentFileTypes
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      max_grade: parseFloat(assignmentMaxGrade) || 100,
      is_active: true,
    };

    if (assignment) {
      await supabase
        .from("assignments")
        .update(payload)
        .eq("id", assignment.id);
    } else {
      const { data } = await supabase
        .from("assignments")
        .insert(payload)
        .select()
        .single();
      if (data) setAssignment(data);
    }

    setSaving(null);
    showSaved("assignment");
  }

  // Add Resource
  async function addResource() {
    if (!session || !newResourceTitle.trim() || !newResourceUrl.trim()) return;

    const { data } = await supabase
      .from("session_resources")
      .insert({
        session_id: session.id,
        title: newResourceTitle.trim(),
        url: newResourceUrl.trim(),
        type: newResourceType,
        order_index: resources.length,
      })
      .select()
      .single();

    if (data) {
      setResources([...resources, data]);
      setNewResourceTitle("");
      setNewResourceUrl("");
      setNewResourceType("link");
    }
  }

  // Delete Resource
  async function deleteResource(resourceId: string) {
    await supabase.from("session_resources").delete().eq("id", resourceId);
    setResources(resources.filter((r) => r.id !== resourceId));
  }

  // Extract YouTube embed URL
  function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  function SaveButton({
    tab,
    onClick,
    disabled,
  }: {
    tab: string;
    onClick: () => void;
    disabled?: boolean;
  }) {
    const isSaving = saving === tab;
    const isSaved = saved === tab;

    return (
      <Button onClick={onClick} disabled={isSaving || disabled} size="lg">
        {isSaving ? (
          <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
        ) : isSaved ? (
          <CheckCircle2
            className="size-4 text-emerald-400"
            data-icon="inline-start"
          />
        ) : (
          <Save className="size-4" data-icon="inline-start" />
        )}
        {isSaved ? "Guardado" : "Guardar"}
      </Button>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  if (!session || !subject) {
    return (
      <div className="space-y-4">
        <Link href={`/teacher/materias/${subjectId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Volver a materia
          </Button>
        </Link>
        <p className="text-sm text-gray-400">Sesion no encontrada.</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/teacher/materias/${subjectId}`}>
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Volver a {subject.name}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Sesión {sessionNumber}: {session.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {subject.code} &middot; {subject.name}
        </p>
      </div>

      {/* Tabbed Editor */}
      <Tabs defaultValue="video">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="video" className="gap-1.5">
            <Video className="size-3.5" />
            <span className="hidden sm:inline">Video</span>
          </TabsTrigger>
          <TabsTrigger value="slides" className="gap-1.5">
            <FileText className="size-3.5" />
            <span className="hidden sm:inline">Presentacion</span>
          </TabsTrigger>
          <TabsTrigger value="theory" className="gap-1.5">
            <BookOpenText className="size-3.5" />
            <span className="hidden sm:inline">Teoria</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-1.5">
            <HelpCircle className="size-3.5" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-1.5">
            <ClipboardList className="size-3.5" />
            <span className="hidden sm:inline">Ejercicio</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5">
            <Link2 className="size-3.5" />
            <span className="hidden sm:inline">Recursos</span>
          </TabsTrigger>
          <TabsTrigger value="sincronica" className="gap-1.5">
            <MonitorPlay className="size-3.5" />
            <span className="hidden sm:inline">Sincronica</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Video Tab ── */}
        <TabsContent value="video">
          <Card>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="video-url">URL de YouTube</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-400">
                  Formatos: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
                </p>
              </div>

              {embedUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                  <iframe
                    src={embedUrl}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Vista previa de video"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <SaveButton tab="video" onClick={saveVideo} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Slides Tab ── */}
        <TabsContent value="slides">
          <Card>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label>Subir PDF</Label>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-[#73B8E7] hover:text-[#73B8E7]">
                    <Upload className="size-4" />
                    {uploading ? "Subiendo..." : "Seleccionar archivo PDF"}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {uploading && (
                    <Loader2 className="size-4 animate-spin text-[#73B8E7]" />
                  )}
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="slides-url">O URL directa</Label>
                <Input
                  id="slides-url"
                  value={slidesUrl}
                  onChange={(e) => setSlidesUrl(e.target.value)}
                  placeholder="https://storage.../presentacion.pdf"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Tipo de presentacion</Label>
                <select
                  value={slidesType}
                  onChange={(e) =>
                    setSlidesType(
                      e.target.value as "pdf" | "google_slides" | "canva"
                    )
                  }
                  className="h-8 w-fit rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="pdf">PDF</option>
                  <option value="google_slides">Google Slides</option>
                  <option value="canva">Canva</option>
                </select>
              </div>

              {slidesUrl && slidesType === "pdf" && (
                <div className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200">
                  <iframe
                    src={slidesUrl}
                    className="size-full"
                    title="Vista previa de presentacion"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <SaveButton tab="slides" onClick={saveSlides} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Theory Tab ── */}
        <TabsContent value="theory">
          <Card>
            <CardContent className="space-y-4">
              <Label>Contenido Teorico (Markdown)</Label>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Editor */}
                <div className="grid gap-1.5">
                  <span className="text-xs font-medium text-gray-500">
                    Editor
                  </span>
                  <Textarea
                    value={theoryMarkdown}
                    onChange={(e) => setTheoryMarkdown(e.target.value)}
                    placeholder="# Titulo de la leccion&#10;&#10;Escribe el contenido teorico en Markdown..."
                    className="min-h-[500px] font-mono text-xs"
                  />
                </div>

                {/* Preview */}
                <div className="grid gap-1.5">
                  <span className="text-xs font-medium text-gray-500">
                    Vista previa
                  </span>
                  <div className="prose prose-sm max-w-none overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 min-h-[500px]">
                    {theoryMarkdown ? (
                      <ReactMarkdown>{theoryMarkdown}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-400">
                        La vista previa aparecera aqui...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton tab="theory" onClick={saveTheory} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Quiz Tab ── */}
        <TabsContent value="quiz">
          <QuizBuilder sessionId={session.id} />
        </TabsContent>

        {/* ── Assignment Tab ── */}
        <TabsContent value="assignment">
          <Card>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="assignment-title">Titulo del ejercicio</Label>
                <Input
                  id="assignment-title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder={`Ejercicio Sesion ${sessionNumber}`}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Instructions editor */}
                <div className="grid gap-1.5">
                  <Label>Instrucciones (Markdown)</Label>
                  <Textarea
                    value={assignmentInstructions}
                    onChange={(e) =>
                      setAssignmentInstructions(e.target.value)
                    }
                    placeholder="# Instrucciones del ejercicio&#10;&#10;Describe lo que el estudiante debe hacer..."
                    className="min-h-[300px] font-mono text-xs"
                  />
                </div>

                {/* Preview */}
                <div className="grid gap-1.5">
                  <Label>Vista previa</Label>
                  <div className="prose prose-sm max-w-none overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 min-h-[300px]">
                    {assignmentInstructions ? (
                      <ReactMarkdown>{assignmentInstructions}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-400">
                        La vista previa aparecera aqui...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="file-types">
                    Tipos de archivo permitidos
                  </Label>
                  <Input
                    id="file-types"
                    value={assignmentFileTypes}
                    onChange={(e) =>
                      setAssignmentFileTypes(e.target.value)
                    }
                    placeholder="pdf,zip,py,ipynb,docx"
                  />
                  <p className="text-xs text-gray-400">
                    Separados por coma
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="max-grade">Nota maxima</Label>
                  <Input
                    id="max-grade"
                    type="number"
                    value={assignmentMaxGrade}
                    onChange={(e) =>
                      setAssignmentMaxGrade(e.target.value)
                    }
                    placeholder="100"
                    min={1}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton tab="assignment" onClick={saveAssignment} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Sincronica Tab ── */}
        <TabsContent value="sincronica">
          <Card>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Sesion Sincronica (Videoconferencia)
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Gestiona las clases en vivo para esta sesion academica. Requisito CES: 51% creditos sincronicos.
                  </p>
                </div>
              </div>

              {/* Panel de clase en vivo (vista del docente) */}
              <LiveClassPanel
                sessionId={session.id}
                subjectName={subject.name}
                userRole="docente"
                isEnrolled={true}
              />

              {/* Formulario para programar clases */}
              <div className="border-t border-gray-100 pt-4">
                {!showScheduleForm ? (
                  <Button
                    onClick={() => setShowScheduleForm(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <MonitorPlay className="size-4" />
                    Programar clase sincronica
                  </Button>
                ) : (
                  <div className="rounded-xl border border-[#1F2F58]/10 bg-gray-50 p-4">
                    <ScheduleClassForm
                      subjectId={subjectId}
                      sessionId={session.id}
                      onScheduled={() => setShowScheduleForm(false)}
                      onCancel={() => setShowScheduleForm(false)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Resources Tab ── */}
        <TabsContent value="resources">
          <Card>
            <CardContent className="space-y-4">
              <Label>Recursos de la sesion</Label>

              {/* Existing resources */}
              {resources.length > 0 && (
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                  {resources.map((resource, idx) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-6 items-center justify-center rounded bg-gray-100 text-[10px] font-medium text-gray-500">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {resource.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase">
                              {resource.type}
                            </span>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-0.5 text-[#73B8E7] hover:underline"
                            >
                              Abrir
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteResource(resource.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add resource form */}
              <div className="rounded-lg border border-dashed border-gray-300 p-4">
                <p className="mb-3 text-xs font-medium text-gray-500">
                  Agregar recurso
                </p>
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                  <Input
                    value={newResourceTitle}
                    onChange={(e) => setNewResourceTitle(e.target.value)}
                    placeholder="Titulo del recurso"
                  />
                  <Input
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    placeholder="URL"
                  />
                  <select
                    value={newResourceType}
                    onChange={(e) =>
                      setNewResourceType(e.target.value as ResourceType)
                    }
                    className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="link">Link</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="github">GitHub</option>
                    <option value="dataset">Dataset</option>
                    <option value="tool">Herramienta</option>
                  </select>
                  <Button
                    onClick={addResource}
                    disabled={
                      !newResourceTitle.trim() || !newResourceUrl.trim()
                    }
                    size="default"
                  >
                    <Plus className="size-4" data-icon="inline-start" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
