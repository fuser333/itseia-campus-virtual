# Ejercicio Sesion 6: Intervalos de Confianza — Tiempo de Entrega de Farmacias en Linea

**Materia:** Matematicas I (Estadistica)
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 35 min

## Objetivo

Construir e interpretar intervalos de confianza para la media y para una proporcion, usando datos reales de logistica de entregas en Ecuador para tomar decisiones operativas.

## Contexto

Cruz Azul en Linea, una plataforma de delivery de medicamentos que opera en Quito, quiere publicar en su sitio web el "tiempo de entrega garantizado". Para eso tomo una **muestra aleatoria de 40 entregas** del ultimo mes y registro el tiempo desde que se hizo el pedido hasta la entrega (en minutos):

**Resultados de la muestra:**
- Tamano de muestra: n = 40
- Media muestral: x̄ = 38.5 minutos
- Desviacion estandar muestral: s = 9.2 minutos

**Adicionalmente**, de esas 40 entregas, **6 llegaron tarde** (mas de 45 minutos), lo que equivale a una proporcion de p̂ = 6/40 = 0.15.

## Instrucciones

### Parte A — Intervalo de confianza para la MEDIA

Formula para IC de la media (n grande, sigma desconocida, uso de t o Z):
```
IC = x̄  +/-  Z * (s / sqrt(n))
```
Con n=40 usamos Z=1.96 (95% confianza) porque n > 30.

1. Calcula el **error estandar**: SE = s / sqrt(n) = 9.2 / sqrt(40)
   - sqrt(40) ≈ 6.32

2. Calcula el **margen de error**: ME = 1.96 x SE

3. Construye el intervalo:
   - Limite inferior: x̄ - ME
   - Limite superior: x̄ + ME

4. Escribe el resultado en formato: IC = (_____, _____)

5. Interpretacion: "Con 95% de confianza, el tiempo promedio real de entrega esta entre _____ y _____ minutos."

### Parte B — Intervalo de confianza para la PROPORCION

Formula para IC de una proporcion:
```
IC = p̂  +/-  Z * sqrt[p̂*(1-p̂) / n]
```

1. Calcula el error estandar de la proporcion: SE_p = sqrt(0.15 * 0.85 / 40)
2. Calcula el margen de error: ME_p = 1.96 x SE_p
3. Construye el intervalo de la proporcion de entregas tardias.
4. Convierte a porcentaje.

### Parte C — Decisiones de negocio

Responde estas preguntas con base en los intervalos calculados:

1. Cruz Azul quiere publicar "Entregamos en menos de 45 minutos". ¿Su muestra soporta esa afirmacion con 95% de confianza?

2. ¿Que nivel de confianza daria un intervalo mas estrecho: 90% o 99%? ¿Por que?

3. Si Cruz Azul quisiera reducir el margen de error a la mitad, ¿cuantas entregas mas tendria que medir? (Pista: el tamano de muestra se cuadruplica cuando el margen se reduce a la mitad)

4. El gerente de operaciones dice "con el 15% de tardanzas publicamos la garantia". ¿Que le dirias basandote en el intervalo de confianza de la proporcion?

## Usa IA para...

> Abre Gemini y escribe:
> "Una empresa de delivery de medicamentos en Quito midio 40 entregas: tiempo promedio 38.5 minutos con desviacion estandar 9.2 minutos. Ademas, 6 de 40 llegaron tarde. Calcula: 1) Intervalo de confianza al 95% para el tiempo promedio de entrega. 2) Intervalo de confianza al 95% para la proporcion de entregas tardias. Explica como interpretar cada intervalo para tomar decisiones de negocio."

Despues pregunta:
> "¿Que pasa con el intervalo de confianza si aumento el nivel de confianza de 95% a 99%? Muestra el calculo con los mismos datos."

## Que aprendiste

- Un **intervalo de confianza** no dice que la media real este "seguramente" dentro del intervalo: dice que si repitieras el muestreo 100 veces, en 95 de ellas el intervalo capturaria la media real.
- El **error estandar** mide la precision de la estimacion: a mayor n, menor error estandar.
- Mayor nivel de confianza = intervalo mas **ancho** (menos precision, mas seguridad).
- Mayor tamano de muestra = intervalo mas **estrecho** (mas precision).
- Los intervalos de confianza son la herramienta clave para **comunicar incertidumbre** en estudios cientificos y decisiones de negocio.

## Reto extra

Busca en el portal de datos abiertos del Ecuador (datos.gob.ec) o en el INEC algun dataset de tiempos, precios o tasas. Toma cualquier variable numerica continua de al menos 30 observaciones. Calcula la media, desviacion estandar e intervalo de confianza al 95%. Presenta los resultados como si fueras a publicarlos en un informe ejecutivo de dos parrafos.
