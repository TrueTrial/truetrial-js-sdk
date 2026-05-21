import type { HttpClient } from '../http.js';
import type { DigitalDeliveryMethod } from '../types/enums.js';

export interface ConfirmDigitalDeliveryParams {
  method: DigitalDeliveryMethod;
  deliveredAt?: string;
  metadata?: Record<string, unknown>;
}

export interface DigitalDeliveryConfirmation {
  orderId: string;
  method: DigitalDeliveryMethod;
  deliveredAt: string;
  metadata: Record<string, unknown> | null;
}

export class DigitalDeliveryResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Confirm digital delivery for an order.
   */
  async confirm(
    orderId: string,
    data: ConfirmDigitalDeliveryParams,
  ): Promise<DigitalDeliveryConfirmation> {
    const response = await this.http.post<{ data: DigitalDeliveryConfirmation }>(
      `/orders/${orderId}/digital-delivery`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }
}
