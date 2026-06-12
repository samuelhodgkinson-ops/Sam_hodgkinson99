"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/teams", label: "Teams" },
  { href: "/groups", label: "Groups" },
  { href: "/matches", label: "Fixtures" },
  { href: "/standings", label: "Standings" },
  { href: "/compare", label: "Compare" },
  { href: "/turkey-barn", label: "🦃 Barn Game" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--card-border)]" style={{ background: "var(--nav-bg)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">⚽</span>
            <span className="hidden sm:inline">WC 2026 Explorer</span>
            <span className="sm:hidden">WC 2026</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[var(--accent)] text-white" : "text-[var(--muted-light)] hover:text-white hover:bg-[var(--surface-light)]"}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link href="/search" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--card-border)] text-sm text-[var(--muted)] hover:border-[var(--accent)] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search...
          </Link>

          <button className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-light)]" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--card-border)]" style={{ background: "var(--surface)" }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (<Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? "bg-[var(--accent)] text-white" : "text-[var(--muted-light)] hover:text-white"}`}>{link.label}</Link>);
            })}
            <Link href="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted-light)] hover:text-white">Search</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
