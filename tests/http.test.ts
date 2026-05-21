import { describe, it, expect } from 'vitest';
import { toSnakeCase, toCamelCase } from '../src/index.js';

describe('toSnakeCase', () => {
  it('converts flat object keys from camelCase to snake_case', () => {
    const input = { firstName: 'John', lastName: 'Doe', createdAt: '2025-01-01' };
    const result = toSnakeCase(input);

    expect(result).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      created_at: '2025-01-01',
    });
  });

  it('converts nested object keys', () => {
    const input = {
      consumerData: {
        firstName: 'Jane',
        contactInfo: { phoneNumber: '555-0100' },
      },
    };
    const result = toSnakeCase(input);

    expect(result).toEqual({
      consumer_data: {
        first_name: 'Jane',
        contact_info: { phone_number: '555-0100' },
      },
    });
  });

  it('converts keys inside arrays', () => {
    const input = { lineItems: [{ productName: 'Widget', priceCents: 1999 }] };
    const result = toSnakeCase(input);

    expect(result).toEqual({
      line_items: [{ product_name: 'Widget', price_cents: 1999 }],
    });
  });

  it('returns null and undefined as-is', () => {
    expect(toSnakeCase(null)).toBe(null);
    expect(toSnakeCase(undefined)).toBe(undefined);
  });

  it('returns primitives as-is', () => {
    expect(toSnakeCase('hello')).toBe('hello');
    expect(toSnakeCase(42)).toBe(42);
    expect(toSnakeCase(true)).toBe(true);
  });
});

describe('toCamelCase', () => {
  it('converts flat object keys from snake_case to camelCase', () => {
    const input = { first_name: 'John', last_name: 'Doe', created_at: '2025-01-01' };
    const result = toCamelCase(input);

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2025-01-01',
    });
  });

  it('converts nested object keys', () => {
    const input = {
      consumer_data: {
        first_name: 'Jane',
        contact_info: { phone_number: '555-0100' },
      },
    };
    const result = toCamelCase(input);

    expect(result).toEqual({
      consumerData: {
        firstName: 'Jane',
        contactInfo: { phoneNumber: '555-0100' },
      },
    });
  });

  it('converts keys inside arrays', () => {
    const input = { line_items: [{ product_name: 'Widget', price_cents: 1999 }] };
    const result = toCamelCase(input);

    expect(result).toEqual({
      lineItems: [{ productName: 'Widget', priceCents: 1999 }],
    });
  });

  it('returns null and undefined as-is', () => {
    expect(toCamelCase(null)).toBe(null);
    expect(toCamelCase(undefined)).toBe(undefined);
  });

  it('returns primitives as-is', () => {
    expect(toCamelCase('hello')).toBe('hello');
    expect(toCamelCase(42)).toBe(42);
    expect(toCamelCase(true)).toBe(true);
  });

  it('handles keys that are already camelCase', () => {
    const input = { firstName: 'John' };
    const result = toCamelCase(input);

    expect(result).toEqual({ firstName: 'John' });
  });
});
