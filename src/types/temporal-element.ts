import type { TemporalType, TemporalStatus, DurationUnit } from './enums.js';

export interface TemporalElement {
  id: string;
  orderId: string;
  type: TemporalType;
  status: TemporalStatus;
  durationValue: number;
  durationUnit: DurationUnit;
  startsAt: string | null;
  expiresAt: string | null;
  convertedAt: string | null;
  cancelledAt: string | null;
  claimedAt: string | null;
  claimResolvedAt: string | null;
  claimResolution: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExtendTemporalParams {
  durationValue: number;
  durationUnit: DurationUnit;
  reason?: string;
}

export interface AdjustTemporalParams {
  newExpiresAt: string;
  reason?: string;
}

export interface ClaimParams {
  description: string;
  metadata?: Record<string, unknown>;
}

export interface ResolveClaimParams {
  resolution: 'approved' | 'denied';
  reason?: string;
  metadata?: Record<string, unknown>;
}
