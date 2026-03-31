"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentRow {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  created_at: string;
  enrollments: {
    programs: {
      name: string;
    };
  } | null;
}

interface ProgramRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  type: string;
  is_active: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#FBBC0C]/20 text-[#FBBC0C]",
  confirmed: "bg-green-500/20 text-green-400",
  rejected: "bg-[#F0846D]/20 text-[#F0846D]",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  rejected: "Rechazado",
};

const METHOD_LABELS: Record<string, string> = {
  transfer: "Transferencia",
  stripe: "Tarjeta",
  cash: "Efectivo",
  paypal: "PayPal",
};

const TYPE_LABELS: Record<string, string> = {
  carrera: "Carrera",
  curso: "Curso",
  preuni: "Preuniversitario",
  bootcamp: "Bootcamp",
};

const TYPE_BADGE_STYLES: Record<string, string> = {
  carrera: "bg-white/20 text-white",
  curso: "bg-[#FBBC0C]/20 text-[#FBBC0C]",
  preuni: "bg-[#73B8E7]/20 text-[#73B8E7]",
  bootcamp: "bg-[#F0846D]/20 text-[#F0846D]",
};

export default function PaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ paid: 0, pending: 0 });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [paymentsRes, programsRes] = await Promise.all([
        supabase
          .from("payments")
          .select(`
            *,
            enrollments (
              programs (name)
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("programs")
          .select("id, name, slug, price, type, is_active")
          .eq("is_active", true)
          .neq("type", "teacher_training")
          .order("price", { ascending: true }),
      ]);

      if (paymentsRes.data) {
        setPayments(paymentsRes.data as unknown as PaymentRow[]);
        setTotals({
          paid: paymentsRes.data.filter((p) => p.status === "confirmed").reduce((s, p) => s + Number(p.amount), 0),
          pending: paymentsRes.data.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0),
        });
      }
      if (programsRes.data) {
        setPrograms(programsRes.data as ProgramRow[]);
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

  const totalInvested = totals.paid;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Mi Estado de Cuenta</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-extrabold text-green-400">${totalInvested.toFixed(2)}</p>
            <p className="text-white/80 text-sm mt-1">Total Invertido</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-extrabold text-green-400">${totals.paid.toFixed(2)}</p>
            <p className="text-white/80 text-sm mt-1">Pagos Confirmados</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-extrabold text-[#FBBC0C]">${totals.pending.toFixed(2)}</p>
            <p className="text-white/80 text-sm mt-1">Pendiente</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-extrabold text-white">{payments.length}</p>
            <p className="text-white/80 text-sm mt-1">Transacciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Programs */}
      {programs.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Carreras Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-[#FBBC0C]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold text-sm">{program.name}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE_STYLES[program.type] || "bg-white/10 text-white/60"}`}
                    >
                      {TYPE_LABELS[program.type] || program.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-extrabold text-[#FBBC0C]">${program.price}</span>
                    <Link href={`/checkout/${program.id}`}>
                      <Button className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold text-xs">
                        Inscribirme
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Info */}
      <Card className="bg-[#FBBC0C]/5 border-[#FBBC0C]/20">
        <CardContent className="p-6">
          <h3 className="text-[#FBBC0C] font-semibold mb-2">Datos para Transferencia</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/40">Banco:</span>
              <span className="text-white ml-2">Produbanco</span>
            </div>
            <div>
              <span className="text-white/40">Cuenta Corriente:</span>
              <span className="text-white ml-2">27059145711</span>
            </div>
            <div>
              <span className="text-white/40">Nombre:</span>
              <span className="text-white ml-2">ITSEIA</span>
            </div>
            <div>
              <span className="text-white/40">Email:</span>
              <span className="text-white ml-2">administracion@itseia.ai</span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-4">
            Envia el comprobante por WhatsApp al +593 95 989 2034 para confirmar tu pago.
          </p>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-white/40 text-center py-8">No tienes pagos registrados.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between bg-white/5 rounded-xl p-4"
                >
                  <div>
                    <p className="text-white font-medium">
                      {payment.enrollments?.programs?.name || "Pago general"}
                    </p>
                    <p className="text-white/40 text-sm">
                      {METHOD_LABELS[payment.method] || payment.method} — {" "}
                      {new Date(payment.created_at).toLocaleDateString("es-EC")}
                    </p>
                    {payment.reference && (
                      <p className="text-white/60 text-xs mt-1">Ref: {payment.reference}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">${Number(payment.amount).toFixed(2)}</p>
                    <Badge className={STATUS_STYLES[payment.status]}>
                      {STATUS_LABELS[payment.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
