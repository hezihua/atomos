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

特点：

- API 简单，接近 `create((set) => initialState)` 的使用方式
- 基于 `useSyncExternalStore` 实现 React 订阅
- 支持 selector，例如 `useStore((state) => state.count)`
- 支持浏览器 UMD 方式和 ESM 方式使用

## 快速开始

### 运行 React Demo

```bash
cd packages/demo
npm install
npm run dev
```

构建 demo：

```bash
cd packages/demo
npm run build
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

当前仓库还没有根级别 workspace 配置，`packages/demo` 是一个独立的 Vite 工程。

为了让 demo 直接使用本地源码，`packages/demo/vite.config.js` 中通过 alias 将：

- `atomos-state` 指向 `packages/core/src/index.js`

这意味着你修改 `packages/core/src/index.js` 后，demo 会直接反映最新实现。

## 当前状态

这是一个偏教学和实验性质的仓库，适合继续扩展的方向包括：

- TypeScript 类型声明
- 单元测试
- 发布脚本
- 根目录 monorepo/workspace 配置
