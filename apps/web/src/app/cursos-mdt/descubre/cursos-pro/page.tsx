// src/app/cursos-mdt/descubre/cursos-pro/page.tsx
// Server Component — landing embebida de Cursos Profesionales
// Hereda el layout de /cursos-mdt (sidebar MDT siempre visible)

export default function DescubreCursosPro() {
  return (
    <div className="min-h-screen" style={{ background: "#111827", color: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .cp-tag-row { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .cp-tag {
          background:rgba(115,184,231,0.12); border:1px solid rgba(115,184,231,0.25);
          color:#73B8E7; font-size:12px; font-weight:600; padding:4px 12px; border-radius:100px;
        }
        .cp-tag.gold { background:rgba(251,188,12,0.12); border-color:rgba(251,188,12,0.3); color:#FBBC0C; }
        .cp-video-ratio {
          position:relative; width:100%; aspect-ratio:16/9;
          border-radius:12px; overflow:hidden;
          background:#0D1B30; border:1px solid rgba(115,184,231,0.15);
        }
        .cp-video-ratio iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
        .cp-pill {
          background:rgba(10,22,40,0.6); border:1px solid rgba(115,184,231,0.2);
          color:#E2E8F0; font-size:13px; font-weight:600;
          padding:8px 16px; border-radius:100px; cursor:default;
          transition:background 0.2s,border-color 0.2s,color 0.2s;
        }
        .cp-pill:hover { background:rgba(251,188,12,0.12); border-color:rgba(251,188,12,0.4); color:#FBBC0C; }
        .cp-how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:36px; }
        @media(max-width:768px){ .cp-how-grid { grid-template-columns:1fr; } }
        .cp-how-step {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.12); border-radius:14px; padding:20px; text-align:center;
        }
        .cp-pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:36px; }
        @media(max-width:768px){ .cp-pricing-grid { grid-template-columns:1fr; } }
        .cp-price-card {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.15); border-radius:16px; padding:24px 20px; text-align:center;
          transition:border-color 0.25s,transform 0.25s;
        }
        .cp-price-card:hover { transform:translateY(-2px); }
        .cp-price-card.featured { border-color:rgba(251,188,12,0.4); }
        .cp-hours-badge {
          display:inline-block;
          background:rgba(115,184,231,0.12); border:1px solid rgba(115,184,231,0.2);
          color:#73B8E7; font-size:12px; font-weight:600;
          padding:3px 10px; border-radius:100px; margin-bottom:6px;
        }
        .cp-tutorias-badge {
          display:block;
          background:rgba(251,188,12,0.1); border:1px solid rgba(251,188,12,0.2);
          color:#FBBC0C; font-size:11px; font-weight:700;
          padding:3px 10px; border-radius:100px; margin-bottom:14px;
        }
        .cp-ul { list-style:none; text-align:left; display:flex; flex-direction:column; gap:6px; }
        .cp-li { font-size:12px; color:#CBD5E1; padding-left:14px; position:relative; line-height:1.4; }
        .cp-li::before { content:''; position:absolute; left:0; top:6px; width:5px; height:5px; background:#FBBC0C; border-radius:50%; }
        .cp-btn-whatsapp {
          display:inline-flex; align-items:center; gap:10px;
          background:#25D366; color:#FFFFFF;
          font-weight:700; font-size:16px;
          padding:18px 36px; border-radius:14px; text-decoration:none;
          transition:background 0.2s,transform 0.2s;
        }
        .cp-btn-whatsapp:hover { background:#1ebe5a; transform:translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#F0846D", marginBottom: "10px" }}>
            Formación a medida
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", color: "#FFFFFF", lineHeight: 1.15, marginBottom: "10px" }}>
            Cursos de IA <span style={{ color: "#FBBC0C" }}>Personalizados</span> para tu Profesión
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", maxWidth: "540px", margin: "0 auto", lineHeight: 1.6 }}>
            Dinos tu profesión y diseñamos el curso exacto que necesitas para integrar la IA en tu trabajo real
          </p>
          <div className="cp-tag-row">
            <span className="cp-tag gold">Desde $99</span>
            <span className="cp-tag">Diseño a medida</span>
            <span className="cp-tag">Con tutorías</span>
            <span className="cp-tag">Certificado MDT</span>
          </div>
        </header>

        {/* ── VIDEO ── */}
        <div style={{ width: "100%", marginBottom: "40px" }}>
          <div className="cp-video-ratio">
            <iframe
              src="https://www.youtube.com/embed/N-wE4B7-MN4?rel=0&modestbranding=1"
              title="Cursos IA Personalizados — ITSEIA Express $99"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* ── PROFESIONES ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(115,184,231,0.15)", borderRadius: "16px", padding: "24px", marginBottom: "36px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>
            Diseñado para <span style={{ color: "#FBBC0C" }}>tu profesión</span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
            {["Vendedor", "Médico", "Abogado", "Contador", "Ingeniero", "Arquitecto", "Psicólogo", "Docente", "Diseñador", "Periodista", "Administrador", "Tu profesión"].map((p) => (
              <span key={p} className="cp-pill">{p}</span>
            ))}
          </div>
          <p style={{ marginTop: "14px", fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>
            Cada curso se adapta al contexto real de tu trabajo. <strong style={{ color: "#FBBC0C" }}>No aprendes IA genérica</strong> — aprendes a usar IA específicamente para los problemas y tareas de tu industria.
          </p>
        </div>

        {/* ── CÓMO FUNCIONA ── */}
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>
          Cómo <span style={{ color: "#FBBC0C" }}>funciona</span>
        </p>
        <div className="cp-how-grid">
          {[
            { num: "01", title: "Nos cuentas tu profesión", desc: "Por WhatsApp nos dices qué haces, qué problemas tienes y qué quieres lograr con IA." },
            { num: "02", title: "Diseñamos tu curriculum", desc: "En 24 horas tienes el temario personalizado listo para tu revisión y aprobación." },
            { num: "03", title: "Estudias y practicas", desc: "Accedes a la plataforma con videos, ejercicios y tutorías según el nivel que elijas." },
          ].map((s) => (
            <div key={s.num} className="cp-how-step">
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "32px", color: "#FBBC0C", lineHeight: 1, marginBottom: "8px" }}>{s.num}</p>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "#FFFFFF", marginBottom: "6px" }}>{s.title}</h4>
              <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* ── PRECIOS ── */}
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>
          Niveles de <span style={{ color: "#FBBC0C" }}>inversión</span>
        </p>
        <div className="cp-pricing-grid">

          <div className="cp-price-card">
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#94A3B8", marginBottom: "8px" }}>Express</p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "36px", color: "#FBBC0C", lineHeight: 1, marginBottom: "4px" }}>
              <sup style={{ fontSize: "18px", verticalAlign: "top", marginTop: "6px" }}>$</sup>99
            </p>
            <span className="cp-hours-badge">40 horas</span>
            <span className="cp-tutorias-badge">2 asesorías incluidas</span>
            <ul className="cp-ul">
              <li className="cp-li">Curriculum personalizado</li>
              <li className="cp-li">Videos y ejercicios prácticos</li>
              <li className="cp-li">2 tutorías con instructor</li>
              <li className="cp-li">Certificado MDT 40h</li>
              <li className="cp-li">Acceso por 4 meses</li>
            </ul>
          </div>

          <div className="cp-price-card featured">
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#94A3B8", marginBottom: "8px" }}>Estándar</p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "36px", color: "#FBBC0C", lineHeight: 1, marginBottom: "4px" }}>
              <sup style={{ fontSize: "18px", verticalAlign: "top", marginTop: "6px" }}>$</sup>197
            </p>
            <span className="cp-hours-badge">60 horas</span>
            <span className="cp-tutorias-badge">4 asesorías incluidas</span>
            <ul className="cp-ul">
              <li className="cp-li">Todo lo del nivel Express</li>
              <li className="cp-li">Módulos avanzados de tu sector</li>
              <li className="cp-li">4 tutorías con instructor</li>
              <li className="cp-li">Proyecto aplicado real</li>
              <li className="cp-li">Certificado MDT 60h</li>
            </ul>
          </div>

          <div className="cp-price-card">
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#94A3B8", marginBottom: "8px" }}>Completo</p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "36px", color: "#FBBC0C", lineHeight: 1, marginBottom: "4px" }}>
              <sup style={{ fontSize: "18px", verticalAlign: "top", marginTop: "6px" }}>$</sup>297
            </p>
            <span className="cp-hours-badge">80 horas</span>
            <span className="cp-tutorias-badge">6 asesorías incluidas</span>
            <ul className="cp-ul">
              <li className="cp-li">Todo lo del nivel Estándar</li>
              <li className="cp-li">Sesiones con Héctor Velasco</li>
              <li className="cp-li">6 tutorías personalizadas</li>
              <li className="cp-li">Acceso de por vida</li>
              <li className="cp-li">Certificado MDT 80h</li>
            </ul>
          </div>

        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "18px" }}>
            Cuéntanos tu profesión y te mandamos el temario personalizado gratis
          </p>
          <a
            href="https://wa.me/593997489821?text=Quiero%20un%20curso%20de%20IA%20personalizado%20para%20mi%20profesión"
            target="_blank"
            rel="noopener noreferrer"
            className="cp-btn-whatsapp"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Quiero mi curso de IA personalizado
          </a>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#64748B" }}>
            WhatsApp: +593 99 748 9821 · administracion@itseia.ai
          </p>
        </div>

      </div>
    </div>
  );
}
