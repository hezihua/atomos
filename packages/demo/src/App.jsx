import { create } from 'atomos-state';

const useBearStore = create((set) => ({
  bears: 0,
  honey: 10,
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
  increaseHoney: () => set((state) => ({ honey: state.honey + 1 })),
}));

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
  const increaseBears = useBearStore((state) => state.increaseBears);
  const increaseHoney = useBearStore((state) => state.increaseHoney);

  return (
    <main className="page">
      <div className="hero">
        <p className="eyebrow">atomos-state</p>
        <h1>React demo package</h1>
        <p className="description">
          This demo consumes the local package from <code>packages/core</code>.
        </p>
      </div>

      <div className="grid">
        <StatCard
          title="Bears"
          value={bears}
          actionLabel="Increase Bears"
          onAction={increaseBears}
        />
        <StatCard
          title="Honey"
          value={honey}
          actionLabel="Increase Honey"
          onAction={increaseHoney}
        />
      </div>
    </main>
  );
}
