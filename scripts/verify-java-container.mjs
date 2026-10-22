import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { setTimeout as pause } from 'node:timers/promises';
import assert from 'node:assert/strict';

const exec = promisify(execFile);
const backend = fileURLToPath(new URL('../examples/java/backend/',import.meta.url));
const image = `dailycoder-java-verification:${randomBytes(8).toString('hex')}`;
const passwords = {alice:randomBytes(24).toString('hex'),bob:randomBytes(24).toString('hex')};
const docker = async args => (await exec('docker',args,{timeout:240_000,maxBuffer:16*1024*1024})).stdout.trim();
let container;
try {
  await docker(['build','-t',image,backend]);
  container = await docker(['run','--rm','-d','-p','127.0.0.1::8080','--env',`DEMO_ALICE_PASSWORD=${passwords.alice}`,'--env',`DEMO_BOB_PASSWORD=${passwords.bob}`,'--mount','type=volume,target=/app/data',image]);
  assert.equal(await docker(['exec',container,'id','-u']),'10001');
  let base;
  async function address() {
    const port = (await docker(['port',container,'8080/tcp'])).split(':').at(-1);
    base = `http://127.0.0.1:${port}`;
  }
  await address();
  async function ready() {
    const deadline = Date.now()+60_000;
    while(Date.now() < deadline) {
      try { if((await fetch(base+'/actuator/health/readiness',{signal:AbortSignal.timeout(1000)})).status === 200) return; } catch {}
      await pause(250);
    }
    throw new Error('Container did not become ready: ' + await docker(['logs',container]));
  }
  async function request(method,route,body) {
    const headers = {Authorization:`Basic ${Buffer.from(`alice:${passwords.alice}`).toString('base64')}`};
    if(method !== 'GET') {
      const response = await fetch(base+'/csrf',{signal:AbortSignal.timeout(10_000)});
      const token = await response.json();
      headers.Cookie = response.headers.get('set-cookie').split(';')[0];
      headers[token.headerName] = token.token;
    }
    if(body) headers['Content-Type'] = 'application/json';
    return fetch(base+route,{method,headers,body:body ? JSON.stringify(body) : undefined,signal:AbortSignal.timeout(10_000)});
  }
  await ready();
  const created = await request('POST','/expenses',{label:'Container expense',amount:1250,spentOn:'2026-10-22'});
  assert.equal(created.status,201);
  const value = await created.json();
  await docker(['restart',container]);
  await address(); // Docker can assign another host port after restarting an ephemeral mapping.
  await ready();
  const restored = await request('GET',`/expenses/${value.id}`);
  assert.equal(restored.status,200); assert.equal((await restored.json()).amount,1250);
  console.log('PASS container: Java 25 image build, non-root uid 10001, writable volume, authenticated/CSRF-protected creation, readiness, and persistence across restart.');
} finally {
  if(container) await docker(['stop',container]);
  await docker(['image','rm',image]);
}
