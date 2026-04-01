# Ejercicio Sesion 6: Pensamiento Computacional — Descomposicion de Problemas Complejos

**Materia:** Logica y Pensamiento Analitico
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion:** 35 min

## Objetivo
Aplicar la tecnica de descomposicion del pensamiento computacional para dividir problemas complejos del entorno empresarial ecuatoriano en subproblemas manejables.

## Contexto (Ecuador)
El pensamiento computacional no es solo para programadores. La empresa Tame (aerolinea ecuatoriana) tuvo que descomponer el problema "gestionar vuelos" en cientos de subproblemas: reservas, asignacion de asientos, control de equipaje, facturacion, etc. Aprender a descomponer problemas es la habilidad mas valorada por los empleadores de IA en Ecuador segun encuestas de la Camara de Comercio de Quito.

## Instrucciones (paso a paso)

**Paso 1 — Aprende la tecnica (5 min)**
La descomposicion tiene 3 niveles:
- **Nivel 1 — Problema principal:** El enunciado general
- **Nivel 2 — Modulos:** Las grandes partes del problema
- **Nivel 3 — Tareas atomicas:** Cada modulo en pasos pequenos e independientes

Regla: una tarea es "atomica" cuando no se puede dividir mas sin perder sentido.

**Paso 2 — Descompone un problema real (20 min)**
Elige UNO de estos problemas reales de Ecuador y descomponlo en los 3 niveles:

**Opcion A:** "Desarrollar una app para que los mercados municipales de Quito (Mercado Central, Iñaquito, etc.) vendan sus productos online."

**Opcion B:** "Crear un sistema para que el Ministerio de Salud rastree en tiempo real el inventario de medicamentos en todos los hospitales del Ecuador."

**Opcion C:** "Disenar una plataforma para que los artesaños de Otavalo puedan exportar sus productos directamente a compradores internacionales."

Tu descomposicion debe tener:
- 1 problema principal
- Entre 4 y 6 modulos
- Al menos 3 tareas atomicas por modulo
- Presentado como lista jerarquica sangrada

**Paso 3 — Mejora con Gemini (10 min)**
Comparte tu descomposicion con Gemini usando este prompt:

```
Soy estudiante de pensamiento computacional en Ecuador. Descompuse este problema:
[pega tu descomposicion]
Por favor:
1. Hay modulos importantes que olvide para el contexto ecuatoriano?
2. Alguna de mis "tareas atomicas" en realidad se puede descomponer mas?
3. Hay dependencias entre modulos que debo considerar? (cual debe desarrollarse primero)
4. Que modulo seria el mas dificil de implementar en Ecuador y por que?
```

## Usa IA para...
Descubrir modulos ocultos o dependencias que no son obvias a primera vista, y entender la viabilidad tecnica en el contexto ecuatoriano.

## Que aprendiste
- Un problema grande e intimidante se vuelve manejable al descomponerlo
- Los modulos bien definidos pueden asignarse a diferentes personas del equipo
- Las dependencias entre modulos determinan el orden de desarrollo (igual que en proyectos reales)

## Reto extra
Toma el modulo que Gemini identifico como el mas dificil. Descomponlo en un Nivel 4: divide sus tareas atomicas en pasos aun mas pequenos. Lleva la descomposicion hasta que cada paso sea una sola linea de codigo o una sola consulta a la base de datos.
