-- ============================================================
-- ITSEIA Academy — Feature 011: Modulo Docente Completo
-- Migration 013: teacher_training, announcements, analytics
-- CES Compliance: Art. 61 RRA 2022 (120h formacion docente)
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. EXTEND programs table to support teacher_training type
-- ──────────────────────────────────────────────────────────

-- Drop and recreate the type check constraint to add 'teacher_training'
DO $$
BEGIN
  -- Drop existing check constraint on programs.type if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'programs_type_check'
      AND table_name = 'programs'
  ) THEN
    ALTER TABLE programs DROP CONSTRAINT programs_type_check;
  END IF;

  -- Add updated constraint with teacher_training
  ALTER TABLE programs
    ADD CONSTRAINT programs_type_check
    CHECK (type IN ('carrera', 'curso', 'preuni', 'bootcamp', 'teacher_training'));
END;
$$;

-- ──────────────────────────────────────────────────────────
-- 2. TEACHER TRAINING PROGRESS
--    One row per (teacher, session) in the training program.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_training_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id    uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  completed_at  timestamptz NOT NULL DEFAULT now(),
  hours_credited decimal(5,2) NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_training_progress_teacher
  ON teacher_training_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_training_progress_session
  ON teacher_training_progress(session_id);

ALTER TABLE teacher_training_progress ENABLE ROW LEVEL SECURITY;

-- Docente solo puede ver/insertar sus propios registros
CREATE POLICY "teacher_training_progress_select_own"
  ON teacher_training_progress FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_training_progress_insert_own"
  ON teacher_training_progress FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "teacher_training_progress_admin_all"
  ON teacher_training_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 3. TEACHER CERTIFICATES
--    One row per teacher when they reach 120h.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_certificates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_hours     decimal(6,2) NOT NULL,
  certificate_url text,
  certified_at    timestamptz NOT NULL DEFAULT now(),
  is_valid        boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_certificates_teacher
  ON teacher_certificates(teacher_id);

ALTER TABLE teacher_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_certificates_select"
  ON teacher_certificates FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_certificates_admin_all"
  ON teacher_certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 4. TEACHER EXTERNAL HOURS
--    Horas de capacitacion externas validadas manualmente.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_external_hours (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hours        decimal(5,2) NOT NULL CHECK (hours > 0),
  description  text NOT NULL,
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_external_hours_teacher
  ON teacher_external_hours(teacher_id);

ALTER TABLE teacher_external_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_external_hours_select"
  ON teacher_external_hours FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_external_hours_admin_write"
  ON teacher_external_hours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_external_hours_admin_update"
  ON teacher_external_hours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 5. ASSIGNMENT RUBRICS
--    Criterios de evaluacion con pesos (sum = 100%).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assignment_rubrics (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id  uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  criterion_name text NOT NULL,
  description    text,
  weight_percent decimal(5,2) NOT NULL CHECK (weight_percent > 0 AND weight_percent <= 100),
  order_index    int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignment_rubrics_assignment
  ON assignment_rubrics(assignment_id);

ALTER TABLE assignment_rubrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assignment_rubrics_select"
  ON assignment_rubrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN sessions s ON s.id = a.session_id
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE a.id = assignment_rubrics.assignment_id
        AND (
          sub.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
          OR EXISTS (
            SELECT 1 FROM enrollments e
            JOIN semesters sem ON sem.id = sub.semester_id
            WHERE e.user_id = auth.uid()
              AND e.program_id = sem.program_id
              AND e.status = 'active'
          )
        )
    )
  );

CREATE POLICY "assignment_rubrics_teacher_write"
  ON assignment_rubrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN sessions s ON s.id = a.session_id
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE a.id = assignment_rubrics.assignment_id
        AND (
          sub.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
        )
    )
  );

-- ──────────────────────────────────────────────────────────
-- 6. TEACHER INTERVENTIONS
--    Notas de seguimiento privadas (docente -> estudiante).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_interventions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id  uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  note_text   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_interventions_student
  ON teacher_interventions(student_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_interventions_teacher
  ON teacher_interventions(teacher_id);

ALTER TABLE teacher_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_interventions_select"
  ON teacher_interventions FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_interventions_insert"
  ON teacher_interventions FOR INSERT
  WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM subjects
      WHERE id = subject_id
        AND teacher_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────────────────
-- 7. ANNOUNCEMENTS
--    Anuncios de docente para estudiantes de una materia.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title         text NOT NULL,
  body_markdown text NOT NULL,
  published_at  timestamptz NOT NULL DEFAULT now(),
  is_archived   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_subject
  ON announcements(subject_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_teacher
  ON announcements(teacher_id);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Docente de la materia puede ver y escribir sus anuncios
CREATE POLICY "announcements_teacher_all"
  ON announcements FOR ALL
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- Estudiantes matriculados pueden leer los no archivados
CREATE POLICY "announcements_student_select"
  ON announcements FOR SELECT
  USING (
    NOT is_archived
    AND EXISTS (
      SELECT 1 FROM enrollments e
      JOIN semesters sem ON sem.id = (
        SELECT semester_id FROM subjects WHERE id = announcements.subject_id
      )
      WHERE e.user_id = auth.uid()
        AND e.program_id = sem.program_id
        AND e.status = 'active'
    )
  );

-- ──────────────────────────────────────────────────────────
-- 8. ANNOUNCEMENT READS
--    Tracking de qué estudiante leyó cada anuncio.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcement_reads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_reads_user
  ON announcement_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement
  ON announcement_reads(announcement_id);

ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcement_reads_own"
  ON announcement_reads FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "announcement_reads_teacher_select"
  ON announcement_reads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM announcements a
      WHERE a.id = announcement_reads.announcement_id
        AND (
          a.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
        )
    )
  );

-- ──────────────────────────────────────────────────────────
-- 9. DIRECT MESSAGES
--    Mensajes privados docente <-> estudiante.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS direct_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id   uuid REFERENCES subjects(id) ON DELETE SET NULL,
  body         text NOT NULL,
  sent_at      timestamptz NOT NULL DEFAULT now(),
  read_at      timestamptz
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient
  ON direct_messages(recipient_id, read_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender
  ON direct_messages(sender_id);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direct_messages_select"
  ON direct_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = recipient_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "direct_messages_insert"
  ON direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "direct_messages_update_read"
  ON direct_messages FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- ──────────────────────────────────────────────────────────
-- 10. SEED: Programa de Capacitacion Docente 120h
--     "Docencia Virtual Efectiva" — program_type = teacher_training
-- ──────────────────────────────────────────────────────────

DO $$
DECLARE
  v_program_id  uuid;
  v_semester_id uuid;
  subj_ids      uuid[] := ARRAY[]::uuid[];
  subj_id       uuid;
  sess_id       uuid;

  -- Module definitions: (order, code, name, hours, description)
  modules text[][] := ARRAY[
    ARRAY['1','CAP101','Fundamentos de la Educacion Virtual y el Marco CES','12',
          'Principios de la educacion en linea, marco normativo CES Ecuador, Art. 61 RRA 2022, modalidades de aprendizaje virtual y roles del docente en entornos digitales.'],
    ARRAY['2','CAP102','Uso Efectivo del LMS ITSEIA (Navegacion y Contenido)','16',
          'Navegacion completa del campus ITSEIA: crear sesiones, subir video y teoria, gestionar quizzes, revisar entregas y usar el AI Lab como docente.'],
    ARRAY['3','CAP103','Diseno de Contenido Interactivo y Evaluaciones Online','20',
          'Estrategias de diseno instruccional para entornos virtuales: microlearning, contenido multimedia, rubricas de evaluacion, quizzes adaptativos y feedback efectivo.'],
    ARRAY['4','CAP104','Facilitacion de Clases Sincronicas con Videoconferencia','14',
          'Tecnicas de facilitacion en videoconferencia: dinámicas de participacion, control del aula virtual, gestion del tiempo, grabacion de clases y seguimiento post-sesion.'],
    ARRAY['5','CAP105','Evaluacion Formativa y Retroalimentacion Efectiva','16',
          'Diseno de evaluaciones continuas, retroalimentacion constructiva por escrito, criterios de calificacion transparentes, prevencion del plagio y etica academica online.'],
    ARRAY['6','CAP106','Seguimiento del Progreso Estudiantil y Tutoria Virtual','14',
          'Uso de analytics del LMS para identificar estudiantes en riesgo, estrategias de intervencion temprana, comunicacion proactiva y documentacion de tutoria virtual.'],
    ARRAY['7','CAP107','Inteligencia Artificial como Herramienta Pedagogica','16',
          'Aplicaciones practicas de IA generativa (ChatGPT, Claude, Gemini) para preparar clases, crear ejercicios, personalizar contenido y dar retroalimentacion automatizada.'],
    ARRAY['8','CAP108','Etica, Privacidad y Normativa en la Educacion Online','12',
          'Proteccion de datos personales (LOPDP Ecuador), derechos de autor en contenido digital, accesibilidad e inclusion, etica en el uso de IA y politicas institucionales ITSEIA.']
  ];

  -- Sessions per module (3 sessions each): (order, title, description)
  sess_defs text[][][] := ARRAY[
    -- Module 1
    ARRAY[
      ARRAY['1','Paradigmas de la Educacion Virtual','Historia, modelos y evidencia de efectividad de la educacion en linea. Diferencias con modalidad presencial.'],
      ARRAY['2','Marco Normativo CES para Modalidad en Linea','Art. 57, 61, 62 RRA 2022. Requisitos de horas sincronicas, contenido y capacitacion docente.'],
      ARRAY['3','El Rol del Docente Virtual Efectivo','Competencias digitales, gestion del tiempo, comunicacion asincronica y presencia docente online.']
    ],
    -- Module 2
    ARRAY[
      ARRAY['1','Navegacion y Configuracion del Campus','Tour completo del LMS ITSEIA: dashboard, materias, sesiones, herramientas del docente.'],
      ARRAY['2','Creacion y Edicion de Sesiones Academicas','Subir video, presentacion, teoria markdown, configurar quiz y ejercicio. Indicadores de calidad CES.'],
      ARRAY['3','Gestion de Entregas y Retroalimentacion','Panel de entregas, calificacion, feedback escrito, seguimiento del progreso estudiantil en el LMS.']
    ],
    -- Module 3
    ARRAY[
      ARRAY['1','Principios de Diseno Instruccional para e-Learning','Modelo ADDIE adaptado a entornos virtuales. Objetivos de aprendizaje verificables y alineacion curricular.'],
      ARRAY['2','Creacion de Contenido Multimedia Efectivo','Video educativo de calidad, presentaciones interactivas, teoria estructurada en markdown. Estandar 1500 palabras.'],
      ARRAY['3','Evaluaciones Online y Rubricas de Calificacion','Tipos de evaluacion, diseno de quizzes anti-trampa, rubricas con criterios y pesos, feedback automatizado.']
    ],
    -- Module 4
    ARRAY[
      ARRAY['1','Configuracion Tecnica de Videoconferencia','Setup de camara, microfono, fondo virtual. Herramientas de participacion: sondeos, salas de trabajo, pizarra.'],
      ARRAY['2','Facilitacion Activa en Clase Sincronica','Tecnicas para mantener atencion, dinamicas de participacion, manejo de imprevistos tecnicos, cierre efectivo.'],
      ARRAY['3','Grabacion, Edicion y Publicacion de Clases','Flujo de trabajo: grabar, editar lo esencial, subir a YouTube privado, vincular en el LMS para clase asincronica.']
    ],
    -- Module 5
    ARRAY[
      ARRAY['1','Evaluacion Continua y Aprendizaje Formativo','Diferencia evaluacion formativa vs sumativa. Estrategias de check-in rapido: exit tickets, kahoot, quizzes cortos.'],
      ARRAY['2','Retroalimentacion Escrita de Alto Impacto','Modelo SBI (Situacion-Comportamiento-Impacto). Feedback especifico, accionable y oportuno por plataforma.'],
      ARRAY['3','Integridad Academica en Entornos Digitales','Prevencion del plagio, configuracion de deteccion en quizzes, politica de integridad ITSEIA, consecuencias.']
    ],
    -- Module 6
    ARRAY[
      ARRAY['1','Lectura de Analytics del LMS','Interpretar reportes de progreso, tasas de completitud, tiempo en sesion y patrones de acceso de los estudiantes.'],
      ARRAY['2','Identificacion Temprana de Estudiantes en Riesgo','Criterios de riesgo: 30% sesiones incompletas, quiz promedio menor 60%, 2+ inasistencias consecutivas. Protocolo de intervencion.'],
      ARRAY['3','Comunicacion y Tutoria Virtual Proactiva','Mensajes de seguimiento efectivos, frecuencia recomendada, registro de intervenciones, escalacion a coordinacion.']
    ],
    -- Module 7
    ARRAY[
      ARRAY['1','Fundamentos de IA Generativa para Docentes','Como funcionan LLMs (ChatGPT, Claude, Gemini). Prompt engineering basico aplicado a preparacion de clases.'],
      ARRAY['2','IA para Creacion de Contenido Educativo','Prompts para generar quizzes, ejercicios, resumenes, casos de estudio y retroalimentacion personalizada.'],
      ARRAY['3','IA para Personalizacion y Seguimiento','Usar IA para analizar respuestas de estudiantes, identificar patrones de error, sugerir recursos adicionales.']
    ],
    -- Module 8
    ARRAY[
      ARRAY['1','Proteccion de Datos en la Educacion Online','LOPDP Ecuador: datos que se recopilan en el LMS, derechos de los estudiantes, politica de privacidad ITSEIA.'],
      ARRAY['2','Derechos de Autor y Contenido Digital','Creative Commons, uso justo, citar correctamente, crear contenido original vs curado, politica de copyright.'],
      ARRAY['3','Accesibilidad, Inclusion y Etica Docente','Diseno universal para el aprendizaje, subtitulos en videos, texto alternativo, conducta etica en entornos digitales.']
    ]
  ];

BEGIN
  -- Check if already seeded
  IF EXISTS (
    SELECT 1 FROM programs WHERE slug = 'docencia-virtual-efectiva'
  ) THEN
    RAISE NOTICE 'Teacher training program already seeded, skipping.';
    RETURN;
  END IF;

  -- Create the training program
  INSERT INTO programs (
    id, name, slug, description, type, price, duration_months,
    is_active, total_semesters
  ) VALUES (
    gen_random_uuid(),
    'Docencia Virtual Efectiva',
    'docencia-virtual-efectiva',
    'Programa de capacitacion de 120 horas para docentes de modalidad en linea. Requisito Art. 61 RRA 2022 (CES Ecuador). Cubre fundamentos pedagogicos, uso del LMS ITSEIA, diseno de contenido, facilitacion sincronica, evaluacion, tutoria virtual e inteligencia artificial aplicada a la docencia.',
    'teacher_training',
    0,
    3,
    true,
    1
  ) RETURNING id INTO v_program_id;

  -- Create 1 semester
  INSERT INTO semesters (
    id, program_id, number, name, level, is_active
  ) VALUES (
    gen_random_uuid(),
    v_program_id,
    1,
    'Capacitacion Completa 120h',
    'professional',
    true
  ) RETURNING id INTO v_semester_id;

  -- Create 8 subjects (one per module)
  FOR i IN 1..8 LOOP
    INSERT INTO subjects (
      id, semester_id, code, name, slug,
      description, credit_hours,
      hours_docencia, hours_practica, hours_autonomo, hours_total,
      order_index, is_active
    ) VALUES (
      gen_random_uuid(),
      v_semester_id,
      modules[i][2],
      modules[i][3],
      lower(replace(replace(modules[i][3], ' ', '-'), '/', '-')),
      modules[i][5],
      0,
      modules[i][4]::int / 2,
      modules[i][4]::int / 4,
      modules[i][4]::int / 4,
      modules[i][4]::int,
      i,
      true
    ) RETURNING id INTO subj_id;

    subj_ids := array_append(subj_ids, subj_id);

    -- Create 3 sessions per module
    FOR j IN 1..3 LOOP
      INSERT INTO sessions (
        id, subject_id, number, title, description,
        theory_markdown, estimated_duration_minutes,
        order_index, is_active
      ) VALUES (
        gen_random_uuid(),
        subj_id,
        j,
        sess_defs[i][j][2],
        sess_defs[i][j][3],
        '# ' || sess_defs[i][j][2] || E'\n\n' ||
        sess_defs[i][j][3] || E'\n\n' ||
        '## Contenido en Desarrollo' || E'\n\n' ||
        'El equipo de coordinacion academica de ITSEIA esta completando el contenido de este modulo. ' ||
        'Podras acceder al material completo proximamente.' || E'\n\n' ||
        '## Objetivo de Aprendizaje' || E'\n\n' ||
        'Al completar esta sesion podras aplicar los conceptos de **' || sess_defs[i][j][2] ||
        '** en tu practica docente dentro del campus ITSEIA.' || E'\n\n' ||
        '## Actividades Sugeridas Mientras Tanto' || E'\n\n' ||
        '- Revisa la documentacion oficial del campus en la seccion de ayuda.' || E'\n' ||
        '- Explora las materias de ejemplo disponibles en tu panel docente.' || E'\n' ||
        '- Comparte dudas con el coordinador academico por WhatsApp: +593 95 989 2034',
        modules[i][4]::int * 20 / 3,
        j,
        true
      ) RETURNING id INTO sess_id;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Teacher training program seeded successfully. Program ID: %', v_program_id;
END;
$$;
