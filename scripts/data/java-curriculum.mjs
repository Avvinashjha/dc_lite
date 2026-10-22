import fundamentals from './java-fundamentals.mjs';
import core from './java-developer-core.mjs';
import advanced from './java-advanced.mjs';
import { workshops } from './java-workshops.mjs';
import { coreWorkshops } from './java-core-workshops.mjs';
import { advancedWorkshops } from './java-advanced-workshops.mjs';
import { predictionRow } from './java-predictions.mjs';

const chapterWorkshops = {...workshops, ...coreWorkshops, ...advancedWorkshops};
function enrich(mod) {
  const activities = chapterWorkshops[mod.id];
  if (!activities || activities.length !== mod.chapters.length) throw new Error(`Missing chapter workshops: ${mod.id}`);
  return {...mod, workshops:activities, questions:[...mod.questions, predictionRow(mod)]};
}

export const researchDate = '2026-10-22';
export const sources = [
  ['Java language, APIs, and JVM learning map', 'https://dev.java/learn/'],
  ['Java LTS release roadmap', 'https://www.oracle.com/technetwork/java/javase/tech/eol-135779.html'],
  ['Virtual thread adoption guidance', 'https://inside.java/2023/09/20/virtual-threads-adoption-guide/'],
  ['Maven project and dependency guides', 'https://maven.apache.org/guides/'],
  ['JUnit Jupiter user guide', 'https://docs.junit.org/6.1.3/overview.html'],
  ['Spring REST service guide', 'https://spring.io/guides/gs/rest-service/'],
  ['Spring Data JPA guide', 'https://spring.io/guides/gs/accessing-data-jpa/'],
  ['Spring Boot testing reference', 'https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html'],
  ['Spring Boot Java compatibility', 'https://docs.spring.io/spring-boot/system-requirements.html'],
];

export const javaCourses = [
  { slug:'java-fundamentals', title:'Java Fundamentals', level:'beginner', duration:'18–25 hours',
    description:'Start from zero: learn Java syntax, problem solving, OOP, and error handling through everyday examples, interactive traces, and a command-line expense tracker.',
    prerequisite:'No programming experience required. Install a Java 25 JDK; use a terminal and an editor.',
    outcome:'Build and debug a command-line application with encapsulated domain models and validated input.',
    project:'Command-line expense tracker', projectDirectory:'fundamentals', modules:fundamentals.map(enrich) },
  { slug:'java-developer-core', title:'Java Developer Core', level:'intermediate', duration:'25–35 hours',
    description:'Move from syntax to application development: generics, collections, streams, files, clean design, algorithms, tests, SQL/JDBC, and HTTP/JSON.',
    prerequisite:'Complete Java Fundamentals or be comfortable with methods, classes, interfaces, and exceptions.',
    outcome:'Build a tested application with database persistence, file import/export, and a replaceable HTTP integration.',
    project:'Persistent expense application', projectDirectory:'developer-core', modules:core.map(enrich) },
  { slug:'java-advanced', title:'Advanced Java & Backend Engineering', level:'advanced', duration:'35–50 hours',
    description:'Explore JVM diagnostics, concurrency, virtual threads, and modern Java, then build a secure Spring Boot API with persistence, integration tests, resilience, and delivery practices.',
    prerequisite:'Complete Java Developer Core or have working knowledge of collections, Maven, unit tests, SQL, and HTTP.',
    outcome:'Design, test, package, and diagnose a secure backend service while explaining concurrency and consistency tradeoffs.',
    project:'Secure expense REST API', projectDirectory:'backend', modules:advanced.map(enrich) },
];

export function moduleSlug(module, index) { return `module-${String(index + 1).padStart(2, '0')}-${module.id}`; }
export function courseQuizSlug(module) { return `java-${module.id}-module-check`; }
export function publicQuizSlug(module) { return `java-${module.id}-practice`; }

/** Deterministic rotations avoid an answer-position pattern without changing correctness. */
export function makeQuestions(rows, namespace) {
  return rows.map(([prompt, correct, wrong, explanation], index) => {
    const entries = [correct, ...wrong];
    const offset = (index + namespace.length) % entries.length;
    const texts = entries.slice(offset).concat(entries.slice(0, offset));
    const options = texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text }));
    return { id:`${namespace}-q${index + 1}`, type:'single', prompt, options,
      correct:[options.find(option => option.text === correct).id], explanation, points:1 };
  });
}

export function quizMeta(course, slug, title, description, rows, courseOnly = false) {
  return { id:slug, title, description, category:'Java',
    difficulty:({ beginner:'easy', intermediate:'medium', advanced:'hard' })[course.level],
    tags:['java', course.level, course.slug], author:'DailyCoder', ranked:false,
    source:'curated', publishedAt:researchDate, courseOnly, questions:makeQuestions(rows, slug) };
}
