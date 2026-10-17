-- ============================================================
-- ITSEIA Academy — Foros de Discusion por Materia
-- Feature: 003-discussion-forums
-- Fecha: 2026-03-22
-- Requisito CES: Art. 61 RRA 2022 (comunicacion asincronica)
-- ============================================================

-- ============================================================
-- 1. FORUM_POSTS — Mensajes principales del foro
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),
  parent_id   UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.forum_posts IS
  'Foros de discusion asincronica por materia. parent_id nulo = post raiz; no nulo = respuesta directa. Evidencia CES Art. 61 RRA 2022.';

COMMENT ON COLUMN public.forum_posts.parent_id IS
  'Referencia al post padre. NULL = post principal. Un nivel de anidacion (A2).';
COMMENT ON COLUMN public.forum_posts.is_deleted IS
  'Soft delete: el registro existe pero se oculta en la UI. Preserva historial para auditorias SENESCYT.';

CREATE INDEX IF NOT EXISTS idx_forum_posts_subject_id   ON public.forum_posts(subject_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_id    ON public.forum_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id      ON public.forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at   ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_subject_pin  ON public.forum_posts(subject_id, is_pinned DESC, created_at DESC);

-- Trigger: actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_forum_posts_updated_at ON public.forum_posts;
CREATE TRIGGER trg_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. FORUM_NOTIFICATIONS — Notificaciones in-app para docentes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id     UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  subject_id  UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.forum_notifications IS
  'Notificaciones in-app cuando un estudiante publica en el foro. Destinatario: docente asignado.';

CREATE INDEX IF NOT EXISTS idx_forum_notif_user_id   ON public.forum_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_notif_is_read   ON public.forum_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_forum_notif_post_id   ON public.forum_notifications(post_id);

-- ============================================================
-- 3. RLS — forum_posts
-- ============================================================

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- SELECT: matriculado en el programa que contiene la materia, o docente asignado, o admin
CREATE POLICY "foro_select_participantes" ON public.forum_posts
  FOR SELECT USING (
    -- Admin / coordinacion / super_admin ven todo
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion', 'finanzas')
    )
    OR
    -- Docente asignado a esta materia
    EXISTS (
      SELECT 1 FROM public.subjects s
      WHERE s.id = forum_posts.subject_id
        AND s.teacher_id = auth.uid()
    )
    OR
    -- Estudiante matriculado activo en el programa que contiene esta materia
    EXISTS (
      SELECT 1
      FROM public.subjects s
      JOIN public.semesters sem ON sem.id = s.semester_id
      JOIN public.enrollments e  ON e.program_id = sem.program_id
      WHERE s.id = forum_posts.subject_id
        AND e.user_id = auth.uid()
        AND e.status = 'active'
    )
  );

-- INSERT: solo estudiantes matriculados o docente asignado (no admins directamente)
CREATE POLICY "foro_insert_participantes" ON public.forum_posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Docente asignado
      EXISTS (
        SELECT 1 FROM public.subjects s
        WHERE s.id = forum_posts.subject_id
          AND s.teacher_id = auth.uid()
      )
      OR
      -- Estudiante matriculado activo
      EXISTS (
        SELECT 1
        FROM public.subjects s
        JOIN public.semesters sem ON sem.id = s.semester_id
        JOIN public.enrollments e  ON e.program_id = sem.program_id
        WHERE s.id = forum_posts.subject_id
          AND e.user_id = auth.uid()
          AND e.status = 'active'
      )
      OR
      -- Admin puede publicar tambien
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN ('super_admin', 'admin', 'coordinacion')
      )
    )
  );

-- UPDATE: autor puede actualizar su propio contenido; docente/admin pueden cambiar is_pinned e is_deleted
CREATE POLICY "foro_update_owner_o_docente" ON public.forum_posts
  FOR UPDATE USING (
    -- Autor propio (puede editar contenido)
    user_id = auth.uid()
    OR
    -- Docente asignado a la materia (puede fijar / soft-delete)
    EXISTS (
      SELECT 1 FROM public.subjects s
      WHERE s.id = forum_posts.subject_id
        AND s.teacher_id = auth.uid()
    )
    OR
    -- Admin siempre
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- DELETE: solo admins pueden hacer hard delete (normalmente usamos is_deleted)
CREATE POLICY "foro_delete_admin" ON public.forum_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin')
    )
  );

-- ============================================================
-- 4. RLS — forum_notifications
-- ============================================================

ALTER TABLE public.forum_notifications ENABLE ROW LEVEL SECURITY;

-- Cada usuario ve solo sus propias notificaciones
CREATE POLICY "notif_select_propio" ON public.forum_notifications
  FOR SELECT USING (user_id = auth.uid());

-- Admin ve todas
CREATE POLICY "notif_select_admin" ON public.forum_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- INSERT via service role (API routes con supabaseAdmin bypasan RLS)
-- Solo admins o el propio sistema pueden insertar
CREATE POLICY "notif_insert_admin" ON public.forum_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- Cada usuario puede marcar sus propias notificaciones como leidas
CREATE POLICY "notif_update_propio" ON public.forum_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- 5. REALTIME — habilitar para forum_posts
-- ============================================================

-- Habilitar Realtime publication en forum_posts para suscripciones por canal
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;

-- ============================================================
-- 6. FUNCION AUXILIAR: get_forum_metrics
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_forum_metrics(p_subject_id UUID)
RETURNS TABLE (
  subject_id          UUID,
  total_posts         BIGINT,
  total_replies       BIGINT,
  unique_authors      BIGINT,
  last_post_at        TIMESTAMPTZ,
  is_inactive         BOOLEAN
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    p_subject_id                                                AS subject_id,
    COUNT(*) FILTER (WHERE parent_id IS NULL AND NOT is_deleted) AS total_posts,
    COUNT(*) FILTER (WHERE parent_id IS NOT NULL AND NOT is_deleted) AS total_replies,
    COUNT(DISTINCT user_id) FILTER (WHERE NOT is_deleted)       AS unique_authors,
    MAX(created_at)                                             AS last_post_at,
    (MAX(created_at) < now() - INTERVAL '7 days'
      OR MAX(created_at) IS NULL)                              AS is_inactive
  FROM public.forum_posts
  WHERE subject_id = p_subject_id;
$$;

COMMENT ON FUNCTION public.get_forum_metrics IS
  'Metricas de participacion de foro por materia. Usado en panel admin para evidencia SENESCYT.';
