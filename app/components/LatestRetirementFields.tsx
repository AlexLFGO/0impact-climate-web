'use client';

import { useEffect, useState } from 'react';
import { impactApi } from '../lib/impactApi';
import {
  MODE_D_HOLDER,
  retiredOnDate,
  summarizeLatestRetirement,
  type LatestRetirementSummary,
} from '../lib/latestRetirement';

interface LatestRetirementData {
  latest: LatestRetirementSummary | null;
  /** Beneficiary the worker is configured for in Mode D ('' if not reported). */
  beneficiary: string;
}

const EMPTY: LatestRetirementData = { latest: null, beneficiary: '' };

// One /status request shared by every component on the page that mounts at the same time.
let inflight: Promise<LatestRetirementData> | null = null;

function loadLatestRetirement(): Promise<LatestRetirementData> {
  if (!inflight) {
    inflight = impactApi
      .getStatus()
      .then((status) => ({
        latest: summarizeLatestRetirement(status.recentTransactions),
        beneficiary: typeof status.modeD?.beneficiary === 'string' ? status.modeD.beneficiary.trim() : '',
      }))
      .catch(() => EMPTY)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

function useLatestRetirement(): LatestRetirementData {
  const [data, setData] = useState<LatestRetirementData>(EMPTY);
  useEffect(() => {
    let cancelled = false;
    loadLatestRetirement().then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return data;
}

function GlanceField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 p-4">
      <dt className="text-[10px] uppercase tracking-wider text-white/50 mb-1">{label}</dt>
      <dd className="text-sm sm:text-base font-light text-white">{value}</dd>
      {note && <dd className="text-xs text-white/50 mt-1">{note}</dd>}
    </div>
  );
}

/**
 * "At a glance" credit source and cadence, read from the recent successful
 * retirements so the copy never goes stale. Neutral text while loading or if the
 * API is unavailable.
 */
export function LatestRetirementFields() {
  const { latest } = useLatestRetirement();
  const date = latest ? retiredOnDate(latest) : '';

  return (
    <>
      <GlanceField
        label="Credit source"
        value={latest ? latest.creditClass : 'Credits retired on Regen Registry'}
        note={latest?.projectName ? `Most recent: ${latest.projectName}` : undefined}
      />
      <GlanceField
        label="Retirement cadence"
        value={
          !latest
            ? 'Scheduled every 5 minutes'
            : latest.isCurrent
              ? `${latest.amount} tCO₂e every 5 minutes`
              : `${latest.amount} tCO₂e per retirement`
        }
        note={
          !latest
            ? undefined
            : latest.isCurrent
              ? 'From recent successful retirements'
              : date
                ? `Most recent retirement: ${date}`
                : 'No recent retirement'
        }
      />
    </>
  );
}

/**
 * One sentence on what the current retirements use, derived from the newest
 * successful retirement. Renders nothing until data is available.
 */
export function CurrentRetirementNote() {
  const { latest, beneficiary } = useLatestRetirement();
  if (!latest) return null;

  const heldBy = latest.isModeD ? ` held by ${MODE_D_HOLDER}` : '';
  if (latest.isCurrent) {
    // The configured beneficiary is only reported (and only true) while Mode D is running.
    const forWhom = latest.isModeD && beneficiary ? ` for ${beneficiary}` : '';
    return latest.isModeD ? (
      <>{`Current retirements use ${latest.creditClass}${heldBy} and retired on Regen Ledger${forWhom}.`}</>
    ) : (
      <>{`Current retirements use ${latest.creditClass}, retired on Regen Ledger.`}</>
    );
  }
  const date = retiredOnDate(latest);
  return <>{`The most recent retirement${date ? ` (${date})` : ''} used ${latest.creditClass}${heldBy}, retired on Regen Ledger.`}</>;
}
