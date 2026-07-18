#!/usr/bin/env node
/**
 * Query current state of Curso Express: IA para Profesionales
 * Shows all sessions with their video_url, quiz, and assignment status
 */

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const H = { 'apikey': SKEY, 'Authorization': 'Bearer ' + SKEY, 'Content-Type': 'application/json' };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  return r.json();
}

async function main() {
  // Get program
  const programs = await get('/programs?slug=eq.ia-profesionales-express&select=id,title,slug');
  console.log('Program:', JSON.stringify(programs));

  if (!programs || programs.length === 0) {
    console.log('No program found with slug ia-profesionales-express');
    // List all programs
    const all = await get('/programs?select=id,title,slug');
    console.log('All programs:', JSON.stringify(all, null, 2));
    return;
  }

  const programId = programs[0].id;
  console.log('\nProgram ID:', programId);

  // Get semesters
  const semesters = await get(`/semesters?program_id=eq.${programId}&select=id,number,name&order=number.asc`);
  console.log('\nSemesters:', JSON.stringify(semesters, null, 2));

  // Get subjects for all semesters
  const semesterIds = semesters.map(s => s.id);
  const subjects = await get(`/subjects?semester_id=in.(${semesterIds.join(',')})&select=id,code,name,semester_id&order=order_index.asc`);
  console.log('\nSubjects count:', subjects.length);

  // Get sessions for all subjects
  const subjectIds = subjects.map(s => s.id);
  const sessions = await get(`/sessions?subject_id=in.(${subjectIds.join(',')})&select=id,number,title,video_url,subject_id&order=order_index.asc`);
  console.log('\nSessions count:', sessions.length);

  // Get quizzes for all sessions
  const sessionIds = sessions.map(s => s.id);
  const quizzes = await get(`/quizzes?session_id=in.(${sessionIds.join(',')})&select=id,session_id,title`);
  console.log('\nQuizzes count:', quizzes.length);

  // Get assignments for all sessions
  const assignments = await get(`/assignments?session_id=in.(${sessionIds.join(',')})&select=id,session_id,title`);
  console.log('\nAssignments count:', assignments.length);

  // Build lookup maps
  const quizMap = {};
  quizzes.forEach(q => { quizMap[q.session_id] = q; });
  const assignmentMap = {};
  assignments.forEach(a => { assignmentMap[a.session_id] = a; });
  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.id] = s; });
  const semesterMap = {};
  semesters.forEach(s => { semesterMap[s.id] = s; });

  // Print full state
  console.log('\n\n========== FULL STATE ==========');
  let noVideo = 0, noQuiz = 0, noAssignment = 0;

  for (const session of sessions) {
    const subject = subjectMap[session.subject_id];
    const semester = semesterMap[subject?.semester_id];
    const hasVideo = !!session.video_url;
    const hasQuiz = !!quizMap[session.id];
    const hasAssignment = !!assignmentMap[session.id];

    const status = `video:${hasVideo ? 'Y' : 'N'} quiz:${hasQuiz ? 'Y' : 'N'} assign:${hasAssignment ? 'Y' : 'N'}`;
    console.log(`[${semester?.number || '?'}][${subject?.code || '?'}] ${session.title} — ${status}`);
    console.log(`  ID: ${session.id}`);

    if (!hasVideo) noVideo++;
    if (!hasQuiz) noQuiz++;
    if (!hasAssignment) noAssignment++;
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`Total sessions: ${sessions.length}`);
  console.log(`Missing video: ${noVideo}`);
  console.log(`Missing quiz: ${noQuiz}`);
  console.log(`Missing assignment: ${noAssignment}`);

  // Output full data as JSON for use in next script
  const fullData = {
    programId,
    sessions: sessions.map(s => ({
      id: s.id,
      title: s.title,
      subject_id: s.subject_id,
      subjectCode: subjectMap[s.subject_id]?.code,
      subjectName: subjectMap[s.subject_id]?.name,
      semesterNumber: semesterMap[subjectMap[s.subject_id]?.semester_id]?.number,
      semesterName: semesterMap[subjectMap[s.subject_id]?.semester_id]?.name,
      hasVideo: !!s.video_url,
      video_url: s.video_url,
      hasQuiz: !!quizMap[s.id],
      quizId: quizMap[s.id]?.id,
      hasAssignment: !!assignmentMap[s.id],
      assignmentId: assignmentMap[s.id]?.id
    }))
  };

  const fs = require('fs');
  fs.writeFileSync('/Users/hectorvelasco/Mis Empresas/ITSEIA/DEPARTAMENTOS/08_TECNOLOGIA_INNOVACION/PROYECTO_CAMPUS_VIRTUAL_ITSEIA/app/content/express_state.json', JSON.stringify(fullData, null, 2));
  console.log('\nState saved to express_state.json');
}

main().catch(e => console.error('FATAL:', e));
