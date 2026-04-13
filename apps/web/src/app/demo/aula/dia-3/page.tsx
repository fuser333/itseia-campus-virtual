import LessonLayout from "../_components/LessonLayout";

export default function Dia3Page() {
  return (
    <LessonLayout
      dayNum={3}
      weekName="Semana 1 · Ignición"
      title="Animé mi foto del colegio"
      subtitle="Transformas una foto en video cinematográfico de 10 segundos con movimiento realista. La IA genera física, luces y cámara."
      duration="2h clase en vivo + 1h proyecto autónomo"
      emotionalGoal="Los recuerdos se vuelven cine. Transformas el pasado en algo que parece producción profesional."
      technicalGoal="Imagen → video con IA. Entender modelos de difusión para video (Kling, Runway, Pika) y sus diferencias."
      tools={[
        { name: "Kling AI 3.0", emoji: "🎥", logoColor: "#FBBC0C", desc: "El mejor modelo image-to-video ahora mismo. 10 segundos a 30fps con física consistente." },
        { name: "Runway Gen-4", emoji: "🎬", logoColor: "#73B8E7", desc: "Video desde texto con control cinematográfico. Cambia cámara, luz, estilo." },
        { name: "Pika Labs", emoji: "✨", logoColor: "#F0846D", desc: "Efectos visuales especiales: explosiones, transformaciones, morphing." },
      ]}
      agenda={[
        { time: "0:00 - 0:15", title: "Los mejores videos IA virales 2026", description: "Vemos ejemplos brillantes que rompieron internet este año. Inspiración para tu proyecto." },
        { time: "0:15 - 0:45", title: "Kling 3.0 — tu foto se mueve", description: "Subes una foto (tuya, familiar, del colegio). Describes qué quieres que pase. En 2 minutos tienes un video de 10 seg con movimiento realista." },
        { time: "0:45 - 1:15", title: "Runway Gen-4 — escena cinematográfica", description: "Generas una escena completa desde texto. Control de plano, iluminación, lente. Nivel producción indie." },
        { time: "1:15 - 1:30", title: "Discord + votación cohorte", description: "Presentas tu mejor escena. Los compañeros dan feedback y votan los top 3 del día." },
        { time: "1:30 - 2:00", title: "Trucos avanzados + reel en 3 min", description: "Cómo hacer un reel viral en 3 minutos usando IA. Técnicas de editing con CapCut + Pika." },
      ]}
      assignment="Crea un video de 30 segundos titulado 'Mi vida en cine IA'. Mezcla al menos 3 escenas: una foto tuya animada, una escena generada desde texto, y un efecto especial con Pika."
      deliverable="Reel Instagram o TikTok de 30 segundos con los 3 tipos de escenas. Comparte el link en el foro del día."
      videoEmbed="https://www.youtube.com/embed/c79-Q4jH__o"
      prevDay={{ num: 2, href: "/demo/aula/dia-2" }}
    >
      <section
        className="p-6 md:p-8 rounded-3xl border border-[#73B8E7]/20"
        style={{
          background:
            "linear-gradient(145deg, rgba(115,184,231,0.08) 0%, rgba(31,47,88,0.4) 100%)",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#73B8E7]/20 text-[#73B8E7] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
          🎓 Fin del demo
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-3">
          Hasta aquí llega tu vista previa
        </h3>
        <p className="text-white/70 mb-4 leading-relaxed">
          Los siguientes 17 días cubren automatización con agentes, apps más
          complejas, integraciones con APIs reales, y el Demo Day final donde
          presentas un proyecto propio ante tu familia y Héctor Velasco.
        </p>
        <p className="text-sm text-[#73B8E7]">
          Tu cohorte oficial arranca en junio 2026. Nos vemos ahí.
        </p>
      </section>
    </LessonLayout>
  );
}
