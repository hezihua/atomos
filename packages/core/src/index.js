import { useSyncExternalStore } from 'react';

export const createStore = (createState) => {
  let state;
  const listeners = new Set();

  const getState = () => state;

  const setState = (partial) => {
    const nextPartial =
      typeof partial === 'function' ? partial(state) : partial;

    if (nextPartial == null || typeof nextPartial !== 'object') {
      return state;
    }

    state = { ...state, ...nextPartial };
    listeners.forEach((listener) => listener());
    return state;
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  state = createState(setState, getState);

  return {
    getState,
    setState,
    subscribe,
  };
};

export const create = (createState) => {
  const store = createStore(createState);

  const useStore = (selector = (state) => state) =>
    useSyncExternalStore(
      store.subscribe,
      () => selector(store.getState()),
      () => selector(store.getState())
    );

  useStore.getState = store.getState;
  useStore.setState = store.setState;
  useStore.subscribe = store.subscribe;

  return useStore;
};
