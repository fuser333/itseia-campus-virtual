/**
 * Script para consolidar las 3 partes del seed en seed_sessions_s1.json
 * Ejecutar: node content/build_seed.js
 */

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);

const part1 = JSON.parse(fs.readFileSync(path.join(dir, 'seed_sessions_s1_part1.json'), 'utf8'));
const part2 = JSON.parse(fs.readFileSync(path.join(dir, 'seed_sessions_s1_part2.json'), 'utf8'));
const part3 = JSON.parse(fs.readFileSync(path.join(dir, 'seed_sessions_s1_part3.json'), 'utf8'));

const output = {
  _meta: {
    version: "1.0.0",
    created: "2026-03-21",
    description: "Seed de contenido educativo - Semestre 1, primeras 4 sesiones de 3 materias",
    total_sesiones: 12,
    materias: 3
  },
  materias: [
    // Materia 1: Fundamentos de Programación (carrera IA)
    part1.materias[0],
    // Materia 2: Introducción a la Ciencia de Datos
    part2.materia,
    // Materia 3: Introducción a Big Data
    part3.materia
  ]
};

const outputPath = path.join(dir, 'seed_sessions_s1.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

const stats = fs.statSync(outputPath);
console.log(`seed_sessions_s1.json creado exitosamente`);
console.log(`Tamano: ${(stats.size / 1024).toFixed(1)} KB`);
console.log(`Materias: ${output.materias.length}`);
console.log(`Sesiones totales: ${output.materias.reduce((acc, m) => acc + m.sesiones.length, 0)}`);
