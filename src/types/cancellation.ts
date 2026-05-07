export interface Cancellation {
  id: string;
  orderId: string;
  reason: string | null;
  cancelledAt: string;
  initiatedBy: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface CreateCancellationParams {
  reason?: string;
  metadata?: Record<string, unknown>;
}
