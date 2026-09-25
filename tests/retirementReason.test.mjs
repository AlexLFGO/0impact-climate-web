// Zero-dependency tests: `npm test` (Node >= 22.18 runs the imported .ts files natively).
// Optional cross-check against the Mode D conformance vectors:
//   MODE_D_VECTORS=/path/to/mode-d-conformance/vectors/test_vectors.json npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  MODE_D_WALLET,
  describeRetirement,
  parseRetirementReason,
  shortAddress,
} from '../app/lib/retirementReason.ts';

const HEAD =
  'regen-klima-retire | mode:wholesale | batch_id:BE-20260923-001 | base_tx:0x' +
  'a'.repeat(64) +
  ' | qty:0.0905 | vintage:C02-004-20210102-20211207-001';
const LEGACY_WALLET = 'regen1xfw890d6chkud69c9h3rrhcgjg4zaqaqf0543r';

test('Mode D reason -> beneficiary field value', () => {
  assert.deepEqual(parseRetirementReason(`${HEAD} | beneficiary:0G Foundation`), {
    beneficiary: '0G Foundation',
    isModeD: true,
  });
});

test('Mode D reason with extras stops at the next " | "', () => {
  assert.deepEqual(parseRetirementReason(`${HEAD} | beneficiary:0G Foundation | order:INV-1 | note:x y`), {
    beneficiary: '0G Foundation',
    isModeD: true,
  });
});

test('beneficiary value may itself contain "beneficiary:", colons and unicode', () => {
  assert.equal(parseRetirementReason(`${HEAD} | beneficiary:beneficiary: The Trust`).beneficiary, 'beneficiary: The Trust');
  assert.equal(parseRetirementReason(`${HEAD} | beneficiary:Café Zürich, Dept: Ops`).beneficiary, 'Café Zürich, Dept: Ops');
});

test('every CFC vintage in the agreement parses', () => {
  for (const vintage of [
    'C02-003-20200630-20220629-001',
    'C02-004-20210102-20211207-001',
    'C02-006-20210216-20220215-001',
  ]) {
    const reason = HEAD.replace('C02-004-20210102-20211207-001', vintage) + ' | beneficiary:0G Foundation';
    assert.equal(parseRetirementReason(reason).isModeD, true, vintage);
  }
});

test('parser contract: legacy reasons -> whole reason (describeRetirement decides what is shown)', () => {
  assert.deepEqual(parseRetirementReason('0G Foundation'), { beneficiary: '0G Foundation', isModeD: false });
  const old = '0impact.ai | Agent #000 | Daily Progress: 92.3% | 24/7 Offsetting | https://climate.0g.ai';
  assert.deepEqual(parseRetirementReason(old), { beneficiary: old, isModeD: false });
});

test('malformed Mode D reasons -> {beneficiary: reason, isModeD: false}', () => {
  const cases = [
    HEAD, // no beneficiary
    `${HEAD} | beneficiary:`, // empty
    `${HEAD} | beneficiary:   `, // whitespace only
    `${HEAD} | order:X | beneficiary:0G Foundation`, // wrong field order
    `${HEAD.replace('mode:wholesale', 'mode:protocol')} | beneficiary:0G Foundation`,
    `${HEAD.replace('BE-20260923-001', 'BE-2026-001')} | beneficiary:0G Foundation`,
    `${HEAD.replace('0x' + 'a'.repeat(64), '0x' + 'A'.repeat(64))} | beneficiary:0G Foundation`,
    `${HEAD.replace('C02-004', 'C02-002')} | beneficiary:0G Foundation`, // not an agreement vintage
    `${HEAD} | beneficiary:0G|Foundation`,
    `${HEAD} | beneficiary:0G Foundation | Bad-Key:x`,
    `${HEAD} | beneficiary:${'x'.repeat(201)}`,
    `${HEAD} | beneficiary:0G Foundation | note:${'y'.repeat(100)} | more:${'z'.repeat(100)} | tail:${'w'.repeat(90)}`, // > 512 chars
    `${HEAD} | beneficiary:0G Foundation`.replaceAll(' | ', '|'),
  ];
  for (const reason of cases) {
    assert.deepEqual(parseRetirementReason(reason), { beneficiary: reason, isModeD: false }, reason);
  }
});

test('null / undefined / non-string reasons are safe', () => {
  assert.deepEqual(parseRetirementReason(undefined), { beneficiary: '', isModeD: false });
  assert.deepEqual(parseRetirementReason(null), { beneficiary: '', isModeD: false });
});

test('describeRetirement: Mode D row shows beneficiary, never the raw reason', () => {
  assert.deepEqual(describeRetirement(`${HEAD} | beneficiary:0G Foundation`, MODE_D_WALLET), {
    beneficiary: '0G Foundation',
    isModeD: true,
    legacyReason: '',
  });
  // Mode D wallet but unparseable reason: flagged Mode D, beneficiary hidden.
  assert.deepEqual(describeRetirement(HEAD, MODE_D_WALLET), { beneficiary: '', isModeD: true, legacyReason: '' });
  // Wholesale-looking but malformed reason from another wallet: raw reason still hidden.
  assert.deepEqual(describeRetirement(HEAD, LEGACY_WALLET), { beneficiary: '', isModeD: false, legacyReason: '' });
});

test('describeRetirement: legacy name reason -> beneficiary', () => {
  assert.deepEqual(describeRetirement('0G Foundation', LEGACY_WALLET), {
    beneficiary: '0G Foundation',
    isModeD: false,
    legacyReason: '',
  });
});

test('describeRetirement: legacy status line is NOT presented as a beneficiary', () => {
  const old = '0impact.ai | Agent #000 | Daily Progress: 87.0% | 24/7 Offsetting | https://climate.0g.ai';
  assert.deepEqual(describeRetirement(old, LEGACY_WALLET), { beneficiary: '', isModeD: false, legacyReason: old });
  for (const reason of ['see https://example.org', 'line one\nline two', 'x'.repeat(101)]) {
    const d = describeRetirement(reason, LEGACY_WALLET);
    assert.equal(d.beneficiary, '', reason);
    assert.equal(d.legacyReason, reason, reason);
  }
  assert.deepEqual(describeRetirement('', LEGACY_WALLET), { beneficiary: '', isModeD: false, legacyReason: '' });
  assert.deepEqual(describeRetirement(null, LEGACY_WALLET), { beneficiary: '', isModeD: false, legacyReason: '' });
});

test('shortAddress', () => {
  assert.equal(shortAddress(MODE_D_WALLET), 'regen16cfez…');
  assert.equal(shortAddress('regen1abc'), 'regen1abc');
  assert.equal(shortAddress(undefined), '');
});

const vectorsPath = process.env.MODE_D_VECTORS;
const REASON_CODES = new Set([
  'E_GRAMMAR', 'E_LENGTH', 'E_BATCH_ID', 'E_BASE_TX', 'E_QTY', 'E_VINTAGE', 'E_BENEFICIARY', 'E_EXTRA_KEY', 'E_EXTRA_VALUE',
]);

test('agrees with the conformance vectors on which reasons are well-formed', { skip: !vectorsPath && 'MODE_D_VECTORS not set' }, () => {
  const { cases } = JSON.parse(readFileSync(vectorsPath, 'utf8'));
  let checked = 0;
  for (const c of cases) {
    if (c.expected?.reason) {
      const parsed = parseRetirementReason(c.expected.reason);
      assert.equal(parsed.isModeD, true, c.id);
      assert.equal(parsed.beneficiary, c.inputs.beneficiary, c.id);
      checked++;
    } else if (c.msg_retire && Array.isArray(c.expected?.codes)) {
      const reasonOk = !c.expected.codes.some((code) => REASON_CODES.has(code));
      const reason = c.msg_retire.reason ?? c.msg_retire.value?.reason; // proto-JSON or cosmjs shape
      assert.equal(parseRetirementReason(reason).isModeD, reasonOk, c.id);
      checked++;
    }
  }
  assert.ok(checked > 20, `only ${checked} vectors checked`);
});
