# BITACORA — Miercoles 1 Abril / Jueves 2 Abril 2026

## Resumen
Dia de charla en vivo + cierre de mejoras plataforma + reestructuracion sistema toques.

## Logros

### 1. CHARLA EN VIVO MIERCOLES 7PM
- 5 canales simultaneos (LinkedIn, TikTok, YouTube, Facebook, Kick)
- 5 asistentes en Google Meet
- 2 preguntas, todos dijeron "todo claro"
- OBS + Restream + sala de espera HTML funcionando

### 2. SISTEMA DE 8 TOQUES V2 — REHECHO COMPLETO
- Cada dia tiene 1 link unico (no se repite)
- MIE:itseia.ai | JUE:mallas | VIE:empresas | SAB:informacion | DOM:test | LUN:cursos | MAR:live | MIE AM:meet
- Acumulativo = todo lo que se perdio desde miercoles
- Individual = 1 link del dia
- Miercoles: individual = acumulativo (mismo mensaje)
- TOQUES_COPIAR_PEGAR.md reescrito completo
- Crons actualizados: 8AM individual + cada 2h revision inbox

### 3. LEADS
- Inicio dia: 113 → Final dia: 125 (+12 nuevos)
- Nuevos: Carlos Sanchez Mazzini, Henry Paladinez, Bolivar Loayza, Anderson David, Cesar, Nancy Balarezo, Lorena Valencia, Lucia Piaun, Lex Frank Brunett Plua, Miguel, + 2 mas
- T8 recordatorio enviado a 113 leads (5AM)
- T1 enviado a todos los nuevos
- Script enviar_toques.js sincroniza inbox automaticamente

### 4. PRESENTACION MIERCOLES V3 — PREUNI FIRST
- Presentacion rehecha: preuniversitario es el producto principal
- $180 reserva (NUNCA $399 solo)
- Camino: Preuni → Carrera (no Semestre 1 primero)
- 8 archivos de presentacion actualizados con pricing correcto
- Sin notas del presentador (solo "Demo 1", "Demo 2")

### 5. PROPUESTA JULIO CRUZ B2B
- Email + propuesta completa redactados
- 8 secciones: resumen, programa detallado, que recibe, calendario, inversion, garantia
- $1,250 (5 personas x $250)
- Pendiente: CEO debe enviar

### 6. HEADER SESION ARREGLADO
- Breadcrumb y titulo ya no se amontonan
- 2 lineas separadas: breadcrumb arriba, titulo + sesion abajo
- Desplegado en produccion

### 7. ASISTENTES OPENAI CREADOS (noche anterior)
- 6 tutores IA con conocimiento completo por modulo
- API route /api/ai/assistant funcionando
- Pendiente: conectar al frontend

## Pendientes

### Hoy jueves 2 abril
- [ ] Live 7PM "Canva IA — Post Instagram en 47 segundos" (LIVE 9 del plan)
- [ ] Subir video hook #3 para promocionar el live
- [ ] Enviar propuesta Julio Cruz (CEO decide)
- [ ] T2 individual 8AM (mallas) — cron automatico

### Esta semana
- [ ] Conectar Asistentes OpenAI al frontend (ChatPanel → /api/ai/assistant)
- [ ] Presentaciones Gamma para M01, M02, M03
- [ ] M01 Carreras: mas quizzes (354 de 1958 sesiones)
- [ ] Diferenciar contenido Express vs Estandar vs Completo
- [ ] Cargar credito OpenRouter cuando se agoten $10

### Metricas del dia
- Leads: 125 (+12)
- Charla: 5 asistentes
- Plataforma: 98% promedio (7 modulos)
- Deploys: 3
- Operaciones Supabase: ~200 (contenido + fixes)
