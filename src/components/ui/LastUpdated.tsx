export function LastUpdated({ timestamp, source }: { timestamp: string; source?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
      <span>Last updated: {new Date(timestamp).toLocaleString()}</span>
      {source && <span>| Source: {source}</span>}
    </div>
  );
}
