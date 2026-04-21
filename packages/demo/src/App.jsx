import { create, shallow } from 'atomos-state';

const createBearState = (set) => ({
  bears: 0,
  honey: 10,
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
  increaseHoney: () => set((state) => ({ honey: state.honey + 1 })),
  reset: () => set(createBearState(set), true),
});

const useBearStore = create(createBearState);

function StatCard({ title, value, actionLabel, onAction }) {
  return (
    <section className="card">
      <p className="label">{title}</p>
      <h2>{value}</h2>
      <button onClick={onAction}>{actionLabel}</button>
    </section>
  );
}

export default function App() {
  const bears = useBearStore((state) => state.bears);
  const honey = useBearStore((state) => state.honey);
  const actions = useBearStore(
    (state) => ({
      increaseBears: state.increaseBears,
      increaseHoney: state.increaseHoney,
      reset: state.reset,
    }),
    shallow
  );

  return (
    <main className="page">
      <div className="hero">
        <p className="eyebrow">atomos-state</p>
        <h1>React demo package</h1>
        <p className="description">
          This demo consumes the local package from <code>packages/core</code>
          and showcases selector equality plus full state replacement.
        </p>
      </div>

      <div className="toolbar">
        <button className="secondaryButton" onClick={actions.reset}>
          Reset Store
        </button>
      </div>

      <div className="grid">
        <StatCard
          title="Bears"
          value={bears}
          actionLabel="Increase Bears"
          onAction={actions.increaseBears}
        />
        <StatCard
          title="Honey"
          value={honey}
          actionLabel="Increase Honey"
          onAction={actions.increaseHoney}
        />
      </div>
    </main>
  );
}
