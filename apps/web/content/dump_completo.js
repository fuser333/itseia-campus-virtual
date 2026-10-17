#!/usr/bin/env node
const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const H = { apikey: SKEY, Authorization: 'Bearer ' + SKEY };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  return r.json();
}

async function main() {
  const subjectIds = 'fda75990-dc63-4e99-8093-cd4f53eadf73,82ed7436-0d03-4060-9f98-667668457088,f73d4495-257d-4829-bcdb-a2facb96b08f,7f01fe2e-700b-4b74-b092-bb334096b99b,e9aa6dd7-dc86-4e67-ba20-ef3e026f57f5';
  const sessions = await get(`/sessions?subject_id=in.(${subjectIds})&select=id,number,title,subject_id,order_index&order=subject_id.asc,order_index.asc`);

  const quizzes = await get(`/quizzes?session_id=in.(${sessions.map(s=>s.id).join(',')})&select=id,session_id,title`);
  const quizSet = new Set(quizzes.map(q => q.session_id));

  const subjectMap = {
    'fda75990-dc63-4e99-8093-cd4f53eadf73': 'CONT-COM',
    '82ed7436-0d03-4060-9f98-667668457088': 'JUR-COM',
    'f73d4495-257d-4829-bcdb-a2facb96b08f': 'MED-COM',
    '7f01fe2e-700b-4b74-b092-bb334096b99b': 'GER-COM',
    'e9aa6dd7-dc86-4e67-ba20-ef3e026f57f5': 'ARQ-COM',
  };

  console.log('TOTAL SESSIONS:', sessions.length);
  console.log('EXISTING QUIZZES:', quizzes.length);
  console.log('');
  for (const s of sessions) {
    const code = subjectMap[s.subject_id];
    console.log(`${code} | idx=${s.order_index} | quiz=${quizSet.has(s.id)?'YES':'NO'} | id=${s.id} | ${s.title}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
