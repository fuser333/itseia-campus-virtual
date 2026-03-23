"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProgramRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: "carrera" | "curso" | "preuni" | "bootcamp";
  price: number;
  duration_months: number | null;
  image_url: string | null;
  is_active: boolean;
  career_code: string | null;
  total_semesters: number;
}

const TYPE_LABELS: Record<string, string> = {
  carrera: "Carrera Tecnologica",
  curso: "Curso Profesional",
  preuni: "Preuniversitario",
  bootcamp: "Bootcamp",
};

const TYPE_BADGE_STYLES: Record<string, string> = {
  carrera: "bg-white/20 text-white",
  curso: "bg-[#FBBC0C]/20 text-[#FBBC0C]",
  preuni: "bg-[#73B8E7]/20 text-[#73B8E7]",
  bootcamp: "bg-[#F0846D]/20 text-[#F0846D]",
};

const TYPE_FEATURES: Record<string, string[]> = {
  carrera: [
    "Titulo IST reconocido por SENESCYT",
    "5 semestres de formacion integral",
    "AI Lab incluido en la matricula",
    "Pipeline de talento con empresas",
    "Portafolio profesional al graduarte",
  ],
  curso: [
    "Certificado ITSEIA al completar",
    "Contenido personalizado por profesion",
    "Acceso al AI Lab durante el curso",
    "Ejercicios practicos con IA real",
    "Soporte y comunidad de estudiantes",
  ],
  preuni: [
    "Preparacion para carreras de IA",
    "Fundamentos de programacion y datos",
    "Introduccion al AI Lab",
    "Sin requisitos previos",
    "Certificado de finalizacion",
  ],
  bootcamp: [
    "Intensivo y practico",
    "Proyectos reales desde el dia 1",
    "Mentoria personalizada",
    "Acceso completo al AI Lab",
    "Certificado al completar",
  ],
};

const FILTER_TABS = [
  { value: "all", label: "Todos" },
  { value: "carrera", label: "Carreras" },
  { value: "curso", label: "Cursos" },
  { value: "preuni", label: "Preuniversitario" },
];

export default function CatalogoPage() {
  const supabase = createClient();
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true)
        .order("type")
        .order("price", { ascending: true });

      if (data) setPrograms(data as ProgramRow[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = programs.filter((p) => {
    const matchesType = activeFilter === "all" || p.type === activeFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group by type
  const grouped: Record<string, ProgramRow[]> = {};
  for (const p of filtered) {
    const key = p.type;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }

  const typeOrder = ["carrera", "curso", "preuni", "bootcamp"];
  const sortedGroups = typeOrder
    .filter((t) => grouped[t] && grouped[t].length > 0)
    .map((t) => ({ type: t, programs: grouped[t] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0A1628]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBBC0C] flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-lg">IT</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              ITSEIA <span className="text-[#73B8E7] font-normal text-sm">Catalogo</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
              Inicio
            </Link>
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Iniciar Sesion
            </Link>
            <Link
              href="/register"
              className="bg-[#FBBC0C] text-[#0A1628] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#FBBC0C]/90 transition-colors"
            >
              Inscribirme
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Catalogo de <span className="text-[#FBBC0C]">Carreras</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto mb-8">
            Explora todas nuestras carreras de formacion en Inteligencia Artificial.
            Desde cursos express hasta carreras completas con titulo.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              type="text"
              placeholder="Buscar carreras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === tab.value
                    ? "bg-[#FBBC0C] text-[#0A1628]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {sortedGroups.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No se encontraron carreras.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#FBBC0C] text-sm mt-2 hover:underline"
                >
                  Limpiar busqueda
                </button>
              )}
            </div>
          ) : (
            sortedGroups.map((group) => (
              <div key={group.type} className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {TYPE_LABELS[group.type] || group.type}
                </h2>
                <div className="h-1 w-12 bg-[#FBBC0C] rounded-full mb-8" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.programs.map((program) => {
                    const features = TYPE_FEATURES[program.type] || [];
                    return (
                      <Card
                        key={program.id}
                        className="bg-white/5 border-white/10 overflow-hidden hover:border-[#FBBC0C]/30 transition-all flex flex-col"
                      >
                        <CardContent className="p-6 flex flex-col flex-1">
                          {/* Type Badge */}
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${TYPE_BADGE_STYLES[program.type] || "bg-white/10 text-white/60"}`}
                            >
                              {TYPE_LABELS[program.type] || program.type}
                            </span>
                            {program.career_code && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1F2F58] text-[#73B8E7]">
                                {program.career_code}
                              </span>
                            )}
                          </div>

                          {/* Name & Description */}
                          <h3 className="text-lg font-bold text-white mb-2">{program.name}</h3>
                          <p className="text-white/40 text-sm mb-4 leading-relaxed flex-1">
                            {program.description || `Carrera de formacion en ${program.name} con certificacion ITSEIA.`}
                          </p>

                          {/* Features */}
                          <ul className="space-y-2 mb-6">
                            {features.slice(0, 4).map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-white/50 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC0C] mt-1.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* Price & Duration */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-2xl font-extrabold text-[#FBBC0C]">${program.price}</span>
                              {program.type === "carrera" && (
                                <span className="text-white/40 text-sm ml-1">/mes</span>
                              )}
                            </div>
                            <div className="text-xs text-white/30">
                              {program.type === "carrera" ? (
                                <span>{program.total_semesters || 5} semestres</span>
                              ) : program.duration_months ? (
                                <span>{program.duration_months} {program.duration_months === 1 ? "mes" : "meses"}</span>
                              ) : null}
                            </div>
                          </div>

                          {/* CTAs */}
                          <div className="flex gap-3">
                            <Link href={`/programs/${program.slug}`} className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-white/10 text-white hover:bg-white/5 text-sm"
                              >
                                Ver detalle
                              </Button>
                            </Link>
                            <Link href={`/checkout/${program.id}`} className="flex-1">
                              <Button className="w-full bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold text-sm">
                                Inscribirme
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/30 text-sm">
            2026 ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              Inicio
            </Link>
            <a href="https://itseia.ai" target="_blank" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              itseia.ai
            </a>
            <Link href="/login" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              Plataforma
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
