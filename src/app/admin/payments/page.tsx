"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Payment, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Plus,
  Loader2,
  Filter,
  CheckCircle2,
  XCircle,
  CreditCard,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const METHOD_OPTIONS = [
  { value: "transfer", label: "Transferencia" },
  { value: "stripe", label: "Stripe" },
  { value: "cash", label: "Efectivo" },
] as const;

const STATUS_FILTERS = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmados" },
  { value: "rejected", label: "Rechazados" },
] as const;

const METHOD_FILTERS = [
  { value: "", label: "Todos los metodos" },
  { value: "transfer", label: "Transferencia" },
  { value: "stripe", label: "Stripe" },
  { value: "cash", label: "Efectivo" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  rejected: "Rechazado",
};

const METHOD_LABELS: Record<string, string> = {
  transfer: "Transferencia",
  stripe: "Stripe",
  cash: "Efectivo",
  paypal: "PayPal",
};

interface PaymentRow {
  id: string;
  user_id: string;
  enrollment_id: string | null;
  amount: number;
  method: Payment["method"];
  status: Payment["status"];
  reference: string | null;
  confirmed_by: string | null;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
}

interface EnrollmentOption {
  id: string;
  program_id: string;
  programs: { name: string } | null;
}

interface MorosoRow {
  enrollment_id: string;
  user_name: string;
  user_email: string;
  program_name: string;
  last_payment_date: string | null;
  days_since_payment: number;
}

interface FormData {
  user_id: string;
  enrollment_id: string;
  amount: string;
  method: Payment["method"];
  reference: string;
}

const EMPTY_FORM: FormData = {
  user_id: "",
  enrollment_id: "",
  amount: "",
  method: "transfer",
  reference: "",
};

export default function PaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<EnrollmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [morosos, setMorosos] = useState<MorosoRow[]>([]);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paymentsThisMonth: 0,
  });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("payments")
      .select(
        "id, user_id, enrollment_id, amount, method, status, reference, confirmed_by, created_at, profiles!payments_user_id_fkey ( full_name, email )"
      )
      .order("created_at", { ascending: false });

    if (filterStatus) {
      query = query.eq("status", filterStatus);
    }
    if (filterMethod) {
      query = query.eq("method", filterMethod);
    }
    if (filterDateFrom) {
      query = query.gte("created_at", filterDateFrom);
    }
    if (filterDateTo) {
      query = query.lte("created_at", filterDateTo + "T23:59:59");
    }

    const { data } = await query;
    const paymentsData = (data as unknown as PaymentRow[]) || [];
    setPayments(paymentsData);
    setLoading(false);
  }, [filterStatus, filterMethod, filterDateFrom, filterDateTo]);

  const fetchSummaryStats = useCallback(async () => {
    // Total revenue (all confirmed payments)
    const { data: confirmed } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "confirmed");

    const totalRevenue = confirmed?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    // Pending amount
    const { data: pending } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "pending");

    const pendingAmount = pending?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    // Payments this month
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data: thisMonth } = await supabase
      .from("payments")
      .select("id")
      .gte("created_at", firstOfMonth);

    setSummaryStats({
      totalRevenue,
      pendingAmount,
      paymentsThisMonth: thisMonth?.length || 0,
    });
  }, []);

  const fetchMorosos = useCallback(async () => {
    // Find active enrollments with no payment in 30+ days
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        id,
        user_id,
        program_id,
        enrolled_at,
        profiles!enrollments_user_id_fkey ( full_name, email ),
        programs!enrollments_program_id_fkey ( name )
      `)
      .eq("status", "active");

    if (!enrollments || enrollments.length === 0) {
      setMorosos([]);
      return;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoff = thirtyDaysAgo.toISOString();

    const morosoList: MorosoRow[] = [];

    for (const enrollment of enrollments) {
      const { data: recentPayments } = await supabase
        .from("payments")
        .select("created_at")
        .eq("enrollment_id", enrollment.id)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })
        .limit(1);

      const lastPayment = recentPayments?.[0]?.created_at || null;
      const isOverdue = !lastPayment || new Date(lastPayment) < thirtyDaysAgo;

      if (isOverdue) {
        const daysSince = lastPayment
          ? Math.floor((Date.now() - new Date(lastPayment).getTime()) / (1000 * 60 * 60 * 24))
          : Math.floor((Date.now() - new Date(enrollment.enrolled_at).getTime()) / (1000 * 60 * 60 * 24));

        const profile = enrollment.profiles as unknown as { full_name: string; email: string } | null;
        const program = enrollment.programs as unknown as { name: string } | null;

        morosoList.push({
          enrollment_id: enrollment.id,
          user_name: profile?.full_name || "Sin nombre",
          user_email: profile?.email || "—",
          program_name: program?.name || "Carrera",
          last_payment_date: lastPayment,
          days_since_payment: daysSince,
        });
      }
    }

    setMorosos(morosoList.sort((a, b) => b.days_since_payment - a.days_since_payment));
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name");
    setUsers(data || []);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchSummaryStats();
    fetchMorosos();
  }, [fetchUsers, fetchSummaryStats, fetchMorosos]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // When user changes in form, fetch their enrollments
  useEffect(() => {
    async function fetchUserEnrollments() {
      if (!form.user_id) {
        setUserEnrollments([]);
        return;
      }
      const { data } = await supabase
        .from("enrollments")
        .select("id, program_id, programs!enrollments_program_id_fkey ( name )")
        .eq("user_id", form.user_id)
        .eq("status", "active");
      setUserEnrollments((data as unknown as EnrollmentOption[]) || []);
    }
    fetchUserEnrollments();
  }, [form.user_id]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.user_id) newErrors.user_id = "Selecciona un alumno";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = "Ingresa un monto valido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;

    setSaving(true);

    await supabase.from("payments").insert({
      user_id: form.user_id,
      enrollment_id: form.enrollment_id || null,
      amount: Number(form.amount),
      method: form.method,
      reference: form.reference.trim() || null,
      status: "pending",
    });

    setSaving(false);
    setDialogOpen(false);
    fetchPayments();
    fetchSummaryStats();
  }

  async function handleConfirm(paymentId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("payments")
      .update({ status: "confirmed", confirmed_by: user?.id || null })
      .eq("id", paymentId);
    fetchPayments();
    fetchSummaryStats();
    fetchMorosos();
  }

  async function handleReject(paymentId: string) {
    if (!window.confirm("¿Estas seguro de rechazar este pago?")) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("payments")
      .update({ status: "rejected", confirmed_by: user?.id || null })
      .eq("id", paymentId);
    fetchPayments();
    fetchSummaryStats();
  }

  function clearFilters() {
    setFilterStatus("");
    setFilterMethod("");
    setFilterDateFrom("");
    setFilterDateTo("");
  }

  const hasFilters = filterStatus || filterMethod || filterDateFrom || filterDateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Registra y gestiona los pagos de alumnos
          </p>
        </div>
        <Button onClick={openCreate} size="lg">
          <CreditCard className="size-4" data-icon="inline-start" />
          Registrar Pago
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <DollarSign className="size-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Ingresos Confirmados</p>
              <p className="truncate text-lg font-bold text-gray-900">
                ${summaryStats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="size-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Monto Pendiente</p>
              <p className="truncate text-lg font-bold text-gray-900">
                ${summaryStats.pendingAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#73B8E7]/10">
              <TrendingUp className="size-5 text-[#73B8E7]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Pagos Este Mes</p>
              <p className="truncate text-lg font-bold text-gray-900">
                {summaryStats.paymentsThisMonth}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Morosos Alert */}
      {morosos.length > 0 && (
        <Card className="border-[#F0846D]/30 bg-[#F0846D]/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="size-4 text-[#F0846D]" />
              <h3 className="text-sm font-semibold text-[#F0846D]">
                Alerta de Morosidad ({morosos.length} {morosos.length === 1 ? "matricula" : "matriculas"})
              </h3>
            </div>
            <div className="space-y-2">
              {morosos.slice(0, 5).map((m) => (
                <div
                  key={m.enrollment_id}
                  className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-900">{m.user_name}</span>
                    <span className="text-gray-400 ml-2 text-xs">{m.user_email}</span>
                    <span className="text-gray-400 mx-1">—</span>
                    <span className="text-gray-600">{m.program_name}</span>
                  </div>
                  <span className="text-[#F0846D] font-semibold text-xs">
                    {m.days_since_payment} dias sin pago
                  </span>
                </div>
              ))}
              {morosos.length > 5 && (
                <p className="text-xs text-gray-400 mt-1">
                  y {morosos.length - 5} mas...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="size-4 text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {METHOD_FILTERS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-400">Desde:</label>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-400">Hasta:</label>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Alumno</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Metodo</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-gray-400"
                >
                  No hay pagos registrados
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.profiles?.full_name || "—"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {payment.profiles?.email || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    ${Number(payment.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {METHOD_LABELS[payment.method] || payment.method}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate text-xs text-gray-400">
                    {payment.reference || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[payment.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_LABELS[payment.status] || payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(payment.created_at).toLocaleDateString("es-EC", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === "pending" ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleConfirm(payment.id)}
                          title="Confirmar pago"
                          className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <CheckCircle2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleReject(payment.id)}
                          title="Rechazar pago"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <XCircle className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Register Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* User */}
            <div className="grid gap-1.5">
              <Label>Alumno *</Label>
              <select
                value={form.user_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    user_id: e.target.value,
                    enrollment_id: "",
                  }))
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar alumno...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email} ({u.email})
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <p className="text-xs text-red-500">{errors.user_id}</p>
              )}
            </div>

            {/* Enrollment (optional) */}
            <div className="grid gap-1.5">
              <Label>Matricula (opcional)</Label>
              <select
                value={form.enrollment_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    enrollment_id: e.target.value,
                  }))
                }
                disabled={!form.user_id || userEnrollments.length === 0}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              >
                <option value="">Sin matricula asociada</option>
                {userEnrollments.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.programs?.name || "Carrera"} (ID: {e.id.slice(0, 8)})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount + Method */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Monto (USD) *</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-xs text-red-500">{errors.amount}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label>Metodo *</Label>
                <select
                  value={form.method}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      method: e.target.value as Payment["method"],
                    }))
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {METHOD_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reference */}
            <div className="grid gap-1.5">
              <Label>Referencia / Comprobante</Label>
              <Input
                value={form.reference}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reference: e.target.value }))
                }
                placeholder="Ej: Transferencia #12345"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              Registrar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
