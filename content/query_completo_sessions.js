#!/usr/bin/env node
/**
 * query_completo_sessions.js
 * Queries all sessions for especialista-ia-completo program
 */

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const H = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=representation' };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  const data = await r.json();
  if (r.status >= 400) throw new Error(`GET ${path} → ${r.status}: ${JSON.stringify(data).substring(0, 300)}`);
  return data;
}

async function main() {
  // 1. Get program
  const programs = await get('/programs?slug=eq.especialista-ia-completo&select=id,name,slug');
  console.log('Programs:', JSON.stringify(programs, null, 2));
  if (!programs.length) { console.log('Program NOT FOUND'); return; }
  const programId = programs[0].id;

  // 2. Get semesters
  const semesters = await get(`/semesters?program_id=eq.${programId}&select=id,number,name&order=number.asc`);
  console.log('\nSemesters:', JSON.stringify(semesters, null, 2));

  // 3. Get subjects
  const semIds = semesters.map(s => s.id).join(',');
  const subjects = await get(`/subjects?semester_id=in.(${semIds})&select=id,code,name,semester_id&order=order_index.asc`);
  console.log('\nSubjects:', JSON.stringify(subjects, null, 2));

  // 4. Get sessions
  const subIds = subjects.map(s => s.id).join(',');
  const sessions = await get(`/sessions?subject_id=in.(${subIds})&select=id,number,title,subject_id&order=order_index.asc`);
  console.log('\nSessions total:', sessions.length);
  console.log('\nSessions:', JSON.stringify(sessions, null, 2));

  // 5. Get existing quizzes
  const sesIds = sessions.map(s => s.id).join(',');
  const quizzes = await get(`/quizzes?session_id=in.(${sesIds})&select=id,session_id,title`);
  console.log('\nExisting quizzes:', quizzes.length);

  // Summary: which sessions have quizzes
  const quizSet = new Set(quizzes.map(q => q.session_id));
  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.id] = s; });

  console.log('\n--- SESSION SUMMARY ---');
  for (const s of sessions) {
    const sub = subjectMap[s.subject_id];
    const hasQ = quizSet.has(s.id);
    console.log(`[${sub?.code || '?'}] ${s.title} | quiz=${hasQ ? 'YES' : 'NO'}`);
  }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
