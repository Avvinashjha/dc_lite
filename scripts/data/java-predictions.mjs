// Distractors are written for the actual example, not unrelated trivia.
export const predictions = {
 'first-program': ['After compiling and launching Receipt, what is printed?', ['Coffees: 0','2','Receipt.class']],
 'values-and-types': ['What three lines does this basket example print?', ['3750\n2.5\n2.5','3750\n2\n2','1250\n2\n2.5']],
 'decisions-and-loops': ['How many orders does this loop count as eligible?', ['1','3','0']],
 'methods-and-debugging': ['What are the two printed values after tip returns?', ['80\n80','800\n80','800\n800']],
 'arrays-and-algorithms': ['Which maximum is printed for these readings?', ['-3','1','0']],
 'strings-and-input': ['What does the normalization and comparison print?', ['AB-42\ntrue','ab-42\nfalse','  AB-42  \ntrue']],
 'classes-and-encapsulation': ['What balance is visible through first after alias.deposit(50)?', ['0','100','A new wallet is allocated, so first is unchanged']],
 'inheritance-and-polymorphism': ['Which fee is printed for the Shipping reference holding Express?', ['50','0','150']],
 'interfaces-and-records': ['What charged amount is printed by the receipt accessor?', ['100','5','0']],
 'exceptions-and-capstone': ['What is printed when this positive-amount parser receives "-10"?', ['-10','NumberFormatException','The program silently stores -10']],
 'generics-and-type-safety': ['What does the generic box example print?', ['Parcel A','Object','A ClassCastException']],
 'collections-and-equality': ['What count and key order does this LinkedHashMap example print?', ['3\n[tea, coffee]','5\n[coffee, tea]','2\n[tea, coffee]']],
 'lambdas-and-streams': ['What revenue does the paid-order pipeline print?', ['350','200','100']],
 'dates-numbers-and-patterns': ['What date and rounded decimal does the example print?', ['2026-10-32\n3.33','2026-11-01\n3','2026-11-01\n3.34']],
 'files-and-resources': ['How many lines are counted before the temporary file is deleted?', ['1','0','3']],
 'builds-tests-and-git': ['What price does discounted(1000, 20) print?', ['200','1000','1200']],
 'design-and-patterns': ['Which member price does the selected strategy print?', ['1000','100','1100']],
 'data-structures-and-complexity': ['In what order do repeated poll calls print these priorities?', ['3\n1\n2','3\n2\n1','2\n1\n3']],
 'sql-and-jdbc': ['Given the stated table fixtures, which label does the prepared query print?', ['Bus','Food\nBus','No rows']],
 'http-json-and-core-capstone': ['What method and Accept header are printed without sending a request?', ['POST\napplication/json','GET\nmissing','GET\ntext/plain']],
 'jvm-and-performance': ['What two map sizes are printed before and after clear?', ['3\n3','0\n0','1\n0']],
 'threads-and-shared-state': ['After both joined workers complete, what count is guaranteed?', ['1000','An arbitrary value below 2000','The code cannot compile because AtomicInteger is mutable']],
 'executors-and-virtual-threads': ['What combined result is printed, regardless of task completion order?', ['price:stock','A randomly chosen order','stockprice']],
 'modern-java-and-modules': ['Which switch result is printed for the shown Success value?', ['FAIL: saved','Success','null']],
 'spring-boot-and-rest': ['In the configured Spring project, what response follows GET /greeting?name=Ada?', ['GET /greeting?name=Ada → 404','GET /greeting?name=Ada → 200 {"message":"Hello Java"}','GET /greeting?name=Ada → 201 {"message":"Hello Ada"}']],
 'jpa-and-transactions': ['Two transactions load the same version. One commits first. What happens when the other flushes a stale update?', ['Both writes always succeed and the later write silently wins','The version column is ignored because it is a Long','Every read is rejected before any update']],
 'security-and-authorization': ['What do the owner and other-user checks print?', ['true\ntrue','false\nfalse','false\ntrue']],
 'integration-tests-and-contracts': ['What should these ownership assertions establish when run with the previous module’s model?', ['Both assertions prove every HTTP endpoint is secured automatically','The second assertion should allow bob','A failing denial assertion should be ignored as a flaky test']],
 'resilience-caching-and-messaging': ['How many unique events does this single-threaded in-memory demonstration accept?', ['3','1','0']],
 'deployment-and-final-capstone': ['What does System.out print, apart from the separately configured logger output?', ['expense_created','req-42','A bearer token']],
};

export function predictionRow(mod) {
  const [question, wrong] = predictions[mod.id] || [];
  if (!question || !wrong || wrong.includes(mod.output)) throw new Error(`Missing or invalid prediction for ${mod.id}`);
  const context = mod.environment ? `\n\nEnvironment: ${mod.environment}` : '';
  return [`${question}${context}\n\n\`\`\`java\n${mod.code}\n\`\`\``, mod.output, wrong, mod.trace.map(([,detail]) => detail).join(' ')];
}
