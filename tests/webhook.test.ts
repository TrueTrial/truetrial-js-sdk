import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyWebhook, parseWebhook } from '../src/index.js';

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function buildPayload(overrides?: Partial<{ event: string; timestamp: string; data: unknown }>): string {
  return JSON.stringify({
    event: 'order.created',
    timestamp: new Date().toISOString(),
    data: { orderId: '01ABC' },
    ...overrides,
  });
}

describe('verifyWebhook', () => {
  const secret = 'whsec_test_secret_key';

  it('returns true for a valid signature with a recent timestamp', () => {
    const payload = buildPayload();
    const signature = sign(payload, secret);

    expect(verifyWebhook(payload, signature, secret)).toBe(true);
  });

  it('returns false for an invalid signature', () => {
    const payload = buildPayload();

    expect(verifyWebhook(payload, 'invalid_signature_hex', secret)).toBe(false);
  });

  it('returns false when the signature does not match', () => {
    const payload = buildPayload();
    const wrongSignature = sign(payload, 'wrong_secret');

    expect(verifyWebhook(payload, wrongSignature, secret)).toBe(false);
  });

  it('returns false for a stale timestamp beyond tolerance', () => {
    const staleTime = new Date(Date.now() - 600_000).toISOString(); // 10 minutes ago
    const payload = buildPayload({ timestamp: staleTime });
    const signature = sign(payload, secret);

    expect(verifyWebhook(payload, signature, secret, 300)).toBe(false);
  });

  it('returns true for a stale timestamp when tolerance is disabled', () => {
    const staleTime = new Date(Date.now() - 600_000).toISOString();
    const payload = buildPayload({ timestamp: staleTime });
    const signature = sign(payload, secret);

    expect(verifyWebhook(payload, signature, secret, 0)).toBe(true);
  });

  it('returns true when timestamp is within custom tolerance', () => {
    const recentTime = new Date(Date.now() - 30_000).toISOString(); // 30 seconds ago
    const payload = buildPayload({ timestamp: recentTime });
    const signature = sign(payload, secret);

    expect(verifyWebhook(payload, signature, secret, 60)).toBe(true);
  });

  it('returns false for malformed JSON payload', () => {
    const payload = 'not-valid-json';
    const signature = sign(payload, secret);

    expect(verifyWebhook(payload, signature, secret)).toBe(false);
  });
});

describe('parseWebhook', () => {
  const secret = 'whsec_test_secret_key';

  it('returns parsed payload for a valid webhook', () => {
    const payload = buildPayload({ event: 'trial.started' });
    const signature = sign(payload, secret);

    const result = parseWebhook(payload, signature, secret);

    expect(result.event).toBe('trial.started');
    expect(result.data).toEqual({ orderId: '01ABC' });
    expect(typeof result.timestamp).toBe('string');
  });

  it('throws for an invalid signature', () => {
    const payload = buildPayload();

    expect(() => parseWebhook(payload, 'bad_sig', secret)).toThrow(
      'Invalid webhook signature',
    );
  });

  it('throws for a stale timestamp', () => {
    const staleTime = new Date(Date.now() - 600_000).toISOString();
    const payload = buildPayload({ timestamp: staleTime });
    const signature = sign(payload, secret);

    expect(() => parseWebhook(payload, signature, secret, 300)).toThrow(
      'Invalid webhook signature',
    );
  });
});
