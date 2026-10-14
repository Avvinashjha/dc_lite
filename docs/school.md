# DailyCoder School

School is a separate learning area within DailyCoder at `/school`. The initial
curriculum direction is CBSE/NCERT. It shares the existing Astro/Preact stack and
static deployment. School has its own layout, navigation, and styles; it does not
load the developer site's advertisements, analytics, public community content,
authentication gates, or progress-sync scripts.

## Current preview

- Class selector for Classes 1–12, retained on this device and carried in links.
- Classes 1–4: warmer colours, rounded shapes, larger text and controls.
- Classes 5–8: friendly, structured learning workspace.
- Classes 9–10: quieter colours and a more focused presentation.
- Classes 11–12: mature presentation and engineering (PCM), medical (PCB),
  commerce, and arts/humanities subject presets. These are navigation presets,
  not official compulsory subject combinations or entrance-exam programmes.
  “All subjects” keeps other combinations accessible.
- Learn: original introductory lessons, worked examples, completion tracking,
  and links to practice and the lesson helper. Mathematics has a starter for
  every class; Class 6 additionally has science, English, Hindi, social science,
  and computing. Senior classes additionally have physics, biology, accountancy,
  economics, and history examples. Other subject shelves show their availability.
- Play: a memory game with number/dot pairs, fraction/decimal pairs, or powers
  and values, depending on the class group.
- Code: three executable direction-block puzzles covering sequencing and
  debugging. This is a deterministic interpreter, not a free-form code runner.
- Quiz: Smash (large answer tiles and immediate explanations), Rush (60-second
  round and end-of-round review), Think (untimed reasoning and explanations).
- Tests: subject-filtered, untimed checks of individual starter lessons. These
  are not full chapters, board mock papers, JEE tests, or NEET tests.
- Ask: explicitly labelled authored lesson recaps, examples, and questions.
  **No LLM is connected.** The provider is intentionally undecided at the user's
  request. No questions or student data are sent to an AI service.
- Browser-local class selection, lesson completion, coding completion, and the
  most recent 50 quiz/test attempts. No names, dates of birth, or school identities
  are collected. Storage failures fall back to session-only progress.

This is a working foundation with starter content, not a completed school
curriculum. Age groups refer to **class numbers**, not ages. The interface is
primarily English; the Hindi starter is in Hindi.

## Content and curriculum

`src/data/school.ts` contains subjects, stream presets, original lessons, questions,
and reference links. `src/types/school.ts` defines the shared serializable model.
`src/lib/school.ts` contains class filtering, profile validation, scoring, and the
block interpreter. The UI components live in `src/components/school/`.

References checked on 14 October 2026:

- [CBSE curriculum, academic year 2026–27](https://cbseacademic.nic.in/curriculum_2027.html)
- [NCERT textbook library](https://ncert.nic.in/textbook.php)

These references guide the platform structure. The starter lessons are original
illustrative material and have **not** been mapped to specific current textbook
chapters or reviewed by subject teachers. Do not label them official, complete,
or board-approved. Before expanding, introduce a versioned content catalogue:

`board → academic year → class → subject/course → textbook edition → chapter → topic`

Each publishable lesson should record a stable ID, outcomes, prerequisites,
language, source references, content version, reviewer, and publication state.
Keep CBSE syllabus version and NCERT textbook edition separate; revisions can
change the chapter sequence. Separate school-subject mastery from optional
entrance-exam preparation. Preserve IDs when adding a backend so saved progress
can be migrated.

## Ask service design for the next phase

Keep API keys and policy enforcement on a server. The static web app should send
only a validated class, subject, topic/lesson ID, question, and desired help mode
(hint, explanation, example, or practice). Resolve curriculum context from the
server's reviewed catalogue; never trust text or answer constraints supplied by
the browser as authoritative instructions.

The server should retrieve only material permitted for the selected context,
enforce input size and rate limits, and apply input/output safety checks suitable
for the student audience. Retrieved text and student questions must be treated
as untrusted data. A prompt alone is not an output-control boundary.

Use a provider-neutral response contract with `status`, `explanation`, `hint`,
`followUpQuestion`, and `sourceIds`. Validate it server-side, enforce class-appropriate
length, and reject source IDs outside the supplied context. For insufficient
evidence or out-of-context requests, return a clear clarification or limitation
instead of fabricating a lesson answer. Render text as text, never model HTML.
Do not provide live-test answers from an active test screen.

Before enabling the service, test prompt injection, off-topic questions, unsafe
requests, hallucinated citations, ambiguous questions, provider failures, and
age-appropriate explanations. Select the provider, storage/retention behaviour,
and operating budget before deployment. This design is not implemented by the
current lesson-recap panel.

## Follow-on milestones

1. Teacher review and chapter mapping for one complete class (Class 6 has the
   broadest starter coverage), including separate practice and assessment banks.
2. Versioned content publishing and teacher/admin review workflow.
3. Optional accounts, parent/teacher views, and cross-device progress, designed
   for the school audience before integration with existing developer accounts.
4. Controlled Ask backend after provider selection and evaluation.
5. Broader subject coverage, richer games, text-based coding, and chapter tests.
6. Shared content/progress APIs for future Android and iOS clients.

## Validation

Run `npm run test:school` for class boundaries, subject filtering, content
integrity, scoring, browser-state validation, and robot execution. It uses Node's
TypeScript stripping; use Node 22.6+ (CI uses the current Node 22 release).
`npm run build` includes this suite and the existing problem validation suite.

Browser checks should cover lesson completion and reload persistence, a full
quiz, Rush expiry, incomplete-test submission, robot execution, memory gameplay,
all class groups, senior presets, empty subjects, Ask availability, and mobile
layout. Local preview: `npm run dev`, then `/school`.
