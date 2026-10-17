import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  ExternalLink,
  GraduationCap,
  Award,
  Zap,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import CertificationBadge from "@/components/certifications/CertificationBadge";
import { getPortfolioBadges } from "@/features/certifications/queries";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  url: string | null;
  technologies: string[] | null;
  created_at: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  const name = profile?.full_name || "Estudiante ITSEIA";

  return {
    title: `${name} - Portfolio | ITSEIA Academy`,
    description: `Portfolio profesional de ${name} en inteligencia artificial. ITSEIA Academy.`,
    openGraph: {
      title: `${name} - Portfolio IA`,
      description: `Proyectos de inteligencia artificial de ${name}`,
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch public portfolio items
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  // Fetch badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", userId);

  // Fetch completed courses count
  const { count: completedLessons } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  // Fetch certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, programs(name)")
    .eq("user_id", userId);

  // Fetch certification badges (industry certifications)
  const certBadges = await getPortfolioBadges(userId);

  const portfolioItems = (items || []) as PortfolioItem[];
  const level = getLevel(profile.nivel_xp || 0);
  const memberSince = new Date(profile.created_at).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
  });

  const PROJECT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
    ai_lab: { label: "AI Lab", color: "bg-[#73B8E7]/15 text-[#73B8E7]" },
    peer_review: { label: "Peer Review", color: "bg-[#FBBC0C]/15 text-[#FBBC0C]" },
    final_project: { label: "Proyecto Final", color: "bg-[#F0846D]/15 text-[#F0846D]" },
    custom: { label: "Personal", color: "bg-[#1F2F58]/10 text-[#1F2F58]" },
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0A1628]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FBBC0C] flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#0A1628]" />
            </div>
            <span className="text-white font-bold text-lg">ITSEIA</span>
          </Link>
          <Badge className="bg-[#1F2F58] border-none text-white/60 text-xs">
            Portfolio Publico
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FBBC0C]/20 to-[#73B8E7]/20 border border-white/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#FBBC0C]">
              {(profile.full_name || "?")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {profile.full_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge className="bg-[#FBBC0C]/10 text-[#FBBC0C] border-none gap-1">
                <Zap className="w-3 h-3" />
                {level.name} — {profile.nivel_xp || 0} XP
              </Badge>
              <span className="text-white/30 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Miembro desde {memberSince}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{completedLessons || 0}</p>
              <p className="text-white/30 text-xs">Lecciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{portfolioItems.length}</p>
              <p className="text-white/30 text-xs">Proyectos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{(userBadges || []).length}</p>
              <p className="text-white/30 text-xs">Insignias</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        {userBadges && userBadges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FBBC0C]" />
              Insignias
            </h2>
            <div className="flex flex-wrap gap-3">
              {userBadges.map((ub: any) => (
                <div
                  key={ub.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                  title={ub.badges?.description || ""}
                >
                  <span className="text-lg">{ub.badges?.icon || "🏆"}</span>
                  <span className="text-sm text-white/80">{ub.badges?.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Industry Certification Badges */}
        {certBadges && certBadges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FBBC0C]" />
              Certificaciones de Industria
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certBadges.map((badge) => (
                <CertificationBadge
                  key={badge.id}
                  badge={badge}
                  compact
                  showUpload={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates && certificates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#73B8E7]" />
              Certificaciones
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {certificates.map((cert: any) => (
                <Card key={cert.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{cert.programs?.name}</p>
                      <p className="text-white/30 text-xs mt-1">
                        {new Date(cert.issued_at).toLocaleDateString("es-EC")}
                      </p>
                    </div>
                    <Link href={`/verify/${cert.code}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-white/60 hover:bg-white/5 gap-1"
                      >
                        Verificar
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio items */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Proyectos</h2>
          {portfolioItems.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <p className="text-white/30">
                  Este estudiante aun no tiene proyectos publicos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {portfolioItems.map((item) => {
                const typeConfig = PROJECT_TYPE_LABELS[item.project_type] || PROJECT_TYPE_LABELS.custom;
                return (
                  <Card key={item.id} className="bg-white/5 border-white/10 hover:bg-white/8 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`border-none text-xs ${typeConfig.color}`}>
                          {typeConfig.label}
                        </Badge>
                        <span className="text-white/20 text-xs">
                          {new Date(item.created_at).toLocaleDateString("es-EC")}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-white/40 text-sm line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      )}
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-[#1F2F58]/60 text-white/50 text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#73B8E7] text-sm hover:text-[#73B8E7]/80 transition-colors"
                        >
                          Ver proyecto
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-white/20 text-sm">
            Portfolio verificado por ITSEIA Academy —{" "}
            <Link href="/" className="text-[#73B8E7] hover:underline">
              tecnologico.itseia.ai
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function getLevel(xp: number) {
  const levels = [
    { name: "Aspirante", min: 0, max: 499 },
    { name: "Practicante", min: 500, max: 1999 },
    { name: "Especialista", min: 2000, max: 4999 },
    { name: "Maestro IA", min: 5000, max: Infinity },
  ];
  return levels.find((l) => xp >= l.min && xp <= l.max) || levels[0];
}
