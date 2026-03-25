# Ejercicio Sesion 4: Diagramas de Flujo para Procesos Reales

**Materia:** Logica y Pensamiento Analitico
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion:** 40 min

## Objetivo
Convertir algoritmos en lenguaje natural a diagramas de flujo usando la simbologia estandar (inicio/fin, proceso, decision, entrada/salida, conector), usando una herramienta digital.

## Contexto (Ecuador)
Las empresas ecuatorianas como Banco Pichincha, CNT o el Ministerio de Salud documentan sus procesos con diagramas de flujo antes de programarlos. Un diagrama de flujo mal hecho produce software con bugs. Esta habilidad te hara valioso desde el primer dia de trabajo.

## Instrucciones (paso a paso)

**Paso 1 — Conoce los simbolos (5 min)**
Memoriza la simbologia estandar ISO 5807:

| Simbolo | Forma | Uso |
|---------|-------|-----|
| Inicio/Fin | Ovalo | Empieza y termina el diagrama |
| Proceso | Rectangulo | Una accion o calculo |
| Decision | Rombo | Pregunta SI/NO o condicion |
| Entrada/Salida | Paralelogramo | Ingresar o mostrar datos |
| Conector | Circulo | Une partes del diagrama |

**Paso 2 — Dibuja a mano primero (10 min)**
Toma papel y dibuja el diagrama de flujo para este algoritmo del sistema de atencion al cliente de una empresa ecuatoriana:

```
INICIO
  Ingresar numero de cedula del cliente
  Buscar cliente en la base de datos
  SI cliente existe ENTONCES
    Mostrar historial de compras
    Preguntar motivo de llamada
    SI es reclamo ENTONCES
      Crear ticket de soporte
      Enviar confirmacion al correo
    SINO
      Registrar consulta
    FIN SI
  SINO
    Mostrar mensaje "Cliente no encontrado"
    Ofrecer registro nuevo
  FIN SI
FIN
```

**Paso 3 — Digitaliza con draw.io (15 min)**
Ve a https://app.diagrams.net (gratuito, no requiere cuenta).
- Abre un nuevo diagrama en blanco
- Recrea tu diagrama de mano usando la herramienta
- Usa colores: rectangulos en azul (#1F2F58), rombos en amarillo (#FBBC0C), ovalos en verde
- Exporta como PNG

**Paso 4 — Valida con Claude (10 min)**
Describe tu diagrama a Claude con este prompt:

```
Soy estudiante de logica computacional. Tengo este algoritmo y quiero saber si mi diagrama de flujo es correcto:
[pega el algoritmo del Paso 2]
Mi diagrama tiene: [describe lo que dibujaste, cuantos rombos, rectangulos, etc.]
Por favor:
1. Verifica si el diagrama captura todos los caminos posibles del algoritmo
2. Hay algun camino que queda "colgado" (sin llegar al FIN)?
3. Los rombos de decision tienen exactamente 2 salidas (SI y NO)?
4. Que pasaria si el cliente ingresa una cedula con formato incorrecto? El diagrama lo maneja?
```

## Usa IA para...
Verificar que el diagrama cubra todos los flujos posibles y detectar caminos sin salida o sin fin.

## Que aprendiste
- Un diagrama de flujo hace visible la logica que el codigo ejecutara
- Cada rombo de decision SIEMPRE debe tener exactamente 2 salidas (SI/NO)
- Un buen diagrama puede ser leido por alguien no tecnico — si no se entiende, el diagrama esta mal

## Reto extra
Dibuja el diagrama de flujo del proceso de compra en una tienda virtual ecuatoriana (como Supermaxi online o MercadoLibre Ecuador): desde que el cliente busca un producto hasta que recibe la confirmacion de pago. Debe incluir al menos 4 decisiones.
