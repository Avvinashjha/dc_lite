import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';

// Exercise the actual event handler with an isolated transport and local store.
const page = fs.readFileSync('src/pages/problems/[slug].astro', 'utf8');
const source = stripTypeScriptTypes(page.slice(page.indexOf("  discussionPostBtn.addEventListener('click'"), page.indexOf('  // ── Favorites')));
function harness(response, signedIn = true) {
  let handler, rendered, stored, calls = 0;
  const message = { value: 'Test message', focus() {} }, status = { textContent: '' };
  const button = { disabled: false, addEventListener(_, fn) { handler = fn; } };
  const context = {
    discussionMsgEl: message, discussionStatusEl: status, discussionPostBtn: button,
    slug: 'test-only', DISCUSSION_TOOL: 'discussion', AbortController, setTimeout, clearTimeout,
    renderDiscussionList(rows) { rendered = rows; },
    fetch: async () => { calls++; if (response instanceof Error) throw response; return { ok: true, json: async () => response }; },
    window: {
      getCurrentUser: () => signedIn ? { uid: 'test', displayName: 'Tester' } : null,
      getFirebaseIdToken: async () => 'fake-test-token',
      requireAuth: (_, callback) => signedIn ? callback() : undefined,
      DCSyncService: { _getScriptUrl: () => 'mock-only' },
      DCStore: { init: async () => {}, get: async () => ({ posts: [] }), set: async (_, __, value) => { stored = value; } },
    },
  };
  vm.runInNewContext(source, context);
  return { message, status, button, async click() { handler(); for(let i=0;i<20;i++) await Promise.resolve(); }, result: () => ({ rendered, stored, calls }) };
}
test('rejected discussion keeps the draft and never enters local cache', async () => {
  const h = harness({status:'error',message:'Authentication required'});
  await h.click();
  assert.equal(h.message.value, 'Test message');
  assert.equal(h.result().stored, undefined);
  assert.equal(h.result().rendered, undefined);
  assert.equal(h.status.textContent, 'Authentication required');
  assert.equal(h.button.disabled, false);
});
test('confirmed discussion clears only after success and caches the post', async () => {
  const h = harness({status:'success'}); await h.click();
  assert.equal(h.message.value, '');
  assert.equal(h.result().stored.posts[0].message, 'Test message');
  assert.equal(h.status.textContent, 'Posted.');
});
test('signed-out and empty discussions do not contact transport', async () => {
  const h = harness({status:'success'}, false); await h.click();
  assert.equal(h.result().calls, 0);
  h.message.value = '  '; await h.click();
  assert.equal(h.result().calls, 0);
  assert.equal(h.status.textContent, 'Write a message before posting.');
});

const loadSource = stripTypeScriptTypes(page.slice(page.indexOf('  async function loadDiscussion() {'), page.indexOf("  discussionPostBtn.addEventListener('click'")));
async function loadHarness({active=true, cached=[], response={status:'success',posts:[]}, fail=false}) {
  const status={textContent:'Loading discussion…'};let rendered;
  const context={discussionLoadStatusEl:status,DISCUSSION_TOOL:'discussion',slug:'test',AbortController,setTimeout,clearTimeout,
    localStorage:{getItem:()=>null},renderDiscussionList:rows=>{rendered=rows;},
    fetch:async()=>{if(fail)throw new Error('offline');return {ok:true,json:async()=>response};},
    window:{DCStore:{init:async()=>{},get:async()=>({posts:cached}),set:async()=>{}},DCSyncService:{isActive:()=>active,_getScriptUrl:()=> 'mock-only'}}};
  await vm.runInNewContext(loadSource+'\nloadDiscussion()',context);
  return {status:status.textContent,rendered};
}
test('unavailable discussion does not claim there are no posts',async()=>{
  const result=await loadHarness({active:false});
  assert.equal(result.status,'Discussion is unavailable right now.');
  assert.equal(result.rendered,undefined);
});
test('failed refresh preserves saved posts and identifies them as cached',async()=>{
  const cached=[{message:'Saved post'}],result=await loadHarness({cached,fail:true});
  assert.equal(result.rendered,cached);
  assert.equal(result.status,'Unable to refresh. Showing saved discussion.');
});
test('confirmed empty response renders empty discussion and clears loading status',async()=>{
  const result=await loadHarness({});
  assert.equal(result.rendered.length,0);
  assert.equal(result.status,'');
});
