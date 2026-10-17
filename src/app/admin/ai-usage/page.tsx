"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, DollarSign, Zap, Users, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface AILogRow {
  id: string;
  user_id: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  created_at: string;
}

interface UserAIStats {
  user_id: string;
  full_name: string;
  email: string;
  request_count: number;
  total_tokens_in: number;
  total_tokens_out: number;
  total_cost: number;
  models: Record<string, { count: number; cost: number; tokens_in: number; tokens_out: number }>;
}

const MONTHLY_QUOTA = 500;
const QUOTA_ALERT_THRESHOLD = 0.8; // 80%

const MODEL_COLORS: Record<string, string> = {
  "gemini-2.0-flash": "bg-[#FBBC0C]/15 text-[#FBBC0C]",
  "gemini-2.5-flash": "bg-[#73B8E7]/15 text-[#73B8E7]",
  "chatgpt-4o": "bg-[#10A37F]/15 text-[#10A37F]",
  "claude-sonnet": "bg-[#CC785C]/15 text-[#CC785C]",
  "llama-3.1": "bg-[#0668E1]/15 text-[#0668E1]",
  "mistral-large": "bg-[#F97316]/15 text-[#F97316]",
};

export default function AIUsagePage() {
  const supabase = createClient();
  const [monthLogs, setMonthLogs] = useState<AILogRow[]>([]);
  const [lastMonthLogs, setLastMonthLogs] = useState<AILogRow[]>([]);
  const [userStats, setUserStats] = useState<UserAIStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

    const [thisMonthRes, lastMonthRes] = await Promise.all([
      supabase
        .from("ai_usage_logs")
        .select("*")
        .gte("created_at", firstOfMonth),
      supabase
        .from("ai_usage_logs")
        .select("*")
        .gte("created_at", firstOfLastMonth)
        .lt("created_at", firstOfMonth),
    ]);

    const thisMonthData = (thisMonthRes.data || []) as AILogRow[];
    const lastMonthData = (lastMonthRes.data || []) as AILogRow[];

    setMonthLogs(thisMonthData);
    setLastMonthLogs(lastMonthData);

    // Aggregate per user with model breakdown
    const userMap = new Map<string, {
      tokens_in: number;
      tokens_out: number;
      cost: number;
      count: number;
      models: Record<string, { count: number; cost: number; tokens_in: number; tokens_out: number }>;
    }>();

    for (const log of thisMonthData) {
      const existing = userMap.get(log.user_id) || {
        tokens_in: 0,
        tokens_out: 0,
        cost: 0,
        count: 0,
        models: {},
      };
      existing.tokens_in += log.tokens_in || 0;
      existing.tokens_out += log.tokens_out || 0;
      existing.cost += log.cost_usd || 0;
      existing.count += 1;

      const modelKey = log.model || "unknown";
      if (!existing.models[modelKey]) {
        existing.models[modelKey] = { count: 0, cost: 0, tokens_in: 0, tokens_out: 0 };
      }
      existing.models[modelKey].count += 1;
      existing.models[modelKey].cost += log.cost_usd || 0;
      existing.models[modelKey].tokens_in += log.tokens_in || 0;
      existing.models[modelKey].tokens_out += log.tokens_out || 0;

      userMap.set(log.user_id, existing);
    }

    // Fetch user profiles
    const userIds = Array.from(userMap.keys());
    let stats: UserAIStats[] = [];

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      stats = userIds
        .map((uid) => {
          const profile = profiles?.find((p) => p.id === uid);
          const s = userMap.get(uid)!;
          return {
            user_id: uid,
            full_name: profile?.full_name || "Sin nombre",
            email: profile?.email || "—",
            request_count: s.count,
            total_tokens_in: s.tokens_in,
            total_tokens_out: s.tokens_out,
            total_cost: s.cost,
            models: s.models,
          };
        })
        .sort((a, b) => b.total_cost - a.total_cost);
    }

    setUserStats(stats);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalRequests = monthLogs.length;
  const totalCost = monthLogs.reduce((sum, l) => sum + (l.cost_usd || 0), 0);
  const totalTokensIn = monthLogs.reduce((sum, l) => sum + (l.tokens_in || 0), 0);
  const totalTokensOut = monthLogs.reduce((sum, l) => sum + (l.tokens_out || 0), 0);
  const uniqueUsers = new Set(monthLogs.map((l) => l.user_id));
  const avgCostPerStudent = uniqueUsers.size > 0 ? totalCost / uniqueUsers.size : 0;

  // Last month comparison
  const lastMonthRequests = lastMonthLogs.length;
  const lastMonthCost = lastMonthLogs.reduce((sum, l) => sum + (l.cost_usd || 0), 0);
  const requestsTrend = lastMonthRequests > 0
    ? ((totalRequests - lastMonthRequests) / lastMonthRequests * 100).toFixed(0)
    : totalRequests > 0 ? "+100" : "0";
  const costTrend = lastMonthCost > 0
    ? ((totalCost - lastMonthCost) / lastMonthCost * 100).toFixed(0)
    : totalCost > 0 ? "+100" : "0";

  // Cost per model breakdown (global)
  const modelBreakdown: Record<string, { count: number; cost: number }> = {};
  for (const log of monthLogs) {
    const key = log.model || "unknown";
    if (!modelBreakdown[key]) modelBreakdown[key] = { count: 0, cost: 0 };
    modelBreakdown[key].count += 1;
    modelBreakdown[key].cost += log.cost_usd || 0;
  }

  // Students above 80% quota
  const highUsageStudents = userStats.filter(
    (u) => u.request_count >= MONTHLY_QUOTA * QUOTA_ALERT_THRESHOLD
  );

  const now = new Date();
  const monthName = now.toLocaleDateString("es-EC", { month: "long", year: "numeric" });

  const stats = [
    {
      label: "Solicitudes del Mes",
      value: totalRequests.toLocaleString(),
      icon: Zap,
      color: "text-[#FBBC0C]",
      bg: "bg-[#FBBC0C]/10",
      trend: `${Number(requestsTrend) >= 0 ? "+" : ""}${requestsTrend}% vs mes anterior`,
    },
    {
      label: "Costo Total del Mes",
      value: `$${totalCost.toFixed(4)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: `${Number(costTrend) >= 0 ? "+" : ""}${costTrend}% vs mes anterior`,
    },
    {
      label: "Promedio por Estudiante",
      value: `$${avgCostPerStudent.toFixed(4)}`,
      icon: Users,
      color: "text-[#73B8E7]",
      bg: "bg-[#73B8E7]/10",
      trend: `${uniqueUsers.size} estudiantes activos`,
    },
    {
      label: "Tokens Totales",
      value: `${((totalTokensIn + totalTokensOut) / 1000).toFixed(1)}K`,
      icon: BrainCircuit,
      color: "text-[#F0846D]",
      bg: "bg-[#F0846D]/10",
      trend: `${(totalTokensIn / 1000).toFixed(1)}K in / ${(totalTokensOut / 1000).toFixed(1)}K out`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Uso del AI Lab</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitoreo de consumo de inteligencia artificial — {monthName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="truncate text-lg font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* High Usage Alert */}
      {highUsageStudents.length > 0 && (
        <Card className="border-[#F0846D]/30 bg-[#F0846D]/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="size-4 text-[#F0846D]" />
              <h3 className="text-sm font-semibold text-[#F0846D]">
                Alerta de Cuota ({highUsageStudents.length} {highUsageStudents.length === 1 ? "estudiante" : "estudiantes"} por encima del 80%)
              </h3>
            </div>
            <div className="space-y-2">
              {highUsageStudents.map((u) => {
                const percent = Math.round((u.request_count / MONTHLY_QUOTA) * 100);
                return (
                  <div key={u.user_id} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{u.full_name}</span>
                      <span className="text-gray-400 ml-2 text-xs">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percent >= 100 ? "bg-red-500" : "bg-[#F0846D]"}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-xs ${percent >= 100 ? "text-red-600" : "text-[#F0846D]"}`}>
                        {u.request_count}/{MONTHLY_QUOTA} ({percent}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost per Model Breakdown */}
      {Object.keys(modelBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-700">
              Costo por Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(modelBreakdown)
                .sort((a, b) => b[1].cost - a[1].cost)
                .map(([model, data]) => (
                  <div
                    key={model}
                    className="rounded-lg border border-gray-100 p-3"
                  >
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold mb-2 ${MODEL_COLORS[model] || "bg-gray-100 text-gray-600"}`}
                    >
                      {model}
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-bold text-gray-900">${data.cost.toFixed(4)}</span>
                      <span className="text-xs text-gray-400">{data.count} solicitudes</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User table with expandable detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-700">
            Consumo por Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-gray-500">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Estudiante</th>
                  <th className="pb-2 pr-4 text-right">Solicitudes</th>
                  <th className="pb-2 pr-4 text-right">Cuota</th>
                  <th className="pb-2 pr-4 text-right">Tokens In</th>
                  <th className="pb-2 pr-4 text-right">Tokens Out</th>
                  <th className="pb-2 text-right">Costo</th>
                  <th className="pb-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userStats.length > 0 ? (
                  userStats.map((user, index) => {
                    const isExpanded = expandedUser === user.user_id;
                    const quotaPercent = Math.round((user.request_count / MONTHLY_QUOTA) * 100);
                    const isOverQuota = quotaPercent >= 80;

                    return (
                      <>
                        <tr
                          key={user.user_id}
                          className={`text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? "bg-gray-50" : ""}`}
                          onClick={() => setExpandedUser(isExpanded ? null : user.user_id)}
                        >
                          <td className="py-2.5 pr-4">
                            <span
                              className={`inline-flex size-5 items-center justify-center rounded text-[10px] font-bold ${
                                index < 3
                                  ? "bg-[#FBBC0C]/15 text-[#1F2F58]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.full_name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4 text-right font-medium">
                            {user.request_count.toLocaleString()}
                          </td>
                          <td className="py-2.5 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isOverQuota ? "bg-[#F0846D]" : "bg-[#73B8E7]"}`}
                                  style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                                />
                              </div>
                              <span className={`text-[10px] font-medium ${isOverQuota ? "text-[#F0846D]" : "text-gray-400"}`}>
                                {quotaPercent}%
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4 text-right text-gray-500">
                            {user.total_tokens_in.toLocaleString()}
                          </td>
                          <td className="py-2.5 pr-4 text-right text-gray-500">
                            {user.total_tokens_out.toLocaleString()}
                          </td>
                          <td className="py-2.5 text-right font-semibold text-emerald-600">
                            ${user.total_cost.toFixed(4)}
                          </td>
                          <td className="py-2.5 pl-2">
                            {isExpanded ? (
                              <ChevronUp className="size-3.5 text-gray-400" />
                            ) : (
                              <ChevronDown className="size-3.5 text-gray-400" />
                            )}
                          </td>
                        </tr>
                        {/* Expanded detail */}
                        {isExpanded && (
                          <tr key={`${user.user_id}-detail`}>
                            <td colSpan={8} className="py-3 px-4 bg-gray-50/50">
                              <div className="pl-8">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Desglose por Modelo</p>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                  {Object.entries(user.models)
                                    .sort((a, b) => b[1].cost - a[1].cost)
                                    .map(([model, data]) => (
                                      <div key={model} className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                                        <span
                                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${MODEL_COLORS[model] || "bg-gray-100 text-gray-600"}`}
                                        >
                                          {model}
                                        </span>
                                        <div className="flex items-center justify-between mt-1.5 text-xs">
                                          <span className="text-gray-500">{data.count} solicitudes</span>
                                          <span className="font-semibold text-emerald-600">${data.cost.toFixed(4)}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5 text-[10px] text-gray-400">
                                          <span>{data.tokens_in.toLocaleString()} in</span>
                                          <span>{data.tokens_out.toLocaleString()} out</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-400">
                      Sin uso de AI Lab este mes
                    </td>
                  </tr>
                )}
              </tbody>
              {userStats.length > 0 && (
                <tfoot>
                  <tr className="border-t bg-gray-50 font-semibold text-gray-700">
                    <td colSpan={2} className="py-2.5 pr-4">
                      Total ({uniqueUsers.size} usuarios)
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      {totalRequests.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-right" />
                    <td className="py-2.5 pr-4 text-right">
                      {totalTokensIn.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      {totalTokensOut.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right text-emerald-600">
                      ${totalCost.toFixed(4)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-700">
            Tendencia Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-xs text-gray-500 mb-1">Mes Anterior</p>
              <p className="text-lg font-bold text-gray-900">{lastMonthRequests} solicitudes</p>
              <p className="text-xs text-gray-400">${lastMonthCost.toFixed(4)} costo</p>
            </div>
            <div className="rounded-lg border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 p-4">
              <p className="text-xs text-gray-500 mb-1">Este Mes</p>
              <p className="text-lg font-bold text-gray-900">{totalRequests} solicitudes</p>
              <p className="text-xs text-gray-400">${totalCost.toFixed(4)} costo</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-xs text-gray-500 mb-1">Variacion</p>
              <p className={`text-lg font-bold ${Number(requestsTrend) > 0 ? "text-[#F0846D]" : Number(requestsTrend) < 0 ? "text-emerald-600" : "text-gray-400"}`}>
                {Number(requestsTrend) >= 0 ? "+" : ""}{requestsTrend}% solicitudes
              </p>
              <p className={`text-xs ${Number(costTrend) > 0 ? "text-[#F0846D]" : Number(costTrend) < 0 ? "text-emerald-600" : "text-gray-400"}`}>
                {Number(costTrend) >= 0 ? "+" : ""}{costTrend}% costo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Users */}
      {userStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-700">
              Top 5 Usuarios por Costo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userStats.slice(0, 5).map((user, index) => {
                const maxCost = userStats[0]?.total_cost || 1;
                const percentage = (user.total_cost / maxCost) * 100;

                return (
                  <div key={user.user_id} className="flex items-center gap-3">
                    <span
                      className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? "bg-[#FBBC0C] text-[#1F2F58]"
                          : index === 1
                            ? "bg-gray-300 text-gray-700"
                            : index === 2
                              ? "bg-[#F0846D]/30 text-[#F0846D]"
                              : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium text-gray-900">
                          {user.full_name}
                        </span>
                        <span className="ml-2 shrink-0 text-sm font-semibold text-emerald-600">
                          ${user.total_cost.toFixed(4)}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-[#73B8E7]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="mt-0.5 text-[10px] text-gray-400">
                        {user.request_count} solicitudes &middot;{" "}
                        {((user.total_tokens_in + user.total_tokens_out) / 1000).toFixed(1)}K tokens
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
