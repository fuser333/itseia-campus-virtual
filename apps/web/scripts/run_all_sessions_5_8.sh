#!/bin/bash
# Ejecutar los 3 scripts de carga de sesiones 5-8
# Usar: cd a este directorio y ejecutar: bash scripts/run_all_sessions_5_8.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "================================================"
echo " CARGA DE SESIONES 5-8 - ITSEIA ACADEMY"
echo " Fecha: $(date)"
echo "================================================"

echo ""
echo "--- MATERIA 1: Fundamentos de Programación (IA) ---"
node "$SCRIPT_DIR/load_sessions_5_8_part1.js"

echo ""
echo "--- MATERIA 2: Introducción a Ciencia de Datos (CD) ---"
node "$SCRIPT_DIR/load_sessions_5_8_part2.js"

echo ""
echo "--- MATERIA 3: Introducción a Big Data (BD) ---"
node "$SCRIPT_DIR/load_sessions_5_8_part3.js"

echo ""
echo "================================================"
echo " CARGA COMPLETA"
echo "================================================"
