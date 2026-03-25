"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MyDataSection from "@/components/privacy/MyDataSection";
import type { Profile } from "@/types/database";

const LEVEL_THRESHOLDS = [
  { name: "Aspirante", min: 0, max: 499 },
  { name: "Practicante", min: 500, max: 1999 },
  { name: "Especialista", min: 2000, max: 4999 },
  { name: "Maestro IA", min: 5000, max: Infinity },
];

function getLevel(xp: number) {
  return LEVEL_THRESHOLDS.find((l) => xp >= l.min && xp <= l.max) || LEVEL_THRESHOLDS[0];
}

function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min;
  const progress = xp - level.min;
  return Math.round((progress / range) * 100);
}

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [aiUsage, setAiUsage] = useState({ count: 0, tokens: 0 });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
      }

      // AI usage this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usage } = await supabase
        .from("ai_usage_logs")
        .select("tokens_in, tokens_out")
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

      if (usage) {
        setAiUsage({
          count: usage.length,
          tokens: usage.reduce((sum, u) => sum + u.tokens_in + u.tokens_out, 0),
        });
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (error) {
      setMessage("Error al guardar");
    } else {
      setMessage("Perfil actualizado");
      setProfile({ ...profile, full_name: fullName });
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-white/50">
        No se pudo cargar el perfil. Intenta recargar la pagina.
      </div>
    );
  }

  const level = getLevel(profile.nivel_xp);
  const levelProgress = getLevelProgress(profile.nivel_xp);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Info Card */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Informacion Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Nombre Completo</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Email</Label>
              <Input
                value={profile.email}
                disabled
                className="bg-white/5 border-white/10 text-white/70 mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Rol</Label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className="border-[#FBBC0C]/30 text-[#FBBC0C]"
                >
                  {profile.role}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-white/80">Miembro desde</Label>
              <p className="text-white/90 mt-1">
                {new Date(profile.created_at).toLocaleDateString("es-EC", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
            {message && (
              <p className={`text-sm text-center ${message.includes("Error") ? "text-[#F0846D]" : "text-green-400"}`}>
                {message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Nivel y Progreso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#FBBC0C]/10 border-2 border-[#FBBC0C]/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-extrabold text-[#FBBC0C]">
                  {profile.nivel_xp}
                </span>
              </div>
              <p className="text-white/40 text-sm">XP Total</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">{level.name}</span>
                {level.max !== Infinity && (
                  <span className="text-white/40 text-sm">
                    {profile.nivel_xp} / {level.max} XP
                  </span>
                )}
              </div>
              <Progress value={levelProgress} className="h-3 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#73B8E7]">{aiUsage.count}</p>
                <p className="text-white/40 text-xs">Consultas IA este mes</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#73B8E7]">
                  {(aiUsage.tokens / 1000).toFixed(1)}K
                </p>
                <p className="text-white/40 text-xs">Tokens usados</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white/50 text-sm font-medium">Niveles</p>
              {LEVEL_THRESHOLDS.map((l) => (
                <div
                  key={l.name}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg ${
                    level.name === l.name
                      ? "bg-[#FBBC0C]/10 border border-[#FBBC0C]/20"
                      : "bg-white/5"
                  }`}
                >
                  <span className={level.name === l.name ? "text-[#FBBC0C] font-semibold" : "text-white/40"}>
                    {l.name}
                  </span>
                  <span className="text-white/30 text-sm">
                    {l.min}+ XP
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Mis Datos / Privacidad (LOPDP) */}
      <div className="mt-8 border-t border-white/10 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Mis Datos y Privacidad</h2>
            <p className="text-white/40 text-sm mt-0.5">
              Gestiona tus datos personales conforme a la LOPDP Ecuador
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-[#73B8E7]/30 text-[#73B8E7] text-xs"
          >
            LOPDP v1.0
          </Badge>
        </div>
        <MyDataSection profile={profile} />
      </div>
    </div>
  );
}
