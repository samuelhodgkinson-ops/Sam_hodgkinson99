import { ReactNode } from "react";

export function Card({ children, className = "", hover = false, padding = true }: { children: ReactNode; className?: string; hover?: boolean; padding?: boolean }) {
  return (
    <div className={`rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] ${hover ? "hover:bg-[var(--card-hover)] hover:border-[var(--accent)] transition-all cursor-pointer" : ""} ${padding ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">{children}</h3>;
}

export function StatCard({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--surface)] p-3">
      <div className="text-xs text-[var(--muted)] mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {sublabel && <div className="text-xs text-[var(--muted)] mt-0.5">{sublabel}</div>}
    </div>
  );
}
