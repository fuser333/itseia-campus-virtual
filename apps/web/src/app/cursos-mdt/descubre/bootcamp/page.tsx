// src/app/cursos-mdt/descubre/bootcamp/page.tsx
// Server Component — landing embebida del Bootcamp Intensivo de IA
// Hereda el layout de /cursos-mdt (sidebar MDT siempre visible)

const MODULES = [
  "Fundamentos de Python para IA",
  "Matemáticas para Machine Learning",
  "Aprendizaje supervisado",
  "Aprendizaje no supervisado",
  "Redes neuronales artificiales",
  "Deep Learning con TensorFlow",
  "Visión por computadora",
  "Procesamiento de lenguaje natural",
  "Modelos generativos y LLMs",
  "MLOps y despliegue en producción",
  "IA en la nube (AWS + Google)",
  "Proyecto final de industria",
] as const;

const STATS = [
  { num: "12",  label: "Módulos intensivos" },
  { num: "120h", label: "De formación total" },
  { num: "6",   label: "Tutorías con Héctor" },
  { num: "3",   label: "Meses de programa" },
] as const;

export default function DescubreBootcamp() {
  return (
    <div className="min-h-screen" style={{ background: "#111827", color: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .bt-tag-row { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .bt-tag {
          background:rgba(115,184,231,0.12); border:1px solid rgba(115,184,231,0.25);
          color:#73B8E7; font-size:12px; font-weight:600; padding:4px 12px; border-radius:100px;
        }
        .bt-tag.gold  { background:rgba(251,188,12,0.12); border-color:rgba(251,188,12,0.3); color:#FBBC0C; }
        .bt-tag.coral { background:rgba(240,132,109,0.12); border-color:rgba(240,132,109,0.3); color:#F0846D; }
        .bt-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; max-width:760px; margin:0 auto 36px; }
        @media(max-width:640px){ .bt-stats-row { grid-template-columns:repeat(2,1fr); } }
        .bt-stat-box {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.15); border-radius:12px; padding:16px; text-align:center;
        }
        .bt-video-ratio {
          position:relative; width:100%; aspect-ratio:16/9;
          border-radius:12px; overflow:hidden;
          background:#0D1B30; border:1px solid rgba(115,184,231,0.15);
        }
        .bt-video-ratio iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
        .bt-benefits-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:36px; }
        @media(max-width:640px){ .bt-benefits-grid { grid-template-columns:1fr; } }
        .bt-benefit-card {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.15); border-radius:16px; padding:22px 20px;
          display:flex; gap:16px; align-items:flex-start; transition:border-color 0.25s;
        }
        .bt-benefit-card:hover { border-color:rgba(251,188,12,0.3); }
        .bt-benefit-icon {
          width:44px; height:44px; flex-shrink:0;
          background:rgba(251,188,12,0.1); border-radius:10px;
          display:flex; align-items:center; justify-content:center;
        }
        .bt-modules-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:16px; }
        @media(max-width:640px){ .bt-modules-grid { grid-template-columns:repeat(2,1fr); } }
        .bt-module-item {
          background:rgba(10,22,40,0.5); border:1px solid rgba(115,184,231,0.1);
          border-radius:8px; padding:10px 12px; display:flex; gap:8px; align-items:flex-start;
        }
        .bt-price-feat {
          background:rgba(115,184,231,0.1); border:1px solid rgba(115,184,231,0.2);
          color:#73B8E7; font-size:12px; font-weight:600; padding:4px 12px; border-radius:100px;
        }
        .bt-btn-whatsapp {
          display:inline-flex; align-items:center; gap:10px;
          background:#25D366; color:#FFFFFF;
          font-weight:700; font-size:16px;
          padding:18px 36px; border-radius:14px; text-decoration:none;
          transition:background 0.2s,transform 0.2s;
        }
        .bt-btn-whatsapp:hover { background:#1ebe5a; transform:translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#F0846D", marginBottom: "10px" }}>
            Programa intensivo
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", color: "#FFFFFF", lineHeight: 1.15, marginBottom: "10px" }}>
            Bootcamp <span style={{ color: "#FBBC0C" }}>Intensivo de IA</span> — 120 horas en 3 meses
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
            El programa más completo de ITSEIA: Machine Learning, Deep Learning y proyecto final con tutoría directa de Héctor Velasco
          </p>
          <div className="bt-tag-row">
            <span className="bt-tag coral">120 horas</span>
            <span className="bt-tag gold">$497 pago único</span>
            <span className="bt-tag">3 meses</span>
            <span className="bt-tag">Certificado MDT</span>
          </div>
        </header>

        {/* ── STATS ── */}
        <div className="bt-stats-row">
          {STATS.map((s) => (
            <div key={s.num} className="bt-stat-box">
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "26px", color: "#FBBC0C", lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── VIDEO ── */}
        <div style={{ width: "100%", marginBottom: "40px" }}>
          <div className="bt-video-ratio">
            <iframe
              src="https://www.youtube.com/embed/QVoO3cY_BPQ?rel=0&modestbranding=1"
              title="Bootcamp Intensivo IA — ITSEIA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* ── QUÉ OBTIENES ── */}
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>
          Qué <span style={{ color: "#FBBC0C" }}>obtienes</span>
        </p>
        <div className="bt-benefits-grid">

          <div className="bt-benefit-card">
            <div className="bt-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>12 módulos progresivos</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Desde fundamentos de Python hasta arquitecturas de Transformers y LLMs. Cada módulo se construye sobre el anterior.</p>
            </div>
          </div>

          <div className="bt-benefit-card">
            <div className="bt-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>6 tutorías con Héctor Velasco</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Sesiones personalizadas con el fundador de ITSEIA: revisión de proyectos, estrategia de carrera y orientación profesional.</p>
            </div>
          </div>

          <div className="bt-benefit-card">
            <div className="bt-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0846D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>Proyecto final de industria</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Desarrollas un proyecto real aplicado a tu sector. Queda en tu portafolio como evidencia concreta para empleadores.</p>
            </div>
          </div>

          <div className="bt-benefit-card">
            <div className="bt-benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/>
                <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
                <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#FFFFFF", marginBottom: "5px" }}>Certificado MDT 120 horas</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>Certificación oficial del Ministerio del Trabajo de Ecuador. Reconocida por empresas públicas y privadas.</p>
            </div>
          </div>

        </div>

        {/* ── LOS 12 MÓDULOS ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(115,184,231,0.15)", borderRadius: "16px", padding: "24px", marginBottom: "36px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>
            Los 12 <span style={{ color: "#FBBC0C" }}>módulos</span>
          </p>
          <div className="bt-modules-grid">
            {MODULES.map((name, i) => (
              <div key={name} className="bt-module-item">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "11px", color: "#FBBC0C", flexShrink: 0, minWidth: "20px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "12px", color: "#CBD5E1", lineHeight: 1.35 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRECIO ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(251,188,12,0.35)", borderRadius: "16px", padding: "28px 24px", textAlign: "center", marginBottom: "36px", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "56px", color: "#FBBC0C", lineHeight: 1 }}>
            <sup style={{ fontSize: "26px", verticalAlign: "top", marginTop: "10px" }}>$</sup>497
          </p>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px" }}>Pago único · Sin mensualidades</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginTop: "16px" }}>
            {["120 horas", "Certificado MDT", "6 tutorías", "Proyecto real"].map((f) => (
              <span key={f} className="bt-price-feat">{f}</span>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "18px" }}>
            Cupos limitados — consúltanos disponibilidad para la próxima cohorte
          </p>
          <a
            href="https://wa.me/593997489821?text=Quiero%20información%20del%20Bootcamp%20Intensivo%20de%20IA"
            target="_blank"
            rel="noopener noreferrer"
            className="bt-btn-whatsapp"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Quiero inscribirme al Bootcamp
          </a>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#64748B" }}>
            WhatsApp: +593 99 748 9821 · administracion@itseia.ai
          </p>
        </div>

      </div>
    </div>
  );
}
