import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALLOWED_ENDPOINTS,
  DEFAULT_IMPACT_API_BASE_URL,
  buildUpstreamUrl,
  resolveApiBase,
  resolveEndpoint,
} from '../app/lib/impactProxy.ts';

test('allow-listed endpoints pass through unchanged', () => {
  for (const endpoint of ALLOWED_ENDPOINTS) assert.equal(resolveEndpoint(endpoint), endpoint);
  assert.deepEqual([...ALLOWED_ENDPOINTS].sort(), [
    '/certificate',
    '/certificates',
    '/consumption',
    '/daily-summary',
    '/health',
    '/status',
    '/transactions',
  ]);
});

test('everything else is rejected', () => {
  const bad = [
    null,
    undefined,
    '',
    'status',
    '/status/',
    '/STATUS',
    '/status?x=1',
    '/status#x',
    '/status/../admin',
    '/admin',
    '/admin/mode-d',
    '/review/mode-d',
    'https://evil.example/status',
    'http://api.0impact.ai/status',
    '//evil.example/status',
    '///evil.example',
    '\\\\evil.example/status',
    '/\\evil.example',
    '\\/evil.example',
    '%2F%2Fevil.example',
    '/%2e%2e/admin',
    '%2Fstatus',
    '/status%00',
    ' /status',
    '/status ',
    'javascript:alert(1)',
  ];
  for (const endpoint of bad) assert.equal(resolveEndpoint(endpoint), null, String(endpoint));
});

test('API base defaults to api.0impact.ai and honours IMPACT_API_BASE_URL', () => {
  assert.equal(resolveApiBase(undefined), DEFAULT_IMPACT_API_BASE_URL);
  assert.equal(resolveApiBase(''), DEFAULT_IMPACT_API_BASE_URL);
  assert.equal(resolveApiBase('  '), DEFAULT_IMPACT_API_BASE_URL);
  assert.equal(resolveApiBase('http://localhost:8787'), 'http://localhost:8787');
  assert.equal(resolveApiBase('http://localhost:8787/'), 'http://localhost:8787');
  assert.equal(resolveApiBase('https://staging.example.com/api/'), 'https://staging.example.com/api');
});

test('invalid API base values are refused', () => {
  for (const value of ['not a url', 'ftp://x.example', 'file:///etc/passwd', 'https://u:p@x.example', 'https://x.example?a=1', 'javascript:alert(1)']) {
    assert.equal(resolveApiBase(value), null, value);
  }
});

test('upstream URL keeps the host fixed and forwards query params except endpoint', () => {
  const params = new URLSearchParams({ endpoint: '/transactions', limit: '5', offset: '10' });
  const url = buildUpstreamUrl(DEFAULT_IMPACT_API_BASE_URL, '/transactions', params);
  assert.equal(url.toString(), 'https://api.0impact.ai/transactions?limit=5&offset=10');

  const local = buildUpstreamUrl('http://localhost:8787', '/certificate', new URLSearchParams({ tx_hash: 'ABC' }));
  assert.equal(local.toString(), 'http://localhost:8787/certificate?tx_hash=ABC');
});
