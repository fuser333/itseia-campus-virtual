import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

const CAREER_ICONS: Record<string, string> = {
  IA: "🧠",
  CD: "📊",
  BD: "🗄️",
};

const CAREER_COLORS: Record<string, { border: string; accent: string }> = {
  IA: { border: "border-[#FBBC0C]/30", accent: "text-[#FBBC0C]" },
  CD: { border: "border-[#73B8E7]/30", accent: "text-[#73B8E7]" },
  BD: { border: "border-[#F0846D]/30", accent: "text-[#F0846D]" },
};

export default async function HomePage() {
  const supabase = supabaseAdmin;
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  // Fetch carreras specifically for the careers section
  const { data: carreras } = await supabase
    .from("programs")
    .select("*")
    .eq("type", "carrera")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0A1628]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBBC0C] flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-lg">IT</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              ITSEIA <span className="text-[#73B8E7] font-normal text-sm">Tecnologico</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#carreras" className="text-white/70 hover:text-white transition-colors text-sm">
              Carreras
            </a>
            <a href="#programas" className="text-white/70 hover:text-white transition-colors text-sm">
              Carreras
            </a>
            <a href="#diferenciadores" className="text-white/70 hover:text-white transition-colors text-sm">
              Por que ITSEIA
            </a>
            <Link href="/catalogo" className="text-white/70 hover:text-white transition-colors text-sm">
              Catalogo
            </Link>
            <a href="#precios" className="text-white/70 hover:text-white transition-colors text-sm">
              Precios
            </a>
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Iniciar Sesion
            </Link>
            <Link
              href="/register"
              className="bg-[#FBBC0C] text-[#0A1628] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#FBBC0C]/90 transition-colors"
            >
              Inscribirme
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FBBC0C] animate-pulse" />
            <span className="text-[#FBBC0C] text-sm font-medium">Matriculas abiertas 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Aprende IA con
            <br />
            <span className="text-[#FBBC0C]">IA incluida</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            El unico instituto en Ecuador donde tu matricula incluye acceso a
            ChatGPT, Claude y Gemini. No solo aprendes IA —{" "}
            <span className="text-[#73B8E7]">la usas desde el dia 1</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#FBBC0C] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FBBC0C]/90 transition-all hover:scale-105 shadow-lg shadow-[#FBBC0C]/20"
            >
              Empezar Ahora
            </Link>
            <a
              href="#programas"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-all"
            >
              Ver Carreras
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { value: "3", label: "Carreras de IA" },
              { value: "85%", label: "Empleabilidad" },
              { value: "$97", label: "Desde / mes" },
              { value: "24/7", label: "AI Lab incluido" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-[#FBBC0C] mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section id="diferenciadores" className="py-20 px-6 bg-[#1F2F58]/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Por que <span className="text-[#FBBC0C]">ITSEIA</span> es diferente
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
            No somos otro curso online. Somos el primer instituto tecnologico de IA en Ecuador.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI Lab Incluido",
                desc: "Acceso a ChatGPT, Claude y Gemini pagado por ITSEIA. Tu solo estudias, nosotros pagamos las APIs.",
                color: "#FBBC0C",
              },
              {
                icon: "💻",
                title: "Split-Screen Learning",
                desc: "Teoria a la izquierda, practica con IA a la derecha. Cada leccion tiene un ejercicio interactivo con el tutor IA.",
                color: "#73B8E7",
              },
              {
                icon: "🎓",
                title: "Certificacion IST",
                desc: "Certificado del Instituto Superior Tecnologico reconocido por SENESCYT. Mas peso que cualquier bootcamp o curso online.",
                color: "#F0846D",
              },
              {
                icon: "👥",
                title: "Cohortes con Peer Review",
                desc: "Estudias en grupo, con deadlines compartidos. Tus companeros revisan tus proyectos y tu los de ellos.",
                color: "#FBBC0C",
              },
              {
                icon: "📁",
                title: "Portafolio Profesional",
                desc: "Cada proyecto que haces se guarda en tu portafolio. Al graduarte tienes 30+ proyectos listos para empleadores.",
                color: "#73B8E7",
              },
              {
                icon: "🌎",
                title: "Pipeline de Talento",
                desc: "Los mejores alumnos acceden a oportunidades reales con H3L (7 paises), ImagemIA y Strata.",
                color: "#F0846D",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FBBC0C] transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carreras */}
      {carreras && carreras.length > 0 && (
        <section id="carreras" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Nuestras <span className="text-[#FBBC0C]">Carreras</span>
            </h2>
            <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
              3 carreras tecnologicas con titulo IST reconocido por SENESCYT. 5 semestres de formacion integral en Inteligencia Artificial.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {carreras.map((carrera) => {
                const code = carrera.career_code || "IA";
                const icon = CAREER_ICONS[code] || "🎓";
                const colors = CAREER_COLORS[code] || CAREER_COLORS.IA;
                return (
                  <Link
                    key={carrera.id}
                    href={`/programs/${carrera.slug}`}
                    className={`bg-white/5 border border-white/10 rounded-2xl p-8 hover:${colors.border} transition-all group flex flex-col`}
                  >
                    <div className="text-5xl mb-6">{icon}</div>
                    <div className="flex items-center gap-2 mb-2">
                      {carrera.career_code && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#1F2F58] text-[#73B8E7]">
                          {carrera.career_code}
                        </span>
                      )}
                      <span className="text-xs text-white/30">Carrera Tecnologica</span>
                    </div>
                    <h3 className={`text-xl font-bold text-white mb-3 group-hover:${colors.accent} transition-colors`}>
                      {carrera.name}
                    </h3>
                    <p className="text-white/40 text-sm mb-6 flex-1 leading-relaxed">
                      {carrera.description || `Formacion integral en ${carrera.name} con titulo IST reconocido por SENESCYT.`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-[#FBBC0C]">${carrera.price}</span>
                        <span className="text-white/40 text-sm ml-1">/mes</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/30">
                        <span>{carrera.total_semesters || 5} semestres</span>
                        <span className="text-white/20">·</span>
                        <span>{carrera.duration_months || 30} meses</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 text-[#FBBC0C] py-2.5 rounded-xl font-semibold text-center text-sm group-hover:bg-[#FBBC0C] group-hover:text-[#0A1628] transition-all">
                      Ver Malla Curricular
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Carreras */}
      <section id="programas" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Nuestras <span className="text-[#FBBC0C]">Carreras</span>
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
            Desde cursos express de 1 mes hasta carreras completas con titulo.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" id="precios">
            {programs?.map((program) => (
              <div
                key={program.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FBBC0C]/30 transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      program.type === "preuni"
                        ? "bg-[#73B8E7]/20 text-[#73B8E7]"
                        : program.type === "curso"
                        ? "bg-[#FBBC0C]/20 text-[#FBBC0C]"
                        : program.type === "bootcamp"
                        ? "bg-[#F0846D]/20 text-[#F0846D]"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {program.type === "preuni"
                      ? "Preuniversitario"
                      : program.type === "curso"
                      ? "Curso"
                      : program.type === "bootcamp"
                      ? "Bootcamp"
                      : "Carrera"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{program.name}</h3>
                <p className="text-white/40 text-sm mb-6 flex-1 leading-relaxed">
                  {program.description}
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-[#FBBC0C]">
                    ${program.price}
                  </span>
                  {program.duration_months && (
                    <span className="text-white/40 text-sm ml-1">
                      / {program.duration_months} {program.duration_months === 1 ? "mes" : "meses"}
                    </span>
                  )}
                </div>
                <Link
                  href="/register"
                  className="w-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 text-[#FBBC0C] py-3 rounded-xl font-semibold text-center hover:bg-[#FBBC0C] hover:text-[#0A1628] transition-all"
                >
                  Inscribirme
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Lab Preview */}
      <section className="py-20 px-6 bg-[#1F2F58]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Tu propio <span className="text-[#FBBC0C]">laboratorio de IA</span>
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Mientras otros pagan $20/mes por ChatGPT, tu tienes acceso a multiples
                modelos de IA incluido en tu matricula. Experimenta, compara, aprende.
              </p>
              <ul className="space-y-4">
                {[
                  "Chat ilimitado con Gemini Flash",
                  "Tutor IA que se adapta a tu nivel",
                  "Prompts sugeridos en cada leccion",
                  "Historial de conversaciones guardado",
                  "500 consultas/mes incluidas",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <span className="w-5 h-5 rounded-full bg-[#FBBC0C]/20 flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#FBBC0C]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Mock AI Lab */}
            <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#F0846D]" />
                <div className="w-3 h-3 rounded-full bg-[#FBBC0C]" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-white/30 text-xs ml-2">AI Lab ITSEIA</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                    <p className="text-white/80 text-sm">
                      Explicame como funciona un modelo de lenguaje como si fuera un chef de cocina
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                    <p className="text-white/70 text-sm leading-relaxed">
                      Imagina que un LLM es un chef que ha leido <strong className="text-[#FBBC0C]">todos los libros de
                      cocina del mundo</strong>. Cuando le pides una receta, no la inventa — combina
                      patrones de miles de recetas que ya vio. Si le pides "pasta italiana",
                      sabe que probablemente lleva tomate, albahaca y queso porque eso es lo
                      que aparece en el 90% de las recetas similares...
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/30 text-sm">
                  Escribe tu pregunta...
                </div>
                <div className="bg-[#FBBC0C] rounded-xl px-4 py-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0A1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Lo que dicen nuestros <span className="text-[#FBBC0C]">estudiantes</span>
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
            Profesionales que ya estan transformando su carrera con inteligencia artificial.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Fernanda Lopez",
                profession: "Contadora Publica",
                quote:
                  "Antes me tomaba 3 horas analizar balances. Con lo que aprendi en ITSEIA, automatice el proceso con IA y ahora me toma 20 minutos. Mis clientes estan impresionados.",
                initials: "ML",
                color: "#FBBC0C",
              },
              {
                name: "Carlos Andres Reyes",
                profession: "Medico Radiologo",
                quote:
                  "El AI Lab es increible. Practique con modelos de IA aplicados a imagenologia medica desde la primera semana. No existe otro programa asi en Ecuador.",
                initials: "CR",
                color: "#73B8E7",
              },
              {
                name: "Andrea Patricia Morales",
                profession: "Gerente de Operaciones",
                quote:
                  "Inverti $197 en el curso estandar y en menos de un mes ya habia implementado 3 automatizaciones en mi empresa. El ROI fue inmediato.",
                initials: "AM",
                color: "#F0846D",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 relative"
              >
                <div className="absolute top-6 right-6 text-5xl text-white/5 font-serif leading-none">
                  &ldquo;
                </div>
                <p className="text-white/60 leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${testimonial.color}20`, color: testimonial.color }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-white/40 text-xs">{testimonial.profession}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            El futuro no se espera.
            <br />
            <span className="text-[#FBBC0C]">Se construye.</span>
          </h2>
          <p className="text-white/50 mb-10">
            Unete a los profesionales que ya estan dominando la IA con ITSEIA.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#FBBC0C] text-[#0A1628] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#FBBC0C]/90 transition-all hover:scale-105 shadow-lg shadow-[#FBBC0C]/20"
          >
            Inscribirme Ahora
          </Link>
          <p className="text-white/30 text-sm mt-6">
            Contacto: administracion@itseia.ai | WhatsApp +593 95 989 2034
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/30 text-sm">
            2026 ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial
          </div>
          <div className="flex gap-6">
            <a href="https://itseia.ai" target="_blank" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              itseia.ai
            </a>
            <Link href="/login" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              Plataforma
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
