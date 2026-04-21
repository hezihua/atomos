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
