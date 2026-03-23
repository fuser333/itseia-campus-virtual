#!/usr/bin/env node
/**
 * Query all bootcamp sessions to see their exact titles and current video_url status
 * Run: node content/query_bootcamp_sessions.js
 */

const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";

const H = {
  "apikey": SKEY,
  "Authorization": "Bearer " + SKEY,
  "Content-Type": "application/json"
};

async function main() {
  // Get program
  const progRes = await fetch(`${BASE}/programs?select=id,name,slug&slug=eq.bootcamp-ia-intensivo`, { headers: H });
  const programs = await progRes.json();
  console.log("Programs:", JSON.stringify(programs));

  if (!programs.length) {
    console.log("No program found!");
    return;
  }

  const programId = programs[0].id;

  // Get semesters
  const semRes = await fetch(`${BASE}/semesters?select=id,number,name&program_id=eq.${programId}&order=number`, { headers: H });
  const semesters = await semRes.json();
  console.log("\nSemesters:", JSON.stringify(semesters));

  const semIds = semesters.map(s => s.id).join(",");

  // Get subjects
  const subRes = await fetch(`${BASE}/subjects?select=id,code,name,order_index&semester_id=in.(${semIds})&order=order_index`, { headers: H });
  const subjects = await subRes.json();
  console.log("\nSubjects:", JSON.stringify(subjects));

  const subIds = subjects.map(s => s.id).join(",");

  // Get sessions
  const sessRes = await fetch(`${BASE}/sessions?select=id,number,title,subject_id,video_url&subject_id=in.(${subIds})&order=order_index&limit=100`, { headers: H });
  const sessions = await sessRes.json();

  console.log(`\n=== All ${sessions.length} Sessions ===`);
  for (const s of sessions) {
    const subj = subjects.find(x => x.id === s.subject_id);
    const hasVideo = s.video_url ? "HAS_VIDEO" : "NO_VIDEO";
    console.log(`  [${hasVideo}] #${s.number} [${subj?.code}] "${s.title}"`);
  }

  const withVideo = sessions.filter(s => s.video_url);
  const withoutVideo = sessions.filter(s => !s.video_url);
  console.log(`\nTotal: ${sessions.length} | With video: ${withVideo.length} | Without video: ${withoutVideo.length}`);
}

main().catch(console.error);
