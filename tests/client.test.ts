import { describe, it, expect } from 'vitest';
import { TrueTrialClient } from '../src/index.js';

describe('TrueTrialClient', () => {
  it('creates a client with a valid API key', () => {
    const client = new TrueTrialClient({ apiKey: 'test-api-key' });

    expect(client).toBeInstanceOf(TrueTrialClient);
  });

  it('throws when no API key is provided', () => {
    expect(() => new TrueTrialClient({ apiKey: '' })).toThrow(
      'An API key is required to create a TrueTrialClient',
    );
  });

  it('exposes the orders resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.orders).toBeDefined();
    expect(typeof client.orders.list).toBe('function');
    expect(typeof client.orders.create).toBe('function');
    expect(typeof client.orders.get).toBe('function');
    expect(typeof client.orders.status).toBe('function');
  });

  it('exposes the shipments resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.shipments).toBeDefined();
    expect(typeof client.shipments.list).toBe('function');
    expect(typeof client.shipments.create).toBe('function');
  });

  it('exposes the digitalDelivery resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.digitalDelivery).toBeDefined();
    expect(typeof client.digitalDelivery.confirm).toBe('function');
  });

  it('exposes the temporal resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.temporal).toBeDefined();
    expect(typeof client.temporal.get).toBe('function');
    expect(typeof client.temporal.extend).toBe('function');
    expect(typeof client.temporal.adjust).toBe('function');
    expect(typeof client.temporal.claim).toBe('function');
    expect(typeof client.temporal.resolveClaim).toBe('function');
  });

  it('exposes the cancellations resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.cancellations).toBeDefined();
    expect(typeof client.cancellations.create).toBe('function');
    expect(typeof client.cancellations.get).toBe('function');
  });

  it('exposes the webhooks resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.webhooks).toBeDefined();
    expect(typeof client.webhooks.list).toBe('function');
    expect(typeof client.webhooks.create).toBe('function');
    expect(typeof client.webhooks.remove).toBe('function');
  });

  it('exposes the system resource', () => {
    const client = new TrueTrialClient({ apiKey: 'test-key' });

    expect(client.system).toBeDefined();
    expect(typeof client.system.carrierHealth).toBe('function');
  });

  it('accepts a custom base URL', () => {
    const client = new TrueTrialClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.example.com/v1',
    });

    expect(client).toBeInstanceOf(TrueTrialClient);
  });
});
