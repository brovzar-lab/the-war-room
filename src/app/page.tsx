import Link from 'next/link';
import { DemoModeBadge } from '@/components/DemoModeBadge';
import { MOCK_COMPARTMENTS, PIPELINE_DATA } from '@/lib/mock-data';

function temperatureColor(temp: string) {
  switch (temp) {
    case 'hot': return 'text-brief-hot';
    case 'warm': return 'text-brief-warm';
    case 'cold': return 'text-brief-cold';
    case 'new': return 'text-brief-new';
    default: return 'text-brief-muted';
  }
}

function temperatureBg(temp: string) {
  switch (temp) {
    case 'hot': return 'bg-brief-hot/10 border-brief-hot/30';
    case 'warm': return 'bg-brief-warm/10 border-brief-warm/30';
    case 'cold': return 'bg-brief-cold/10 border-brief-cold/30';
    case 'new': return 'bg-brief-new/10 border-brief-new/30';
    default: return 'bg-brief-surface border-brief-border';
  }
}

export default function DashboardPage() {
  const featured = MOCK_COMPARTMENTS.find((c) => c.isPinned && c.needsAction) ?? MOCK_COMPARTMENTS[0];
  const actionDeals = MOCK_COMPARTMENTS.filter((c) => c.needsAction);
  const fieldReports = MOCK_COMPARTMENTS.filter((c) => c.id !== featured.id);

  // Bar chart data: by value descending
  const byValue = [...MOCK_COMPARTMENTS]
    .filter((c) => c.metrics.dealValue)
    .sort((a, b) => (b.metrics.dealValue ?? 0) - (a.metrics.dealValue ?? 0));
  const maxVal = Math.max(...byValue.map((c) => c.metrics.dealValue ?? 0));

  const today = new Date('2026-05-14');
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-brief-bg text-brief-text">
      <DemoModeBadge />

      {/* MASTHEAD */}
      <header className="border-b border-brief-border px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-brief-muted">
              The War Room
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-brief-accent ml-3">
              Intelligence Brief
            </span>
          </div>
          <div className="font-mono text-[10px] text-brief-muted uppercase tracking-widest">
            {dateStr} &nbsp;|&nbsp; Vol. IV No. 14
          </div>
        </div>
      </header>

      {/* ALERT BAR */}
      {actionDeals.length > 0 && (
        <div className="bg-brief-accent px-6 py-2">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <span className="font-mono text-[11px] font-semibold text-black uppercase tracking-widest shrink-0">
              ⚠ ACTIONS TODAY: {actionDeals.length}
            </span>
            <span className="text-black/40 font-mono text-[11px]">|</span>
            {actionDeals.map((d, i) => (
              <span key={d.id} className="font-mono text-[11px] text-black">
                <Link href={`/compartment/${d.id}`} className="font-semibold hover:underline">
                  {d.companyName}
                </Link>
                {': '}
                {d.actionNote}
                {i < actionDeals.length - 1 && <span className="text-black/40 mx-3">—</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex gap-8">

          {/* LEFT: FEATURED DEAL (60%) */}
          <div className="flex-1 min-w-0 border-r border-brief-border pr-8">
            {/* Company badge + tags */}
            <div className="flex items-center gap-3 mb-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brief-muted bg-brief-surface border border-brief-border px-3 py-1.5">
                {featured.companyName}
              </div>
              {featured.isPinned && (
                <span className="brief-tag border-brief-accent/40 text-brief-accent">
                  [PINNED]
                </span>
              )}
              {featured.needsAction && (
                <span className="brief-tag border-brief-urgent/40 text-brief-urgent">
                  [ACTION]
                </span>
              )}
              <span className={`brief-tag border-current ${temperatureColor(featured.temperature)}`}>
                {featured.temperature.toUpperCase()}
              </span>
            </div>

            {/* Editorial headline */}
            <h1 className="font-serif text-5xl font-semibold leading-[1.1] text-brief-text mb-2">
              {featured.editorialHeadline}
            </h1>

            {/* Deck line */}
            <p className="font-sans text-sm text-brief-muted mb-6 leading-relaxed border-b border-brief-border pb-4">
              {featured.description}
            </p>

            {/* Two-column editorial body */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <p className="font-serif text-base leading-[1.7] text-brief-text/90">
                {featured.editorialBody[0]}
              </p>
              <p className="font-serif text-base leading-[1.7] text-brief-text/90">
                {featured.editorialBody[1]}
              </p>
            </div>

            {/* Key insights */}
            <div className="mb-6 border-t border-brief-border pt-4">
              <span className="brief-section-label block mb-3">Field Intelligence</span>
              <div className="grid grid-cols-2 gap-2">
                {featured.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] font-sans text-brief-muted">
                    <span className="text-brief-accent mt-0.5 shrink-0">›</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Link href={`/compartment/${featured.id}`}>
                <button className="brief-btn">
                  Open Field Report
                </button>
              </Link>
              <button className="brief-btn brief-btn-muted">
                [PIN]
              </button>
              {featured.needsAction && (
                <button className="brief-btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                  [CONSULT]
                </button>
              )}
              <div className="ml-auto font-mono text-[10px] text-brief-muted">
                {featured.metrics.dealSize && (
                  <span className={`${temperatureColor(featured.temperature)} font-semibold`}>
                    {featured.metrics.dealSize}
                  </span>
                )}
                {featured.metrics.stage && (
                  <span className="ml-2">{featured.metrics.stage.toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: PIPELINE SIDEBAR (40%) */}
          <div className="w-[340px] shrink-0 space-y-6">

            {/* Pipeline Stats */}
            <div>
              <span className="brief-section-label block mb-3">Pipeline</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brief-surface border border-brief-border p-3">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-brief-muted mb-1">Total</div>
                  <div className="font-serif text-2xl text-brief-text">{PIPELINE_DATA.total}</div>
                </div>
                <div className="bg-brief-surface border border-brief-border p-3">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-brief-muted mb-1">Deals</div>
                  <div className="font-serif text-2xl text-brief-text">{PIPELINE_DATA.deals}</div>
                </div>
                <div className="bg-brief-surface border border-brief-border p-3">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-brief-muted mb-1">Closing</div>
                  <div className="font-serif text-2xl text-brief-new">{PIPELINE_DATA.closing}</div>
                </div>
                <div className="bg-brief-surface border border-brief-border p-3">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-brief-muted mb-1">At Risk</div>
                  <div className="font-serif text-2xl text-brief-urgent">{PIPELINE_DATA.atRisk}</div>
                </div>
              </div>
            </div>

            {/* By Value Bar Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="brief-section-label">By Value</span>
                <span className="font-mono text-[9px] text-brief-muted">USD MILLIONS</span>
              </div>
              <div className="space-y-2.5">
                {byValue.map((deal) => {
                  const pct = Math.round(((deal.metrics.dealValue ?? 0) / maxVal) * 100);
                  const barColor =
                    deal.temperature === 'hot' ? 'bg-brief-urgent' :
                    deal.temperature === 'cold' ? 'bg-brief-cold' :
                    deal.temperature === 'new' ? 'bg-brief-new' :
                    'bg-brief-accent';
                  return (
                    <Link key={deal.id} href={`/compartment/${deal.id}`} className="block group">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-mono text-[10px] uppercase tracking-wider group-hover:text-brief-accent transition-colors ${temperatureColor(deal.temperature)}`}>
                          {deal.companyName}
                        </span>
                        <span className="font-mono text-[10px] text-brief-muted">
                          ${deal.metrics.dealValue}M
                        </span>
                      </div>
                      <div className="h-1.5 bg-brief-surface2 w-full">
                        <div
                          className={`h-full ${barColor} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Key contacts / quick jump */}
            <div>
              <span className="brief-section-label block mb-3">Hot Contacts</span>
              <div className="space-y-2">
                {featured.keyContacts.map((contact) => (
                  <div key={contact} className="flex items-center gap-2 font-mono text-[11px] text-brief-muted border-b border-brief-border/50 pb-2 last:border-0">
                    <span className="w-4 h-4 bg-brief-surface2 border border-brief-border flex items-center justify-center text-[8px] text-brief-text shrink-0">
                      {contact[0]}
                    </span>
                    {contact}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FIELD REPORTS STRIP */}
      <section className="border-t border-brief-border bg-brief-surface">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center gap-1 mb-3">
            <span className="brief-section-label">Field Reports</span>
          </div>
          <div className="flex gap-0 overflow-x-auto">
            {fieldReports.map((deal, i) => (
              <Link
                key={deal.id}
                href={`/compartment/${deal.id}`}
                className="shrink-0 border-r border-brief-border last:border-r-0 pr-5 mr-5 last:mr-0 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[10px] font-semibold uppercase tracking-wider group-hover:underline ${temperatureColor(deal.temperature)}`}>
                    {deal.companyName}
                  </span>
                  {deal.metrics.dealSize && (
                    <span className="font-mono text-[10px] text-brief-muted">
                      {deal.metrics.dealSize}
                    </span>
                  )}
                  <span className="font-mono text-[8px] text-brief-muted">•</span>
                  <span className={`font-mono text-[9px] uppercase ${temperatureColor(deal.temperature)}`}>
                    {deal.temperature}
                  </span>
                  {deal.needsAction && (
                    <span className="font-mono text-[8px] text-brief-urgent">[!]</span>
                  )}
                </div>
                <p className="font-sans text-[11px] text-brief-muted max-w-[200px] truncate">
                  {deal.fieldReportSummary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER NAV */}
      <footer className="border-t border-brief-border bg-brief-bg px-6 py-2">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 font-mono text-[10px] text-brief-muted">
            <span>Hold <kbd className="px-1.5 py-0.5 bg-brief-surface border border-brief-border text-[9px]">Space</kbd> to speak</span>
            <span><kbd className="px-1.5 py-0.5 bg-brief-surface border border-brief-border text-[9px]">T</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-brief-surface border border-brief-border text-[9px]">Enter</kbd> Open</span>
            <span><kbd className="px-1.5 py-0.5 bg-brief-surface border border-brief-border text-[9px]">P</kbd> Pin deal</span>
          </div>
          <div className="font-mono text-[10px] text-brief-muted/50 uppercase tracking-widest">
            Intelligence Brief v2 — Clearance Level: CEO
          </div>
        </div>
      </footer>
    </div>
  );
}
