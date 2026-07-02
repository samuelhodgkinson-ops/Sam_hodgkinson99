import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <div className="relative overflow-hidden border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-6xl mb-6">⚽</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              FIFA World Cup 2026<br />
              <span className="text-[var(--accent-light)]">Team Explorer</span>
            </h1>
            <p className="text-lg text-[var(--muted-light)] mb-8 max-w-xl mx-auto">
              Browse teams, squads, fixtures, results, standings, and statistics for the first-ever 48-team World Cup.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/teams" className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors">Browse All Teams</Link>
              <Link href="/groups" className="px-6 py-3 rounded-lg border border-[var(--card-border)] text-white font-semibold hover:bg-[var(--surface-light)] transition-colors">View Groups</Link>
              <Link href="/matches" className="px-6 py-3 rounded-lg border border-[var(--card-border)] text-white font-semibold hover:bg-[var(--surface-light)] transition-colors">Fixtures</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Teams", value: "48", detail: "First 48-team World Cup" },
            { label: "Groups", value: "12", detail: "4 teams per group" },
            { label: "Matches", value: "104", detail: "June 11 - July 19, 2026" },
            { label: "Venues", value: "16", detail: "USA, Mexico & Canada" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-center">
              <div className="text-3xl font-bold text-[var(--accent-light)]">{s.value}</div>
              <div className="text-sm font-semibold text-white mt-1">{s.label}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{s.detail}</div>
            </div>
          ))}
        </div>

        <Link href="/turkey-barn" className="block mb-12 group">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--surface)] p-6 sm:p-8 hover:border-[var(--accent)] transition-all">
            <div className="absolute -right-4 -top-6 text-[7rem] sm:text-[9rem] opacity-10 group-hover:opacity-20 transition-opacity select-none pointer-events-none">🦃</div>
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="text-5xl sm:text-6xl">🦃</div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--warning)] mb-1">Mini Game</div>
                <h3 className="text-2xl font-bold text-white mb-1">Barn Door Keeper</h3>
                <p className="text-sm text-[var(--muted-light)] max-w-xl">
                  Use the arrow keys to run your keeper across seven levels — barns, an African field, the ocean, a pig pen, even the office floor — slamming pens shut before your livestock escape. Points accumulate across every level and land on the leaderboard.
                </p>
              </div>
              <span className="self-start sm:self-center px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold group-hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap">
                Play Now
              </span>
            </div>
          </div>
        </Link>

        <h2 className="text-xl font-bold text-white mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/teams", icon: "🏟️", title: "All Teams", desc: "Browse qualified teams with profiles, rankings, and group info" },
            { href: "/groups", icon: "📊", title: "Groups", desc: "View groups with standings, fixtures, and qualification scenarios" },
            { href: "/matches", icon: "📅", title: "Fixtures & Results", desc: "Complete match schedule with venues, times, and results" },
            { href: "/standings", icon: "🏆", title: "Standings", desc: "Full tournament standings across all groups" },
            { href: "/compare", icon: "⚖️", title: "Compare Teams", desc: "Side-by-side comparison of any two teams" },
            { href: "/search", icon: "🔍", title: "Search", desc: "Find teams, players, and matches quickly" },
            { href: "/turkey-barn", icon: "🦃", title: "Barn Door Keeper", desc: "Arrow-key game — run your keeper across seven levels, rack up points and top the leaderboard" },
          ].map((l) => (
            <Link key={l.href} href={l.href}>
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 hover:bg-[var(--card-hover)] hover:border-[var(--accent)] transition-all">
                <div className="text-2xl mb-3">{l.icon}</div>
                <h3 className="font-semibold text-white mb-1">{l.title}</h3>
                <p className="text-sm text-[var(--muted)]">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h2 className="text-lg font-bold text-white mb-4">About the Tournament</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--muted-light)]">
            <p>The 2026 FIFA World Cup is the first edition to feature 48 teams, expanded from 32. It is jointly hosted by <strong className="text-white">Canada</strong>, <strong className="text-white">Mexico</strong>, and the <strong className="text-white">United States</strong>. The tournament features 12 groups of 4 teams each.</p>
            <p>The top two teams from each group, plus the eight best third-placed teams, advance to a 32-team knockout stage. The final will be held at <strong className="text-white">MetLife Stadium</strong> in East Rutherford, New Jersey.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
