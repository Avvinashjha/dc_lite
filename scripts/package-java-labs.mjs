import fs from 'node:fs';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'examples/java');
const excluded = new Set(['target','data','.git','.env']);
function files(dir, prefix='') {
  return fs.readdirSync(dir, {withFileTypes:true}).sort((a,b) => a.name.localeCompare(b.name,'en')).flatMap(entry => {
    if (excluded.has(entry.name) || entry.name.endsWith('.log')) return [];
    if (entry.isDirectory()) return files(path.join(dir,entry.name), `${prefix}${entry.name}/`);
    return entry.isFile() ? [`${prefix}${entry.name}`] : [];
  });
}
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i=0;i<8;i++) crc = (crc>>>1) ^ ((crc&1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
/** Deterministic ZIP, built with Node only. Never include targets, databases, or local credentials. */
export function javaLabArchive() {
  const records = [], central = [];
  let offset = 0;
  const entries = files(source);
  for (const relative of entries) {
    const name = Buffer.from(`java-course-labs/${relative}`);
    const raw = fs.readFileSync(path.join(source,relative));
    const compressed = deflateRawSync(raw);
    const crc = crc32(raw);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50,0); local.writeUInt16LE(20,4); local.writeUInt16LE(0x800,6);
    local.writeUInt16LE(8,8); local.writeUInt16LE(0x21,12); // 1980-01-01, midnight
    local.writeUInt32LE(crc,14); local.writeUInt32LE(compressed.length,18); local.writeUInt32LE(raw.length,22); local.writeUInt16LE(name.length,26);
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50,0); header.writeUInt16LE(0x314,4); header.writeUInt16LE(20,6); header.writeUInt16LE(0x800,8);
    header.writeUInt16LE(8,10); header.writeUInt16LE(0x21,14); header.writeUInt32LE(crc,16);
    header.writeUInt32LE(compressed.length,20); header.writeUInt32LE(raw.length,24); header.writeUInt16LE(name.length,28);
    header.writeUInt32LE(((relative === 'mvnw' || relative === 'verify.sh' ? 0o100755 : 0o100644) * 65536) >>> 0,38);
    header.writeUInt32LE(offset,42);
    records.push(local,name,compressed); central.push(header,name);
    offset += local.length + name.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0); end.writeUInt16LE(entries.length,8); end.writeUInt16LE(entries.length,10);
  end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
  return {archive:Buffer.concat([...records,directory,end]), files:entries.length};
}
export function packageJavaLabs() {
  const {archive,files} = javaLabArchive();
  const target = path.join(root,'public/downloads/java-course-labs.zip');
  fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,archive);
  return {target,files};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(packageJavaLabs());
