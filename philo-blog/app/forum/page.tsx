export default function ForumPage() {
  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="mx-auto w-full max-w-[760px] px-6">
        <div className="relative overflow-hidden rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-[clamp(var(--space-6),5vw,var(--space-10))] py-[clamp(var(--space-8),5vw,var(--space-12))] text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[color:var(--color-primary)]" />

          <span className="inline-flex items-center border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-1 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Жақында
          </span>

          <h1 className="mt-[var(--space-5)] font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] tracking-[-0.02em] text-[color:var(--color-text)]">
            Форум жақын арада іске қосылады
          </h1>

          <p className="mx-auto mt-[var(--space-4)] max-w-[42ch] font-body text-[length:var(--text-base)] leading-[1.75] text-[color:var(--color-text-muted)]">
            В ближайшее время здесь откроется площадка для дискуссий,
            вопросов и обмена идеями.
          </p>

          <p className="mt-[var(--space-6)] font-ui text-[length:var(--text-sm)] uppercase tracking-[0.16em] text-[color:var(--color-text-faint)]">
            Следите за обновлениями ZERDE
          </p>
        </div>
      </div>
    </section>
  );
}
