// src/app/cursos-mdt/descubre/carreras/page.tsx
// Server Component — landing embebida de Carreras de IA
// Hereda el layout de /cursos-mdt (sidebar MDT siempre visible)

export default function DescubreCarreras() {
  return (
    <div className="min-h-screen" style={{ background: "#111827", color: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Estilos escopados ── */}
      <style>{`
        .lp-tag-row { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .lp-tag {
          background:rgba(115,184,231,0.12); border:1px solid rgba(115,184,231,0.25);
          color:#73B8E7; font-size:12px; font-weight:600; padding:4px 12px; border-radius:100px;
        }
        .lp-tag.gold { background:rgba(251,188,12,0.12); border-color:rgba(251,188,12,0.25); color:#FBBC0C; }
        .lp-video-ratio {
          position:relative; width:100%; aspect-ratio:16/9;
          border-radius:12px; overflow:hidden;
          background:#0D1B30; border:1px solid rgba(115,184,231,0.15);
        }
        .lp-video-ratio iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
        .lp-cards-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:40px; }
        @media(max-width:768px){ .lp-cards-grid { grid-template-columns:1fr; } }
        .lp-card {
          background:rgba(31,47,88,0.4); backdrop-filter:blur(20px);
          border:1px solid rgba(115,184,231,0.15); border-radius:16px; padding:24px 20px;
          transition:border-color 0.25s,transform 0.25s;
        }
        .lp-card:hover { border-color:rgba(251,188,12,0.35); transform:translateY(-2px); }
        .lp-card-icon {
          width:44px; height:44px; background:rgba(251,188,12,0.12);
          border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:14px;
        }
        .lp-pricing-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:18px; }
        @media(max-width:640px){ .lp-pricing-grid { grid-template-columns:1fr; } }
        .lp-price-box {
          background:rgba(10,22,40,0.5); border:1px solid rgba(115,184,231,0.12);
          border-radius:12px; padding:20px;
        }
        .lp-price-box.featured { border-color:rgba(251,188,12,0.4); background:rgba(251,188,12,0.06); }
        .lp-beca-badge {
          display:inline-block; background:rgba(251,188,12,0.15);
          border:1px solid rgba(251,188,12,0.3); color:#FBBC0C;
          font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; margin-bottom:10px;
        }
        .lp-btn-whatsapp {
          display:inline-flex; align-items:center; gap:10px;
          background:#25D366; color:#FFFFFF;
          font-weight:700; font-size:16px;
          padding:18px 36px; border-radius:14px; text-decoration:none;
          transition:background 0.2s,transform 0.2s;
        }
        .lp-btn-whatsapp:hover { background:#1ebe5a; transform:translateY(-1px); }
        .lp-ul { list-style:none; display:flex; flex-direction:column; gap:7px; }
        .lp-li {
          font-size:13px; color:#94A3B8; padding-left:16px; position:relative; line-height:1.45;
        }
        .lp-li::before {
          content:''; position:absolute; left:0; top:7px;
          width:6px; height:6px; background:#73B8E7; border-radius:50%;
        }
        .lp-li-gold::before { background:#FBBC0C; }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#73B8E7", marginBottom: "8px" }}>
            Descubre ITSEIA
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", color: "#FFFFFF", lineHeight: 1.15, marginBottom: "10px" }}>
            3 Carreras de <span style={{ color: "#FBBC0C" }}>Inteligencia Artificial</span>
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
            Obtén tu título de Tercer Nivel en 3 años con certificaciones internacionales incluidas
          </p>
          <div className="lp-tag-row">
            <span className="lp-tag">Horario vespertino 17:30–21:30</span>
            <span className="lp-tag gold">85–92% empleabilidad</span>
            <span className="lp-tag">Título de Tercer Nivel</span>
            <span className="lp-tag">Quito, Ecuador</span>
          </div>
        </header>

        {/* ── VIDEO ── */}
        <div style={{ width: "100%", marginBottom: "40px" }}>
          <div className="lp-video-ratio">
            <iframe
              src="https://www.youtube.com/embed/dTFIUA_pfys?rel=0&modestbranding=1"
              title="ITSEIA — Carreras de Inteligencia Artificial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* ── CARRERAS ── */}
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "20px" }}>
          Elige tu <span style={{ color: "#FBBC0C" }}>carrera</span>
        </p>
        <div className="lp-cards-grid">

          {/* Carrera 1 */}
          <div className="lp-card">
            <div className="lp-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBC0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", color: "#FFFFFF", marginBottom: "6px" }}>
              Inteligencia Artificial
            </h3>
            <p style={{ fontSize: "12px", color: "#FBBC0C", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              6 semestres · 3 años
            </p>
            <ul className="lp-ul">
              <li className="lp-li">Machine Learning y Deep Learning aplicado</li>
              <li className="lp-li">Procesamiento de lenguaje natural (NLP)</li>
              <li className="lp-li">Visión por computadora y modelos generativos</li>
              <li className="lp-li">Certificación AWS + Google incluida</li>
            </ul>
          </div>

          {/* Carrera 2 */}
          <div className="lp-card">
            <div className="lp-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#73B8E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", color: "#FFFFFF", marginBottom: "6px" }}>
              Ciencia de Datos
            </h3>
            <p style={{ fontSize: "12px", color: "#FBBC0C", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              6 semestres · 3 años
            </p>
            <ul className="lp-ul">
              <li className="lp-li">Análisis estadístico y visualización de datos</li>
              <li className="lp-li">Python, SQL y herramientas de BI</li>
              <li className="lp-li">Modelos predictivos y series de tiempo</li>
              <li className="lp-li">Proyectos reales con empresas del sector</li>
            </ul>
          </div>

          {/* Carrera 3 */}
          <div className="lp-card">
            <div className="lp-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0846D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", color: "#FFFFFF", marginBottom: "6px" }}>
              Big Data e Inteligencia de Negocio
            </h3>
            <p style={{ fontSize: "12px", color: "#FBBC0C", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              6 semestres · 3 años
            </p>
            <ul className="lp-ul">
              <li className="lp-li">Arquitecturas de datos en la nube (AWS, Azure)</li>
              <li className="lp-li">Business Intelligence y dashboards ejecutivos</li>
              <li className="lp-li">Procesamiento de datos a escala masiva</li>
              <li className="lp-li">Estrategia de datos para empresas</li>
            </ul>
          </div>

        </div>

        {/* ── PRECIOS ── */}
        <div style={{ background: "rgba(31,47,88,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(115,184,231,0.15)", borderRadius: "16px", padding: "28px 24px", marginBottom: "36px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>
            Inversión en tu <span style={{ color: "#FBBC0C" }}>futuro</span>
          </p>
          <div className="lp-pricing-grid">

            <div className="lp-price-box">
              <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#94A3B8", marginBottom: "8px" }}>
                Precio regular
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "28px", color: "#FBBC0C", lineHeight: 1, marginBottom: "4px" }}>
                $300<sub style={{ fontSize: "14px" }}>/mes</sub>
              </p>
              <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "10px" }}>+ Inscripción $180 (única vez)</p>
              <ul className="lp-ul">
                <li className="lp-li lp-li-gold">Modalidad presencial</li>
                <li className="lp-li lp-li-gold">Quito — horario vespertino</li>
                <li className="lp-li lp-li-gold">Acceso a plataforma + grabaciones</li>
                <li className="lp-li lp-li-gold">Certificaciones AWS + Google</li>
              </ul>
            </div>

            <div className="lp-price-box featured">
              <span className="lp-beca-badge">Beca H3L</span>
              <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#FBBC0C", marginBottom: "8px" }}>
                Con Beca Corporativa H3L
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "28px", color: "#FBBC0C", lineHeight: 1, marginBottom: "4px" }}>
                $99<sub style={{ fontSize: "14px" }}>/mes</sub>
              </p>
              <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "10px" }}>Online · $149/mes presencial · Inscripción $180</p>
              <ul className="lp-ul">
                <li className="lp-li lp-li-gold">H3L subsidia parte de la pensión</li>
                <li className="lp-li lp-li-gold">Misma malla y certificaciones</li>
                <li className="lp-li lp-li-gold">100% online disponible</li>
                <li className="lp-li lp-li-gold">30 cupos — junio 2026</li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "18px" }}>
            Resolvemos todas tus dudas por WhatsApp — sin compromiso
          </p>
          <a
            href="https://wa.me/593997489821?text=Quiero%20información%20sobre%20las%20carreras%20de%20IA"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-whatsapp"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Quiero información sobre las carreras
          </a>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#64748B" }}>
            WhatsApp: +593 99 748 9821 · administracion@itseia.ai
          </p>
        </div>

      </div>
    </div>
  );
}
