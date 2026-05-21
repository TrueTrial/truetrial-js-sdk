import type { HttpClient } from '../http.js';
import type {
  TemporalElement,
  ExtendTemporalParams,
  AdjustTemporalParams,
  ClaimParams,
  ResolveClaimParams,
} from '../types/temporal-element.js';

export class TemporalResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the temporal element for an order.
   */
  async get(orderId: string): Promise<TemporalElement> {
    const response = await this.http.get<{ data: TemporalElement }>(
      `/orders/${orderId}/temporal`,
    );
    return response.data;
  }

  /**
   * Extend the temporal element duration for an order.
   */
  async extend(orderId: string, data: ExtendTemporalParams): Promise<TemporalElement> {
    const response = await this.http.post<{ data: TemporalElement }>(
      `/orders/${orderId}/temporal/extend`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }

  /**
   * Adjust the temporal element expiration for an order.
   */
  async adjust(orderId: string, data: AdjustTemporalParams): Promise<TemporalElement> {
    const response = await this.http.post<{ data: TemporalElement }>(
      `/orders/${orderId}/temporal/adjust`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }

  /**
   * Submit a claim against the temporal element for an order (warranty/guarantee).
   */
  async claim(orderId: string, data: ClaimParams): Promise<TemporalElement> {
    const response = await this.http.post<{ data: TemporalElement }>(
      `/orders/${orderId}/temporal/claim`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }

  /**
   * Resolve a pending claim on the temporal element.
   */
  async resolveClaim(orderId: string, data: ResolveClaimParams): Promise<TemporalElement> {
    const response = await this.http.post<{ data: TemporalElement }>(
      `/orders/${orderId}/temporal/resolve-claim`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }
}
