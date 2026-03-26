# Ejercicio Sesion 5: Data Stewardship

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Disenar e implementar un programa de Data Stewardship para el IESS Ecuador: definir roles y responsabilidades de data stewards por dominio, construir el sistema de gestion de issues de calidad de datos, implementar el flujo de aprobacion de cambios al modelo de datos, y medir la productividad del programa — siguiendo el framework DAMA-DMBOK y la normativa del Ministerio de Finanzas del Ecuador.

## Contexto

El IESS administra datos de 4.2 millones de afiliados activos, 650,000 jubilados, 12,000 empleadores y 22 hospitales. Sin data stewards definidos, cuando se detecta un error (por ejemplo: 15,000 afiliados con cedula duplicada) nadie sabe quien es el responsable de corregirlo. El primer ano del programa de Data Stewardship del IESS redujo en 67% los issues criticos sin resolver. Esta es la diferencia entre tener datos y gobernar datos.

## Instrucciones

1. Crea el archivo `sesion05_data_stewardship_iess.py`:

```python
# Data Stewardship - ITSEIA
# Gobierno de Datos y Cumplimiento
# IESS Ecuador — programa de stewardship

import json
import uuid
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from collections import defaultdict, deque
from enum import Enum
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("DATA STEWARDSHIP — IESS ECUADOR")
print("4.2M afiliados | 650K jubilados | 22 hospitales")
print("=" * 65)

# ================================================
# DOMINIOS DE DATOS Y STEWARDS
# ================================================
print("\n--- DOMINIOS DE DATOS IESS ---")

class DominiosDatos:
    """Catalogo de dominios de datos del IESS con sus stewards."""

    DOMINIOS = {
        "Afiliados": {
            "descripcion":    "Datos de personas afiliadas activas al IESS",
            "steward_lider":  "Jefa Nacional de Afiliacion",
            "stewards_zona":  ["Coord. Pichincha", "Coord. Guayas", "Coord. Azuay",
                               "Coord. Manabi", "Coord. Tungurahua"],
            "datasets":       ["afiliados_activos", "historico_aportes", "empleadores"],
            "registros_est":  4_200_000,
            "criticidad":     "ALTA",
            "sla_calidad":    0.98,
        },
        "Prestaciones": {
            "descripcion":    "Jubilaciones, pensiones, subsidios y beneficios",
            "steward_lider":  "Director de Prestaciones Economicas",
            "stewards_zona":  ["Analista Jubilaciones", "Analista Montepios",
                               "Analista Subsidios", "Analista Prestamos"],
            "datasets":       ["jubilados", "pensiones_vejez", "prestamos_quirografarios",
                               "subsidios_enfermedad"],
            "registros_est":  850_000,
            "criticidad":     "ALTA",
            "sla_calidad":    0.99,
        },
        "Salud": {
            "descripcion":    "Historia clinica, citas, hospitalizaciones, medicamentos",
            "steward_lider":  "Director Medico Nacional IESS",
            "stewards_zona":  ["Steward HCU", "Steward Farmacia", "Steward Imagenologia",
                               "Steward UCI"],
            "datasets":       ["historia_clinica", "citas_medicas", "dispensacion_farmacias",
                               "hospitalizaciones"],
            "registros_est":  18_000_000,
            "criticidad":     "CRITICA",
            "sla_calidad":    0.995,
        },
        "Financiero": {
            "descripcion":    "Aportes, recaudacion, inversiones, contabilidad",
            "steward_lider":  "Director Financiero IESS",
            "stewards_zona":  ["Steward Recaudacion", "Steward Inversiones",
                               "Steward Contabilidad"],
            "datasets":       ["recaudacion_aportes", "inversiones_fondos",
                               "balance_actuarial", "pagos_prestaciones"],
            "registros_est":  2_400_000,
            "criticidad":     "CRITICA",
            "sla_calidad":    0.999,
        },
        "Empleadores": {
            "descripcion":    "Empresas y personas naturales que aportan al IESS",
            "steward_lider":  "Jefa de Control Patronal",
            "stewards_zona":  ["Steward PYMES", "Steward Grandes Empresas",
                               "Steward Sector Publico"],
            "datasets":       ["empleadores_activos", "nominas_reportadas",
                               "deudas_patronales"],
            "registros_est":  120_000,
            "criticidad":     "ALTA",
            "sla_calidad":    0.97,
        },
    }

    def resumen(self):
        total_registros = sum(d["registros_est"] for d in self.DOMINIOS.values())
        print(f"\n  {'Dominio':<16} {'Criticidad':<12} {'Registros':>12} {'SLA':>8} {'Steward Lider'}")
        print(f"  {'-'*72}")
        for dominio, info in self.DOMINIOS.items():
            print(f"  {dominio:<16} {info['criticidad']:<12} "
                  f"{info['registros_est']:>12,} {info['sla_calidad']:>8.1%} "
                  f"{info['steward_lider'][:30]}")
        print(f"\n  Total registros bajo gobierno: {total_registros:,}")
        print(f"  Total data stewards:           {sum(1+len(d['stewards_zona']) for d in self.DOMINIOS.values())}")

dominios = DominiosDatos()
dominios.resumen()

# ================================================
# SISTEMA DE GESTION DE ISSUES
# ================================================
print("\n--- SISTEMA DE GESTION DE ISSUES ---")

class Severidad(Enum):
    BAJA     = 1
    MEDIA    = 2
    ALTA     = 3
    CRITICA  = 4

class EstadoIssue(Enum):
    NUEVO       = "NUEVO"
    ASIGNADO    = "ASIGNADO"
    EN_PROCESO  = "EN_PROCESO"
    PENDIENTE   = "PENDIENTE_VALIDACION"
    RESUELTO    = "RESUELTO"
    CERRADO     = "CERRADO"
    RECHAZADO   = "RECHAZADO"

class IssueCalidad:
    """Issue de calidad de datos en el sistema IESS."""

    SLA_RESOLUCION = {
        Severidad.CRITICA: 4,    # horas
        Severidad.ALTA:    24,   # horas
        Severidad.MEDIA:   72,   # horas
        Severidad.BAJA:    168,  # horas (1 semana)
    }

    def __init__(self, titulo, dominio, severidad, descripcion,
                 registros_afectados, detectado_por):
        self.id              = f"IQ-{uuid.uuid4().hex[:6].upper()}"
        self.titulo          = titulo
        self.dominio         = dominio
        self.severidad       = severidad
        self.descripcion     = descripcion
        self.registros_afect = registros_afectados
        self.detectado_por   = detectado_por
        self.estado          = EstadoIssue.NUEVO
        self.asignado_a      = None
        self.fecha_creacion  = datetime.now()
        self.fecha_limite    = self.fecha_creacion + timedelta(
                                   hours=self.SLA_RESOLUCION[severidad])
        self.historial       = [(datetime.now(), "SISTEMA",
                                 f"Issue creado — {registros_afectados} registros afectados")]
        self.costo_estimado  = self._estimar_costo()

    def _estimar_costo(self):
        """Estima costo del issue en USD basado en registros y severidad."""
        costo_por_registro = {
            Severidad.CRITICA: 5.00,
            Severidad.ALTA:    1.50,
            Severidad.MEDIA:   0.50,
            Severidad.BAJA:    0.10,
        }
        return self.registros_afect * costo_por_registro[self.severidad]

    def asignar(self, steward):
        self.asignado_a = steward
        self.estado     = EstadoIssue.ASIGNADO
        self.historial.append((datetime.now(), "SISTEMA",
                               f"Asignado a {steward}"))

    def actualizar_estado(self, nuevo_estado, actor, comentario):
        self.estado = nuevo_estado
        self.historial.append((datetime.now(), actor, comentario))

    def esta_vencido(self):
        return datetime.now() > self.fecha_limite and \
               self.estado not in [EstadoIssue.RESUELTO, EstadoIssue.CERRADO]

    def horas_restantes(self):
        delta = self.fecha_limite - datetime.now()
        return max(0, delta.total_seconds() / 3600)

    def resumen(self):
        vencido = " [VENCIDO]" if self.esta_vencido() else ""
        print(f"  [{self.id}] {self.titulo[:45]}")
        print(f"    Dominio:   {self.dominio} | Severidad: {self.severidad.name}{vencido}")
        print(f"    Estado:    {self.estado.value} | Asignado: {self.asignado_a or 'Sin asignar'}")
        print(f"    Afectados: {self.registros_afect:,} | Costo est: ${self.costo_estimado:,.2f}")
        print(f"    SLA:       {self.horas_restantes():.0f}h restantes")


class GestorIssues:
    """Sistema central de gestion de issues de calidad IESS."""

    def __init__(self):
        self.issues       = {}
        self.por_dominio  = defaultdict(list)
        self.por_steward  = defaultdict(list)

    def registrar(self, issue):
        self.issues[issue.id] = issue
        self.por_dominio[issue.dominio].append(issue.id)
        return issue.id

    def asignar_automatico(self, issue_id):
        """Asigna issue al steward lider del dominio."""
        issue = self.issues[issue_id]
        steward = DominiosDatos.DOMINIOS[issue.dominio]["steward_lider"]
        issue.asignar(steward)
        self.por_steward[steward].append(issue_id)
        return steward

    def dashboard(self):
        total    = len(self.issues)
        abiertos = sum(1 for i in self.issues.values()
                       if i.estado not in [EstadoIssue.RESUELTO, EstadoIssue.CERRADO])
        vencidos = sum(1 for i in self.issues.values() if i.esta_vencido())
        criticos = sum(1 for i in self.issues.values()
                       if i.severidad == Severidad.CRITICA and
                       i.estado not in [EstadoIssue.RESUELTO, EstadoIssue.CERRADO])
        costo_total = sum(i.costo_estimado for i in self.issues.values())

        print(f"\n  === DASHBOARD ISSUES IESS ===")
        print(f"  Total issues:    {total:>6}")
        print(f"  Abiertos:        {abiertos:>6}")
        print(f"  Vencidos SLA:    {vencidos:>6}")
        print(f"  Criticos activos:{criticos:>6}")
        print(f"  Costo total est: ${costo_total:>10,.2f}")

        print(f"\n  Por dominio:")
        for dominio, ids in self.por_dominio.items():
            activos = sum(1 for i in ids
                          if self.issues[i].estado not in
                          [EstadoIssue.RESUELTO, EstadoIssue.CERRADO])
            print(f"    {dominio:<16}: {len(ids):>3} total, {activos:>3} activos")


# Simular issues reales del IESS
gestor = GestorIssues()

issues_simulados = [
    IssueCalidad(
        "Cedulas duplicadas en padron afiliados",
        "Afiliados", Severidad.CRITICA,
        "15,234 afiliados con cedula registrada en 2 o mas cuentas distintas — "
        "afecta calculo de aportes y acceso a prestaciones",
        15_234, "Sistema de Auditoria Automatica"
    ),
    IssueCalidad(
        "Fechas nacimiento inconsistentes jubilados",
        "Prestaciones", Severidad.ALTA,
        "3,456 jubilados con fecha nacimiento futura o antes de 1900 — "
        "impide calculo correcto de edad de jubilacion",
        3_456, "Auditoria Interna"
    ),
    IssueCalidad(
        "Diagnosticos HCU sin codigo CIE-10 valido",
        "Salud", Severidad.ALTA,
        "89,123 registros de historia clinica con codigo diagnostico no estandarizado — "
        "impide reportes epidemiologicos al MSP",
        89_123, "Departamento de Estadisticas Medicas"
    ),
    IssueCalidad(
        "Aportes patronales sin RUC validado",
        "Empleadores", Severidad.MEDIA,
        "1,234 planillas con RUC de empleador no existente en SRI — "
        "posible evasion o error de digitacion",
        1_234, "Unidad de Control Patronal"
    ),
    IssueCalidad(
        "Montos prestaciones con precision incorrecta",
        "Financiero", Severidad.BAJA,
        "23,456 registros de pagos con montos redondeados a entero en vez de 2 decimales",
        23_456, "Auditoria Financiera"
    ),
    IssueCalidad(
        "Telefonos contacto sin formato estandar",
        "Afiliados", Severidad.BAJA,
        "156,789 afiliados con telefono sin prefijo pais ni formato E.164",
        156_789, "Validacion Automatica"
    ),
]

for issue in issues_simulados:
    iid = gestor.registrar(issue)
    gestor.asignar_automatico(iid)

# Simular progreso en algunos issues
lista_issues = list(gestor.issues.values())
lista_issues[0].actualizar_estado(EstadoIssue.EN_PROCESO,
    "Jefa Nacional de Afiliacion",
    "Ejecutando query de deduplicacion — 8,500 cedulas ya normalizadas")
lista_issues[1].actualizar_estado(EstadoIssue.RESUELTO,
    "Director de Prestaciones",
    "Corregidos via cruce con Registro Civil — issue cerrado")
lista_issues[2].actualizar_estado(EstadoIssue.ASIGNADO,
    "Director Medico Nacional IESS",
    "Planificando taller con medicos para estandarizacion CIE-10")

print(f"\n  Issues registrados y asignados:")
for issue in lista_issues:
    issue.resumen()
    print()

gestor.dashboard()

# ================================================
# FLUJO DE APROBACION DE CAMBIOS AL MODELO
# ================================================
print("\n--- FLUJO DE APROBACION: CAMBIOS AL MODELO DE DATOS ---")

class TipoCambio(Enum):
    NUEVA_COLUMNA   = "Nueva columna"
    MODIFICAR_TIPO  = "Modificar tipo dato"
    ELIMINAR_CAMPO  = "Eliminar campo"
    NUEVA_TABLA     = "Nueva tabla"
    MODIFICAR_TABLA = "Modificar tabla existente"
    NUEVO_INDICE    = "Nuevo indice"

class NivelAprobacion(Enum):
    DATA_STEWARD    = 1   # cambios menores
    CDO             = 2   # cambios moderados
    COMITE_DATOS    = 3   # cambios criticos o estructurales

class SolicitudCambio:
    """Solicitud de cambio al modelo de datos IESS (Data Change Request)."""

    NIVEL_REQUERIDO = {
        TipoCambio.NUEVO_INDICE:    NivelAprobacion.DATA_STEWARD,
        TipoCambio.NUEVA_COLUMNA:   NivelAprobacion.DATA_STEWARD,
        TipoCambio.MODIFICAR_TIPO:  NivelAprobacion.CDO,
        TipoCambio.NUEVA_TABLA:     NivelAprobacion.CDO,
        TipoCambio.MODIFICAR_TABLA: NivelAprobacion.COMITE_DATOS,
        TipoCambio.ELIMINAR_CAMPO:  NivelAprobacion.COMITE_DATOS,
    }

    def __init__(self, titulo, tipo, tabla, solicitante, justificacion, impacto):
        self.id           = f"DCR-{uuid.uuid4().hex[:6].upper()}"
        self.titulo       = titulo
        self.tipo         = tipo
        self.tabla        = tabla
        self.solicitante  = solicitante
        self.justificacion= justificacion
        self.impacto      = impacto
        self.nivel        = self.NIVEL_REQUERIDO[tipo]
        self.aprobaciones = []
        self.estado       = "PENDIENTE"
        self.fecha        = datetime.now()

    def aprobar(self, aprobador, comentario=""):
        self.aprobaciones.append({
            "aprobador":  aprobador,
            "comentario": comentario,
            "fecha":      datetime.now().strftime("%Y-%m-%d %H:%M"),
        })
        if len(self.aprobaciones) >= self.nivel.value:
            self.estado = "APROBADO"
        else:
            self.estado = f"APROBACION_PARCIAL ({len(self.aprobaciones)}/{self.nivel.value})"

    def rechazar(self, rechazador, motivo):
        self.estado = f"RECHAZADO por {rechazador}: {motivo}"

    def mostrar(self):
        print(f"  [{self.id}] {self.titulo}")
        print(f"    Tipo:    {self.tipo.value} | Tabla: {self.tabla}")
        print(f"    Nivel:   {self.nivel.name} ({self.nivel.value} aprobacion/es requerida/s)")
        print(f"    Estado:  {self.estado}")
        print(f"    Impacto: {self.impacto}")
        for a in self.aprobaciones:
            print(f"    OK:      {a['aprobador']} ({a['fecha']}) — {a['comentario']}")


dcrs = [
    SolicitudCambio(
        "Agregar campo es_extranjero a tabla afiliados_activos",
        TipoCambio.NUEVA_COLUMNA,
        "afiliados_activos",
        "Departamento de Afiliacion",
        "10% de nuevos afiliados son extranjeros con passaporte — campo cedula no aplica",
        "Requiere actualizar 3 formularios web y 2 APIs"
    ),
    SolicitudCambio(
        "Cambiar tipo monto_pension de DECIMAL(10,2) a DECIMAL(18,4)",
        TipoCambio.MODIFICAR_TIPO,
        "pensiones_vejez",
        "Direccion Financiera",
        "Precision insuficiente para calculos actuariales y ajustes por inflacion",
        "Impacta 12 reportes, requiere migracion de 650K registros"
    ),
    SolicitudCambio(
        "Eliminar campo codigo_postal obsoleto de tabla afiliados",
        TipoCambio.ELIMINAR_CAMPO,
        "afiliados_activos",
        "Arquitectura de Datos",
        "Campo no se usa desde 2018 — 98.7% nulos — genera confusion en nuevos desarrolladores",
        "Critico: verificar 45 sistemas que podrian leer el campo antes de eliminar"
    ),
]

# Procesar aprobaciones
dcrs[0].aprobar("Steward Afiliados Pichincha",
                "Validado — no rompe modelos ML existentes")
# DCR 0 aprobado con 1 (nivel DATA_STEWARD requiere 1)

dcrs[1].aprobar("CDO IESS",
                "Aprobado — coordinar con DBA para ventana de mantenimiento")
# DCR 1 aprobado (nivel CDO requiere 1? CDO.value = 2, asi que necesita 2)
# CDO = NivelAprobacion.CDO = 2, entonces necesita 2 aprobaciones
dcrs[1].aprobar("Director Financiero",
                "Confirmado impacto financiero — presupuesto asignado")

dcrs[2].aprobar("CDO IESS",
                "Primera aprobacion — requiere analisis impacto completo primero")
dcrs[2].rechazar("Comite de Datos",
                 "Falta inventario completo de sistemas dependientes — resubmit con analisis")

print(f"\n  Solicitudes de cambio procesadas:")
for dcr in dcrs:
    dcr.mostrar()
    print()

# ================================================
# KPIs DEL PROGRAMA DE STEWARDSHIP
# ================================================
print("\n--- KPIs PROGRAMA DATA STEWARDSHIP ---")

np.random.seed(42)
meses = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"]

# Simulacion de evolucion del programa a lo largo de 6 meses
issues_abiertos = [145, 128, 103, 87, 64, 48]  # tendencia descendente
issues_resueltos_mes = [0, 23, 31, 22, 27, 19]
tasa_sla = [0.61, 0.68, 0.74, 0.81, 0.87, 0.91]  # mejora mes a mes
score_calidad = [0.72, 0.74, 0.77, 0.82, 0.86, 0.89]
dcrs_aprobados = [4, 7, 9, 12, 11, 14]
tiempo_resolucion_h = [96, 84, 72, 58, 44, 38]  # horas promedio

df_kpis = pd.DataFrame({
    "Mes":                  meses,
    "Issues Abiertos":      issues_abiertos,
    "Resueltos en Mes":     issues_resueltos_mes,
    "SLA Cumplimiento %":   [f"{v:.0%}" for v in tasa_sla],
    "Score Calidad":        [f"{v:.2f}" for v in score_calidad],
    "DCRs Aprobados":       dcrs_aprobados,
    "Tiempo Resol (h)":     tiempo_resolucion_h,
})

print(f"\n  {df_kpis.to_string(index=False)}")

print(f"\n  Mejoras 6 meses:")
print(f"    Issues abiertos:    {issues_abiertos[0]} → {issues_abiertos[-1]} "
      f"(-{(1 - issues_abiertos[-1]/issues_abiertos[0]):.0%})")
print(f"    Cumplimiento SLA:   {tasa_sla[0]:.0%} → {tasa_sla[-1]:.0%} "
      f"(+{(tasa_sla[-1] - tasa_sla[0]):.0%} puntos)")
print(f"    Score calidad:      {score_calidad[0]:.2f} → {score_calidad[-1]:.2f}")
print(f"    Tiempo resolucion:  {tiempo_resolucion_h[0]}h → {tiempo_resolucion_h[-1]}h "
      f"(-{(1 - tiempo_resolucion_h[-1]/tiempo_resolucion_h[0]):.0%})")

# ================================================
# MATRIZ DE RESPONSABILIDADES RACI
# ================================================
print("\n--- MATRIZ RACI: PROCESO 'CORREGIR DATO AFILIADO' ---")

raci = {
    "Detectar error en dato":         {"Steward":  "R", "CDO":     "I", "DBA":      "C", "Solicitante": "I"},
    "Validar si es error real":       {"Steward":  "R", "CDO":     "C", "DBA":      "C", "Solicitante": "C"},
    "Registrar issue en sistema":     {"Steward":  "R", "CDO":     "A", "DBA":      "I", "Solicitante": "I"},
    "Diagnosticar causa raiz":        {"Steward":  "R", "CDO":     "C", "DBA":      "R", "Solicitante": "I"},
    "Aprobar correccion":             {"Steward":  "C", "CDO":     "A", "DBA":      "I", "Solicitante": "I"},
    "Ejecutar correccion en BD":      {"Steward":  "I", "CDO":     "I", "DBA":      "R", "Solicitante": "I"},
    "Validar correccion aplicada":    {"Steward":  "R", "CDO":     "A", "DBA":      "C", "Solicitante": "R"},
    "Cerrar issue y documentar":      {"Steward":  "R", "CDO":     "A", "DBA":      "I", "Solicitante": "I"},
    "Prevenir recurrencia":           {"Steward":  "R", "CDO":     "A", "DBA":      "R", "Solicitante": "I"},
}

roles = ["Steward", "CDO", "DBA", "Solicitante"]
print(f"\n  {'Actividad':<40} {'Steward':>8} {'CDO':>6} {'DBA':>6} {'Solicitante':>12}")
print(f"  {'-'*75}")
for actividad, asignaciones in raci.items():
    print(f"  {actividad:<40} "
          f"{'['+asignaciones['Steward']+']':>8} "
          f"{'['+asignaciones['CDO']+']':>6} "
          f"{'['+asignaciones['DBA']+']':>6} "
          f"{'['+asignaciones['Solicitante']+']':>12}")

print(f"\n  R=Responsible (ejecuta) | A=Accountable (responde) | C=Consulted | I=Informed")

print("\n" + "=" * 65)
print("DATA STEWARDSHIP — CONCEPTOS CLAVE:")
print("  Data Steward:   guardian del dominio — NO es TI, es negocio con datos")
print("  Issue tracking: registrar → asignar → resolver — trazabilidad completa")
print("  DCR:            todo cambio al modelo requiere aprobacion formal")
print("  RACI:           sin esta matriz nadie sabe quien decide ni quien actua")
print("  KPIs programa:  SLA cumplimiento + score calidad + issues abiertos")
print("  Dominios:       Afiliados / Prestaciones / Salud / Financiero / Empleadores")
print("=" * 65)
```

3. Implementa el sistema de notificaciones automaticas para escalamiento de issues vencidos: si un issue CRITICO lleva mas de 4 horas sin actualizacion, enviar alerta al CDO; si lleva 8 horas, escalar al Directorio del IESS con el costo acumulado calculado por hora.

4. Agrega el generador de reporte mensual de stewardship en formato ejecutivo: top 5 issues por costo, evolucion del score de calidad por dominio, stewards con mejor y peor desempeno, y recomendaciones para el proximo mes.

## Usa IA para...

> Abre Gemini y escribe:
> "Soy el CDO del IESS Ecuador. Acabamos de lanzar el programa de Data Stewardship con 18 data stewards distribuidos en 5 dominios. El problema: los stewards son tecnicos de TI que no conocen el negocio, o son expertos de negocio que no entienden de datos. ¿Como capacito en 3 meses a 18 personas para que puedan: 1) identificar y documentar issues de calidad de datos con criterios claros (no todo es un error critico), 2) tomar decisiones sobre datos sin necesitar aprobacion de TI para cada cosa, 3) defender la importancia de la calidad de datos ante gerencias que ven el programa como burocracia? Dame el curriculo de capacitacion, los ejercicios practicos y como medir si un steward esta listo para operar de forma autonoma."

Despues de leer la respuesta:
- Implementa el sistema de certificacion de data stewards: 5 niveles de competencia con criterios de evaluacion y ejercicios de validacion por nivel.
- Agrega el generador de casos de uso para capacitacion: dado un dominio del IESS, genera 3 escenarios de issues reales con preguntas guia para que el steward analice y decida.

## Que aprendiste

- El data steward no es un rol de TI — es un experto de negocio responsable de sus datos.
- El sistema de issues de calidad debe tener SLA diferenciados por severidad — un critico no puede esperar una semana.
- La matriz RACI elimina el "yo creia que lo hacia el otro" — cada actividad tiene un Accountable.
- Los Data Change Requests (DCR) protegen el modelo de datos de cambios sin control.
- Los KPIs del programa deben mostrar tendencia — la direccion importa mas que el valor puntual.
- Sin stewards activos, el gobierno de datos es solo politica en papel — sin ejecucion.

## Reto extra

Diseña e implementa el programa de Data Stewardship para la Superintendencia de Compras Publicas (SERCOP) del Ecuador: catalogo de 8 dominios (contratos, proveedores, entidades contratantes, procesos, precios referenciales, sanciones, ejecucion presupuestaria, documentos), sistema de deteccion automatica de anomalias en precios (precio > 150% del referencial = issue CRITICO automatico), flujo de aprobacion para contratos > $1M con 3 niveles de validacion, KPIs de transparencia publica (% contratos con documentacion completa, tiempo promedio publicacion vs firma, % procesos con un solo oferente), y reporte mensual compatible con el portal datos.gob.ec y el Observatorio de Compras Publicas de la Contraloria.
