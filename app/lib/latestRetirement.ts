/**
 * Display-only summary of the most recent retirements, used for the "credit source"
 * and "cadence" copy on the homepage and methodology page.
 *
 * Kept separate from the reason parser so pages that only need this summary do not
 * ship the parser in their JavaScript.
 */

/** Wallet that holds wholesale (Mode D) credits; owned by Regen Network Development. */
export const MODE_D_WALLET = 'regen16cfez305da2s07cjmn5kwre49v35k4t87e9hhl';
export const MODE_D_HOLDER = 'Regen Network Development';

/** A retirement newer than this counts as "current"; older ones are shown as "most recent". */
export const CURRENT_WINDOW_MS = 30 * 60 * 1000;

export interface RetirementLike {
  id?: number;
  status?: string;
  amount?: string;
  co2e_tons?: string;
  credit_class?: string;
  project_name?: string;
  wallet_address?: string;
  created_at?: string;
  completed_at?: string | null;
}

export interface LatestRetirementSummary {
  /** Usual amount per retirement among the recent successful rows, e.g. '0.0905'. */
  amount: string;
  /** Credit class of the newest successful retirement, e.g. 'City Forest Credits'. */
  creditClass: string;
  /** Project of the newest successful retirement, e.g. 'Harvey Manning Park Expansion (CFC-15)'. */
  projectName: string;
  /** The newest successful retirement drew on credits held in the Mode D Wallet. */
  isModeD: boolean;
  /** When the newest successful retirement happened (ISO, UTC), or null if unknown. */
  retiredAt: string | null;
  /** retiredAt is within CURRENT_WINDOW_MS of now. */
  isCurrent: boolean;
}

/** Worker timestamps are ISO ('…T…Z') or SQLite UTC ('YYYY-MM-DD HH:MM:SS'). Returns epoch ms or null. */
export function parseApiTimestamp(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  let iso = value.trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(iso)) iso = `${iso.replace(' ', 'T')}Z`;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

/** True when the retirement at retiredAt is recent enough to be called "current". */
export function isCurrentRetirement(retiredAt: string | null, now: number): boolean {
  const ms = parseApiTimestamp(retiredAt);
  return ms !== null && now - ms <= CURRENT_WINDOW_MS;
}

/**
 * Summarise the recent successful retirements so the site can show the live credit
 * source and per-retirement amount instead of hard-coded copy. Returns null when there
 * is nothing usable (callers show neutral fallback text).
 *
 * The amount is the most common one among the successful rows (ties go to the larger),
 * so a batch's final, smaller remainder tick does not change the advertised cadence.
 */
export function summarizeLatestRetirement(
  transactions: readonly RetirementLike[] | null | undefined,
  now: number = Date.now(),
): LatestRetirementSummary | null {
  if (!Array.isArray(transactions)) return null;
  let latest: RetirementLike | null = null;
  const counts = new Map<number, number>();
  for (const tx of transactions) {
    if (!tx || tx.status !== 'success') continue;
    const amount = parseFloat(tx.amount ?? tx.co2e_tons ?? '');
    if (!Number.isFinite(amount) || amount <= 0) continue;
    counts.set(amount, (counts.get(amount) ?? 0) + 1);
    // Rows arrive newest first; prefer the highest id when ids are present.
    if (!latest || (typeof tx.id === 'number' && typeof latest.id === 'number' && tx.id > latest.id)) {
      latest = tx;
    }
  }
  const creditClass = (latest?.credit_class ?? '').trim();
  if (!latest || !creditClass) return null;

  let amount = 0;
  let best = 0;
  for (const [value, count] of counts) {
    if (count > best || (count === best && value > amount)) {
      amount = value;
      best = count;
    }
  }

  const retiredMs = parseApiTimestamp(latest.completed_at) ?? parseApiTimestamp(latest.created_at);
  const retiredAt = retiredMs === null ? null : new Date(retiredMs).toISOString();
  return {
    amount: String(amount),
    creditClass,
    projectName: (latest.project_name ?? '').trim(),
    isModeD: latest.wallet_address === MODE_D_WALLET,
    retiredAt,
    isCurrent: isCurrentRetirement(retiredAt, now),
  };
}

/** 'YYYY-MM-DD' (UTC) of a summary's newest retirement, or '' if unknown. */
export function retiredOnDate(summary: Pick<LatestRetirementSummary, 'retiredAt'>): string {
  return summary.retiredAt ? summary.retiredAt.slice(0, 10) : '';
}
