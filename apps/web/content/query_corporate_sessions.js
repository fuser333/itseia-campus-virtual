#!/usr/bin/env node
/**
 * Query sessions for corporate programs to get their IDs
 */

const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";
const H = { "apikey": SKEY, "Authorization": "Bearer " + SKEY };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  return r.json();
}

async function main() {
  // 1. Get programs
  const programs = await get("/programs?slug=in.(capacitacion-ia-equipos,transformacion-digital-ia)&select=id,name,slug");
  console.log("=== PROGRAMS ===");
  console.log(JSON.stringify(programs, null, 2));

  for (const prog of programs) {
    console.log(`\n=== PROGRAM: ${prog.name} (${prog.id}) ===`);

    // 2. Get semesters for this program
    const semesters = await get(`/semesters?program_id=eq.${prog.id}&select=id,name`);
    console.log("Semesters:", JSON.stringify(semesters, null, 2));

    for (const sem of semesters) {
      // 3. Get subjects
      const subjects = await get(`/subjects?semester_id=eq.${sem.id}&select=id,name,code&order=order_index`);
      console.log(`\nSubjects for semester ${sem.name}:`, JSON.stringify(subjects, null, 2));

      for (const subj of subjects) {
        // 4. Get sessions
        const sessions = await get(`/sessions?subject_id=eq.${subj.id}&select=id,title,order_index,video_url&order=order_index`);
        console.log(`\n  Sessions for subject ${subj.name}:`);
        sessions.forEach(s => {
          console.log(`    [${s.id}] order=${s.order_index} title="${s.title}" video_url=${s.video_url || 'NULL'}`);
        });
      }
    }
  }
}

main().catch(console.error);
