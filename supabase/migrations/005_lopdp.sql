-- ============================================
-- ITSEIA Academy - Migration 005: LOPDP Compliance
-- Ley Organica de Proteccion de Datos Personales (Ecuador)
-- Fecha: 22 marzo 2026
-- ============================================

-- ============================================
-- 1. CONSENT_RECORDS
-- Registro de consentimiento explicito (Art. 9 LOPDP)
-- ============================================

CREATE TABLE IF NOT EXISTS public.consent_records (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  policy_version  TEXT        NOT NULL,
  accepted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address      TEXT,
  user_agent      TEXT,
  UNIQUE(user_id, policy_version)
);

COMMENT ON TABLE public.consent_records IS
  'Evidencia legal de consentimiento LOPDP Art.9 — un registro por usuario por version de politica';

CREATE INDEX IF NOT EXISTS idx_consent_records_user_version
  ON public.consent_records(user_id, policy_version);

CREATE INDEX IF NOT EXISTS idx_consent_records_user_id
  ON public.consent_records(user_id);

-- ============================================
-- 2. DATA_REQUESTS
-- Solicitudes de derechos ARCO (Arts. 19-22 LOPDP)
-- ============================================

CREATE TABLE IF NOT EXISTS public.data_requests (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT        NOT NULL CHECK (type IN ('export', 'delete', 'rectify', 'oppose')),
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'held')),
  notes           TEXT,
  admin_notes     TEXT,
  legal_hold_reason TEXT,
  resolved_by     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.data_requests IS
  'Solicitudes ARCO de usuarios — plazo legal de respuesta: 15 dias habiles (LOPDP)';

CREATE INDEX IF NOT EXISTS idx_data_requests_status_created
  ON public.data_requests(status, created_at);

CREATE INDEX IF NOT EXISTS idx_data_requests_user_id
  ON public.data_requests(user_id);

-- ============================================
-- 3. ROW LEVEL SECURITY — consent_records
-- ============================================

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Usuario ve solo sus propios registros de consentimiento
DROP POLICY IF EXISTS "consent_records_select_own" ON public.consent_records;
CREATE POLICY "consent_records_select_own"
  ON public.consent_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuario inserta solo su propio consentimiento
DROP POLICY IF EXISTS "consent_records_insert_own" ON public.consent_records;
CREATE POLICY "consent_records_insert_own"
  ON public.consent_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin (service role) puede leer todos — sin policy adicional porque
-- service_role bypasses RLS por defecto en Supabase

-- ============================================
-- 4. ROW LEVEL SECURITY — data_requests
-- ============================================

ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

-- Usuario ve solo sus propias solicitudes
DROP POLICY IF EXISTS "data_requests_select_own" ON public.data_requests;
CREATE POLICY "data_requests_select_own"
  ON public.data_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuario crea solo solicitudes propias
DROP POLICY IF EXISTS "data_requests_insert_own" ON public.data_requests;
CREATE POLICY "data_requests_insert_own"
  ON public.data_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin actualiza cualquier solicitud (via profiles role check)
DROP POLICY IF EXISTS "data_requests_update_admin" ON public.data_requests;
CREATE POLICY "data_requests_update_admin"
  ON public.data_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- Admin lee todas las solicitudes
DROP POLICY IF EXISTS "data_requests_select_admin" ON public.data_requests;
CREATE POLICY "data_requests_select_admin"
  ON public.data_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );
