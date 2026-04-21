(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('react'));
  } else {
    global.AtomosState = factory(global.React);
  }
})(typeof window !== 'undefined' ? window : this, function (React) {
  const { useSyncExternalStore } = React;

  const createStore = (createState) => {
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

  const create = (createState) => {
    const store = createStore(createState);

    const useStore = (selector) =>
      useSyncExternalStore(
        store.subscribe,
        () => (selector ? selector(store.getState()) : store.getState()),
        () => (selector ? selector(store.getState()) : store.getState())
      );

    useStore.getState = store.getState;
    useStore.setState = store.setState;
    useStore.subscribe = store.subscribe;

    return useStore;
  };

  return {
    createStore,
    create,
  };
});
