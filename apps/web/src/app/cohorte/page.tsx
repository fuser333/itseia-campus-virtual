"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Profile } from "@/types/database";
import {
  Users,
  MessageSquare,
  Trophy,
  Calendar,
  Bell,
  Zap,
  Star,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const LEVEL_THRESHOLDS = [
  { name: "Aspirante", min: 0, max: 499 },
  { name: "Practicante", min: 500, max: 1999 },
  { name: "Especialista", min: 2000, max: 4999 },
  { name: "Maestro IA", min: 5000, max: Infinity },
];

function getLevel(xp: number) {
  return (
    LEVEL_THRESHOLDS.find((l) => xp >= l.min && xp <= l.max) ||
    LEVEL_THRESHOLDS[0]
  );
}

function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min;
  const progress = xp - level.min;
  return Math.round((progress / range) * 100);
}

interface CohortFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "pronto" | "planificado";
}

const COHORT_FEATURES: CohortFeature[] = [
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Ranking de Cohorte",
    description:
      "Compite con tus companeros de generacion. Gana XP, sube de nivel y aparece en el Top 10 de tu cohorte.",
    status: "pronto",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Foro de Discusion",
    description:
      "Espacio exclusivo para tu cohorte. Resuelve dudas, comparte recursos y colabora en proyectos.",
    status: "pronto",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Calendario de Entregas",
    description:
      "Deadlines compartidos, recordatorios automaticos y sincronizacion con tu calendario personal.",
    status: "planificado",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Peer Review",
    description:
      "Revisa y recibe retroalimentacion de tus companeros. Mejora tu trabajo con perspectivas diversas.",
    status: "planificado",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Metas Grupales",
    description:
      "Objetivos semanales de la cohorte. Si todos cumplen, desbloquean recompensas especiales.",
    status: "planificado",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Insignias de Cohorte",
    description:
      "Insignias exclusivas por logros grupales: mejor asistencia, mas proyectos completados, etc.",
    status: "planificado",
  },
];

export default function CohortePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifyClicked, setNotifyClicked] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show content even if profile failed to load — xp defaults to 0
  const xp = profile?.nivel_xp || 0;
  const level = getLevel(xp);
  const levelProgress = getLevelProgress(xp);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-[#FBBC0C]" />
          Mi Cohorte
        </h1>
        <p className="mt-1 text-white/80 text-sm">
          Tu comunidad de aprendizaje en ITSEIA Academy
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="bg-gradient-to-br from-[#1F2F58]/80 to-[#0A1628] border-[#FBBC0C]/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBC0C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#73B8E7]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <CardContent className="relative py-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-[#FBBC0C]" />
          </div>
          <Badge className="bg-[#FBBC0C]/15 text-[#FBBC0C] border-none mb-4 text-xs uppercase tracking-wider">
            Proximamente
          </Badge>
          <h2 className="text-2xl font-bold text-white mb-3">
            Las Cohortes estan en camino
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6 text-sm leading-relaxed">
            Estamos construyendo la experiencia de cohorte definitiva. Pronto
            seras parte de un grupo exclusivo con foro, ranking, entregas
            compartidas y peer review.
          </p>
          <Button
            onClick={() => setNotifyClicked(true)}
            disabled={notifyClicked}
            className={`${
              notifyClicked
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90"
            } font-semibold transition-all`}
          >
            {notifyClicked ? (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Te notificaremos cuando este listo
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Notificarme cuando este listo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Student XP Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FBBC0C]" />
              Tu Progreso Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-[#FBBC0C]">
                  {xp}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">{level.name}</p>
                <p className="text-white/60 text-sm">XP Total</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Progreso de nivel</span>
                {level.max !== Infinity && (
                  <span className="text-white/60 text-xs">
                    {xp} / {level.max} XP
                  </span>
                )}
              </div>
              <Progress value={levelProgress} className="h-2.5 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {LEVEL_THRESHOLDS.map((l) => (
                <div
                  key={l.name}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    level.name === l.name
                      ? "bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 text-[#FBBC0C] font-semibold"
                      : "bg-white/5 text-white/60"
                  }`}
                >
                  {l.name}
                  <span className="block text-xs mt-0.5 opacity-60">
                    {l.min}+ XP
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#73B8E7]" />
              Cuando se lance, tu cohorte incluira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#73B8E7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trophy className="w-4 h-4 text-[#73B8E7]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    Tu posicion en el ranking
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Basado en XP, quizzes aprobados y proyectos completados
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FBBC0C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-[#FBBC0C]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    Progreso vs. tu cohorte
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Compara cuantas sesiones has completado vs. el promedio
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F0846D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-[#F0846D]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    Foro exclusivo de tu generacion
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Discusiones, dudas y colaboracion con tu cohorte
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    Deadlines y entregas sincronizadas
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Calendario compartido con recordatorios automaticos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Funcionalidades de Cohorte
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COHORT_FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1F2F58]/60 flex items-center justify-center text-[#73B8E7]">
                    {feature.icon}
                  </div>
                  <Badge
                    className={`border-none text-[10px] uppercase tracking-wider ${
                      feature.status === "pronto"
                        ? "bg-[#FBBC0C]/15 text-[#FBBC0C]"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {feature.status === "pronto" ? "Pronto" : "Planificado"}
                  </Badge>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-8 text-center">
          <p className="text-white/50 text-sm mb-4">
            Mientras tanto, sigue acumulando XP completando sesiones, quizzes y
            proyectos. Cuando las cohortes se activen, tu progreso contara.
          </p>
          <a href="/courses">
            <Button className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold">
              Continuar Aprendiendo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
