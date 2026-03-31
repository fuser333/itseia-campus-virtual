# Ejercicio Sesion 2: Politicas y Estandares de Datos

**Materia:** Gobierno de Datos y Cumplimiento
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Disenar e implementar politicas y estandares de datos para el sistema financiero ecuatoriano: politica de calidad de datos, estandares de nomenclatura, politica de retencion y eliminacion, y estandares de integracion — siguiendo las normas de la Superintendencia de Bancos (SBS) y el Banco Central del Ecuador (BCE).

## Contexto

Los 23 bancos privados del Ecuador reportan datos financieros a la SBS en formatos distintos: algunos usan "RUC", otros "ruc_empresa", otros "ruc_contribuyente" para la misma informacion. La SBS gasta 3,000 horas anuales en reconciliar estos formatos. Un estandar de datos unificado reduce ese trabajo al 10% y mejora la calidad de la supervision financiera. Esta es la realidad del gobierno de datos en Ecuador hoy.

## Instrucciones

1. Crea el archivo `sesion02_politicas_estandares_ecuador.py`:

```python
# Politicas y Estandares de Datos - ITSEIA
# Gobierno de Datos y Cumplimiento
# SBS Ecuador — sistema financiero unificado

import json
import re
import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("POLITICAS Y ESTANDARES DE DATOS — SBS ECUADOR")
print("Sistema Financiero: 23 bancos privados")
print("=" * 65)

# ================================================
# ESTANDAR DE NOMENCLATURA
# ================================================
print("\n--- ESTANDAR DE NOMENCLATURA SBS ---")

estandar_nomenclatura = {
    "Bases de datos": {
        "regla":   "snake_case, nombre descriptivo, sin abreviaciones",
        "correcto": "banco_pichincha_cartera_credito",
        "incorrecto": "BP_CC",
        "justificacion": "Legibilidad — DBA sucesor entiende sin documentacion",
    },
    "Tablas": {
        "regla":    "sustantivo_plural en snake_case",
        "correcto": "transacciones_spi, cuentas_ahorro, clientes_persona_natural",
        "incorrecto": "TRX, CTA, CLI",
        "justificacion": "SQL legible: SELECT * FROM transacciones_spi",
    },
    "Columnas": {
        "regla":    "tipo_descripcion para IDs, descripcion para el resto",
        "correcto": "id_cliente, ruc_empresa, fecha_apertura, monto_usd",
        "incorrecto": "ID, RUC, FECHA, MONTO",
        "justificacion": "El tipo y la unidad evitan errores — monto_usd vs monto_eur",
    },
    "Identificadores": {
        "regla":    "Prefijo id_ + entidad en singular",
        "correcto": "id_cliente, id_cuenta, id_credito, id_sucursal",
        "incorrecto": "cliente_id, CUST_ID, c_id",
        "justificacion": "Consistencia cross-sistema — joins sin ambigüedad",
    },
    "Fechas": {
        "regla":    "ISO 8601: YYYY-MM-DD, timestamp con timezone",
        "correcto": "2024-03-15, 2024-03-15T14:32:07-05:00 (Ecuador UTC-5)",
        "incorrecto": "15/03/24, March 15, 20240315",
        "justificacion": "Interoperabilidad internacional — SWIFT, OECD reportes",
    },
    "Booleanos": {
        "regla":    "es_ o tiene_ como prefijo",
        "correcto": "es_activo, tiene_garantia, es_persona_natural",
        "incorrecto": "activo, garantia, persona",
        "justificacion": "Semantica clara — es_activo=True sin ambigüedad",
    },
    "Montos": {
        "regla":    "DECIMAL(18,4) en BD, sufijo _usd o _moneda",
        "correcto": "monto_usd DECIMAL(18,4), saldo_usd DECIMAL(18,4)",
        "incorrecto": "monto FLOAT",
        "justificacion": "FLOAT tiene error de redondeo — critico para finanzas",
    },
}

print(f"\n  {'Elemento':<18} {'Correcto':<40} {'Incorrecto'}")
print(f"  {'-'*75}")
for elem, info in estandar_nomenclatura.items():
    print(f"  {elem:<18} {info['correcto'][:38]:<40} {info['incorrecto']}")

# ================================================
# VALIDADOR DE NOMENCLATURA
# ================================================
print("\n--- VALIDADOR DE NOMENCLATURA ---")

class ValidadorNomenclatura:
    """Valida que los nombres de objetos cumplan el estandar SBS."""

    PATRON_SNAKE   = re.compile(r'^[a-z][a-z0-9_]*$')
    PATRON_ID      = re.compile(r'^id_[a-z][a-z0-9_]*$')
    PATRON_FECHA   = re.compile(r'^fecha_[a-z][a-z0-9_]*$')
    PATRON_MONTO   = re.compile(r'^monto_[a-z]{3}$|^saldo_[a-z]{3}$|^valor_[a-z]{3}$')
    ABREVIACIONES  = {"CUST","CLT","TRX","ACC","ADR","TBL","COL","IDX"}

    def validar_tabla(self, nombre):
        errores = []
        if not self.PATRON_SNAKE.match(nombre):
            errores.append(f"No es snake_case: '{nombre}'")
        if any(abr.lower() in nombre.split("_") for abr in self.ABREVIACIONES):
            errores.append("Contiene abreviacion no estandar")
        if nombre.endswith("_tbl") or nombre.endswith("_table"):
            errores.append("No incluir sufijo _tbl/_table en nombre de tabla")
        return errores

    def validar_columna(self, nombre):
        errores = []
        if not self.PATRON_SNAKE.match(nombre):
            errores.append(f"No es snake_case: '{nombre}'")
        if nombre.startswith("id") and not self.PATRON_ID.match(nombre):
            errores.append("ID debe seguir patron id_entidad")
        if "fecha" in nombre and not self.PATRON_FECHA.match(nombre):
            errores.append("Fecha debe seguir patron fecha_descripcion")
        return errores

    def validar_schema(self, schema_dict):
        """Valida un schema completo: {tabla: [columnas]}."""
        resultado = {}
        for tabla, columnas in schema_dict.items():
            errores_tabla = self.validar_tabla(tabla)
            errores_cols  = {}
            for col in columnas:
                ec = self.validar_columna(col)
                if ec:
                    errores_cols[col] = ec
            if errores_tabla or errores_cols:
                resultado[tabla] = {"tabla_errores": errores_tabla,
                                     "columnas_errores": errores_cols}
        return resultado

# Esquemas de prueba — mezcla de nombres correctos e incorrectos
schemas_bancos = {
    # Banco 1: bien documentado
    "transacciones_spi": ["id_transaccion","id_cuenta_origen","id_cuenta_destino",
                           "monto_usd","fecha_transaccion","es_reversada","canal"],
    # Banco 2: nombres legacy
    "TRX_DATA":          ["TRX_ID","ACC_FROM","ACC_TO","AMOUNT","DATE","REV_FLAG","CH"],
    # Banco 3: mezcla
    "creditos":          ["id_credito","ruc_deudor","monto","fecha","activo","tipo_c"],
}

validador = ValidadorNomenclatura()
resultado = validador.validar_schema(schemas_bancos)

print(f"\n  Validacion de esquemas:")
for tabla, errores in resultado.items():
    estado = "FALLO" if errores["tabla_errores"] or errores["columnas_errores"] else "OK"
    print(f"\n  [{estado}] Tabla: {tabla}")
    for e in errores["tabla_errores"]:
        print(f"    Tabla: {e}")
    for col, ec in errores["columnas_errores"].items():
        for e in ec:
            print(f"    Columna '{col}': {e}")

tablas_ok = sum(1 for t, e in resultado.items() if not e["tabla_errores"] and not e["columnas_errores"])
print(f"\n  Tablas cumpliendo estandar: {len(schemas_bancos)-len(resultado)}/{len(schemas_bancos)}")

# ================================================
# POLITICA DE RETENCION
# ================================================
print("\n--- POLITICA DE RETENCION Y ELIMINACION ---")

politica_retencion = {
    "Transacciones SPI/SCI": {
        "retencion_online": "2 anos",
        "retencion_archivo": "7 anos",
        "retencion_legal": "7 anos (Art. 87 LRFSE)",
        "eliminacion": "Destruccion segura certificada",
        "responsable": "Banco + SBS supervisa",
    },
    "Creditos y prestamos": {
        "retencion_online": "Vigencia + 3 anos",
        "retencion_archivo": "10 anos",
        "retencion_legal": "10 anos (Codigo Civil 2346)",
        "eliminacion": "Shredding fisico + borrado seguro digital",
        "responsable": "Banco prestamista",
    },
    "Datos PII clientes": {
        "retencion_online": "Vigencia relacion + 2 anos",
        "retencion_archivo": "5 anos post-cancelacion",
        "retencion_legal": "LOPDP Art. 20 — minimo necesario",
        "eliminacion": "LOPDP Art. 22 — derecho al olvido en 15 dias",
        "responsable": "DPO del banco",
    },
    "Logs de auditoria": {
        "retencion_online": "1 ano",
        "retencion_archivo": "5 anos",
        "retencion_legal": "5 anos (EGSI Control A.12.4)",
        "eliminacion": "Solo con autorizacion CISO",
        "responsable": "CISO + CDO",
    },
    "Datos analiticos agregados": {
        "retencion_online": "Indefinido (anonimizados)",
        "retencion_archivo": "N/A",
        "retencion_legal": "No aplica (dato anonimo no es personal)",
        "eliminacion": "No requerida",
        "responsable": "CDO",
    },
}

print(f"\n  {'Tipo de dato':<30} {'Online':>10} {'Archivo':>10} {'Legal':>10}")
print(f"  {'-'*65}")
for tipo, pol in politica_retencion.items():
    print(f"  {tipo:<30} {pol['retencion_online']:>10} "
          f"{pol['retencion_archivo']:>10} {pol['retencion_legal'][:10]:>10}")

# ================================================
# ESTANDAR DE INTEGRACION
# ================================================
print("\n--- ESTANDAR DE INTEGRACION DE DATOS ---")

estandar_integracion = {
    "API REST": {
        "formato":     "JSON con schema OpenAPI 3.0",
        "autenticacion": "OAuth 2.0 + JWT",
        "versionado":  "/api/v1/, /api/v2/ — sin romper backward compatibility",
        "paginacion":  "cursor-based para datasets grandes",
        "error_codes": "RFC 7807 (Problem Details for HTTP APIs)",
    },
    "Transferencia batch": {
        "formato":     "Parquet o CSV con UTF-8 y separador |",
        "cifrado":     "PGP en transito + AES-256 en reposo",
        "compresion":  "GZIP para CSV, Snappy para Parquet",
        "checksum":    "SHA-256 para verificar integridad del archivo",
        "confirmacion": "ACK/NACK protocol — confirmacion de recepcion",
    },
    "Streaming": {
        "protocolo":   "Kafka con Schema Registry (Avro)",
        "garantia":    "Exactly-once semantics — no duplicados",
        "schema":      "Evolucion compatible hacia atras (backward compatible)",
        "monitoreo":   "Lag <= 5 segundos para datos criticos SPI",
    },
}

for canal, config in estandar_integracion.items():
    print(f"\n  [{canal}]")
    for k, v in config.items():
        print(f"    {k:<14}: {v}")

# ================================================
# SCORECARD: CUMPLIMIENTO DE ESTANDARES
# ================================================
print("\n--- SCORECARD: CUMPLIMIENTO BANCOS ---")

np.random.seed(42)
bancos = ["Pichincha","Guayaquil","Pacifico","Internacional","Produbanco",
          "Bolivariano","Austro","Loja","Machala","Coopnacional"]

criterios = ["Nomenclatura","Formatos","APIs","Retencion","Cifrado"]
scores    = {banco: {c: round(np.random.uniform(0.5, 1.0), 2) for c in criterios}
             for banco in bancos}
# Pichincha = modelo de cumplimiento
scores["Pichincha"] = {c: round(np.random.uniform(0.85, 1.0), 2) for c in criterios}

df_scores = pd.DataFrame(scores).T
df_scores["promedio"] = df_scores.mean(axis=1).round(3)

print(f"\n  {'Banco':<15} {' '.join(f'{c[:6]:>8}' for c in criterios)} {'Promedio':>10}")
print(f"  {'-'*75}")
for banco, row in df_scores.sort_values("promedio", ascending=False).iterrows():
    cumple = "OK" if row["promedio"] >= 0.80 else "FALLO"
    print(f"  [{cumple}] {banco:<13} "
          f"{' '.join(f'{row[c]:>8.2f}' for c in criterios)} {row['promedio']:>10.3f}")

print(f"\n  Bancos con cumplimiento >= 80%: "
      f"{(df_scores['promedio'] >= 0.80).sum()}/{len(bancos)}")

print("\n" + "=" * 65)
print("POLITICAS Y ESTANDARES — CONCEPTOS CLAVE:")
print("  Nomenclatura: snake_case, prefijos id_/fecha_/monto_usd — legibilidad")
print("  Retencion:    plazos legales Ecuador (7-10 anos financiero)")
print("  LOPDP:        derecho al olvido — eliminar PII en 15 dias")
print("  OpenAPI:      documentacion automatica — interoperabilidad garantizada")
print("  Scorecard:    medir cumplimiento — lo que no se mide no mejora")
print("  Validacion:   automatica en CI/CD — detectar violaciones antes de produccion")
print("=" * 65)
```

3. Implementa el generador automatico de politica de retencion en formato JSON-LD para integracion con catalogo de datos: dado un tipo de dato y el marco legal aplicable, genera la politica estructurada.

4. Agrega el validador de formato de fecha: acepta solo ISO 8601 con zona horaria Ecuador (UTC-5) y rechaza todos los otros formatos con mensaje descriptivo.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el CDO de la Superintendencia de Bancos del Ecuador. Quiero crear el estandar de datos unificado que todos los bancos privados deben cumplir para los reportes regulatorios. El problema: cada banco usa nombres de campos distintos para la misma informacion (RUC del cliente lo llaman: ruc, ruc_contribuyente, nit_cliente, tax_id segun el banco). Necesito: 1) metodologia para identificar campos equivalentes entre sistemas distintos (semantic mapping), 2) proceso de migracion para que los bancos adopten el estandar sin interrumpir operaciones, 3) herramienta de validacion que los bancos ejecuten antes de enviar reportes a la SBS. ¿Como lo implemento con un equipo de 5 personas en 6 meses?"

Despues de leer la respuesta:
- Implementa el mapeador semantico: dado un campo no estandar, sugiere el campo estandar SBS correspondiente.
- Agrega el generador de reporte de incumplimiento con las acciones correctivas requeridas por banco.

## Que aprendiste

- Los estandares de nomenclatura eliminan la ambigüedad — monto_usd es inequivoco, monto no lo es.
- DECIMAL(18,4) es obligatorio para montos financieros — FLOAT tiene error de redondeo en centavos.
- Los plazos de retencion en Ecuador tienen base legal especifica — violaciones generan multas.
- El derecho al olvido (LOPDP Art. 22) obliga a eliminar datos PII en 15 dias de solicitud.
- El scorecard de cumplimiento convierte politicas en metricas medibles por institucion.
- La validacion automatica en CI/CD detecta violaciones antes de llegar a produccion.

## Reto extra

Diseña e implementa el estandar de datos del sector publico ecuatoriano para el programa de datos abiertos del MINTEL: catalogo de 200 datasets de 15 ministerios, estandar de metadatos DCAT-AP (EU standard adaptado a Ecuador), validador automatico que verifica formato, licencia, periodicidad y contacto responsable, scorecard de calidad con ranking de ministerios, y proceso de certificacion "Dato Abierto de Calidad MINTEL" para datasets que cumplan > 90% del estandar. El portal debe ser compatible con datos.gob.ec y con el portal de datos de CEPAL y OEA.
