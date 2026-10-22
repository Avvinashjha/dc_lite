import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const java = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME,'bin/java') : 'java';
const data = await fs.mkdtemp(path.join(os.tmpdir(),'java-course-api-'));
const passwords = {alice:randomBytes(24).toString('hex'), bob:randomBytes(24).toString('hex')};
let child, port;
async function stop() {
  if (!child || child.exitCode !== null) return;
  const running = child;
  const exited = once(running,'exit');
  running.kill('SIGTERM');
  const kill = setTimeout(() => running.kill('SIGKILL'),25_000);
  await exited; clearTimeout(kill); child = undefined;
}
async function start() {
  let logs = '';
  child = spawn(java,['-jar',path.join(root,'examples/java/backend/target/backend-1.0.0.jar'),'--server.port=0',`--spring.datasource.url=jdbc:h2:file:${data}/expenses;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE`],
    {cwd:data,env:{...process.env,DEMO_ALICE_PASSWORD:passwords.alice,DEMO_BOB_PASSWORD:passwords.bob},stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject) => {
    const timeout = setTimeout(() => reject(new Error('API startup exceeded 60 seconds\n'+logs)),60_000);
    const read = chunk => {
      logs = (logs + chunk.toString()).slice(-20000);
      const match = logs.match(/Tomcat started on port (\d+)/);
      if (match) { port = Number(match[1]); clearTimeout(timeout); resolve(); }
    };
    child.stdout.on('data',read); child.stderr.on('data',read);
    child.once('error',error => {clearTimeout(timeout);reject(error);});
    child.once('exit',code => {clearTimeout(timeout);reject(new Error(`API exited ${code}\n${logs}`));});
  });
}
async function request(method,route,{user='alice',body,write=false}={}) {
  const headers = {};
  if (user) headers.Authorization = `Basic ${Buffer.from(`${user}:${passwords[user]}`).toString('base64')}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (write) {
    const response = await fetch(`http://127.0.0.1:${port}/csrf`,{signal:AbortSignal.timeout(10_000)});
    assert.equal(response.status,200);
    const token = await response.json();
    headers.Cookie = response.headers.get('set-cookie').split(';')[0];
    headers[token.headerName] = token.token;
  }
  return fetch(`http://127.0.0.1:${port}${route}`,{method,headers,body:body === undefined ? undefined : JSON.stringify(body),signal:AbortSignal.timeout(10_000)});
}
try {
  await start();
  assert.equal((await request('GET','/expenses',{user:null})).status,401);
  assert.equal((await request('POST','/expenses',{body:{}})).status,403);
  const created = await request('POST','/expenses',{write:true,body:{label:'Food',amount:1250,spentOn:'2026-10-22'}});
  assert.equal(created.status,201);
  const expense = await created.json(), route = `/expenses/${expense.id}`;
  assert.equal(created.headers.get('location'),route);
  assert.match(created.headers.get('x-request-id'),/^[0-9a-f-]{36}$/);
  assert.equal((await request('GET',route,{user:'bob'})).status,404);
  assert.equal((await request('DELETE',route,{user:'bob',write:true})).status,404);
  assert.equal((await request('POST','/expenses',{write:true,body:{owner:'bob',label:'Bad',amount:1,spentOn:'2026-10-22'}})).status,400);
  const changed = {label:'Bus',amount:300,spentOn:'2026-10-22',version:expense.version};
  assert.equal((await request('PUT',route,{write:true,body:changed})).status,200);
  assert.equal((await request('PUT',route,{write:true,body:changed})).status,409);
  const delivered = await request('POST',`${route}/notify`,{write:true});
  assert.equal(delivered.status,200); assert.equal((await delivered.json()).applied,true);
  await stop(); await start();
  const restored = await request('GET',route);
  assert.equal(restored.status,200);
  const stored = await restored.json(); assert.equal(stored.amount,300); assert.equal(stored.version,1);
  const repeated = await request('POST',`${route}/notify`,{write:true});
  assert.equal(repeated.status,200); assert.equal((await repeated.json()).applied,false);
  const summary = await request('GET','/expenses/summary?month=2026-10');
  assert.equal(summary.status,200); assert.equal((await summary.json()).paise,300);
  assert.equal((await request('GET','/actuator/health/readiness',{user:null})).status,200);
  assert.equal((await request('DELETE',route,{write:true})).status,204);
  assert.equal((await request('GET',route)).status,404);
  console.log('PASS live HTTP: Basic authentication, real CSRF, validation, ownership, version conflict, durable delivery, restart persistence, summary, readiness, and deletion.');
} finally { await stop(); await fs.rm(data,{recursive:true,force:true}); }
