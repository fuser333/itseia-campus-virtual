import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = supabaseAdmin;

  const { data: certificate } = await supabase
    .from("certificates")
    .select(`
      *,
      profiles:user_id (full_name, email),
      programs:program_id (name, type)
    `)
    .eq("code", code)
    .single();

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {certificate ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Certificado Valido</h1>
            <p className="text-white/50 mb-8">Este certificado es autentico y fue emitido por ITSEIA.</p>

            <div className="space-y-4 text-left bg-white/5 rounded-xl p-6">
              <div>
                <span className="text-white/40 text-sm">Nombre</span>
                <p className="text-white font-semibold">
                  {(certificate.profiles as { full_name: string })?.full_name}
                </p>
              </div>
              <div>
                <span className="text-white/40 text-sm">Carrera</span>
                <p className="text-white font-semibold">
                  {(certificate.programs as { name: string })?.name}
                </p>
              </div>
              <div>
                <span className="text-white/40 text-sm">Fecha de Emision</span>
                <p className="text-white font-semibold">
                  {new Date(certificate.issued_at).toLocaleDateString("es-EC", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-white/40 text-sm">Codigo</span>
                <p className="text-[#FBBC0C] font-mono text-sm">{certificate.code}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FBBC0C] flex items-center justify-center">
                  <span className="text-[#0A1628] font-bold text-xs">IT</span>
                </div>
                <span className="text-white/50 text-sm">
                  Instituto Ecuatoriano de Inteligencia Artificial
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F0846D]/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#F0846D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Certificado No Encontrado</h1>
            <p className="text-white/50 mb-6">
              El codigo <span className="font-mono text-[#F0846D]">{code}</span> no corresponde a ningun certificado valido.
            </p>
            <Link
              href="/"
              className="text-[#73B8E7] hover:text-[#73B8E7]/80 text-sm transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
