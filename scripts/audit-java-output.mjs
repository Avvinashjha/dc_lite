import fs from 'node:fs';
import assert from 'node:assert/strict';
import { javaCourses, moduleSlug, courseQuizSlug, publicQuizSlug } from './data/java-curriculum.mjs';

const output = route => fs.readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8');
const quizIndex = output('quiz');
const roadmap = output('courses/java');
assert.equal((roadmap.match(/<details\b[^>]*\sdata-java-module(?:\s|=|>)/g) || []).length, 30);
assert.ok(roadmap.includes('/downloads/java-course-labs.zip'));
assert.ok(fs.statSync(new URL('../dist/downloads/java-course-labs.zip',import.meta.url)).size > 10_000);
let lessons = 0, publicQuizzes = 0;
for (const course of javaCourses) {
  assert.ok(output(`courses/${course.slug}`).includes('/courses/java'));
  for (const [index, mod] of course.modules.entries()) {
    const base = `courses/${course.slug}/${moduleSlug(mod, index)}`;
    for (const lesson of ['01-learn-and-explore', '02-practice-lab', '03-module-quiz']) {
      const html = output(`${base}/${lesson}`);
      assert.ok(!html.includes(':::learninglab'));
      assert.ok(!html.includes('<!--BLOCK_'));
      if (lesson === '01-learn-and-explore') {
        assert.ok(html.includes('learning-lab'));
        assert.ok(html.includes('client="load"'));
        assert.equal((html.match(/<h2>Chapter [1-4]:/g) || []).length, 4);
        assert.equal((html.match(/<summary>Check your reasoning<\/summary>/g) || []).length,4);
      }
      if (lesson === '02-practice-lab') assert.ok(html.includes('<details>'));
      if (lesson === '03-module-quiz') assert.ok(html.includes(courseQuizSlug(mod)));
      lessons++;
    }
    const publicSlug = publicQuizSlug(mod);
    assert.ok(quizIndex.includes(`/quiz/${publicSlug}`));
    assert.ok(!quizIndex.includes(`/quiz/${courseQuizSlug(mod)}`));
    assert.ok(output(`quiz/${publicSlug}`).includes('Start quiz'));
    publicQuizzes++;
  }
  assert.ok(quizIndex.includes(`/quiz/${course.slug}-readiness`));
  assert.ok(output(`quiz/${course.slug}-readiness`).includes('Start quiz'));
  publicQuizzes++;
}
console.log(`Verified ${lessons} rendered Java lessons and ${publicQuizzes} independent public quiz routes; module quizzes are excluded from the public index.`);
