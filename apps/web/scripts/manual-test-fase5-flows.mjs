/**
 * Smoke test manual · FASE 5 routing.
 *
 * Simula los flows de login para las 3 cuentas reales y verifica que
 * el endpoint /api/auth/post-login-redirect devuelve el destino correcto
 * usando la cookie de sesión real (npm run dev levantado en :3000).
 *
 * Uso:
 *   cd apps/web && (npm run dev &) && sleep 8 && node scripts/manual-test-fase5-flows.mjs
 *
 * Reglas:
 *   · Xavier (estudiante con preuni) → /preuni
 *   · Héctor (super_admin)          → /admin
 *   · Docente puro                   → /docente
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUP_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const APP = 'http://localhost:3000';

const CASES = [
  { label: 'Xavier (estudiante preuni)', email: 'xavo88@hotmail.com', pwd: 'Itseia2026!Xavier', expected: '/preuni' },
  { label: 'Hector (super_admin)', email: 'administracion@itseia.ai', pwd: 'Itseia2026!Hector', expected: '/admin' },
  { label: 'Docente puro', email: 'docente@itseia.ai', pwd: 'ItseiaDocente2026!', expected: '/docente' },
];

let fail = 0;

for (const c of CASES) {
  // 1. login con Supabase para obtener el access_token + refresh_token
  const sb = createClient(SUP_URL, SUP_ANON, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await sb.auth.signInWithPassword({ email: c.email, password: c.pwd });
  if (error || !data?.session) {
    console.error(`❌ ${c.label}: login falló · ${error?.message}`);
    fail++;
    continue;
  }

  // 2. construir cookie header con el formato que Supabase SSR 0.9 espera.
  // Storage key: sb-<ref>-auth-token con un objeto JSON cuyas claves son
  // access_token, refresh_token, expires_in, expires_at, token_type, user.
  // El cookie real va base64 ("base64-" prefix) o JSON URL-encoded.
  const ref = new URL(SUP_URL).hostname.split('.')[0];
  const cookieName = `sb-${ref}-auth-token`;
  const sessionObj = {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at,
    token_type: data.session.token_type,
    user: data.session.user,
  };
  // base64 (Supabase SSR ≥0.5 acepta este formato)
  const cookieValue =
    'base64-' + Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  // 3. fetch al endpoint
  const res = await fetch(`${APP}/api/auth/post-login-redirect`, {
    headers: { cookie: `${cookieName}=${cookieValue}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error(`❌ ${c.label}: endpoint HTTP ${res.status}`);
    fail++;
    continue;
  }
  const body = await res.json();
  const ok = body.url === c.expected;
  console.log(`${ok ? '✅' : '❌'} ${c.label} → ${body.url} (esperado ${c.expected}) reason=${body.reason}`);
  if (!ok) fail++;
}

console.log(`\nResultado: ${CASES.length - fail}/${CASES.length} pasaron`);
process.exit(fail > 0 ? 1 : 0);
