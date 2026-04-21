import { useCallback, useRef, useSyncExternalStore } from 'react';

const identity = (value) => value;

const isObject = (value) => value !== null && typeof value === 'object';

export const shallow = (left, right) => {
  if (Object.is(left, right)) {
    return true;
  }

  if (!isObject(left) || !isObject(right)) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(right, key) ||
      !Object.is(left[key], right[key])
    ) {
      return false;
    }
  }

  return true;
};

export const createStore = (createState) => {
  let state;
  const listeners = new Set();

  const getState = () => state;

  const setState = (partial, replace = false) => {
    const nextPartial =
      typeof partial === 'function' ? partial(state) : partial;

    if (nextPartial === undefined) {
      return state;
    }

    const nextState =
      replace || !isObject(state) || !isObject(nextPartial)
        ? nextPartial
        : { ...state, ...nextPartial };

    if (shallow(state, nextState)) {
      return state;
    }

    state = nextState;
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

  const useStore = (selector = identity, equalityFn = Object.is) => {
    const selectorRef = useRef(selector);
    const equalityFnRef = useRef(equalityFn);
    const selectedStateRef = useRef();
    const hasSelectionRef = useRef(false);

    selectorRef.current = selector;
    equalityFnRef.current = equalityFn;

    const currentSelectedState = selector(store.getState());

    if (
      !hasSelectionRef.current ||
      !equalityFnRef.current(selectedStateRef.current, currentSelectedState)
    ) {
      selectedStateRef.current = currentSelectedState;
      hasSelectionRef.current = true;
    }

    const subscribe = useCallback(
      (notify) =>
        store.subscribe(() => {
          const nextSelectedState = selectorRef.current(store.getState());

          if (
            equalityFnRef.current(selectedStateRef.current, nextSelectedState)
          ) {
            return;
          }

          selectedStateRef.current = nextSelectedState;
          notify();
        }),
      []
    );

    const getSnapshot = useCallback(() => selectedStateRef.current, []);

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  };

  useStore.getState = store.getState;
  useStore.setState = store.setState;
  useStore.subscribe = store.subscribe;

  return useStore;
};
