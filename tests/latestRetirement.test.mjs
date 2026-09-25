import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENT_WINDOW_MS,
  MODE_D_WALLET,
  isCurrentRetirement,
  parseApiTimestamp,
  retiredOnDate,
  summarizeLatestRetirement,
} from '../app/lib/latestRetirement.ts';
import { MODE_D_WALLET as REEXPORTED_WALLET } from '../app/lib/retirementReason.ts';

const LEGACY_WALLET = 'regen1xfw890d6chkud69c9h3rrhcgjg4zaqaqf0543r';
const NOW = Date.parse('2026-09-23T19:40:00Z');

const row = (over) => ({
  status: 'success',
  amount: '0.0905',
  credit_class: 'City Forest Credits',
  project_name: 'Harvey Manning Park Expansion (CFC-15)',
  wallet_address: MODE_D_WALLET,
  created_at: '2026-09-23 19:35:43',
  completed_at: '2026-09-23T19:35:44.000Z',
  ...over,
});

test('parser module re-exports the same Mode D wallet', () => {
  assert.equal(REEXPORTED_WALLET, MODE_D_WALLET);
});

test('parseApiTimestamp reads SQLite UTC and ISO timestamps', () => {
  assert.equal(parseApiTimestamp('2026-09-23 19:35:43'), Date.parse('2026-09-23T19:35:43Z'));
  assert.equal(parseApiTimestamp('2026-09-23T19:35:43.887Z'), Date.parse('2026-09-23T19:35:43.887Z'));
  for (const bad of [undefined, null, '', 'yesterday']) assert.equal(parseApiTimestamp(bad), null, String(bad));
});

test('picks the newest successful row and flags Mode D', () => {
  const rows = [
    row({ id: 12, status: 'failed', project_name: 'X' }),
    row({ id: 11 }),
    row({ id: 10, credit_class: 'Verified Carbon Standard (VCS) Credits', project_name: 'Y', wallet_address: LEGACY_WALLET }),
  ];
  const expected = {
    amount: '0.0905',
    creditClass: 'City Forest Credits',
    projectName: 'Harvey Manning Park Expansion (CFC-15)',
    isModeD: true,
    retiredAt: '2026-09-23T19:35:44.000Z',
    isCurrent: true,
  };
  assert.deepEqual(summarizeLatestRetirement(rows, NOW), expected);
  assert.deepEqual(summarizeLatestRetirement([...rows].reverse(), NOW), expected);
});

test('legacy wallet rows are not Mode D', () => {
  const s = summarizeLatestRetirement(
    [row({ id: 1, wallet_address: LEGACY_WALLET, credit_class: 'Verified Carbon Standard (VCS) Credits' })],
    NOW,
  );
  assert.equal(s?.isModeD, false);
  assert.equal(s?.creditClass, 'Verified Carbon Standard (VCS) Credits');
});

test('a batch remainder tick does not change the advertised amount', () => {
  const rows = [row({ id: 5, amount: '0.0415' }), row({ id: 4 }), row({ id: 3 }), row({ id: 2 })];
  assert.equal(summarizeLatestRetirement(rows, NOW)?.amount, '0.0905');
  // Tie between one remainder and one full tick -> the larger amount.
  assert.equal(summarizeLatestRetirement([row({ id: 2, amount: '0.0415' }), row({ id: 1 })], NOW)?.amount, '0.0905');
});

test('an old retirement is not "current"', () => {
  const s = summarizeLatestRetirement([row({ id: 1 })], NOW + CURRENT_WINDOW_MS + 60_000);
  assert.equal(s?.isCurrent, false);
  assert.equal(retiredOnDate(s), '2026-09-23');
  // Falls back to created_at when completed_at is missing.
  assert.equal(summarizeLatestRetirement([row({ id: 1, completed_at: null })], NOW)?.retiredAt, '2026-09-23T19:35:43.000Z');
  // No timestamp at all -> never claimed as current.
  const undated = summarizeLatestRetirement([row({ id: 1, completed_at: null, created_at: undefined })], NOW);
  assert.equal(undated?.isCurrent, false);
  assert.equal(undated?.retiredAt, null);
  assert.equal(retiredOnDate(undated), '');
});

test('isCurrentRetirement', () => {
  assert.equal(isCurrentRetirement('2026-09-23T19:35:44.000Z', NOW), true);
  assert.equal(isCurrentRetirement('2026-09-23T18:00:00.000Z', NOW), false);
  assert.equal(isCurrentRetirement(null, NOW), false);
});

test('-> null when nothing usable', () => {
  assert.equal(summarizeLatestRetirement(undefined), null);
  assert.equal(summarizeLatestRetirement([]), null);
  assert.equal(summarizeLatestRetirement([row({ id: 1, status: 'failed' })]), null);
  assert.equal(summarizeLatestRetirement([row({ id: 1, status: 'pending' })]), null);
  assert.equal(summarizeLatestRetirement([row({ id: 1, amount: 'abc', co2e_tons: undefined })]), null);
  // Newest success has no credit class: do not fall back to an older row's class.
  assert.equal(summarizeLatestRetirement([row({ id: 2, credit_class: '' }), row({ id: 1 })]), null);
});
