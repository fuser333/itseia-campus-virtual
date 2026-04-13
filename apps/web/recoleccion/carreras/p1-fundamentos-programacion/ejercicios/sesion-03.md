# Ejercicio Sesion 3: Calculadora de Salarios Tech Ecuador

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 30 min

## Objetivo

Usar operadores aritmeticos, de comparacion y logicos para construir una calculadora de salarios del sector tecnologico en Ecuador, con proyeccion de crecimiento salarial al graduarse de ITSEIA.

## Contexto

Segun datos del mercado laboral ecuatoriano (Computrabajo, LinkedIn Ecuador, 2025), los salarios promedio en el sector tech son:
- Junior Developer: $600 - $900/mes
- Data Analyst Junior: $700 - $1,100/mes
- ML Engineer Junior: $1,200 - $1,800/mes
- Senior AI Engineer: $2,500 - $4,000/mes

Un graduado de ITSEIA entra al mercado como Junior y puede alcanzar nivel Senior en 3-5 años. Vamos a calcular el impacto economico real de estudiar IA.

## Instrucciones

1. Crea un archivo `sesion03_calculadora_salarios.py`.

2. Escribe el programa usando todos los tipos de operadores:

```python
# Calculadora de Impacto Economico - Carrera IA Ecuador
# Operadores: aritmeticos, comparacion, logicos

print("=" * 60)
print("CALCULADORA DE IMPACTO ECONOMICO - ITSEIA")
print("¿Cuanto puedes ganar con una carrera en IA?")
print("=" * 60)

# --- DATOS BASE ---
salario_actual = 500.00          # SBU Ecuador 2025
salario_junior_ia = 900.00       # Promedio junior IA
salario_senior_ia = 3200.00      # Promedio senior IA
pension_mensual = 220.00         # Pension ITSEIA pionero
meses_carrera = 25               # 5 semestres x 5 meses

# --- OPERADORES ARITMETICOS ---
# Suma: ingresos acumulados sin carrera (5 años = 60 meses)
ingresos_sin_itseia = salario_actual * 60
print(f"\nSin estudiar IA (5 años): ${ingresos_sin_itseia:,.2f}")

# Multiplicacion y resta: costo total de la carrera
costo_carrera = (pension_mensual * meses_carrera) + 180  # + inscripcion
print(f"Costo total ITSEIA:       ${costo_carrera:,.2f}")

# Suma y multiplicacion: ingresos con carrera IA (2.5 años junior + 2.5 senior)
ingresos_con_itseia = (salario_junior_ia * 30) + (salario_senior_ia * 30)
print(f"Con IA (5 años):          ${ingresos_con_itseia:,.2f}")

# Division: ROI (retorno sobre inversion)
ganancia_neta = ingresos_con_itseia - ingresos_sin_itseia - costo_carrera
roi = (ganancia_neta / costo_carrera) * 100
print(f"Ganancia neta adicional:  ${ganancia_neta:,.2f}")
print(f"ROI de la carrera:        {roi:.0f}%")

# Modulo y potencia
meses_recuperar = round(costo_carrera / (salario_junior_ia - salario_actual))
incremento_potencia = salario_junior_ia ** 1  # solo para mostrar potencia
print(f"\nMeses para recuperar inversion: {meses_recuperar}")

# --- OPERADORES DE COMPARACION ---
print("\n--- COMPARACIONES ---")
print(f"¿Junior IA > SBU?         {salario_junior_ia > salario_actual}")
print(f"¿Senior IA >= 3000?       {salario_senior_ia >= 3000}")
print(f"¿Costo carrera == 5680?   {costo_carrera == 5680}")
print(f"¿ROI > 500%?              {roi > 500}")

# --- OPERADORES LOGICOS ---
print("\n--- CONDICIONES LOGICAS ---")
es_buen_roi = roi > 300 and ganancia_neta > 50000
puede_pagar = pension_mensual <= 300 or salario_actual >= 500
print(f"¿Es buen ROI y ganancia alta?  {es_buen_roi}")
print(f"¿Puede pagar pension?          {puede_pagar}")
print(f"¿NO es caro estudiar IA?       {not (costo_carrera > 10000)}")

print("\n" + "=" * 60)
print(f"CONCLUSION: Con ${costo_carrera:,.2f} de inversion,")
print(f"puedes generar ${ganancia_neta:,.2f} adicionales en 5 años.")
print("El futuro no se espera. Se construye. - Hector Velasco")
print("=" * 60)
```

3. Ejecuta y analiza cada resultado. Asegurate de entender que operador genera cada numero.

4. Modifica los salarios: busca en Computrabajo Ecuador el salario actual de "Data Scientist" y actualiza `salario_junior_ia` con el dato real que encuentres.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo este codigo Python que calcula ROI de una carrera. Explica paso a paso que hace el operador % (modulo) y ** (potencia) en Python. Dame 3 ejemplos practicos de cada uno con contexto de finanzas o salarios."

Despues de leer la respuesta:
- Agrega al menos un uso del operador modulo `%` en tu programa (ejemplo: calcular años y meses restantes).
- ¿La explicacion de Claude fue mas clara o menos clara que el libro?

## Que aprendiste

- Los operadores aritmeticos en Python: `+`, `-`, `*`, `/`, `//`, `%`, `**`.
- Los operadores de comparacion devuelven `True` o `False`: `>`, `<`, `>=`, `<=`, `==`, `!=`.
- Los operadores logicos combinan condiciones: `and`, `or`, `not`.
- `:,.2f` en f-strings formatea numeros con comas de miles y 2 decimales.
- Un ROI alto con baja inversion es la combinacion perfecta para tomar decisiones.

## Reto extra

Agrega una seccion que calcule cuanto dinero EXTRA gana un profesional de IA vs un profesional promedio durante TODA su vida laboral (35 años activos). Usa el salario promedio nacional ecuatoriano ($550/mes) como referencia. Muestra el resultado en dolares y en numero de veces mas.
