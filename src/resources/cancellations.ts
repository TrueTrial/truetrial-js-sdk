import type { HttpClient } from '../http.js';
import type { Cancellation, CreateCancellationParams } from '../types/cancellation.js';

export class CancellationsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Initiate a cancellation for an order.
   */
  async create(orderId: string, data?: CreateCancellationParams): Promise<Cancellation> {
    const response = await this.http.post<{ data: Cancellation }>(
      `/orders/${orderId}/cancellations`,
      data as unknown as Record<string, unknown> | undefined,
    );
    return response.data;
  }

  /**
   * Get the cancellation details for an order.
   */
  async get(orderId: string): Promise<Cancellation> {
    const response = await this.http.get<{ data: Cancellation }>(
      `/orders/${orderId}/cancellations`,
    );
    return response.data;
  }
}
