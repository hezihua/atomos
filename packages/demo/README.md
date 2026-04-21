# React Demo

`packages/demo` 是这个仓库里的 React 示例项目，用来验证和演示 `packages/core` 的用法。

它基于：

- React
- Vite

## 启动

```bash
cd packages/demo
npm install
npm run dev
```

默认会启动本地开发服务器，你可以在浏览器中看到两个独立的状态卡片：

- `Bears`
- `Honey`

另外还有一个 `Reset Store` 按钮，用来演示整状态替换。

## 构建

```bash
cd packages/demo
npm run build
```

构建产物会输出到：

```text
packages/demo/dist
```

## 这个 demo 做了什么

demo 中创建了一个简单 store：

```js
const useBearStore = create((set) => ({
  bears: 0,
  honey: 10,
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
  increaseHoney: () => set((state) => ({ honey: state.honey + 1 })),
}));
```

然后在两个组件区域中分别订阅不同字段，验证 selector 的使用方式：

- 一个组件只读取 `bears`
- 一个组件只读取 `honey`

demo 还展示了两个新能力：

- 使用 `shallow` 组合订阅多个 action，避免无意义更新
- 使用 `setState(nextState, true)` 执行整状态替换

## 如何引用 core

这个 demo 没有从 npm 安装 `atomos-state`，而是直接引用本地源码。

在 `vite.config.js` 中通过 alias 把：

- `atomos-state` 指向 `../core/src/index.js`

这样做的好处是你修改 `packages/core/src/index.js` 后，demo 可以立刻使用最新实现。

## 相关文件

- `src/App.jsx`：示例页面和 store 使用方式
- `src/main.jsx`：React 入口
- `src/styles.css`：示例样式
- `vite.config.js`：本地包 alias 配置
