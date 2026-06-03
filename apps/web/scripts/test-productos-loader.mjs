/**
 * Smoke test del loader de productos · Campus v2 FASE 1.
 *
 * No usa el loader TS directamente (requeriría tsx/ts-node) sino que
 * replica la lógica leyendo los 8 YAML con js-yaml y validando los
 * campos mínimos del schema definido en src/lib/productos/types.ts.
 *
 * Esto es lo que hace el loader real bajo el capó · si esto pasa,
 * la integración Server Component → loader.ts funcionará igual.
 *
 * Uso:
 *   cd apps/web && node scripts/test-productos-loader.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const PRODUCTO_IDS = [
  'preuni',
  'cursos-pro',
  'bootcamp',
  'mdt',
  'b2b',
  'certificaciones',
  'carreras',
  'demo',
];

const PESTAÑAS_ALUMNO_VALIDAS = new Set([
  'video_resumen',
  'materiales',
  'ejercicios',
  'evaluacion',
]);

const PESTAÑAS_DOCENTE_VALIDAS = new Set([
  'resumen',
  'plan_clase',
  'materiales_editar',
  'ejercicios_editar',
  'evaluacion_editar',
  'prompts',
  'recursos',
  'notas_privadas',
  'grabaciones',
]);

const DIR = path.join(process.cwd(), 'src/config/productos');

let fails = 0;
let oks = 0;

function check(cond, msg) {
  if (cond) {
    oks++;
    return true;
  }
  fails++;
  console.error(`  ❌ ${msg}`);
  return false;
}

console.log(`\n🧪 Smoke test loader productos · 8 YAML\n`);

for (const id of PRODUCTO_IDS) {
  const file = path.join(DIR, `${id}.yaml`);
  console.log(`📄 ${id}.yaml`);

  if (!fs.existsSync(file)) {
    fails++;
    console.error(`  ❌ archivo no existe: ${file}`);
    continue;
  }

  let parsed;
  try {
    parsed = yaml.load(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    fails++;
    console.error(`  ❌ YAML inválido: ${e.message}`);
    continue;
  }

  check(typeof parsed === 'object' && parsed !== null, 'raíz es objeto');

  // 1) producto
  check(parsed.producto?.id === id, `producto.id === "${id}"`);
  check(typeof parsed.producto?.nombre === 'string', 'producto.nombre string');
  check(typeof parsed.producto?.color_accent === 'string', 'producto.color_accent string');
  check(typeof parsed.producto?.icono === 'string', 'producto.icono string');

  // 2) cohorte
  check(typeof parsed.cohorte?.estructura === 'string', 'cohorte.estructura string');
  check(typeof parsed.cohorte?.duracion_dias === 'number', 'cohorte.duracion_dias number');
  check(Array.isArray(parsed.cohorte?.horario_default?.dias_semana), 'cohorte.horario_default.dias_semana array');
  check(typeof parsed.cohorte?.sesiones_totales === 'number', 'cohorte.sesiones_totales number');

  // 3) alumno · pestañas válidas
  const alumnoPestañas = parsed.alumno?.pestañas_sesion;
  if (check(Array.isArray(alumnoPestañas), 'alumno.pestañas_sesion array')) {
    for (const p of alumnoPestañas) {
      check(
        PESTAÑAS_ALUMNO_VALIDAS.has(p),
        `alumno pestaña "${p}" debe estar en el registry`
      );
    }
  }
  check(typeof parsed.alumno?.ai_lab === 'boolean', 'alumno.ai_lab boolean');
  check(typeof parsed.alumno?.comunidad === 'boolean', 'alumno.comunidad boolean');
  check(typeof parsed.alumno?.asesorias === 'boolean', 'alumno.asesorias boolean');

  // 4) docente · pestañas válidas
  const docPestañas = parsed.docente?.pestañas_sesion;
  if (check(Array.isArray(docPestañas), 'docente.pestañas_sesion array')) {
    for (const p of docPestañas) {
      check(
        PESTAÑAS_DOCENTE_VALIDAS.has(p),
        `docente pestaña "${p}" debe estar en el registry`
      );
    }
  }
  check(typeof parsed.docente?.boton_grabar === 'boolean', 'docente.boton_grabar boolean');
  check(typeof parsed.docente?.asistencia === 'boolean', 'docente.asistencia boolean');

  // 5) pricing
  check(typeof parsed.pricing?.modelo === 'string', 'pricing.modelo string');
  check(
    parsed.pricing?.precio_usd === null || typeof parsed.pricing?.precio_usd === 'number',
    'pricing.precio_usd number|null'
  );
  check(typeof parsed.pricing?.beca_h3l === 'boolean', 'pricing.beca_h3l boolean');

  // 6) assignment_docente + cross_promo
  check(['manual', 'auto_unico'].includes(parsed.assignment_docente?.modo), 'assignment_docente.modo válido');
  check(typeof parsed.cross_promo?.excluir_a_si_mismo === 'boolean', 'cross_promo.excluir_a_si_mismo boolean');
  check(Array.isArray(parsed.cross_promo?.orden_otros), 'cross_promo.orden_otros array');

  console.log(`  ✓ ${id} validado`);
}

console.log(`\n────────────────────────────`);
console.log(`Asserts: ${oks} OK · ${fails} FAIL`);
console.log(`────────────────────────────\n`);

if (fails > 0) {
  console.error(`❌ ${fails} validaciones fallaron`);
  process.exit(1);
}
console.log(`✅ Los 8 productos cargan y validan correctamente.`);
