# atomos-state core

`packages/core` 是这个仓库里的状态管理库核心实现。

它导出了一个轻量的 React 状态管理 API，核心目标是：

- 用尽量少的代码提供全局 store 能力
- 保持 `create((set) => state)` 这种直观写法
- 支持 React 组件按 selector 订阅状态

## 安装

如果你把它作为独立包发布，可以这样使用：

```bash
npm install atomos-state
```

当前仓库里它位于：

```text
packages/core
```

## 导出

### `createStore(createState)`

创建一个原始 store，不依赖 React 组件本身，返回：

- `getState()`
- `setState(partial, replace?)`
- `subscribe(listener)`

适合你需要在 React 外部直接操作 store 的场景。

### `create(createState)`

创建一个 React Hook。

返回值本身就是 `useStore`，同时它还挂载了：

- `useStore.getState`
- `useStore.setState`
- `useStore.subscribe`

因此你既可以在组件里通过 Hook 使用，也可以在外部直接操作同一个 store。

## 用法

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

## `setState` 行为

`setState` 默认采用浅合并：

```js
useBearStore.setState({ bears: 1 });
```

如果你需要整状态替换，可以传第二个参数 `true`：

```js
useBearStore.setState(
  {
    bears: 0,
    honey: 10,
  },
  true
);
```

另外，如果更新前后浅比较没有发生变化，store 不会触发订阅通知。

## selector 说明

推荐优先使用 selector：

```js
const bears = useBearStore((state) => state.bears);
```

而不是直接：

```js
const state = useBearStore();
```

这样可以让组件只订阅自己真正关心的状态片段，减少不必要的重渲染。

## equalityFn 与 `shallow`

`useStore` 支持第二个参数 `equalityFn`：

```js
const actions = useBearStore(
  (state) => ({
    increaseBears: state.increaseBears,
    increaseHoney: state.increaseHoney,
  }),
  shallow
);
```

库内置导出了 `shallow`，适合对象或数组风格的 selector 结果比较。

## 浏览器直接使用

仓库中已经提供了一个 UMD 文件：

```text
packages/core/dist/index.umd.js
```

在浏览器里可以这样使用：

```html
<script src="./packages/core/dist/index.umd.js"></script>
<script>
  const { create, shallow } = AtomosState;
</script>
```

## React 版本

当前 `peerDependencies` 为：

```text
react ^18.0.0 || ^19.0.0
```

内部基于 `useSyncExternalStore` 实现订阅。

## 当前限制

当前实现保持了简单优先，暂时没有提供这些能力：

- 中间件机制
- 持久化
- devtools 集成
- 内建 TypeScript 类型声明
- 服务端场景下更完整的兼容性打磨
