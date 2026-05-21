import { createHmac } from 'node:crypto';
import type { WebhookEvent } from './types/enums.js';

const DEFAULT_TOLERANCE_SECONDS = 300;

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Compute the expected HMAC SHA-256 signature for a webhook payload.
 */
function computeSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify that a webhook signature is valid and the timestamp is within tolerance.
 *
 * @param payload - The raw JSON body as a string
 * @param signature - The value of the X-TrueTrial-Signature header
 * @param secret - Your webhook signing secret
 * @param toleranceSeconds - Maximum age of the webhook in seconds (default: 300)
 * @returns true if the signature is valid and the timestamp is within tolerance
 */
export function verifyWebhook(
  payload: string,
  signature: string,
  secret: string,
  toleranceSeconds: number = DEFAULT_TOLERANCE_SECONDS,
): boolean {
  const expected = computeSignature(payload, secret);

  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < expectedBuffer.length; i++) {
    result |= expectedBuffer[i]! ^ signatureBuffer[i]!;
  }

  if (result !== 0) {
    return false;
  }

  // Check timestamp tolerance
  try {
    const parsed = JSON.parse(payload) as Record<string, unknown>;
    const timestamp = parsed.timestamp as string | undefined;

    if (timestamp && toleranceSeconds > 0) {
      const webhookTime = new Date(timestamp).getTime();
      const now = Date.now();
      const diffSeconds = Math.abs(now - webhookTime) / 1000;

      if (diffSeconds > toleranceSeconds) {
        return false;
      }
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * Verify and parse a webhook payload in one step.
 *
 * @param payload - The raw JSON body as a string
 * @param signature - The value of the X-TrueTrial-Signature header
 * @param secret - Your webhook signing secret
 * @param toleranceSeconds - Maximum age of the webhook in seconds (default: 300)
 * @returns The parsed webhook payload
 * @throws Error if signature verification fails
 */
export function parseWebhook(
  payload: string,
  signature: string,
  secret: string,
  toleranceSeconds: number = DEFAULT_TOLERANCE_SECONDS,
): WebhookPayload {
  if (!verifyWebhook(payload, signature, secret, toleranceSeconds)) {
    throw new Error('Invalid webhook signature');
  }

  const parsed = JSON.parse(payload) as WebhookPayload;

  return {
    event: parsed.event,
    timestamp: parsed.timestamp,
    data: parsed.data,
  };
}
