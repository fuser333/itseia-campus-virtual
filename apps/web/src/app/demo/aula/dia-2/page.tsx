import LessonLayout from "../_components/LessonLayout";

export default function Dia2Page() {
  return (
    <LessonLayout
      dayNum={2}
      weekName="Semana 1 · Ignición"
      title="Mi voz habla 5 idiomas"
      subtitle="Clonas tu voz en 30 segundos, la haces hablar japonés, chino y árabe, y generas un avatar tuyo presentando."
      duration="2h clase en vivo + 1h proyecto autónomo"
      emotionalGoal="Las barreras de idioma desaparecen. Tu mensaje puede llegar a 5.000 millones de personas."
      technicalGoal="Clonación de voz + traducción + generación de avatar sincronizado. Entender cómo TTS conecta con avatares."
      tools={[
        { name: "ElevenLabs v3", emoji: "🔊", logoColor: "#FBBC0C", desc: "Clonación de voz con 30 segundos de audio. Genera audios en cualquier idioma con tu voz." },
        { name: "HeyGen", emoji: "🎬", logoColor: "#73B8E7", desc: "Avatar AI con tu cara y voz. Presenta contenido en múltiples idiomas con labios sincronizados." },
        { name: "Gemini / DeepL", emoji: "🌐", logoColor: "#F0846D", desc: "Traducción de alta calidad. Matices culturales, no traducción literal." },
      ]}
      agenda={[
        { time: "0:00 - 0:15", title: "Recap Día 1 + top 3 cohorte", description: "Revisamos los mejores proyectos del Día 1. Aprendemos de los aciertos." },
        { time: "0:15 - 0:40", title: "ElevenLabs — clona tu voz", description: "Grabas 30 segundos hablando. En 2 minutos tu voz habla japonés, mandarín, árabe, alemán y francés." },
        { time: "0:40 - 1:15", title: "HeyGen — tu avatar presentador", description: "Avatar con tu cara habla esos 5 idiomas con labios sincronizados. Uso para presentaciones profesionales." },
        { time: "1:15 - 1:30", title: "Competencia cohorte", description: "Mejor 'yo hablando idiomas' se lleva puntos XP. Todos votan." },
        { time: "1:30 - 2:00", title: "Cómo funciona por detrás", description: "Explicación técnica básica: encoding de voz, transformers multilingües, cloning con pocas muestras." },
      ]}
      assignment="Crea un video de 1 minuto en TikTok/IG donde tu avatar se presenta a un familiar imaginario o real en un idioma que nunca has hablado. El mensaje debe ser emocional y real."
      deliverable="Video de 1 minuto con tu avatar hablando en otro idioma. Tag #Dia2 #ITSEIAIgnite en TikTok o Instagram."
      prevDay={{ num: 1, href: "/demo/aula/dia-1" }}
      nextDay={{ num: 3, href: "/demo/aula/dia-3" }}
    />
  );
}
