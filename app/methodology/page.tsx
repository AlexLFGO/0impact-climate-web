import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Methodology — ØG Climate Dashboard',
  description: 'Conservative-estimate methodology for documented credit retirements and covered ØG network emissions.',
  robots: { index: true, follow: true },
};

const FIELDS: Array<{ label: string; value: string }> = [
  { label: 'Covered emissions', value: 'Selected ØG network activity' },
  { label: 'Credit source', value: 'Verified Carbon Standard (Regen C03)' },
  { label: 'Retirement cadence', value: '0.0905 tCO₂e every 5 minutes' },
  { label: 'Methodology type', value: 'Conservative estimate' },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/dotted-gradient-bg.webp')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '600px 600px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
      </div>

      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/0g-white-logo.png"
                alt="ØG Logo"
                width={120}
                height={48}
                className="h-10 sm:h-12 w-auto"
              />
              <div className="h-5 sm:h-6 w-px bg-white/20" />
              <div className="text-base sm:text-lg font-normal text-white/60">Methodology</div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-6">
          <span className="text-white block">Climate accounting</span>
          <span className="gradient-text block mt-1">methodology.</span>
        </h1>

        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10">
          This dashboard uses conservative estimates for covered ØG network emissions and compares
          them with documented credit retirements. Current retirements use the Regen Registry
          Verified Carbon Standard credit class at 0.0905 tCO₂e every five minutes
          (9,511 tCO₂e/year).
        </p>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium mb-4">
            At a glance
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.map((field) => (
              <div
                key={field.label}
                className="rounded-lg bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 p-4"
              >
                <dt className="text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  {field.label}
                </dt>
                <dd className="text-sm sm:text-base font-light text-white">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium mb-4">
            Covered emissions
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Modeled emissions cover selected ØG network activity. Inputs include per-node power
            assumptions, hardware utilization patterns, and a global-average grid carbon intensity.
            Estimates are intentionally conservative; they do not assert full coverage of every
            node, region, or workload.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium mb-4">
            Documented credit retirements
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mb-3">
            Each retirement record is publicly viewable in the Impact Scanner on the dashboard,
            with on-chain transaction hashes and certificate metadata. Retirements are executed
            on the Regen Registry. Current activity uses the Verified Carbon Standard credit
            class (C03).
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            Retirement cadence: <span className="text-white">0.0905 tCO₂e every 5 minutes</span>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium mb-4">
            Methodology type
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Conservative estimate. Tree-equivalent figures shown elsewhere on the dashboard are
            illustrative only and do not assert offset coverage, balance claims, or regulatory
            compliance. Methodology is aligned with EU sustainability assessment standards.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium mb-4">
            Reference documents
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/Emissions_Methodology.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Emissions Methodology (PDF)
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://archax.com/hubfs/dlt-sustainability-assessment.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Sustainability Assessment
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
          </ul>
        </section>

        <div className="border-t border-white/10 pt-6 mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-purple-500/20 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-white/50 text-xs">
            © 2025 ØG Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
