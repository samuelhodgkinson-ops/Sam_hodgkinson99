export function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚽</span>
            <span>FIFA World Cup 2026 Team Explorer</span>
          </div>
          <span>Data sources: FIFA.com, official federation sites</span>
          <span className="text-xs">Not affiliated with FIFA. For educational and analysis purposes only.</span>
        </div>
      </div>
    </footer>
  );
}
