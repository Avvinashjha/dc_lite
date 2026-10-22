import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { javaCourses, moduleSlug, courseQuizSlug, publicQuizSlug } from './data/java-curriculum.mjs';
import { extractBlocks } from '../src/utils/parseBlocks.ts';
import { parseLearningLab } from '../src/lib/learningLab.ts';
import { gradeQuiz } from '../src/lib/quizScoring.ts';
import { javaLabArchive } from './package-java-labs.mjs';
import { parseMarkdown } from '../src/utils/markdown.ts';

const read = relative => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const quiz = slug => read(`content/quiz/${slug}/quiz.json`);

test('the public project download matches current sources and excludes generated/private files', () => {
  const {archive,files} = javaLabArchive();
  assert.ok(files > 25);
  assert.deepEqual(fs.readFileSync(new URL('../public/downloads/java-course-labs.zip',import.meta.url)),archive,'Regenerate course content after editing reference projects');
  // ZIP central-directory names remain readable even when file payloads are deflated.
  const directory = archive.toString('latin1');
  assert.ok(directory.includes('java-course-labs/mvnw'));
  assert.ok(directory.includes('java-course-labs/README.md'));
  assert.ok(!directory.includes('java-course-labs/backend/target/'));
  assert.ok(!directory.includes('java-course-labs/data/'));
  assert.ok(!directory.includes('java-course-labs/.env'));
});

test('three complete Java courses have real lessons, a lab, and a gated quiz for every module', () => {
  assert.equal(javaCourses.length, 3);
  const ids = new Set();
  for (const course of javaCourses) {
    const base = `content/courses/${course.slug}`;
    const meta = read(`${base}/meta.json`);
    assert.equal(meta.draft, false);
    assert.equal(meta.modules.length, 10);
    for (const [index, mod] of course.modules.entries()) {
      assert.ok(!ids.has(mod.id)); ids.add(mod.id);
      assert.equal(mod.chapters.length, 4);
      assert.equal(mod.questions.length, 9);
      assert.equal(mod.workshops.length, 4);
      for (const workshop of mod.workshops) {
        assert.ok(workshop.why.length > 60);
        assert.ok(workshop.task.length > 20);
        assert.ok(workshop.answer.length > 30);
        if (workshop.codeFile) assert.ok(fs.existsSync(new URL(`../examples/java/${workshop.codeFile}`,import.meta.url)));
        else assert.ok(workshop.code && workshop.output);
      }
      const dir = `${base}/${moduleSlug(mod, index)}`;
      const module = read(`${dir}/meta.json`);
      assert.equal(module.lessons.length, 3);
      for (const lesson of module.lessons) {
        const body = fs.readFileSync(new URL(`../${dir}/${lesson.slug}.md`, import.meta.url), 'utf8');
        assert.ok(body.length > 300);
        if (lesson.type === 'interactive') {
          const { blocks, cleanMarkdown } = extractBlocks(body);
          assert.equal(blocks.length, 1);
          assert.equal(blocks[0].type, 'learninglab');
          assert.equal(blocks[0].data.steps.length, mod.trace.length);
          assert.equal(blocks[0].data.output, mod.output);
          assert.ok(cleanMarkdown.includes('<!--BLOCK_0-->'));
          assert.ok(parseMarkdown(cleanMarkdown).includes('<!--BLOCK_0-->'),'Markdown fences must not swallow the interactive activity');
          assert.ok(!cleanMarkdown.includes(':::learninglab'));
          assert.equal((body.match(/<summary>Check your reasoning<\/summary>/g) || []).length,4);
          assert.ok(blocks[0].data.prediction.options.includes(mod.output));
        }
        if (lesson.type === 'quiz') {
          assert.equal(lesson.passingScore, 70);
          assert.equal(lesson.quizSlug, courseQuizSlug(mod));
        }
      }
    }
  }
  assert.equal(ids.size, 30);
});

test('30 course quizzes and 33 independent public quizzes have valid, explained, nonduplicated questions', () => {
  const courseSlugs = new Set();
  const publicSlugs = new Set();
  const allQuestionIds = new Set();
  const authoredPrompts = new Set();
  const expectedAnswers = new Map();
  let placements = 0;
  for (const course of javaCourses) {
    const entries = [];
    for (const mod of course.modules) {
      const check = courseQuizSlug(mod), practice = publicQuizSlug(mod);
      courseSlugs.add(check); publicSlugs.add(practice);
      entries.push([check, true, 7], [practice, false, 7]);
      for (const [prompt, correct, wrong, explanation] of mod.questions) {
        assert.ok(!authoredPrompts.has(prompt), `Repeated authored prompt: ${prompt}`);
        authoredPrompts.add(prompt);
        expectedAnswers.set(prompt, correct);
        assert.equal(new Set([correct, ...wrong]).size, 4);
        assert.ok(explanation.length > 20);
      }
    }
    publicSlugs.add(`${course.slug}-readiness`);
    entries.push([`${course.slug}-readiness`, false, 20]);
    for (const [slug, courseOnly, count] of entries) {
      const data = quiz(slug);
      assert.equal(data.courseOnly, courseOnly);
      assert.equal(data.category, 'Java');
      assert.equal(data.ranked, false);
      assert.equal(data.questions.length, count);
      assert.equal(new Set(data.questions.map(q => q.prompt)).size, count);
      for (const question of data.questions) {
        assert.ok(!allQuestionIds.has(question.id)); allQuestionIds.add(question.id);
        assert.equal(question.options.length, 4);
        assert.equal(question.correct.length, 1);
        assert.ok(question.options.some(option => option.id === question.correct[0]));
        assert.equal(question.options.find(option => option.id === question.correct[0]).text, expectedAnswers.get(question.prompt));
        assert.ok(question.explanation);
        assert.equal(question.points, 1);
        placements++;
      }
      assert.ok(new Set(data.questions.map(q => q.correct[0])).size >= 3, 'Answers must not all occupy one position');
    }
  }
  assert.equal(courseSlugs.size, 30);
  assert.equal(publicSlugs.size, 33);
  assert.equal(authoredPrompts.size, 270);
  assert.equal(placements, 480);
  for (const slug of publicSlugs) assert.ok(!courseSlugs.has(slug));
});

test('module quizzes pass at five of seven and fail at four, using the real quiz scorer', () => {
  const { questions } = quiz(courseQuizSlug(javaCourses[0].modules[0]));
  const answers = Object.fromEntries(questions.slice(0, 4).map(q => [q.id, q.correct]));
  assert.ok(gradeQuiz(questions, answers, 10).percent < 70);
  answers[questions[4].id] = questions[4].correct;
  assert.ok(gradeQuiz(questions, answers, 10).percent >= 70);
});

test('block extraction preserves existing content and keeps indexes correct around unknown directives', () => {
  const { cleanMarkdown, blocks } = extractBlocks(':::note\nKeep this text\n:::\n:::quiz\nquestion: Pick one\noptions:\n - A\n - B\nanswer: 1\nexplanation: B is correct\n:::\n:::exercise\ntitle: Try\ndescription: Write code\nstarterCode: |\n  int x = 1;\n:::');
  assert.ok(cleanMarkdown.includes(':::note\nKeep this text\n:::'));
  assert.deepEqual(blocks.map(block => block.type), ['quiz', 'exercise']);
  assert.ok(cleanMarkdown.includes('<!--BLOCK_0-->'));
  assert.ok(cleanMarkdown.includes('<!--BLOCK_1-->'));
  assert.equal(blocks[0].answer, 1);
  assert.equal(blocks[1].starterCode.trim(), 'int x = 1;');
});

test('broken authored activities fail at build time', () => {
  assert.throws(() => parseLearningLab('not JSON'));
  assert.throws(() => parseLearningLab('{}'), /Invalid learninglab/);
  const valid = { title:'Trace', code:'int x = 1;', output:'1', steps:[{label:'Assign', detail:'x is one'}], prediction:{question:'Value?', options:['1','2'], answer:0, explanation:'Assigned one.'} };
  assert.equal(parseLearningLab(JSON.stringify(valid)).prediction.answer, 0);
  assert.throws(() => parseLearningLab(JSON.stringify({...valid, prediction:{...valid.prediction, answer:2}})));
  assert.throws(() => parseLearningLab(JSON.stringify({...valid, steps:[]})));
});
