import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';
import {affected,decide} from './vercel-ignore.mjs';
test('runtime paths, legal notices, assets and explicit shared inputs',()=>{
 for(const file of ['index.html','style.css','assets/font-OFL.txt','LICENSE.md','THIRD_PARTY_NOTICES.md','scripts/build.mjs','scripts/html-helper.mjs'])assert.equal(affected('games/a',['games/a/'+file]),true,file);
 for(const file of ['README.md','.rankup/plan.md','design/card.html','scripts/verification.json','scripts/check.mjs','scripts/engine.test.mjs'])assert.equal(affected('games/a',['games/a/'+file]),false,file);
 assert.equal(affected('games/a',['games/ab/game.js','README.md','research/report.json']),false);
 assert.equal(affected('games/a',['shared/runtime.js'],['shared']),true);
});
test('Git baseline covers multiple commits, deletions, manual redeploy and unavailable history',()=>{
 const tempRoot=path.resolve(os.tmpdir()),dir=mkdtempSync(path.join(tempRoot,'gamehubs-ignore-'));
 const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 const write=(file,text)=>{mkdirSync(path.dirname(path.join(dir,file)),{recursive:true});writeFileSync(path.join(dir,file),text);};
 const commit=()=>{git('add','.');git('commit','-qm','fixture');return git('rev-parse','HEAD');};
 try{
  git('init','-q');git('config','user.email','fixture@example.invalid');git('config','user.name','Build gate fixture');
  write('games/a/index.html','a1');write('games/b/index.html','b1');write('README.md','first');const baseline=commit();
  write('games/a/index.html','a2');commit();write('README.md','documentation after code change');const head=commit();
  assert.equal(decide({cwd:dir,project:'games/a',previous:baseline}).build,true,'must not compare only HEAD^');
  assert.equal(decide({cwd:dir,project:'games/b',previous:baseline}).build,false);
  const run=spawnSync(process.execPath,[new URL('./vercel-ignore.mjs',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'),'games/b'],{cwd:dir,env:{...process.env,VERCEL_GIT_PREVIOUS_SHA:baseline,GAMEHUBS_FORCE_BUILD:''},encoding:'utf8'});assert.equal(run.status,0,'Vercel skip exit code');
  assert.equal(decide({cwd:dir,project:'games/a',previous:head}).build,true,'manual same-SHA redeploy must work');
  assert.equal(decide({cwd:dir,project:'games/b',previous:baseline,force:'1'}).build,true);
  assert.equal(decide({cwd:dir,project:'games/b',previous:''}).build,true);
  assert.equal(decide({cwd:dir,project:'../outside',previous:baseline}).build,true);
  assert.equal(decide({cwd:dir,project:'games/a',previous:'f'.repeat(40)}).build,true,'missing shallow history fails open');
  git('rm','-q','games/a/index.html');commit();assert.equal(decide({cwd:dir,project:'games/a',previous:head}).build,true,'deleted inputs trigger build');
 }finally{
  const resolved=path.resolve(dir);if(path.dirname(resolved)!==tempRoot||!path.basename(resolved).startsWith('gamehubs-ignore-'))throw Error('Unsafe fixture cleanup');
  rmSync(resolved,{recursive:true,force:true});
 }
});
