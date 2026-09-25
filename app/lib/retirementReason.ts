/**
 * Display-only helpers for Regen retirement records.
 *
 * Nothing here builds, validates or signs on-chain messages: the worker owns
 * that. These functions only decide what the public dashboard shows.
 */

import { MODE_D_WALLET } from './latestRetirement.ts';

export { MODE_D_HOLDER, MODE_D_WALLET } from './latestRetirement.ts';

const MODE_D_PREFIX = 'regen-klima-retire';
const DELIM = ' | ';
const BENEFICIARY_KEY = 'beneficiary:';
const BENEFICIARY_FIELD_INDEX = 6;
const MAX_REASON_CHARS = 512;
// Spec 9.2 string grammar, copied from the conformance package's grammar.json. Display-only:
// the worker's frozen reason builder is the source of truth for what gets broadcast.
const MODE_D_REASON_RE =
  /^regen-klima-retire \| mode:wholesale \| batch_id:BE-\d{8}-\d{3} \| base_tx:0x[0-9a-f]{64} \| qty:\d+(\.\d{1,6})? \| vintage:C02-00[346]-\d{8}-\d{8}-001 \| beneficiary:[^|]{1,200}( \| [a-z_]+:[^|]{1,100})*$/;

export interface ParsedRetirementReason {
  /** Who the credits were retired on behalf of. */
  beneficiary: string;
  /** True only for a well-formed wholesale (Mode D, spec 6.3) reason. */
  isModeD: boolean;
}

/**
 * Pull the beneficiary out of a retirement reason.
 *
 * - Mode D reason (`<prefix> | mode:wholesale | ... | beneficiary:<name>[ | key:value]*`,
 *   matching the spec 9.2 grammar) -> the beneficiary value, stopping at the next ' | '.
 * - Legacy reason (e.g. '0G Foundation') -> the whole reason.
 * - Anything malformed -> the whole reason, isModeD false.
 */
export function parseRetirementReason(reason: string | null | undefined): ParsedRetirementReason {
  const raw = typeof reason === 'string' ? reason : '';
  if (raw.length > MAX_REASON_CHARS || !MODE_D_REASON_RE.test(raw)) {
    return { beneficiary: raw, isModeD: false };
  }
  // The grammar fixes the field order and forbids '|' inside values, so the
  // beneficiary is always the seventh ' | '-separated field.
  const beneficiary = raw.split(DELIM)[BENEFICIARY_FIELD_INDEX].slice(BENEFICIARY_KEY.length).trim();
  if (!beneficiary) {
    return { beneficiary: raw, isModeD: false };
  }
  return { beneficiary, isModeD: true };
}

export interface RetirementDisplay {
  /** Who the credits were retired on behalf of; '' when the record names no one. */
  beneficiary: string;
  /** Wholesale row: its reason parses as Mode D or the credits came from the Mode D wallet. */
  isModeD: boolean;
  /** Legacy free-text reason that is not a name (e.g. an old status line); '' otherwise. */
  legacyReason: string;
}

const MAX_LEGACY_NAME_CHARS = 100;

/** A legacy reason reads as a beneficiary only when it looks like a plain name. */
function looksLikeName(text: string): boolean {
  return (
    text.length > 0 &&
    text.length <= MAX_LEGACY_NAME_CHARS &&
    !text.includes('|') &&
    !text.includes('://') &&
    !/[\r\n]/.test(text)
  );
}

/**
 * What a certificate shows for one retirement. A wholesale reason that does not
 * parse is never echoed raw (it carries settlement references the site does not
 * display); the beneficiary is left empty instead. A legacy reason is presented as
 * the beneficiary only when it looks like a name ('0G Foundation'); anything else
 * (e.g. '0impact.ai | Agent #000 | Daily Progress: …') is returned as legacyReason.
 */
export function describeRetirement(
  reason: string | null | undefined,
  wallet: string | null | undefined,
): RetirementDisplay {
  const parsed = parseRetirementReason(reason);
  if (parsed.isModeD) return { beneficiary: parsed.beneficiary, isModeD: true, legacyReason: '' };
  const isModeD = wallet === MODE_D_WALLET;
  if (isModeD || parsed.beneficiary.startsWith(MODE_D_PREFIX)) {
    return { beneficiary: '', isModeD, legacyReason: '' };
  }
  const text = parsed.beneficiary.trim();
  return looksLikeName(text)
    ? { beneficiary: text, isModeD: false, legacyReason: '' }
    : { beneficiary: '', isModeD: false, legacyReason: text };
}

/** 'regen16cfez305da2s07cjmn5kwre49v35k4t87e9hhl' -> 'regen16cfez…' */
export function shortAddress(address: string | null | undefined, keep = 11): string {
  const value = address ?? '';
  return value.length > keep ? `${value.slice(0, keep)}…` : value;
}
