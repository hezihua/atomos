# Changelog

用于手动记录每次 commit 的更新内容。

## 维护规则

- 每次提交后，追加一个新的小节
- 标题建议包含日期和简短主题
- 内容尽量记录“为什么改”和“改了什么”
- 如果有影响范围，尽量写清楚涉及的目录或模块

推荐格式：

```md
## 2026-04-21 - feat: 简短标题

- 背景：为什么要改
- 变更：具体做了什么
- 影响：涉及哪些模块或行为
```

---

## 2026-04-21 - chore: 初始化仓库结构

- 背景：将状态管理代码从示例中抽离，整理为独立 package。
- 变更：新增 `packages/core` 作为核心库，新增 `packages/demo` 作为 React 示例项目。
- 影响：仓库从单文件演示调整为 `core + demo` 的结构。

## 2026-04-21 - docs: 完善项目文档

- 背景：需要补齐项目说明，方便后续继续开发和维护。
- 变更：新增根目录 `README.md`，完善 `packages/core/README.md` 与 `packages/demo/README.md`。
- 影响：仓库的结构、用法和开发方式已经有基础文档可查。

## 2026-04-21 - feat: 增强状态库能力

- 背景：原始实现只支持浅合并对象状态，selector 比较能力也比较弱。
- 变更：新增 `setState(partial, replace)`、`shallow`、`useStore(selector, equalityFn)`，并优化无变化更新跳过通知。
- 影响：`packages/core` 的可用性更强，`packages/demo` 也同步演示了 `reset` 和 `shallow` 的用法。

## 2026-04-21 - chore: 清理示例与仓库基础配置

- 背景：仓库结构逐步稳定后，需要去掉早期临时示例并补齐基础工程文件。
- 变更：删除根目录 `react.html`，新增根目录 `.gitignore`，并清理文档中对旧 HTML 示例的引用。
- 影响：仓库内容更聚焦于 `packages/core` 和 `packages/demo`，同时避免将依赖目录、构建产物和本地缓存纳入版本控制。

## 2026-04-21 - docs: 引入手动维护的提交记录

- 背景：需要为每次 commit 保留可读的更新记录，方便后续回顾改动历史。
- 变更：新增根目录 `CHANGELOG.md`，约定以手动追加的方式记录每次提交的背景、变更和影响，并在 `README.md` 中补充说明。
- 影响：后续提交可以统一在 `CHANGELOG.md` 中维护演进过程，减少仅依赖 commit message 查阅上下文的成本。

## 2026-04-21 - refactor: 将源码迁移到 TypeScript

- 背景：随着状态库能力增加，纯 JavaScript 版本在 API 约束和可维护性上开始变弱。
- 变更：将 `packages/core/src/index.js` 迁移为 `index.ts`，将 `packages/demo` 中的 `App`、`main`、Vite 配置迁移到 TS/TSX，并新增两侧的 `tsconfig.json`、类型依赖和 `typecheck` 脚本。
- 影响：`core` 和 `demo` 现在都具备类型检查能力，状态库的 `SetState`、`UseStore`、`StoreApi` 等接口也有了明确的类型定义。

## 2026-04-21 - chore: 切换到 pnpm workspace

- 背景：仓库已经形成多包结构，继续使用分散的 npm 安装方式不利于统一管理依赖和脚本。
- 变更：新增根目录 `package.json`、`pnpm-workspace.yaml` 和 `pnpm-lock.yaml`，删除原有 `package-lock.json`，并把文档和命令统一为 `pnpm install`、`pnpm dev`、`pnpm typecheck`、`pnpm build`。
- 影响：`packages/core` 与 `packages/demo` 现在由同一个 workspace 管理，依赖安装、类型检查和构建入口都统一到了根目录。
