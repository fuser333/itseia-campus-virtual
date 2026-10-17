# ARQUITECTURA MODERNA — ITSEIA vs El Resto
**Principio:** Somos un instituto de IA. La plataforma DEMUESTRA lo que ensenamos.

---

## COMO LO HACEN LOS DEMAS (anticuado)

| Requisito | Solucion tipica Ecuador | Costo | Problemas |
|-----------|------------------------|-------|-----------|
| LMS | Moodle autohosteado | $50-200/mes servidor | Lento, feo, requiere admin Linux |
| Video | Zoom separado + link manual | $150/mes por host | Desconectado del LMS, sin registro |
| Foros | Moodle forums | $0 (incluido) | Nadie los usa, UX terrible |
| Biblioteca | Contrato EBSCO $2K-5K/ano | $2K-5K/ano | Caro, contenido generico |
| Anti-fraude | Respondus LockDown | $5/alumno/ano | Intrusivo, problemas tecnicos |
| Calendario | Google Calendar aparte | $0 | Desconectado de todo |
| Total | | $5K-10K/ano + admin | Experiencia fragmentada |

---

## COMO LO HACE ITSEIA (2026 — IA-first)

| Requisito CES | Solucion ITSEIA | Tecnologia | Costo |
|---------------|-----------------|------------|-------|
| LMS completo | Next.js + Supabase (YA EXISTE) | Custom, 45 paginas | $12-95/mes |
| Videoconferencia | **Daily.co API** embebida | WebRTC, iframe en plataforma | $0 hasta 2K min/mes, luego $0.004/min |
| Grabacion | **Daily.co recording** automatica | Cloud recording, link en sesion | Incluido en plan |
| Asistencia | **Automatica** — la API registra quien entra/sale | Supabase + Daily webhooks | $0 |
| Foros | **Supabase Realtime** — foro en tiempo real | PostgreSQL + websockets | $0 (ya tenemos Supabase) |
| Biblioteca virtual | **OpenAlex + Scielo + arXiv APIs** (open access) | APIs gratuitas, busqueda por IA | $0 |
| Anti-fraude | **IA nativa** — randomizacion + timer + analisis patron | QuizEngine mejorado + Gemini | $0.01/evaluacion |
| Calendario | **Componente integrado** — vinculado a sesiones | React + Supabase | $0 |
| AI Lab | **Multi-modelo** — Gemini API + links ChatGPT/Claude | YA EXISTE | $12-50/mes |
| Proctoring basico | **Webcam snapshot** + IA verificacion | Browser API + Gemini Vision | $0.01/examen |
| LOPDP | **Consentimiento integrado** en registro | Checkbox + texto legal | $0 |
| Total | | | **$50-150/mes** |

---

## DIFERENCIADORES vs MOODLE+ZOOM

| Aspecto | Moodle+Zoom | ITSEIA Platform |
|---------|-------------|-----------------|
| UX | 2005 (botones grises, paginas lentas) | 2026 (Tailwind, animaciones, mobile-first) |
| IA | Ninguna | Tutor IA contextual, 4 herramientas externas |
| Video | Link externo, sale de la plataforma | Embebido, grabacion automatica, asistencia auto |
| Evaluacion | Quiz basico | IA anti-fraude, randomizacion, feedback IA |
| Foros | Nadie los usa (feos) | Real-time chat, notificaciones, gamificacion |
| Costo | $5K-10K/ano | $600-1.8K/ano |
| Admin | Necesita sysadmin Linux | Zero-ops (Vercel + Supabase managed) |
| Escalabilidad | Servidor se cae con 100 usuarios | CDN global, autoescala |

---

## DECISIONES ARQUITECTONICAS

### 1. Videoconferencia: Daily.co (NO Zoom, NO Meet)
**Por que:**
- API-first: se embebe en nuestra plataforma (iframe o WebRTC nativo)
- Grabacion cloud automatica
- Webhooks: nos notifica join/leave para asistencia automatica
- Free tier: 2,000 minutos/mes (suficiente para piloto)
- Alternativas: Whereby API, 100ms.live
- NO Zoom: requiere app externa, rompe la experiencia

### 2. Foros: Supabase Realtime (NO foro externo)
**Por que:**
- Ya tenemos Supabase
- Realtime channels = chat en vivo por materia
- PostgreSQL = persistencia, busqueda, moderacion
- Cero costo adicional
- UX moderna (tipo Slack/Discord, no phpBB)

### 3. Biblioteca: APIs Open Access (NO contrato EBSCO)
**Por que:**
- OpenAlex: 250M+ papers, API gratuita, sin limite
- arXiv: papers IA/ML/CS gratuitos
- Scielo: papers latinoamericanos gratuitos
- Google Scholar: busqueda academica
- Componente de busqueda con IA que filtra por relevancia
- Costo: $0 vs $2K-5K/ano de EBSCO
- El CES dice "al menos UNA biblioteca virtual" — esto es mas de una

### 4. Anti-fraude: IA nativa (NO Respondus)
**Por que:**
- Randomizacion de preguntas (ya tenemos quiz engine)
- Timer estricto con auto-submit
- Banco de preguntas rotativas por sesion
- Analisis de patron de respuesta con Gemini (tiempo entre clicks, patron sospechoso)
- Webcam snapshot opcional con Gemini Vision (verifica identidad)
- Costo: $0.01/examen vs $5/alumno/ano de Respondus

### 5. Calendario: Componente React integrado (NO Google Calendar externo)
**Por que:**
- Vinculado directamente a sesiones de la BD
- Muestra sesiones sincronicas, deadlines, tutorias
- Notificaciones en plataforma
- Un componente mas, cero costo

### 6. LOPDP: Integrado en registro (NO documento suelto)
**Por que:**
- Checkbox de consentimiento en el formulario de registro
- Pagina /privacidad con politica completa
- Link "Mis datos" en perfil del alumno
- Exportar/eliminar datos del alumno desde admin

---

## LO QUE SE CONSERVA DEL CODIGO ACTUAL

| Componente | Conservar | Motivo |
|------------|-----------|--------|
| Auth (Supabase) | SI | Funciona, roles implementados |
| Dashboard alumno | SI | Base funcional, mejorar UX |
| 7 tabs sesion | SI | Estructura correcta, agregar Daily.co |
| QuizEngine | SI | Mejorar con anti-fraude |
| Panel docente | SI | Base funcional |
| Panel admin | SI | Base funcional |
| AI Lab | SI | Diferenciador, ya tiene multi-herramienta |
| PayPal | SI | Funciona en sandbox |
| Gamificacion XP | SI | Diferenciador |
| Certificados PDF | SI | Existe, verificar QR |

## LO QUE SE DESCARTA

| Componente | Descartar | Motivo |
|------------|-----------|--------|
| Sistema V1 (courses/modules/lessons) | SI | Duplica V3, confunde |
| Landing pages /preuniversitario /bootcamp | REEMPLAZAR | Deben ser navegables, no landing |
| Contenido basico (1200 chars teoria) | REESCRIBIR | Insuficiente, necesita 65% practico |

## LO QUE SE AGREGA (nuevos modulos)

| Modulo | Prioridad | Para CES |
|--------|-----------|----------|
| Daily.co videoconferencia | P0 | 51% sincronico |
| Foro por materia (Realtime) | P0 | Interaccion asincronica |
| Biblioteca virtual (OpenAlex+Scielo+arXiv) | P0 | Requisito Art. 61 |
| Anti-fraude evaluaciones | P1 | Requisito Art. 62 |
| Calendario academico | P1 | Planificacion sincronico |
| Registro asistencia automatico | P1 | Evidencia 51% |
| Politica LOPDP | P1 | Legal obligatorio |
| Reportes exportables SENESCYT | P2 | Informes regulatorios |
| Proctoring IA basico | P2 | Diferenciador |

---

*Documento creado: 22 marzo 2026*
*Decision: CTO ITSEIA Academy*
