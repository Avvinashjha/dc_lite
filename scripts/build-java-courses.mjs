import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { javaCourses, sources, researchDate, moduleSlug, courseQuizSlug, publicQuizSlug, quizMeta } from './data/java-curriculum.mjs';
import { predictions } from './data/java-predictions.mjs';
import { packageJavaLabs } from './package-java-labs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const write = (relative, text) => {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive:true });
  fs.writeFileSync(target, text);
};
const json = (relative, value) => write(relative, JSON.stringify(value, null, 2) + '\n');
const fence = (code, lang = 'java') => {
  const marker = '`'.repeat(Math.max(3, ...(code.match(/`+/g) || []).map(run => run.length + 1)));
  return `\n\n${marker}${lang}\n${code}\n${marker}\n\n`;
};
const references = sources.map(([title, url]) => `- [${title}](${url})`).join('\n');

let curriculum = `# Java developer learning path\n\nResearch reviewed: ${researchDate}.\n\n` +
  'Three sequential courses, 30 modules, 120 short chapters, 30 guided walkthroughs, 30 local labs, 30 module quizzes, and 33 independent public quizzes. The guide and lab are separate lesson pages; each guide contains four chapter sections.\n\n' +
  '## Teaching approach\n\nEvery module starts with a familiar problem, introduces four short chapters, and connects them to an authored code example. Learners predict a result, step through the reasoning, modify the example locally, and check acceptance criteria before taking a module quiz. Hints and reference approaches stay collapsed until requested. The browser walkthrough shows authored states; it does not execute Java.\n\n' +
  'Use Java 25 LTS without preview features. Read older idioms when relevant. Use Maven consistently for project labs; Gradle is introduced as an alternative. Spring project setup uses a compatible stable release from Initializr, whose generated dependency versions and wrapper must be committed. Project fragments identify their required environment.\n\n' +
  '## Assessment design\n\nEach module quiz has seven explained questions, including a prediction about the shown code, and a 70% pass threshold under the existing progression rules. Public practice has its own seven-question entry per topic plus one 20-question readiness quiz per course. Five questions overlap between a module assessment and its public practice set for retrieval practice; each set also has two exclusive questions. Readiness quizzes remix questions across ten modules. There are 270 distinct authored questions and 480 question placements across 63 quizzes. Quizzes are untimed and unranked; capstone checks provide evidence beyond multiple-choice scores. Public quizzes are independent of course enrollment.\n\n' +
  '## Runnable projects and chapter practice\n\nEvery chapter includes a worked example, a focused question, and a concealed answer. Standalone snippets can be run in Java 25 JShell; project examples identify their source file in the downloadable reference. The complete source archive includes a Maven wrapper, three capstones with regression tests, migrations, HTTP examples, and a named-module/jlink exercise. See [project setup and walkthroughs](../examples/java/README.md). The site serves the archive at /downloads/java-course-labs.zip.\n\n' +
  '## Course progression and chapter layout\n\n';

for (const course of javaCourses) {
  const dir = `content/courses/${course.slug}`;
  json(`${dir}/meta.json`, { title:course.title, description:course.description, author:'DailyCoder',
    level:course.level, duration:course.duration, tags:['Java','Interactive', ...(course.level === 'advanced' ? ['Spring Boot','Backend'] : ['OOP','Projects'])],
    modules:course.modules.map((mod, i) => ({ slug:moduleSlug(mod, i), title:mod.title })), draft:false });
  curriculum += `### ${course.title}\n\n**Prerequisite:** ${course.prerequisite}\n\n**Outcome:** ${course.outcome}\n\n**Estimated effort:** ${course.duration}, including exercises. **Capstone:** ${course.project}.\n\n`;
  for (const [index, mod] of course.modules.entries()) {
    const slug = moduleSlug(mod, index);
    const base = `${dir}/${slug}`;
    const checkSlug = courseQuizSlug(mod);
    const practiceSlug = publicQuizSlug(mod);
    json(`${base}/meta.json`, { title:mod.title, description:mod.scenario, lessons:[
      { slug:'01-learn-and-explore', title:`${mod.title}: learn and explore`, type:'interactive', duration:'20 min' },
      { slug:'02-practice-lab', title:`${mod.title}: practical lab`, type:'text', duration:index === 9 ? '120 min' : '45 min' },
      { slug:'03-module-quiz', title:`${mod.title}: module quiz`, type:'quiz', duration:'10 min', quizSlug:checkSlug, passingScore:70 },
    ] });
    const predictionRow = mod.questions.at(-1);
    const predictionOptions = [predictionRow[1], ...predictionRow[2]];
    const shift = index % predictionOptions.length;
    const rotated = predictionOptions.slice(shift).concat(predictionOptions.slice(0, shift));
    const lab = { title:mod.title, code:mod.code, output:mod.output,
      steps:mod.trace.map(([label, detail]) => ({ label, detail })),
      prediction:{ question:predictions[mod.id][0], options:rotated, answer:rotated.indexOf(predictionRow[1]), explanation:predictionRow[3] } };
    const environment = mod.environment || (mod.id === 'first-program'
      ? 'Save the example as Receipt.java, then run javac Receipt.java and java Receipt. You can also paste the class into JShell and call Receipt.main(new String[0]).'
      : 'Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.');
    let guide = `# ${mod.title}\n\n**Real-life problem:** ${mod.scenario}\n\n**You will learn:** ${mod.chapters.map(([title]) => title).join('; ')}.\n\n`;
    guide += mod.chapters.map(([title, text], i) => {
      const activity = mod.workshops[i];
      let example;
      if (activity.codeFile) {
        const code = fs.readFileSync(path.join(root,'examples/java',activity.codeFile),'utf8');
        const language = activity.codeFile.endsWith('.java') ? 'java' : activity.codeFile.endsWith('.xml') ? 'xml' : activity.codeFile.endsWith('.sql') ? 'sql' : activity.codeFile.endsWith('.sh') ? 'bash' : 'text';
        example = `**Follow the working project:** ${activity.why}\n\nFile in the [reference-project download](/downloads/java-course-labs.zip): \`${activity.codeFile}\`. Follow its README to build and run it.\n\n<details>\n<summary>Read the complete example source</summary>\n${fence(code.trim(),language)}\n</details>\n\n**Observe:** ${activity.output}`;
      } else {
        example = `**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after \`/reset\`.\n${fence(activity.code)}\n<details>\n<summary>Check the result and reasoning</summary>\n${fence(activity.output,'text')}\n${activity.why}\n\n</details>`;
      }
      return `## Chapter ${i + 1}: ${title}\n\n${text}\n\n${example}\n\n**Your turn:** ${activity.task}\n\n<details>\n<summary>Check your reasoning</summary>\n\n${activity.answer}\n\n</details>`;
    }).join('\n\n');
    guide += `\n\n## Predict and explore\n\n${environment}\n\n:::learninglab\n${JSON.stringify(lab, null, 2)}\n:::\n\n`;
    guide += `## Explain it back\n\nDescribe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.\n\n`;
    guide += `Continue to the [practical lab](/courses/${course.slug}/${slug}/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).\n\n<details>\n<summary>Official references and further reading</summary>\n\n${references}\n\n</details>\n`;
    write(`${base}/01-learn-and-explore.md`, guide);
    const sourceSolution = fence(mod.solution, mod.solutionLanguage || 'java');
    const exercise = `# Practical lab: ${mod.title}\n\n${mod.scenario}\n\n## Your challenge\n\n${mod.task}\n\n## Environment\n\n${environment}\n\n## Work through it\n\n1. Predict the original example’s result without running it.\n2. Reproduce it locally and explain any difference.\n3. Make the requested change in small steps.\n4. Check each acceptance criterion below; add a failing case before repairing a bug.\n\n## Acceptance criteria\n\n${mod.checks.map(check => `- [ ] ${check}`).join('\n')}\n\n` +
      `<details>\n<summary>Show a hint</summary>\n\n${mod.hint}\n\n</details>\n\n` +
      `<details>\n<summary>Show the reference approach</summary>\n\nThis is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.\n${sourceSolution}\n</details>\n\n` +
      `## Runnable reference project\n\n[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open \`${course.projectDirectory}/\` for this stage. Run \`./mvnw -pl ${course.projectDirectory} test\` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.\n\n` +
      `## Review your work\n\nExplain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.\n\n` +
      `[Take this module’s course quiz](/courses/${course.slug}/${slug}/03-module-quiz) · [Try independent public practice](/quiz/${practiceSlug}) · [See the full path](/courses/java)\n`;
    write(`${base}/02-practice-lab.md`, exercise);
    write(`${base}/03-module-quiz.md`, `# Module quiz: ${mod.title}\n\nSeven questions on this module’s concepts, code, and practical decisions. The pass threshold is 70%; with seven equally weighted questions this requires at least five correct answers. Review explanations after submitting and revisit the lab when needed.\n\nThe [independent practice quiz](/quiz/${practiceSlug}) is a separate entry and does not complete this course module.\n`);
    json(`content/quiz/${checkSlug}/quiz.json`, quizMeta(course, checkSlug, `${mod.title} — Module Quiz`, `Course assessment: ${mod.scenario}`, [...mod.questions.slice(0, 6), mod.questions.at(-1)], true));
    json(`content/quiz/${practiceSlug}/quiz.json`, quizMeta(course, practiceSlug, `${mod.title} — Java Practice`, `Independent practice: ${mod.scenario} Seven questions with explanations.`, mod.questions.slice(2)));
    curriculum += `#### Module ${index + 1}: ${mod.title}\n\n**Scenario:** ${mod.scenario}\n\n` +
      mod.chapters.map(([title, text], i) => `${i + 1}. **${title}.** ${text} **Chapter practice:** ${mod.workshops[i].task}`).join('\n') +
      `\n\n**Interactive activity:** ${mod.trace.map(([title]) => title).join(' → ')}.\n\n**Lab:** ${mod.task}\n\n**Acceptance checks:**\n\n${mod.checks.map(check => `- ${check}`).join('\n')}\n\n**Assessment:** seven-question module quiz; seven-question independent public practice.\n\n`;
  }
  const readinessSlug = `${course.slug}-readiness`;
  json(`content/quiz/${readinessSlug}/quiz.json`, quizMeta(course, readinessSlug, `${course.title} — Readiness Check`,
    `Twenty questions spanning all ten modules of ${course.title}. Available independently of course enrollment.`, course.modules.flatMap(mod => mod.questions.slice(6,8))));
}
curriculum += `## Boundaries and follow-on study\n\nThe path targets general Java backend development. Android, JavaFX, deep reactive programming, advanced Kubernetes administration, and vendor certification preparation are separate specializations. Required labs use finalized Java APIs. Interviews may need additional algorithm practice, and deployment to a real public service requires the learner’s own infrastructure and identity-provider configuration. No live Java execution service is added to this static site.\n\n## Research and rationale\n\nDev.java’s language/API/JVM organization informs the core sequence. The LTS roadmap supports Java 25 as a stable teaching baseline. The virtual-thread guidance informs task-per-thread examples and explicit resource bounds. Spring’s REST, JPA, compatibility, and testing documentation informs the backend sequence. These are original teaching examples, not copied tutorials.\n\n${references}\n\n## Maintaining the content\n\nEdit the authored modules, chapter workshops, and code predictions under scripts/data/java-*.mjs, then run node scripts/build-java-courses.mjs. The script regenerates the three Java courses, their 63 quizzes, this document, and the source-project ZIP; existing JavaScript, React, and Node courses are preserved. Run npm run test:java, npm run test:java:examples with Java 25, sh examples/java/verify.sh, and npm run build before publishing. Configure TEST_DB_URL/USER/PASSWORD to run the backend suite against an isolated PostgreSQL database too. The generated content uses the existing course progression and quiz scoring.\n`;
write('docs/java-curriculum.md', curriculum);
packageJavaLabs();
console.log('Generated 3 Java courses, 30 modules, 90 lesson pages, and 63 quizzes (33 public, 30 course).');
