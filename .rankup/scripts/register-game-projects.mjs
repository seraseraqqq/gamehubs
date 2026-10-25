/** Register only verified docs-ready private projects, preserving every legacy game entry.
 * Local management files only; does not commit/push GameHubs or change deployments.
 * Run after init-game-projects.mjs --finalize-records. Verified 2026-10-24.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const record=JSON.parse(await fs.readFile(path.join(root,'research/2026-10-24-game-project-init/verification.json'),'utf8'));
assert(record.status==='passed'&&record.projects.length===5);
const registryPath=path.join(root,'data/repositories.json');
const registry=JSON.parse(await fs.readFile(registryPath,'utf8')),oldGames=JSON.stringify(registry.games),oldPlanned=registry.plannedGames?.length||0;
if(registry._management) throw new Error('Registry is a generated compatibility view. Register projects through scripts/hub.py site or the local dashboard, then generate.');
const plan=JSON.parse(await fs.readFile(path.join(root,'research/2026-10-24-game-build-plan/plan.json'),'utf8'));
registry.plannedGames??=[];
for(const p of record.projects){
 assert(p.private&&p.workingTreeClean&&p.head===p.remoteHead);
 const s=plan.sites.find(s=>s.slug===p.siteId);assert(s);
 const entry={siteId:p.siteId,displayName:p.name,repo:p.repo,rootDirectory:'.',localPath:p.localPath,private:true,githubRepositoryId:p.githubRepositoryId,defaultBranch:p.defaultBranch,migrationState:'new-independent-repository',developmentState:'documentation-ready-not-implemented',releaseState:'not-deployed',verifiedHead:p.head,verifiedAt:p.verifiedAt,priority:s.rank,cohort:s.cohort,plannedDomain:s.domain,domainOwned:false,vercel:null,documentation:{requirements:'docs/PRD.md',design:'docs/DESIGN_BRIEF.md',competitors:'docs/COMPETITORS.md',handoff:'.rankup/INDEX.md'}};
 const i=registry.plannedGames.findIndex(g=>g.siteId===p.siteId);if(i>=0)registry.plannedGames[i]={...registry.plannedGames[i],...entry};else registry.plannedGames.push(entry);
}
assert(JSON.stringify(registry.games)===oldGames,'Legacy game entries changed');
assert(new Set(registry.plannedGames.map(p=>p.siteId)).size===registry.plannedGames.length);
registry.updatedAt=new Date().toISOString();
await fs.writeFile(registryPath,JSON.stringify(registry,null,2)+'\n');
const rows=record.projects.map(p=>{const s=plan.sites.find(s=>s.slug===p.siteId);return `| ${s.rank} | ${p.name} | [gameshub-${p.siteId}](${p.repo}) | [工作目录](${p.localPath}/README.md) | [开发需求](${p.localPath}/docs/PRD.md) · [设计简报](${p.localPath}/docs/DESIGN_BRIEF.md) · [竞品](${p.localPath}/docs/COMPETITORS.md) |`;}).join('\n');
const body=`# 五个新游戏开发工作空间\n\n2026-10-24。按Owner要求，前五个候选已分别建立文件夹及**私有GitHub仓库**，统一前缀gameshub-。各仓库main已推送，本地与远端HEAD一致且工作树干净；状态为文档就绪、游戏未开发。\n\n| 优先级 | 游戏 | GitHub私有仓库 | 本地入口 | 开发资料 |\n|---|---|---|---|---|\n${rows}\n\n每项目29个文件，包含PRODUCT、PRD、设计简报/候选tokens、竞品参考、许可登记、独立研究快照和Rankup接力/计划/词表/基线/接入看板。设计简报未冒充已验收的DESIGN.md；参考样例区分实际观察、SERP摘要与待实玩。离开GameHubs也能独立阅读主要资料，未复制游戏包或登录态。\n\n## 下一步\n\n从Cutle的[项目接力](E:/Projects/game-sites/cutle/.rankup/INDEX.md)与CUT-00开始：关键变体/名称/差异检查，再做几何引擎可玩原型。Metazooa须先解决分类数据审查。其余条件候选本轮没有建仓，以免把暂缓项误当已启动。\n\n新项目都没有Vercel项目、域名所有权或部署；不写成上线/可索引/变现已通过。现有12游戏映射与发布holds原样保留。根机器台账[data/repositories.json](data/repositories.json)将这5项单列plannedGames；games数组仍是原有12个有运行时游戏，现有导出检查不会误读无dist文档项目。实现具备运行时后再按验收晋升登记。\n\n## 验证与维护\n\n- [逐仓API/远端HEAD/工作树核验](research/2026-10-24-game-project-init/verification.json)；每项目29文件、52个本地Markdown链接通过检查（合计260）。\n- 5个Rankup目录文档检查断链/超限均为0；索引包含阶段、上一关卡、下一动作、阻塞与接力。\n- [原始研究计划](research/2026-10-24-game-build-plan/README.md)与[本轮接力](.rankup/research/game-project-initialization-2026-10-24.md)。\n\n## 沉淀的脚本\n\n- [.rankup/scripts/init-game-projects.mjs](.rankup/scripts/init-game-projects.mjs)：prepare仅创建新文件夹；publish-private需显式启用，校验gh账号、拒绝未知已有仓库、显式路径提交；finalize-records补记已验证推送；verify只读核对。需要本机gh/Git身份，无令牌进入文件。\n- [.rankup/scripts/register-game-projects.mjs](.rankup/scripts/register-game-projects.mjs)：从已验证结果登记plannedGames，断言原12个games条目不变，不推送GameHubs。\n\n管理仓库的其他未提交修改保留。新增项目已各自提交推送；本轮总台账变更仅保存在GameHubs本地，未把其他会话改动一起提交/发布。\n`;
await fs.writeFile(path.join(root,'docs/NEW_GAME_PROJECTS.md'),body.replaceAll('](research/','](../research/').replaceAll('](.rankup/','](../.rankup/').replaceAll('](data/','](../data/'));
await fs.writeFile(path.join(root,'research/2026-10-24-game-project-init/registry-validation.json'),JSON.stringify({checkedAt:new Date().toISOString(),legacyGamesBefore:JSON.parse(oldGames).length,legacyGamesAfter:registry.games.length,legacyEntriesUnchanged:JSON.stringify(registry.games)===oldGames,plannedBefore:oldPlanned,plannedAfter:registry.plannedGames.length,allNewPrivate:record.projects.every(p=>p.private),noVercelProjects:registry.plannedGames.every(p=>p.vercel===null),domainPurchases:0,result:'passed'},null,2)+'\n');
console.log(JSON.stringify({games:registry.games.length,plannedGames:registry.plannedGames.length,legacyEntriesUnchanged:true,managementFilesPushed:false}));
