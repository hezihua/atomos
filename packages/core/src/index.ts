import { useCallback, useRef, useSyncExternalStore } from 'react';

export type EqualityFn<T> = (left: T, right: T) => boolean;
export type Listener = () => void;
export type GetState<T> = () => T;
export type Subscribe = (listener: Listener) => () => void;
export type StateSlice<T> = T extends object ? T | Partial<T> : T;
export type StateUpdater<T> = StateSlice<T> | ((state: T) => StateSlice<T>);
export type SetState<T> = (partial: StateUpdater<T>, replace?: boolean) => T;
export type StateCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

export interface StoreApi<T> {
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: Subscribe;
}

export interface UseStore<T> {
  <Selected = T>(
    selector?: (state: T) => Selected,
    equalityFn?: EqualityFn<Selected>
  ): Selected;
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: Subscribe;
}

const identity = <T,>(value: T): T => value;

const isObject = (value: unknown): value is Record<PropertyKey, unknown> =>
  value !== null && typeof value === 'object';

export const shallow = <T,>(left: T, right: T): boolean => {
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

export const createStore = <T,>(createState: StateCreator<T>): StoreApi<T> => {
  let state!: T;
  const listeners = new Set<Listener>();

  const getState = (): T => state;

  const setState: SetState<T> = (partial, replace = false) => {
    const nextPartial =
      typeof partial === 'function'
        ? (partial as (state: T) => StateSlice<T>)(state)
        : partial;

    if (nextPartial === undefined) {
      return state;
    }

    const nextState =
      replace || !isObject(state) || !isObject(nextPartial)
        ? (nextPartial as T)
        : ({ ...state, ...nextPartial } as T);

    if (shallow(state, nextState)) {
      return state;
    }

    state = nextState;
    listeners.forEach((listener) => listener());
    return state;
  };

  const subscribe: Subscribe = (listener) => {
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

export const create = <T,>(createState: StateCreator<T>): UseStore<T> => {
  const store = createStore(createState);

  const useStore = (<Selected = T>(
    selector: (state: T) => Selected = identity as (state: T) => Selected,
    equalityFn: EqualityFn<Selected> = Object.is
  ): Selected => {
    const selectorRef = useRef(selector);
    const equalityFnRef = useRef(equalityFn);
    const selectedStateRef = useRef<Selected>(selector(store.getState()));
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
      (notify: Listener) =>
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
  }) as UseStore<T>;

  useStore.getState = store.getState;
  useStore.setState = store.setState;
  useStore.subscribe = store.subscribe;

  return useStore;
};
