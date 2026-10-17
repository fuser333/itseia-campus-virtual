# Ejercicio Sesion 8: Proyecto — Construir un Asistente IA para Profesion Ecuatoriana

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** OpenAI API + Anthropic API (a eleccion del estudiante)
**Duracion:** 60 min

## Objetivo

Integrar todas las tecnicas aprendidas en el modulo (APIs, prompt engineering avanzado, agentes, multimodal) para construir un asistente de IA completo, funcional y orientado a una profesion especifica del mercado ecuatoriano, con deployment real accesible por URL.

## Contexto (Ecuador)

Ecuador tiene sectores donde la adopcion de IA es casi nula pero el impacto seria inmediato: abogados que redactan contratos manualmente, contadores que calculan nomina en Excel, medicos que buscan interacciones de farmacos en libros fisicos. El asistente que construyas hoy podria ser el MVP de un producto real. De hecho, cada estudiante de este periodo tiene el nivel tecnico para vender este asistente a empresas ecuatorianas a $50-200/mes.

## Instrucciones

### Parte 1 — Seleccion y diseño del asistente (10 min)

Elige UNA de estas 5 profesiones para tu asistente (o propone una alternativa justificada):

**Opcion A — AsesorLegal:** Asistente para abogados ecuatorianos
- Consulta articulos del COGEP, Codigo Penal, Codigo Civil
- Redacta cartas legales formales
- Resume jurisprudencia

**Opcion B — ContaBot:** Asistente para contadores y tributaristas
- Calcula impuestos segun normativa SRI
- Interpreta formularios 102, 104, 101
- Responde preguntas sobre NIIF y NEC

**Opcion C — MedicoAsistente:** Asistente para profesionales de salud
- Interacciones de farmacos comunes en Ecuador
- Protocolos MSP para enfermedades prevalentes
- Redaccion de informes medicos

**Opcion D — AgroBot:** Asistente para agro-exportadores
- Precios actuales de commodities (banano, cacao, flores)
- Requisitos fitosanitarios para exportacion
- Calculo de costos de logistica maritima

**Opcion E — DocenteIA:** Asistente para profesores de bachillerato
- Genera planes de clase segun curriculum ecuatoriano
- Crea evaluaciones alineadas a estandares MINEDUC
- Adapta contenido a diferentes niveles de aprendizaje

Completa esta ficha de diseño antes de escribir codigo:

```
NOMBRE DEL ASISTENTE: _______________
PROFESION TARGET: _______________
PERSONA PRINCIPAL: [describe al usuario tipico: edad, ciudad, problema diario]
3 TAREAS QUE RESUELVE:
  1. _______________
  2. _______________
  3. _______________
HERRAMIENTAS QUE NECESITA: [busqueda web? calculadora? base de conocimiento?]
LIMITACIONES A COMUNICAR AL USUARIO: _______________
MODELO ELEGIDO Y JUSTIFICACION: _______________
```

### Parte 2 — Implementacion core (30 min)

Implementa el asistente con al menos estas 4 capacidades:

```python
import os
import json
from anthropic import Anthropic
from datetime import datetime
from pathlib import Path

# ============================================================
# CONFIGURACION DEL ASISTENTE
# Cambia estos valores segun tu profesion elegida
# ============================================================
NOMBRE_ASISTENTE = "ContaBot"
PROFESION = "contador tributarista ecuatoriano"
VERSION = "1.0.0"

SYSTEM_PROMPT = """
Eres ContaBot, el asistente especializado para contadores y tributaristas ecuatorianos.

IDENTIDAD:
- Nombre: ContaBot
- Especialidad: Tributacion ecuatoriana, NIIF, nomina y contabilidad de costos
- Actualizacion: Normativa SRI vigente 2025

CAPACIDADES CORE:
1. Responder preguntas sobre declaraciones SRI (102, 104, 101, ATS)
2. Calcular impuesto a la renta personas naturales y sociedades
3. Interpretar normativas NIIF y NEC aplicables en Ecuador
4. Explicar procedimientos de retenciones en la fuente (IVA e IR)
5. Orientar sobre regimen RIMPE (emprendedor y negocio popular)

TONO:
- Preciso y sin ambiguedades en datos numericos
- Cita siempre el numero de ley/resolucion cuando sea posible
- Advierte cuando una situacion requiere criterio profesional adicional
- Usa terminologia tecnica contable pero explica cuando sea necesario

LIMITACIONES:
- No das criterios vinculantes (solo orientacion tecnica)
- No tienes acceso a sistemas del SRI en tiempo real
- Para situaciones complejas de evasion/elusion, recomienda abogado tributarista
- Tu conocimiento tiene fecha de corte, verificar resoluciones recientes

FORMATO DE RESPUESTA:
- Respuesta directa primero (1-2 oraciones)
- Sustento legal o tecnico
- Ejemplo practico si aplica
- Alerta o nota importante si corresponde
"""

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class AsistenteIA:
    def __init__(self):
        self.historial = []
        self.sesion_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.consultas_realizadas = 0

    def consultar(self, pregunta: str) -> str:
        """Procesa una consulta del usuario manteniendo historial."""
        self.historial.append({
            "role": "user",
            "content": pregunta
        })

        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=800,
            system=SYSTEM_PROMPT,
            messages=self.historial
        )

        respuesta = response.content[0].text

        self.historial.append({
            "role": "assistant",
            "content": respuesta
        })

        self.consultas_realizadas += 1
        return respuesta

    def generar_resumen_sesion(self) -> str:
        """Genera un resumen de la sesion para el usuario."""
        if not self.historial:
            return "No se realizaron consultas en esta sesion."

        preguntas = [
            msg["content"][:80] + "..."
            for msg in self.historial
            if msg["role"] == "user"
        ]

        resumen_prompt = (
            f"Genera un resumen ejecutivo de esta sesion de asesoria con {NOMBRE_ASISTENTE}. "
            f"Se realizaron {self.consultas_realizadas} consultas. "
            f"Temas tratados: {', '.join(preguntas[:5])}. "
            f"Formato: bullet points, maximo 150 palabras."
        )

        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            messages=[{"role": "user", "content": resumen_prompt}]
        )
        return response.content[0].text

    def guardar_sesion(self):
        """Guarda el historial de la sesion en un archivo JSON."""
        log_dir = Path("logs_asistente")
        log_dir.mkdir(exist_ok=True)

        archivo = log_dir / f"sesion_{self.sesion_id}.json"
        datos = {
            "asistente": NOMBRE_ASISTENTE,
            "version": VERSION,
            "fecha": datetime.now().isoformat(),
            "consultas": self.consultas_realizadas,
            "historial": self.historial,
            "resumen": self.generar_resumen_sesion()
        }

        with open(archivo, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False, indent=2)

        print(f"\nSesion guardada en: {archivo}")
        return str(archivo)


# Interface de linea de comandos
def main():
    print(f"\n{'='*60}")
    print(f"  {NOMBRE_ASISTENTE} v{VERSION}")
    print(f"  Asistente para {PROFESION}")
    print(f"  Escribe 'salir' para terminar | 'resumen' para ver resumen")
    print(f"{'='*60}\n")

    asistente = AsistenteIA()

    # Preguntas de demo para probar el asistente
    preguntas_demo = [
        "Cuanto es el impuesto a la renta para una persona natural con ingresos de $36,000 anuales en 2025?",
        "Cuando vence la declaracion del IVA para contribuyentes con RUC terminado en 5?",
        "Que es el RIMPE y quienes pueden acogerse a ese regimen?",
    ]

    print("MODO DEMO — Ejecutando 3 consultas predefinidas:\n")
    for pregunta in preguntas_demo:
        print(f"Usuario: {pregunta}")
        respuesta = asistente.consultar(pregunta)
        print(f"\n{NOMBRE_ASISTENTE}: {respuesta}\n")
        print("-" * 40 + "\n")

    print("\nMODO INTERACTIVO — Ahora es tu turno:\n")
    while True:
        entrada = input("Tu consulta: ").strip()
        if not entrada:
            continue
        if entrada.lower() == "salir":
            asistente.guardar_sesion()
            break
        if entrada.lower() == "resumen":
            print(f"\nRESUMEN DE SESION:\n{asistente.generar_resumen_sesion()}\n")
            continue

        respuesta = asistente.consultar(entrada)
        print(f"\n{NOMBRE_ASISTENTE}: {respuesta}\n")

if __name__ == "__main__":
    main()
```

### Parte 3 — Interface web con Streamlit (15 min)

Convierte el asistente en una aplicacion web:

```python
# app_asistente.py
import streamlit as st
import os
from anthropic import Anthropic

st.set_page_config(
    page_title=f"{NOMBRE_ASISTENTE} - ITSEIA",
    page_icon="🤖",
    layout="centered"
)

st.title(f"{NOMBRE_ASISTENTE}")
st.caption(f"Asistente IA para {PROFESION} | Desarrollado en ITSEIA")

# Inicializar estado
if "historial" not in st.session_state:
    st.session_state.historial = []
if "consultas" not in st.session_state:
    st.session_state.consultas = 0

# Sidebar con informacion
with st.sidebar:
    st.header("Acerca de")
    st.write(f"**Modelo:** Claude 3.5 Sonnet")
    st.write(f"**Consultas en esta sesion:** {st.session_state.consultas}")
    if st.button("Limpiar historial"):
        st.session_state.historial = []
        st.session_state.consultas = 0
        st.rerun()

# Mostrar historial de chat
for msg in st.session_state.historial:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# Input del usuario
if pregunta := st.chat_input("Escribe tu consulta..."):
    # Mostrar mensaje del usuario
    with st.chat_message("user"):
        st.write(pregunta)
    st.session_state.historial.append({"role": "user", "content": pregunta})

    # Generar respuesta
    with st.chat_message("assistant"):
        with st.spinner("Consultando..."):
            client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=800,
                system=SYSTEM_PROMPT,
                messages=st.session_state.historial
            )
            respuesta = response.content[0].text
            st.write(respuesta)

    st.session_state.historial.append({"role": "assistant", "content": respuesta})
    st.session_state.consultas += 1
```

Ejecuta con: `streamlit run app_asistente.py`

### Parte 4 — Documentacion y entrega (5 min)

Crea un archivo `README.md` con:
1. Nombre y descripcion del asistente
2. Profesion target y 3 casos de uso principales
3. Instrucciones de instalacion (pip install, .env)
4. Captura de pantalla de una conversacion real
5. Limitaciones conocidas
6. Posible modelo de negocio (precio, mercado target en Ecuador)

## Usa IA para...

- Pedirle a Claude que critique tu system prompt y sugiera mejoras especificas.
- Pedirle que genere 10 preguntas de prueba que un usuario real de tu profesion target haria.
- Preguntarle como escalar este asistente de MVP a producto de pago (autenticacion, limites de uso, facturacion).

## Que aprendiste

- Como integrar todas las tecnicas del modulo (APIs, prompts, historial, UI) en un producto funcional.
- Que un asistente de IA con buen system prompt puede generar valor real para una profesion especifica.
- La diferencia entre un MVP (lo que construiste hoy) y un producto de produccion (autenticacion, base de datos, monitoring).
- Como estimar el modelo de negocio: costo de API por usuario/mes vs precio de suscripcion viable.

## Reto extra

Agrega a tu asistente una funcionalidad de busqueda con RAG (Retrieval Augmented Generation): descarga el PDF de algun reglamento o ley ecuatoriana relevante para tu profesion, indexalo en una base vectorial (ChromaDB o FAISS), y haz que el asistente busque en ese documento antes de responder preguntas especificas. Compara la precision de las respuestas con y sin RAG usando 10 preguntas de prueba.
