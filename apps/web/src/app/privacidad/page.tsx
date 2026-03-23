import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad | ITSEIA",
  description:
    "Politica de Privacidad del Instituto Ecuatoriano de Inteligencia Artificial, conforme a la Ley Organica de Proteccion de Datos Personales del Ecuador (LOPDP).",
};

// Pagina publica — no requiere autenticacion
export default function PrivacidadPage() {
  const POLICY_VERSION = "1.0";
  const PUBLISHED_DATE = "22 de marzo de 2026";

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0A1628]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-lg font-[family-name:var(--font-space-grotesk)]"
          >
            <span className="w-8 h-8 rounded-lg bg-[#FBBC0C] flex items-center justify-center text-[#0A1628] font-black text-sm">
              IT
            </span>
            ITSEIA
          </Link>
          <Link
            href="/register"
            className="text-sm text-[#73B8E7] hover:text-[#73B8E7]/80 transition-colors"
          >
            Volver al registro
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FBBC0C]" />
            <span className="text-[#FBBC0C] text-xs font-semibold tracking-wide uppercase">
              Version {POLICY_VERSION} &mdash; {PUBLISHED_DATE}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)] mb-3">
            Politica de Privacidad
          </h1>
          <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
            Instituto Ecuatoriano de Inteligencia Artificial (ITSEIA) &mdash; Conforme
            a la Ley Organica de Proteccion de Datos Personales del Ecuador
            (LOPDP, vigente desde mayo 2021).
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-white/75 leading-relaxed">

          {/* Responsable */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FBBC0C]/20 flex items-center justify-center text-[#FBBC0C] text-xs font-bold">1</span>
              Responsable del Tratamiento
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Institucion</p>
                <p className="text-white font-medium">Instituto Ecuatoriano de Inteligencia Artificial</p>
                <p className="text-white/50">ITSEIA</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Contacto</p>
                <a
                  href="mailto:administracion@itseia.ai"
                  className="text-[#73B8E7] hover:underline font-medium"
                >
                  administracion@itseia.ai
                </a>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Ubicacion</p>
                <p>Quito, Ecuador</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Plataforma</p>
                <p>tecnologico.itseia.ai</p>
              </div>
            </div>
          </section>

          {/* Datos recopilados */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#73B8E7]/20 flex items-center justify-center text-[#73B8E7] text-xs font-bold">2</span>
              Datos Personales Recopilados
            </h2>
            <p className="text-sm mb-4">
              En el desarrollo de nuestros servicios educativos, ITSEIA recopila y
              trata las siguientes categorias de datos personales:
            </p>
            <div className="space-y-3 text-sm">
              {[
                {
                  categoria: "Datos de identificacion",
                  detalle:
                    "Nombre completo, numero de cedula de identidad (cuando aplica), fecha de nacimiento.",
                },
                {
                  categoria: "Datos de contacto",
                  detalle:
                    "Correo electronico, numero de telefono / WhatsApp.",
                },
                {
                  categoria: "Datos de acceso",
                  detalle:
                    "Direccion IP, navegador y dispositivo utilizado, fecha y hora de inicio de sesion.",
                },
                {
                  categoria: "Datos academicos",
                  detalle:
                    "Matriculas activas, progreso por sesion y modulo, resultados de evaluaciones y quizzes, entregas de tareas, certificados emitidos.",
                },
                {
                  categoria: "Datos de uso de la plataforma",
                  detalle:
                    "Consultas realizadas al AI Lab (modelo, cantidad de tokens, costo estimado), tiempo de visualizacion de contenido, actividad de gamificacion (puntos XP, insignias).",
                },
                {
                  categoria: "Datos de pago",
                  detalle:
                    "Referencias de pago, comprobantes de transferencia, correo del pagador en transacciones PayPal. No almacenamos datos de tarjetas de credito.",
                },
                {
                  categoria: "Datos de consentimiento",
                  detalle:
                    "Registro del consentimiento dado al aceptar esta politica, incluyendo version aceptada, fecha, hora e IP de origen.",
                },
              ].map((item) => (
                <div key={item.categoria} className="flex gap-3">
                  <span className="text-[#FBBC0C] mt-0.5 flex-shrink-0">&#8226;</span>
                  <div>
                    <span className="text-white font-medium">{item.categoria}: </span>
                    {item.detalle}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Finalidad */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#F0846D]/20 flex items-center justify-center text-[#F0846D] text-xs font-bold">3</span>
              Finalidad del Tratamiento
            </h2>
            <div className="space-y-3 text-sm">
              {[
                "Prestacion de servicios educativos: acceso a cursos, sesiones en vivo, materiales y evaluaciones.",
                "Seguimiento academico: monitoreo del progreso del estudiante, generacion de reportes de avance y emision de certificados.",
                "Soporte tecnico y administrativo: atencion a consultas, gestion de pagos y matriculas.",
                "Comunicaciones institucionales: notificaciones sobre cambios en la plataforma, recordatorios de clases y actualizaciones de politicas.",
                "Mejora del servicio: analisis agregado y anonimizado del uso de la plataforma para optimizar el contenido educativo.",
                "Cumplimiento legal: conservacion de registros academicos conforme a requisitos del SENESCYT y organismos de control ecuatorianos.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[#FBBC0C] mt-0.5 flex-shrink-0">&#8226;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Base legal */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FBBC0C]/20 flex items-center justify-center text-[#FBBC0C] text-xs font-bold">4</span>
              Base Legal del Tratamiento (LOPDP Art. 9)
            </h2>
            <div className="space-y-4 text-sm">
              <div className="bg-[#FBBC0C]/5 border border-[#FBBC0C]/20 rounded-xl p-4">
                <p className="text-[#FBBC0C] font-semibold mb-1">Consentimiento explicito</p>
                <p>
                  El tratamiento de sus datos de contacto, seguimiento de uso y
                  comunicaciones de marketing se basa en el consentimiento libre,
                  especifico, informado e inequivoco que usted otorga al registrarse en
                  la plataforma. Puede retirar su consentimiento en cualquier momento
                  desde la seccion "Mis Datos" de su perfil.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Ejecucion contractual</p>
                <p>
                  El tratamiento de datos academicos y de pago es necesario para la
                  prestacion de los servicios educativos contratados por el estudiante
                  (Art. 9.3 LOPDP).
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Obligacion legal</p>
                <p>
                  La conservacion de registros academicos (notas, certificados) puede
                  ser requerida por el SENESCYT u otras autoridades de control del
                  sistema educativo superior ecuatoriano, independientemente del
                  consentimiento del titular.
                </p>
              </div>
            </div>
          </section>

          {/* Derechos ARCO */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#73B8E7]/20 flex items-center justify-center text-[#73B8E7] text-xs font-bold">5</span>
              Sus Derechos ARCO (LOPDP Arts. 19-22)
            </h2>
            <p className="text-sm mb-4">
              Como titular de datos personales, usted tiene los siguientes derechos:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                {
                  letra: "A",
                  derecho: "Acceso",
                  descripcion:
                    "Conocer que datos personales suyos tratamos, con que finalidad y durante cuanto tiempo.",
                },
                {
                  letra: "R",
                  derecho: "Rectificacion",
                  descripcion:
                    "Solicitar la correccion de datos incorrectos, incompletos o desactualizados.",
                },
                {
                  letra: "C",
                  derecho: "Cancelacion",
                  descripcion:
                    "Solicitar la eliminacion de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recopilados.",
                },
                {
                  letra: "O",
                  derecho: "Oposicion",
                  descripcion:
                    "Oponerse al tratamiento de sus datos para determinadas finalidades, en particular para comunicaciones de marketing.",
                },
              ].map((item) => (
                <div
                  key={item.letra}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded bg-[#1F2F58] flex items-center justify-center text-[#FBBC0C] text-xs font-bold">
                      {item.letra}
                    </span>
                    <p className="text-white font-semibold">{item.derecho}</p>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{item.descripcion}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-[#73B8E7]/10 border border-[#73B8E7]/20 rounded-xl p-4 text-sm">
              <p className="text-[#73B8E7] font-semibold mb-1">
                Como ejercer sus derechos
              </p>
              <p>
                Puede ejercer sus derechos directamente desde la seccion{" "}
                <Link
                  href="/profile"
                  className="text-white underline underline-offset-2 hover:text-[#73B8E7]"
                >
                  "Mis Datos"
                </Link>{" "}
                en su perfil (exportacion y eliminacion), o enviando un correo a{" "}
                <a
                  href="mailto:administracion@itseia.ai"
                  className="text-white underline underline-offset-2 hover:text-[#73B8E7]"
                >
                  administracion@itseia.ai
                </a>
                . El plazo legal de respuesta es de <strong className="text-white">15 dias habiles</strong>{" "}
                desde la recepcion de la solicitud.
              </p>
            </div>
          </section>

          {/* Retencion */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#F0846D]/20 flex items-center justify-center text-[#F0846D] text-xs font-bold">6</span>
              Retencion de Datos
            </h2>
            <div className="space-y-2 text-sm">
              {[
                {
                  tipo: "Datos de registro y contacto",
                  periodo:
                    "Mientras la cuenta este activa. Hasta 30 dias despues de la eliminacion de la cuenta.",
                },
                {
                  tipo: "Datos academicos (notas, certificados)",
                  periodo:
                    "10 anos desde la fecha de emision del certificado o finalizacion del programa, por obligacion legal ante el SENESCYT.",
                },
                {
                  tipo: "Datos de pago",
                  periodo:
                    "7 anos desde la transaccion, conforme a la normativa tributaria ecuatoriana.",
                },
                {
                  tipo: "Datos de marketing y comunicaciones",
                  periodo:
                    "Hasta que el usuario revoque su consentimiento o solicite la eliminacion de su cuenta.",
                },
                {
                  tipo: "Registros de consentimiento",
                  periodo:
                    "Conservados permanentemente como evidencia legal de cumplimiento LOPDP.",
                },
              ].map((item) => (
                <div key={item.tipo} className="flex gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-xs">{item.tipo}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.periodo}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Transferencias internacionales */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FBBC0C]/20 flex items-center justify-center text-[#FBBC0C] text-xs font-bold">7</span>
              Transferencias Internacionales
            </h2>
            <p className="text-sm mb-4">
              Los datos personales pueden ser transferidos y almacenados fuera del
              Ecuador a traves de los siguientes proveedores tecnologicos, todos con
              medidas de seguridad adecuadas:
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {[
                {
                  proveedor: "Supabase (base de datos)",
                  ubicacion: "AWS us-east-1 (Virginia, EE.UU.)",
                  finalidad: "Base de datos y autenticacion",
                },
                {
                  proveedor: "Vercel",
                  ubicacion: "Global CDN (EE.UU. / Europa)",
                  finalidad: "Alojamiento de la plataforma web",
                },
                {
                  proveedor: "Daily.co",
                  ubicacion: "EE.UU.",
                  finalidad: "Videoconferencias en vivo",
                },
              ].map((item) => (
                <div
                  key={item.proveedor}
                  className="bg-white/5 rounded-xl p-3 text-xs"
                >
                  <p className="text-white font-semibold">{item.proveedor}</p>
                  <p className="text-white/40 mt-0.5">{item.ubicacion}</p>
                  <p className="text-white/40 mt-0.5">{item.finalidad}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Seguridad */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#73B8E7]/20 flex items-center justify-center text-[#73B8E7] text-xs font-bold">8</span>
              Seguridad de los Datos
            </h2>
            <p className="text-sm">
              ITSEIA implementa medidas tecnicas y organizativas para proteger sus
              datos personales contra acceso no autorizado, perdida o divulgacion:
              cifrado en transito (HTTPS/TLS), autenticacion segura con tokens de
              sesion, control de acceso basado en roles, politicas de seguridad a
              nivel de base de datos (Row Level Security) y acceso restringido a
              datos sensibles unicamente a personal autorizado.
            </p>
          </section>

          {/* Cambios a la politica */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#F0846D]/20 flex items-center justify-center text-[#F0846D] text-xs font-bold">9</span>
              Actualizaciones de esta Politica
            </h2>
            <p className="text-sm">
              ITSEIA puede actualizar esta Politica de Privacidad cuando sea necesario
              para reflejar cambios en nuestros servicios o en la normativa aplicable.
              Cuando se publique una nueva version, se le notificara al iniciar sesion
              y se le solicitara su aceptacion expresa antes de continuar usando la
              plataforma. La version vigente siempre estara disponible en{" "}
              <Link
                href="/privacidad"
                className="text-[#73B8E7] hover:underline"
              >
                tecnologico.itseia.ai/privacidad
              </Link>
              .
            </p>
          </section>

          {/* Contacto / Reclamaciones */}
          <section className="bg-[#1F2F58]/30 border border-[#1F2F58]/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FBBC0C]/20 flex items-center justify-center text-[#FBBC0C] text-xs font-bold">10</span>
              Contacto y Reclamaciones
            </h2>
            <p className="text-sm mb-4">
              Para ejercer sus derechos ARCO, resolver dudas sobre esta politica o
              presentar una reclamacion, puede contactarnos:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">Email:</span>
                <a
                  href="mailto:administracion@itseia.ai"
                  className="text-[#73B8E7] hover:underline font-medium"
                >
                  administracion@itseia.ai
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">WhatsApp:</span>
                <a
                  href="https://wa.me/593959892034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#73B8E7] hover:underline font-medium"
                >
                  +593 95 989 2034
                </a>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg text-xs text-white/40">
              Si considera que el tratamiento de sus datos no es conforme a la LOPDP,
              tiene derecho a presentar una reclamacion ante la{" "}
              <span className="text-white/60">
                Superintendencia de Proteccion de Datos del Ecuador (SNAI)
              </span>
              , autoridad de control competente en materia de proteccion de datos
              personales.
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-white/10 pt-8">
          <p className="text-white/30 text-xs">
            Politica de Privacidad v{POLICY_VERSION} &mdash; Publicada el {PUBLISHED_DATE}
          </p>
          <p className="text-white/20 text-xs mt-1">
            &copy; {new Date().getFullYear()} Instituto Ecuatoriano de Inteligencia
            Artificial (ITSEIA) &mdash; Quito, Ecuador
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link
              href="/register"
              className="text-xs text-[#73B8E7] hover:underline"
            >
              Volver al registro
            </Link>
            <Link
              href="/login"
              className="text-xs text-[#73B8E7] hover:underline"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
