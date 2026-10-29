# 安装与跨设备使用

skill由SKILL.md、agents/openai.yaml及references组成，可在macOS、Windows、Linux上的Codex使用；工作流不依赖本机下载目录。只安装同名skill的一份可发现副本，官方说明同名skill不会合并，重复目录可导致选择器出现多份。

## 本次交付

- 仓库源码：`docs/skills/gamehubs-keyword-site-plan/`，用于版本管理和跨设备复制；此处不是自动发现目录。
- 本机按skill-creator默认个人路径安装到`~/.codex/skills/gamehubs-keyword-site-plan/`；此环境已有个人skill使用该目录。
- 可迁移整个同名目录，或解压交付的ZIP。仅复制SKILL.md会丢失引用资料。

## 另一台电脑

按[官方本地发现说明](https://learn.chatgpt.com/docs/build-skills)，当前推荐个人目录为`~/.agents/skills/`，Windows为用户主目录下`.agents\skills\`。把完整gamehubs-keyword-site-plan文件夹放入该目录即可；或将它放到目标仓库`.agents/skills/`，只供该仓库使用。不要同时往个人和仓库发现目录各放同名副本。已使用兼容的`.codex/skills`环境可沿用其实际发现目录，先检查同名安装。

示例：

```text
macOS / Linux: ~/.agents/skills/gamehubs-keyword-site-plan/SKILL.md
Windows:      %USERPROFILE%\.agents\skills\gamehubs-keyword-site-plan\SKILL.md
```

Codex通常自动发现文件变化；若选择器未出现，重启Codex后重试。输入`$gamehubs-keyword-site-plan`显式调用，也可用自然语言请求游戏单站挖词／建站方案；自动匹配取决于任务和可用skill。

本地目录安装不应当作“同账号已自动同步另一台电脑”。仓库源码只有经授权提交／推送并在另一台拉取，才会随Git传递；源码位于docs/skills，拉取后仍需安装到该设备的发现目录。未做远端同步时可以先传ZIP；本次不能声称另一台电脑已经安装。

## 需要分别准备的内容

- **规则文件**：整个skill目录。通过复制／ZIP／Git传递即可，不带工具执行权限。
- **GameHubs资料**：在目标设备同步管理仓库和所需证据；执行时读取当前台账，不能以skill快照代替最新批次／站点。
- **工具访问**：Semrush镜像浏览器会话、可选插件连接、GitHub／Vercel登录和DataForSEO密钥分别在目标设备配置。不把它们打包进skill，不认为Actions Secrets能下载为本机明文。
- **游戏源码**：按正式站点source在目标设备定位／克隆独立仓库；历史另一台电脑的路径和localhost不可直接使用。

换设备可先让Codex读取本skill并验证文件／引用可读，再做只读查询或已有证据分析；缺少外部访问时明确待补，不制造新采集结果。
