# Ejercicio Sesion 5: Pseudocodigo con PSeInt — Del Problema al Codigo

**Materia:** Logica y Pensamiento Analitico
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion:** 40 min

## Objetivo
Escribir pseudocodigo funcional en PSeInt para resolver problemas de calculo presentes en el dia a dia laboral ecuatoriano, como paso previo a la programacion real.

## Contexto (Ecuador)
PSeInt es la herramienta mas usada para ensenanza de algoritmia en universidades latinoamericanas, incluyendo la PUCE, UCE y EPN en Ecuador. Permite escribir logica en espanol antes de traducirla a Python o cualquier otro lenguaje. En esta sesion conectas la logica con la primera escritura real de codigo.

## Instrucciones (paso a paso)

**Paso 1 — Instala o usa PSeInt (5 min)**
- Opcion A: Descarga PSeInt desde http://pseint.sourceforge.net (gratuito)
- Opcion B: Usa el modo texto sin herramienta, escribiendo directamente en el cuaderno

**Paso 2 — Escribe 3 pseudocodigos (20 min)**

**Pseudocodigo 1 — Calculadora de decimo tercer sueldo**
```
Algoritmo DecimoTercero
    Escribir "Ingrese el sueldo mensual promedio:"
    Leer sueldo
    decimo <- sueldo   // En Ecuador el decimotercer sueldo = sueldo mensual promedio
    Escribir "Su decimotercer sueldo es: $", decimo
FinAlgoritmo
```
Modifica este pseudocodigo para que pregunte cuantos meses trabajo el empleado y calcule el proporcional.

**Pseudocodigo 2 — Validador de cedula ecuatoriana (longitud)**
Escribe desde cero el pseudocodigo que:
- Pida al usuario ingresar su numero de cedula
- Verifique que tenga exactamente 10 digitos
- Si tiene 10 digitos, muestre "Cedula valida"
- Si no, muestre "Cedula invalida: debe tener 10 digitos"

**Pseudocodigo 3 — Calculo de IVA en Ecuador**
Escribe el pseudocodigo que:
- Pida el precio sin IVA de un producto
- Pregunte si el producto tiene IVA (15% en Ecuador) o esta exento
- Calcule el precio final segun la respuesta
- Muestre el desglose: precio base, valor IVA, total

**Paso 3 — Revisa con ChatGPT (15 min)**
Pega tus 3 pseudocodigos y usa este prompt:

```
Soy estudiante de algoritmia en Ecuador. Escribi estos pseudocodigos en PSeInt:
[pega tus pseudocodigos]
Por favor:
1. Verifica si la sintaxis de PSeInt es correcta en cada uno
2. Hay errores logicos? (calculos incorrectos, variables no declaradas, etc.)
3. Para el pseudocodigo de IVA: en Ecuador el IVA es 15% desde 2024, esta mi calculo correcto?
4. Como mejoraria el pseudocodigo 2 para validar tambien que todos los caracteres sean numeros?
```

## Usa IA para...
Depurar errores de sintaxis y logica sin tener que ejecutar el programa, y entender correcciones con explicacion en espanol.

## Que aprendiste
- El pseudocodigo es codigo en idioma humano: si la logica es clara aqui, el codigo Python sera facil
- Las variables deben declararse antes de usarse y tener nombres descriptivos
- Un buen pseudocodigo considera TODOS los casos: datos validos, invalidos y bordes

## Reto extra
Escribe el pseudocodigo de un sistema que calcule el sueldo liquido de un empleado ecuatoriano considerando: sueldo bruto, descuento IESS (9.45%), impuesto a la renta (si aplica, para sueldos > $11,722 anuales), y beneficios (decimo cuarto proporcional = $460/12 meses).
