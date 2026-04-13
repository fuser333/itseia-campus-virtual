import LessonLayout from "../_components/LessonLayout";

export default function Dia1Page() {
  return (
    <LessonLayout
      dayNum={1}
      weekName="Semana 1 · Ignición"
      title="Hoy hago una IA que habla como yo"
      subtitle="Tu primera sesión. Canción propia, avatar anime, app funcional. Todo en las primeras 2 horas del programa."
      duration="2h clase en vivo + 1h proyecto autónomo"
      emotionalGoal="Wow absoluto. La prueba de que la IA es accesible, divertida y tuya. No es del futuro — es de hoy."
      technicalGoal="Entender el ciclo prompt → salida. Aprender a describir lo que quieres con palabras y obtener un resultado."
      tools={[
        { name: "Suno v5", emoji: "🎵", logoColor: "#FBBC0C", desc: "Genera canciones completas con letra, vocales y música desde una descripción en texto." },
        { name: "Midjourney v7", emoji: "🎨", logoColor: "#73B8E7", desc: "Imágenes de calidad profesional desde un prompt. Crea tu avatar anime." },
        { name: "Lovable", emoji: "💻", logoColor: "#F0846D", desc: "Describe tu app ideal en una frase. Te devuelve un sitio web funcional con código real." },
      ]}
      agenda={[
        { time: "0:00 - 0:05", title: "Bienvenida de Héctor", description: "Reto del día: al final de esta clase tienes 3 cosas publicadas en redes con tu nombre." },
        { time: "0:05 - 0:20", title: "Suno — tu primera canción", description: "Creamos una canción de 2 minutos con tu ciudad y tu género musical favorito. La subes a TikTok." },
        { time: "0:20 - 0:45", title: "Midjourney — tu avatar", description: "Te conviertes en personaje de anime o cyberpunk con tu nombre. Se lo mandas a tu mamá. Se lo subes a Instagram." },
        { time: "0:45 - 1:15", title: "Lovable — tu primera app", description: "Describe en una frase una app que te gustaría usar. En 30 minutos tienes un link funcional que tus amigos visitan." },
        { time: "1:15 - 1:30", title: "Muestra en cohorte", description: "Presentas tus 3 proyectos en el chat. La cohorte vota los top 3." },
        { time: "1:30 - 2:00", title: "Q&A + bienvenida oficial", description: "Respondo dudas. Te digo cómo se ve el resto del programa. Bienvenida a IGNITE." },
      ]}
      assignment="Publica tus 3 proyectos en redes sociales con los hashtags #ITSEIAIgnite y #Dia1. Graba un video de 30 segundos mostrando los 3. Si tienes tiempo, prueba otra canción con otro género musical."
      deliverable="Video TikTok o Reel IG de 30 segundos mostrando canción + avatar + app funcional. Comparte el link en el foro del día."
      videoEmbed="https://www.youtube.com/embed/sGuPsEOznug"
      nextDay={{ num: 2, href: "/demo/aula/dia-2" }}
    />
  );
}
