# atomos-state

一个轻量级 React 状态管理库示例仓库。

这个仓库目前包含两个核心部分：

- `packages/core`：状态管理库本体
- `packages/demo`：基于 `Vite + React` 的示例项目，直接消费 `packages/core`

## 目录结构

```text
.
├── packages
│   ├── core
│   │   ├── dist
│   │   └── src
│   └── demo
│       └── src
```

## 功能概览

`packages/core` 当前提供两个导出：

- `createStore(createState)`：创建一个原始 store，暴露 `getState`、`setState`、`subscribe`
- `create(createState)`：创建一个 React Hook，用于在组件中订阅状态
- `shallow(left, right)`：用于 selector 结果的浅比较

特点：

- API 简单，接近 `create((set) => initialState)` 的使用方式
- 基于 `useSyncExternalStore` 实现 React 订阅
- 支持 `setState(partial, replace)` 整体替换状态
- 支持 selector 和自定义 `equalityFn`
- 内置 `shallow` 用于对象 selector 比较
- 支持浏览器 UMD 方式和 ESM 方式使用

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行 React Demo

```bash
pnpm dev
```

构建 demo：

```bash
pnpm build
```

## 示例代码

```js
import { create } from 'atomos-state';

const useBearStore = create((set) => ({
  bears: 0,
  honey: 10,
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
  increaseHoney: () => set((state) => ({ honey: state.honey + 1 })),
}));

function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  const increaseBears = useBearStore((state) => state.increaseBears);

  return <button onClick={increaseBears}>{bears}</button>;
}
```

## 开发说明

当前仓库使用 `pnpm workspace` 管理 `packages/core` 和 `packages/demo`。

为了让 demo 直接使用本地源码，`packages/demo/vite.config.ts` 中通过 alias 将：

- `atomos-state` 指向 `packages/core/src/index.ts`

这意味着你修改 `packages/core/src/index.ts` 后，demo 会直接反映最新实现。

提交记录采用手动维护方式，统一写在根目录的 `CHANGELOG.md` 中。

## 当前状态

这是一个偏教学和实验性质的仓库，适合继续扩展的方向包括：

- 单元测试
- 发布脚本
- 更完整的自动化构建流程
