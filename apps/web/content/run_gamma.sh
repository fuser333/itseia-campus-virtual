#!/bin/bash
# Run gamma presentations generator
# Usage: bash content/run_gamma.sh
# Or: chmod +x content/run_gamma.sh && ./content/run_gamma.sh

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=== ITSEIA Gamma Presentations Generator ==="
echo "Node version: $(node --version)"
echo "Working dir: $PROJECT_ROOT"
echo ""

# Run from project root so relative paths work
cd "$PROJECT_ROOT"

# Execute the main script
node content/generate_gamma_presentations.js 2>&1 | tee /tmp/gamma_run_$(date +%Y%m%d_%H%M%S).log

echo ""
echo "Log saved to /tmp/gamma_run_*.log"
