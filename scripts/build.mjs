import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.vercel/output');
const staticOutput = path.join(output, 'static');
// Only the generated build-output directory may be removed.
if (!output.startsWith(root + path.sep) || path.basename(output) !== 'output') throw new Error('Invalid build path');
await fs.rm(output, {recursive:true,force:true});
await fs.mkdir(staticOutput, {recursive:true});
const excluded = new Set(['.git','.github','.vercel','node_modules','scripts','tests','package.json','package-lock.json','vercel.json','vercel-output.config.json','README.md','activity.txt','CNAME']);
for (const entry of await fs.readdir(root, {withFileTypes:true})) {
  if (excluded.has(entry.name) || (entry.name.startsWith('.') && entry.name !== '.nojekyll' && entry.name !== '.well-known')) continue;
  await fs.cp(path.join(root,entry.name), path.join(staticOutput,entry.name), {recursive:true});
}
const config = JSON.parse(await fs.readFile(path.join(root,'vercel-output.config.json'),'utf8'));
await fs.writeFile(path.join(output,'config.json'), JSON.stringify(config,null,2) + '\n');
console.log('Built static portfolio into .vercel/output/static');
