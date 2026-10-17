"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, Eye, Users } from "lucide-react";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "coordinacion", label: "Coordinacion" },
  { value: "docente", label: "Docente" },
  { value: "estudiante", label: "Estudiante" },
  { value: "finanzas", label: "Finanzas" },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  admin: "bg-[#1F2F58]/10 text-[#1F2F58]",
  coordinacion: "bg-[#73B8E7]/15 text-[#1F2F58]",
  docente: "bg-[#FBBC0C]/15 text-[#1F2F58]",
  estudiante: "bg-gray-100 text-gray-600",
  finanzas: "bg-emerald-100 text-emerald-700",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  coordinacion: "Coordinacion",
  docente: "Docente",
  estudiante: "Estudiante",
  finanzas: "Finanzas",
};

interface UserDetail {
  profile: Profile;
  enrollmentCount: number;
  paymentTotal: number;
  aiRequests: number;
}

export default function UsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    fetchUsers();
  }

  async function openDetail(user: Profile) {
    setDetailLoading(true);
    setDetailOpen(true);

    const [enrollments, payments, aiLogs] = await Promise.all([
      supabase
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("payments")
        .select("amount")
        .eq("user_id", user.id)
        .eq("status", "confirmed"),
      supabase
        .from("ai_usage_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    const paymentTotal =
      payments.data?.reduce((sum, p) => sum + (p.amount || 0), 0) ?? 0;

    setDetail({
      profile: user,
      enrollmentCount: enrollments.count || 0,
      paymentTotal,
      aiRequests: aiLogs.count || 0,
    });
    setDetailLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los usuarios de la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
          <Users className="size-4" />
          <span className="font-medium">{users.length}</span> usuarios
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="size-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#1F2F58]/10 text-[10px] font-bold text-[#1F2F58]">
                          {user.full_name
                            ? user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "?"}
                        </div>
                      )}
                      <span className="font-medium text-gray-900">
                        {user.full_name || "Sin nombre"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{user.email}</TableCell>
                  <TableCell>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as UserRole
                        )
                      }
                      className={`h-6 rounded-full border-0 px-2 text-[10px] font-semibold outline-none ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[#FBBC0C]">
                        {user.nivel_xp.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400">XP</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("es-EC", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openDetail(user)}
                      title="Ver detalles"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
          ) : detail ? (
            <div className="space-y-4 py-2">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                {detail.profile.avatar_url ? (
                  <img
                    src={detail.profile.avatar_url}
                    alt={detail.profile.full_name}
                    className="size-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#1F2F58] text-sm font-bold text-white">
                    {detail.profile.full_name
                      ? detail.profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "?"}
                  </div>
                )}
                <div>
                  <div className="text-base font-semibold text-gray-900">
                    {detail.profile.full_name || "Sin nombre"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {detail.profile.email}
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Rol</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_COLORS[detail.profile.role] || "bg-gray-100 text-gray-600"}`}
                    >
                      {ROLE_LABELS[detail.profile.role] ||
                        detail.profile.role}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">XP</div>
                  <div className="mt-0.5 text-sm font-semibold text-[#FBBC0C]">
                    {detail.profile.nivel_xp.toLocaleString()} XP
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Matriculas</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {detail.enrollmentCount}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Pagos Confirmados</div>
                  <div className="mt-0.5 text-sm font-semibold text-emerald-600">
                    ${detail.paymentTotal.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Solicitudes AI</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {detail.aiRequests}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Registrado</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {new Date(
                      detail.profile.created_at
                    ).toLocaleDateString("es-EC", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                <div className="text-[10px] text-gray-400">ID de usuario</div>
                <div className="mt-0.5 font-mono text-xs text-gray-500">
                  {detail.profile.id}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
