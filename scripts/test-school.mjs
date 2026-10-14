import test from 'node:test';
import assert from 'node:assert/strict';
import { SCHOOL_LESSONS, SCHOOL_SUBJECTS, SCHOOL_STREAMS } from '../src/data/school.ts';
import { isSchoolGrade, restoreSchoolProfile, schoolSubjects, schoolStage, scoreSchoolQuestions, runSchoolRobot, ROBOT_CHALLENGES } from '../src/lib/school.ts';

test('class boundaries select the intended experience', () => {
  assert.deepEqual([1, 4, 5, 8, 9, 10, 11, 12].map(schoolStage), ['discover', 'discover', 'explore', 'explore', 'focus', 'focus', 'specialise', 'specialise']);
  for (const bad of [0, 13, 6.5, NaN, '6', null]) assert.equal(isSchoolGrade(bad), false);
});

test('each class and senior direction has usable starter content', () => {
  for (let grade = 1; grade <= 12; grade++) {
    for (const stream of grade >= 11 ? SCHOOL_STREAMS : [SCHOOL_STREAMS[0]]) {
      const available = schoolSubjects(grade, stream.id);
      assert.ok(available.length > 0);
      assert.ok(SCHOOL_LESSONS.some(l => l.grade === grade && available.some(s => s.id === l.subject)), `Class ${grade}, ${stream.id}`);
      assert.ok(available.every(s => s.grades.includes(grade)));
    }
  }
  assert.ok(schoolSubjects(11, 'medical').some(s => s.id === 'biology'));
  assert.ok(!schoolSubjects(11, 'medical').some(s => s.id === 'accountancy'));
  assert.ok(schoolSubjects(12, 'all').some(s => s.id === 'accountancy'));
  assert.deepEqual(schoolSubjects(6, 'medical'), schoolSubjects(6, 'all'));
});

test('lesson and assessment content is internally consistent', () => {
  assert.equal(new Set(SCHOOL_LESSONS.map(l => l.id)).size, SCHOOL_LESSONS.length);
  for (const lesson of SCHOOL_LESSONS) {
    assert.ok(isSchoolGrade(lesson.grade), lesson.id);
    assert.ok(SCHOOL_SUBJECTS.some(s => s.id === lesson.subject && s.grades.includes(lesson.grade)), lesson.id);
    assert.ok(lesson.sections.length && lesson.sections.every(s => s.text.trim()));
    assert.ok(lesson.questions.length >= 3, lesson.id);
    for (const question of lesson.questions) {
      assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < question.options.length, question.prompt);
      assert.equal(new Set(question.options).size, question.options.length, question.prompt);
      assert.ok(question.explanation.trim());
    }
  }
});

test('scoring gives no credit for skipped or invalid answers', () => {
  const questions = SCHOOL_LESSONS[0].questions;
  assert.equal(scoreSchoolQuestions(questions, questions.map(q => q.correct)), questions.length);
  assert.equal(scoreSchoolQuestions(questions, [null, null, null]), 0);
  assert.equal(scoreSchoolQuestions(questions, []), 0);
  assert.equal(scoreSchoolQuestions(questions, questions.map(q => (q.correct + 1) % q.options.length)), 0);
});

test('malformed local profiles and unknown activity references are rejected', () => {
  assert.equal(restoreSchoolProfile(null).grade, 6);
  assert.equal(restoreSchoolProfile({ version: 2, grade: 3 }).grade, 6);
  const good = { lessonId: SCHOOL_LESSONS[0].id, mode: 'rush', correct: 2, total: 3, completedAt: 100 };
  const profile = restoreSchoolProfile({ version: 1, grade: 45, stream: 'unknown', completed: ['missing', SCHOOL_LESSONS[0].id, SCHOOL_LESSONS[0].id], codeCompleted: ['robot-1', 'robot-99'], attempts: [good, { ...good, correct: 99 }, { ...good, total: 30 }, { ...good, mode: 'fake' }, { ...good, lessonId: 'missing' }] });
  assert.equal(profile.grade, 6);
  assert.equal(profile.stream, 'all');
  assert.deepEqual(profile.completed, [SCHOOL_LESSONS[0].id]);
  assert.deepEqual(profile.codeCompleted, ['robot-1']);
  assert.deepEqual(profile.attempts, [good]);
  assert.equal(restoreSchoolProfile({ version: 1, attempts: Array(100).fill(good) }).attempts.length, 50);
});

test('robot interpreter handles success, boundaries, obstacles and step limits', () => {
  assert.equal(runSchoolRobot(['right', 'right', 'right', 'down', 'down', 'down'], ROBOT_CHALLENGES[0]).success, true);
  assert.equal(runSchoolRobot(['down', 'down', 'down', 'right', 'right', 'right'], ROBOT_CHALLENGES[1]).success, true);
  assert.equal(runSchoolRobot(['down', 'down', 'down', 'right', 'right', 'right', 'up', 'up', 'up'], ROBOT_CHALLENGES[2]).success, true);
  assert.match(runSchoolRobot(['left'], ROBOT_CHALLENGES[0]).message, /off the board/);
  assert.match(runSchoolRobot(['right'], ROBOT_CHALLENGES[1]).message, /garden square/);
  assert.equal(runSchoolRobot([], ROBOT_CHALLENGES[0]).success, false);
  assert.equal(runSchoolRobot(['invalid'], ROBOT_CHALLENGES[0]).success, false);
  assert.match(runSchoolRobot(Array(9).fill('right'), ROBOT_CHALLENGES[0]).message, /at most/);
});
