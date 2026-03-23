#!/usr/bin/env node
const fs = require('fs');

const SUBJECT_MAP = {
  'inteligencia-artificial': '0df94819-8ccc-499b-ae88-7ed70713295d',
  'ciencia-de-datos': '015311e7-c0d0-4065-abbf-83ab210da384',
  'big-data': '191281b2-a3bb-4fbd-9a1d-f92443d1be3b'
};

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const headers = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};
const headersMin = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

async function loadFile(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  let carrera, sesiones;

  if (raw.materias) {
    carrera = raw.materias[0].carrera;
    sesiones = raw.materias[0].sesiones;
  } else if (raw.materia) {
    carrera = raw.materia.carrera;
    sesiones = raw.materia.sesiones;
  } else {
    console.log('Unknown format in ' + file);
    return;
  }

  const subjectId = SUBJECT_MAP[carrera];
  if (!subjectId) {
    console.log('No subject ID for ' + carrera);
    return;
  }

  console.log('\n' + carrera + ': ' + sesiones.length + ' sesiones');

  for (const s of sesiones) {
    // Insert session
    const sessionBody = {
      subject_id: subjectId,
      number: s.number,
      title: s.title,
      description: s.title,
      video_url: s.video_url || null,
      theory_markdown: s.theory_markdown || null,
      ai_lab_context: s.ai_context || null,
      ai_lab_suggested_prompt: s.ai_prompt_suggested || null,
      order_index: s.number,
      estimated_duration_minutes: s.video_duration_minutes || 45,
      is_active: true
    };

    const res = await fetch(BASE + '/sessions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(sessionBody)
    });

    const data = await res.json();
    if (res.status !== 201) {
      console.log('  ERROR S' + s.number + ': ' + JSON.stringify(data).substring(0, 100));
      continue;
    }

    const sessionId = Array.isArray(data) ? data[0].id : data.id;
    let info = '  S' + s.number + ' OK';

    // Quiz
    if (s.quiz && s.quiz.questions && s.quiz.questions.length > 0) {
      const qRes = await fetch(BASE + '/quizzes', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          session_id: sessionId,
          title: s.quiz.title || 'Quiz Sesion ' + s.number,
          pass_percentage: s.quiz.pass_percentage || 70,
          max_attempts: 3,
          is_active: true
        })
      });

      if (qRes.status === 201) {
        const qData = await qRes.json();
        const quizId = Array.isArray(qData) ? qData[0].id : qData.id;

        for (let i = 0; i < s.quiz.questions.length; i++) {
          const q = s.quiz.questions[i];
          await fetch(BASE + '/quiz_questions', {
            method: 'POST',
            headers: headersMin,
            body: JSON.stringify({
              quiz_id: quizId,
              question_text: q.question_text,
              question_type: 'multiple_choice',
              options: JSON.stringify(q.options),
              explanation: q.explanation || null,
              points: 1,
              order_index: i + 1
            })
          });
        }
        info += ' | Quiz: ' + s.quiz.questions.length + 'q';
      }
    }

    // Assignment
    if (s.assignment) {
      await fetch(BASE + '/assignments', {
        method: 'POST',
        headers: headersMin,
        body: JSON.stringify({
          session_id: sessionId,
          title: s.assignment.title,
          instructions_markdown: s.assignment.instructions_markdown,
          allowed_file_types: s.assignment.allowed_file_types || ['pdf', 'py'],
          max_grade: 100,
          is_active: true
        })
      });
      info += ' | Ejercicio OK';
    }

    // Resources
    if (s.resources && s.resources.length > 0) {
      for (let i = 0; i < s.resources.length; i++) {
        const r = s.resources[i];
        await fetch(BASE + '/session_resources', {
          method: 'POST',
          headers: headersMin,
          body: JSON.stringify({
            session_id: sessionId,
            title: r.title,
            url: r.url,
            type: r.type || 'link',
            description: r.description || null,
            order_index: i + 1
          })
        });
      }
      info += ' | Recursos: ' + s.resources.length;
    }

    console.log(info);
  }
}

async function main() {
  console.log('=== Cargando contenido de 12 sesiones ===');
  await loadFile('content/seed_sessions_s1_part1.json');
  await loadFile('content/seed_sessions_s1_part2.json');
  await loadFile('content/seed_sessions_s1_part3.json');
  console.log('\n=== COMPLETADO ===');
}

main().catch(e => console.error(e));
