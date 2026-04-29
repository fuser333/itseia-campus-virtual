"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Play,
  Code2,
  Brain,
  Layers,
  Zap,
  FolderKanban,
  Rocket,
  BarChart2,
} from "lucide-react";
import {
  BOOTCAMP_MES1_MODULOS,
  BOOTCAMP_MES1_SESIONES,
} from "../../_data/mes1-data";
import {
  BOOTCAMP_MES2_MODULOS,
  BOOTCAMP_MES2_SESIONES,
} from "../../_data/mes2-data";
import {
  BOOTCAMP_MES3_MODULOS,
  BOOTCAMP_MES3_SESIONES,
} from "../../_data/mes3-data";

// ─── Mapa de ID de módulo (m1–m12) → datos del mes/módulo ────────────────────

const ICON_MAP: Record<number, React.ComponentType<{ className?: string }>> = {
  1:  Brain,
  2:  BarChart2,
  3:  Zap,
  4:  FolderKanban,
  5:  BookOpen,
  6:  Brain,
  7:  Rocket,
  8:  Layers,
  9:  Brain,
  10: Rocket,
  11: Code2,
  12: FolderKanban,
};

const COLOR_MAP: Record<number, string> = {
  1:  "#73B8E7",
  2:  "#FBBC0C",
  3:  "#F0846D",
  4:  "#73B8E7",
  5:  "#FBBC0C",
  6:  "#F0846D",
  7:  "#73B8E7",
  8:  "#FBBC0C",
  9:  "#F0846D",
  10: "#73B8E7",
  11: "#FBBC0C",
  12: "#F0846D",
};

interface ModuloMeta {
  num: number;
  nombre: string;
  horas: number;
  sesiones: number;
}

interface SesionMeta {
  id: number;
  titulo: string;
  moduloNum: number;
}

interface ModuloResolved {
  /** Número global (1–12) */
  globalNum: number;
  /** Número dentro del mes (1–4) */
  localNum: number;
  mes: number;
  meta: ModuloMeta;
  sesiones: SesionMeta[];
}

function resolveModulo(idStr: string): ModuloResolved | null {
  const match = idStr.match(/^m(\d+)$/);
  if (!match) return null;
  const globalNum = Number(match[1]);
  if (globalNum < 1 || globalNum > 12) return null;

  let mes: number;
  let localNum: number;
  let modulos: ModuloMeta[];
  let sesiones: SesionMeta[];

  if (globalNum <= 4) {
    mes      = 1;
    localNum = globalNum;
    modulos  = BOOTCAMP_MES1_MODULOS;
    sesiones = BOOTCAMP_MES1_SESIONES;
  } else if (globalNum <= 8) {
    mes      = 2;
    localNum = globalNum - 4;
    modulos  = BOOTCAMP_MES2_MODULOS;
    sesiones = BOOTCAMP_MES2_SESIONES;
  } else {
    mes      = 3;
    localNum = globalNum - 8;
    modulos  = BOOTCAMP_MES3_MODULOS;
    sesiones = BOOTCAMP_MES3_SESIONES;
  }

  const meta = modulos.find((m) => m.num === localNum);
  if (!meta) return null;

  const sesionesFiltradas = sesiones.filter((s) => s.moduloNum === localNum);

  return {
    globalNum,
    localNum,
    mes,
    meta,
    sesiones: sesionesFiltradas,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BootcampModuloPage({ params }: PageProps) {
  const { id } = use(params);

  const modulo = resolveModulo(id);
  if (!modulo) notFound();

  const Icon  = ICON_MAP[modulo.globalNum] ?? Brain;
  const color = COLOR_MAP[modulo.globalNum] ?? "#73B8E7";

  return (
    <div className="space-y-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#1F2F58]/50 flex-wrap">
        <Link
          href="/bootcamp"
          className="hover:text-[#1F2F58] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="size-3" />
          Bootcamp
        </Link>
        <span>/</span>
        <span className="text-[#1F2F58]/70">Mes {modulo.mes}</span>
        <span>/</span>
        <span className="text-[#0A1628] font-medium">
          M{modulo.globalNum}: {modulo.meta.nombre}
        </span>
      </nav>

      {/* ── Header del módulo ──────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          {/* Badge */}
          <div
            className="hidden sm:flex size-14 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${color}22` }}
          >
            <span
              className="text-xl font-black font-[family-name:var(--font-space-grotesk)]"
              style={{ color }}
            >
              M{modulo.globalNum}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#73B8E7] uppercase tracking-wider">
                Bootcamp Intensivo de IA · Mes {modulo.mes}
              </span>
              <span
                className="inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold"
                style={{ background: `${color}22`, color }}
              >
                Módulo {modulo.localNum} de 4
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space-grotesk)]">
              {modulo.meta.nombre}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {modulo.meta.horas} horas
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {modulo.sesiones.length} sesiones
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>Nivel: Intensivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lista de sesiones ──────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0A1628]">
            Sesiones del módulo ({modulo.sesiones.length})
          </h2>
          <span className="text-xs text-[#1F2F58]/40">
            Haz clic para abrir la sesión completa
          </span>
        </div>

        <div className="space-y-2">
          {modulo.sesiones.map((s, idx) => (
            <Link
              key={s.id}
              href={`/bootcamp/sesion/${s.id}`}
              className="group flex items-center gap-4 rounded-xl border border-[#1F2F58]/[0.08] bg-white p-4 shadow-sm transition-all hover:border-[#73B8E7]/40 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Número */}
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${color}1A` }}
              >
                <span
                  className="text-sm font-black font-[family-name:var(--font-space-grotesk)]"
                  style={{ color }}
                >
                  {modulo.localNum}.{idx + 1}
                </span>
              </div>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color }}>
                  Sesión {idx + 1} de {modulo.sesiones.length}
                </p>
                <h3 className="text-sm font-bold text-[#0A1628] leading-snug">
                  {s.titulo}
                </h3>
                <p className="mt-1 text-[10px] text-[#1F2F58]/40">
                  Video · Presentación · Teoría · Quiz · Ejercicio · AI Lab · Recursos · Grabaciones
                </p>
              </div>

              {/* Acción */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2F58]/30 group-hover:text-[#73B8E7] transition-colors shrink-0">
                <Play className="size-3.5" />
                <span className="hidden sm:inline">Abrir sesión</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Navegación módulos del mes ─────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-[#0A1628] mb-3">
          Otros módulos — Mes {modulo.mes}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((localN) => {
            const globalN = (modulo.mes - 1) * 4 + localN;
            const isActive = globalN === modulo.globalNum;
            const IconN = ICON_MAP[globalN] ?? Brain;
            const colorN = COLOR_MAP[globalN] ?? "#73B8E7";

            let modulosMeta: ModuloMeta[];
            if (modulo.mes === 1)      modulosMeta = BOOTCAMP_MES1_MODULOS;
            else if (modulo.mes === 2) modulosMeta = BOOTCAMP_MES2_MODULOS;
            else                       modulosMeta = BOOTCAMP_MES3_MODULOS;

            const meta = modulosMeta.find((m) => m.num === localN);
            if (!meta) return null;

            return (
              <Link
                key={globalN}
                href={`/bootcamp/modulos/m${globalN}`}
                className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-all ${
                  isActive
                    ? "border-[#FBBC0C]/40 bg-[#FBBC0C]/[0.06] cursor-default"
                    : "border-[#1F2F58]/[0.08] bg-white hover:border-[#73B8E7]/40 hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${colorN}1A`, color: colorN }}
                >
                  <IconN className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-[#1F2F58]/40 uppercase">
                    M{globalN}
                  </p>
                  <p
                    className={`text-xs font-bold leading-snug truncate ${
                      isActive ? "text-[#FBBC0C]" : "text-[#0A1628]"
                    }`}
                  >
                    {meta.nombre}
                  </p>
                </div>
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-[#FBBC0C] flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── CTA WhatsApp ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6">
        <div>
          <p className="text-sm font-bold text-white">
            ¿Dudas con este módulo?
          </p>
          <p className="text-xs text-white/60 mt-0.5">
            Un instructor te apoya en minutos por WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/593959892034?text=Hola%2C%20tengo%20dudas%20con%20el%20M%C3%B3dulo%20${modulo.globalNum}%20del%20Bootcamp%20ITSEIA`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FBBC0C] px-5 py-2.5 text-sm font-bold text-[#0A1628] transition-colors hover:bg-[#f5b300] shrink-0"
        >
          Contactar instructor
        </a>
      </div>
    </div>
  );
}
