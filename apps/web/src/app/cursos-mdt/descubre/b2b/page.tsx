// src/app/cursos-mdt/descubre/b2b/page.tsx
// Server Component — landing embebida de Capacitación B2B Empresarial
// Hereda el layout de /cursos-mdt (sidebar MDT siempre visible)

const CLIENTS = [
  { name: "Armada del Ecuador", sector: "Sector público — defensa" },
  { name: "Growix NX",          sector: "Tecnología y startups" },
  { name: "PECTI Imágenes",     sector: "Servicios médicos" },
  { name: "Liceo ByS",          sector: "Educación" },
] as const;

const PROCESS_STEPS = [
  { num: "01", title: "Diagnóstico",   desc: "Entendemos tu industria, equipo y objetivos de negocio" },
  { num: "02", title: "Diseño",        desc: "Construimos el curriculum personalizado para tu empresa" },
  { num: "03", title: "Formación",     desc: "Tu equipo estudia en nuestra plataforma con tutorías en vivo" },
  { num: "04", title: "Certificación", desc: "Todos obtienen su certificado MDT oficial al finalizar" },
] as const;

export default function DescubreB2B() {
  return (
    <div className="min-h-screen" style={{ background: "#111827", color: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .b2-tag-row { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .b2-tag {
          background:rgba(115,184,231,0.12); border:1px solid rgba(115,184,231,0.25);
          color:#73B8E7; font-size:12px; font-weight:600; padding:4px 12px; border-radius:100px;
        }
        .b2-tag.gold  { background:rgba(251,188,12,0.12); border-color:rgba(251,188,12,0.3); color:#FBBC0C; }
        .b2-tag.green { background:rgba(34,197,94,0.12); border-color:rgba(34,197,94,0.3); color:#22C55E; }
        .b2-video-ratio {
          position:relative; width:100%; aspect-ratio:16/9;
          border-radius:12px; overflow:hidden;
          background:#0D1B30; border:1px solid rgba(115,184,231,0.15);
        }
        .b2-video-ratio iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
        .b2-benefits-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:40px; }
        @media(max-width:640px){ .b2-benefits-grid { grid-template-columns:1fr; } }
        .b2-benefit-card {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.15); border-radius:16px; padding:22px 20px;
          display:flex; gap:16px; align-items:flex-start; transition:border-color 0.25s;
        }
        .b2-benefit-card:hover { border-color:rgba(251,188,12,0.3); }
        .b2-benefit-icon {
          width:44px; height:44px; flex-shrink:0;
          background:rgba(251,188,12,0.1); border-radius:10px;
          display:flex; align-items:center; justify-content:center;
        }
        .b2-process-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:16px; }
        @media(max-width:768px){ .b2-process-steps { grid-template-columns:repeat(2,1fr); } }
        .b2-process-step { text-align:center; padding:14px 10px; }
        .b2-clients-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-top:16px; }
        @media(max-width:640px){ .b2-clients-grid { grid-template-columns:1fr; } }
        .b2-client-item {
          background:rgba(10,22,40,0.5); border:1px solid rgba(115,184,231,0.1);
          border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:10px;
        }
        .b2-btn-whatsapp {
          display:inline-flex; align-items:center; gap:10px;
          background:#25D366; color:#FFFFFF;
          font-weight:700; font-size:16px;
          padding:18px 36px; border-radius:14px; text-decoration:none;
          transition:background 0.2s,transform 0.2s;
        }
        .b2-btn-whatsapp:hover { background:#1ebe5a; transform:translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#73B8E7", marginBottom: "10px" }}>
            Solución empresarial
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", color: "#FFFFFF", lineHeight: 1.15, marginBottom: "10px" }}>
            Capacitación IA para <span style={{ color: "#FBBC0C" }}>tu Empresa</span>
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
            Formamos a tu equipo en Inteligencia Artificial con un curriculum diseñado específicamente para tu industria y necesidades
          </p>
          <div className="b2-tag-row">
            <span className="b2-tag gold">Desde $250 por persona</span>
            <span className="b2-tag green">Certificado MDT para el equipo</span>
            <span className="b2-tag">Personalizado por industria</span>
            <span className="b2-tag">Plataforma propia</span>
          </div>
        </header>

        {/* ── VIDEO ── */}
        <div style={{ width: "100%", marginBottom: "40px" }}>
          <div className="b2-video-ratio">
            <iframe
              src="https://www.youtube.com/embed/jp4MeUVZwk0?rel=0&modestbranding=1"
              title="Capacitación IA para Empresas — ITSEIA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* ── POR QUÉ NOS ELIGEN ── */}
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>
          Por qué empresas nos <span style={{ color: "#FBBC0C" }}>eligen</span>
        </p>
        <div className="b2-benefits-grid">

          <div className="b2-benefit-card">
            <div className="b2-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>Personalizado por industria</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>No es un curso genérico. Analizamos tu empresa, tus procesos y tus retos específicos para diseñar el contenido exacto que necesita tu equipo.</p>
            </div>
          </div>

          <div className="b2-benefit-card">
            <div className="b2-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>Certificado MDT para todo el equipo</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Cada colaborador recibe un certificado oficial del Ministerio del Trabajo. Demostrable, verificable y reconocido en Ecuador.</p>
            </div>
          </div>

          <div className="b2-benefit-card">
            <div className="b2-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0846D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>Plataforma + grabaciones por 6 meses</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Acceso completo a todos los materiales, videos grabados y recursos de aprendizaje durante 6 meses después del programa.</p>
            </div>
          </div>

          <div className="b2-benefit-card">
            <div className="b2-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>Reportes de progreso del equipo</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Dashboard ejecutivo con el avance de cada colaborador, módulos completados, evaluaciones y tiempo de dedicación semanal.</p>
            </div>
          </div>

        </div>

        {/* ── CÓMO TRABAJAMOS ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(115,184,231,0.15)", borderRadius: "16px", padding: "24px", marginBottom: "36px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>
            Cómo <span style={{ color: "#FBBC0C" }}>trabajamos</span>
          </p>
          <div className="b2-process-steps">
            {PROCESS_STEPS.map((s) => (
              <div key={s.num} className="b2-process-step">
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "28px", color: "#FBBC0C", lineHeight: 1, marginBottom: "6px" }}>{s.num}</p>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "13px", color: "#FFFFFF", marginBottom: "4px" }}>{s.title}</h4>
                <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CLIENTES ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(115,184,231,0.15)", borderRadius: "16px", padding: "24px", marginBottom: "36px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>
            Empresas que <span style={{ color: "#FBBC0C" }}>confiaron</span> en ITSEIA
          </p>
          <div className="b2-clients-grid">
            {CLIENTS.map((c) => (
              <div key={c.name} className="b2-client-item">
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FBBC0C", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>{c.name}</p>
                  <p style={{ fontSize: "11px", color: "#64748B" }}>{c.sector}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRECIO REFERENCIA ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(251,188,12,0.25)", borderRadius: "16px", padding: "22px 24px", textAlign: "center", marginBottom: "32px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "8px" }}>Inversión por persona (grupos desde 5 personas)</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "28px", color: "#FBBC0C" }}>
            $250 – $500 <small style={{ fontSize: "14px", fontWeight: 600, color: "#94A3B8" }}>/ persona</small>
          </p>
          <p style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>El precio varía según horas, nivel y personalización. Cotización sin costo en 24 horas.</p>
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "18px" }}>
            Hablemos sobre las necesidades específicas de tu equipo
          </p>
          <a
            href="https://wa.me/593997489821?text=Quiero%20cotizar%20capacitación%20IA%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="b2-btn-whatsapp"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Cotizar capacitación para mi empresa
          </a>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#64748B" }}>
            WhatsApp: +593 99 748 9821 · administracion@itseia.ai
          </p>
        </div>

      </div>
    </div>
  );
}
