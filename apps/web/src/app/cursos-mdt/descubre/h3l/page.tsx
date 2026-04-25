// src/app/cursos-mdt/descubre/h3l/page.tsx
// Server Component — landing embebida de H3L y Partners del ecosistema ITSEIA
// Hereda el layout de /cursos-mdt (sidebar MDT siempre visible)

export default function DescubreH3L() {
  return (
    <div className="min-h-screen" style={{ background: "#111827", color: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .h3-tag-row { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .h3-tag {
          background:rgba(115,184,231,0.12); border:1px solid rgba(115,184,231,0.25);
          color:#73B8E7; font-size:12px; font-weight:600; padding:4px 12px; border-radius:100px;
        }
        .h3-tag.gold { background:rgba(251,188,12,0.12); border-color:rgba(251,188,12,0.3); color:#FBBC0C; }
        .h3-video-ratio {
          position:relative; width:100%; aspect-ratio:16/9;
          border-radius:14px; overflow:hidden;
          border:1px solid rgba(115,184,231,0.15);
        }
        .h3-video-ratio iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
        .h3-stat {
          background:rgba(10,22,40,0.5); border:1px solid rgba(115,184,231,0.1);
          border-radius:10px; padding:16px; text-align:center;
        }
        .h3-what-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        @media(max-width:640px){ .h3-what-grid { grid-template-columns:1fr; } }
        .h3-what-item {
          background:rgba(10,22,40,0.4); border:1px solid rgba(115,184,231,0.1);
          border-radius:10px; padding:14px;
        }
        .h3-divider { width:100%; height:1px; background:rgba(115,184,231,0.1); margin:36px 0; }
        .h3-partners-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-bottom:40px; }
        @media(max-width:640px){ .h3-partners-grid { grid-template-columns:1fr; } }
        .h3-partner-card {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.15); border-radius:16px; padding:24px 20px;
          transition:border-color 0.25s;
        }
        .h3-partner-card:hover { border-color:rgba(251,188,12,0.25); }
        .h3-partner-logo {
          width:52px; height:52px;
          background:rgba(10,22,40,0.7); border:1px solid rgba(115,184,231,0.15);
          border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .h3-highlight { display:flex; gap:8px; align-items:center; font-size:12px; color:#CBD5E1; }
        .h3-highlight::before { content:''; width:5px; height:5px; border-radius:50%; background:#73B8E7; flex-shrink:0; }
        .h3-btn-primary {
          display:inline-flex; align-items:center; gap:10px;
          background:#FBBC0C; color:#0D1B30;
          font-weight:800; font-size:16px;
          padding:18px 36px; border-radius:14px; text-decoration:none;
          transition:background 0.2s,transform 0.2s;
        }
        .h3-btn-primary:hover { background:#e6a900; transform:translateY(-1px); }
        .h3-btn-whatsapp-sm {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:#25D366;
          font-weight:700; font-size:14px;
          padding:12px 24px; border-radius:10px;
          border:1px solid rgba(37,211,102,0.4); text-decoration:none;
          transition:background 0.2s,border-color 0.2s;
        }
        .h3-btn-whatsapp-sm:hover { background:rgba(37,211,102,0.08); border-color:rgba(37,211,102,0.6); }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#73B8E7", marginBottom: "10px" }}>
            Ecosistema ITSEIA
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", color: "#FFFFFF", lineHeight: 1.15, marginBottom: "10px" }}>
            H3L — Diagnóstico de <span style={{ color: "#FBBC0C" }}>Capacidad Atrapada</span> con IA
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", maxWidth: "580px", margin: "0 auto", lineHeight: 1.6 }}>
            Nuestro partner líder identifica entre $150,000 y $800,000 de capacidad oculta en tu empresa mediante auditoría operativa con Inteligencia Artificial
          </p>
          <div className="h3-tag-row">
            <span className="h3-tag gold">$150K–$800K capacidad identificada</span>
            <span className="h3-tag">7 países</span>
            <span className="h3-tag">Diagnóstico gratuito</span>
          </div>
        </header>

        {/* ── VIDEO H3L ── */}
        <div style={{ marginBottom: "36px" }}>
          <div className="h3-video-ratio">
            <iframe
              src="https://www.youtube.com/embed/Mr7J_V-cTbA?rel=0&modestbranding=1"
              title="H3L — Diagnóstico de Capacidad Atrapada con IA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* ── H3L CARD PRINCIPAL ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(251,188,12,0.25)", borderRadius: "20px", padding: "32px 28px", marginBottom: "40px" }}>

          {/* Header H3L */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(10,22,40,0.7)", border: "1px solid rgba(251,188,12,0.2)", borderRadius: "14px", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "22px", color: "#FBBC0C", letterSpacing: "1px" }}>H3L</span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "24px", color: "#FFFFFF", marginBottom: "4px" }}>H3L — Auditoría Operativa con IA</h2>
              <p style={{ fontSize: "13px", color: "#73B8E7" }}>h3l.ai</p>
              <span style={{ display: "inline-block", background: "rgba(115,184,231,0.12)", border: "1px solid rgba(115,184,231,0.2)", color: "#73B8E7", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px", marginTop: "6px" }}>
                Presencia en 7 países
              </span>
            </div>
          </div>

          <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.7, marginBottom: "20px" }}>
            H3L es la empresa de auditoría operativa con IA más avanzada de Latinoamérica. Utilizando modelos propietarios de Inteligencia Artificial, analiza los procesos internos de tu empresa para identificar <strong style={{ color: "#FBBC0C" }}>dónde se pierde dinero, tiempo y talento</strong> que no estás viendo.
          </p>

          {/* Stats H3L */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
            {[
              { num: "$150K", label: "Mínimo identificado por diagnóstico" },
              { num: "$800K", label: "Máximo identificado en una empresa" },
              { num: "7",     label: "Países con clientes activos" },
            ].map((s) => (
              <div key={s.num} className="h3-stat">
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "24px", color: "#FBBC0C", lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Qué hace H3L */}
          <div className="h3-what-grid">
            {[
              { title: "Costos ocultos",       desc: "Identifica gastos invisibles en procesos, tiempos muertos y reprocesos que se acumulan silenciosamente." },
              { title: "Procesos ineficientes", desc: "Mapea qué tareas pueden automatizarse con IA para liberar a tu equipo de trabajo repetitivo de bajo valor." },
              { title: "Plan de acción",        desc: "No solo el diagnóstico: recibes un reporte con hallazgos priorizados y las acciones concretas a tomar." },
            ].map((w) => (
              <div key={w.title} className="h3-what-item">
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "13px", color: "#FBBC0C", marginBottom: "5px" }}>{w.title}</h4>
                <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.45 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h3-divider" />

        {/* ── OTROS PARTNERS ── */}
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>
          Otros partners del <span style={{ color: "#FBBC0C" }}>ecosistema ITSEIA</span>
        </p>
        <div className="h3-partners-grid">

          {/* ImagemIA */}
          <div className="h3-partner-card">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <div className="h3-partner-logo">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "13px", color: "#F0846D" }}>IMG</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "17px", color: "#FFFFFF", marginBottom: "2px" }}>ImagemIA</h3>
                <p style={{ fontSize: "12px", color: "#73B8E7" }}>imagemia.com</p>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "12px" }}>
              Plataforma de IA predictiva para imagenología médica. Ayuda a centros de salud y clínicas a reducir inasistencias y optimizar su operación con modelos de predicción de comportamiento del paciente.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span className="h3-highlight">Reducción del 30% en inasistencias</span>
              <span className="h3-highlight">IA predictiva para centros médicos</span>
              <span className="h3-highlight">Integración con sistemas hospitalarios</span>
              <span className="h3-highlight">Reportes en tiempo real</span>
            </div>
          </div>

          {/* Strata */}
          <div className="h3-partner-card">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <div className="h3-partner-logo">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "13px", color: "#73B8E7" }}>STR</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "17px", color: "#FFFFFF", marginBottom: "2px" }}>Strata</h3>
                <p style={{ fontSize: "12px", color: "#73B8E7" }}>strata.h3l.ai</p>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "12px" }}>
              El cerebro digital profesional. Una base de conocimiento inteligente que organiza, conecta y hace buscable todo el conocimiento de tu empresa o carrera profesional. Confiado por más de 9,000 documentos en 19 países.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span className="h3-highlight">9,000 documentos gestionados</span>
              <span className="h3-highlight">Presencia en 19 países</span>
              <span className="h3-highlight">Desde $19.99 al mes</span>
              <span className="h3-highlight">IA para búsqueda y síntesis</span>
            </div>
          </div>

        </div>

        {/* ── CTA PRINCIPAL H3L ── */}
        <div style={{ background: "linear-gradient(135deg,rgba(31,47,88,0.6) 0%,rgba(10,22,40,0.8) 100%)", backdropFilter: "blur(20px)", border: "1px solid rgba(251,188,12,0.3)", borderRadius: "20px", padding: "32px 24px", textAlign: "center", marginBottom: "20px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "22px", color: "#FFFFFF", marginBottom: "8px" }}>
            Solicita tu Diagnóstico Gratuito con H3L
          </h3>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px", lineHeight: 1.6 }}>
            En 48 horas el equipo de H3L te contacta para coordinar tu diagnóstico operativo con IA. Sin compromiso, sin costo.
          </p>
          <a
            href="https://wa.me/593990969009?text=Quiero%20el%20diagnóstico%20gratis%20de%20H3L"
            target="_blank"
            rel="noopener noreferrer"
            className="h3-btn-primary"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Solicitar Diagnóstico Gratuito con H3L
          </a>
          <p style={{ marginTop: "10px", fontSize: "12px", color: "#64748B" }}>WhatsApp directo de H3L: +593 99 096 9009</p>
        </div>

        {/* ── CTA SECUNDARIO ITSEIA ── */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "12px" }}>
            Para consultas generales sobre ITSEIA y sus partners:
          </p>
          <a
            href="https://wa.me/593997489821?text=Quiero%20saber%20más%20sobre%20H3L%20y%20los%20partners%20de%20ITSEIA"
            target="_blank"
            rel="noopener noreferrer"
            className="h3-btn-whatsapp-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar sobre los partners con ITSEIA
          </a>
        </div>

      </div>
    </div>
  );
}
