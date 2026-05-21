import type { HttpClient } from '../http.js';
import type { Carrier } from '../types/enums.js';

export interface CarrierHealthStatus {
  carrier: Carrier;
  isHealthy: boolean;
  latencyMs: number | null;
  lastCheckedAt: string;
  message: string | null;
}

export class SystemResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the health status of all carrier integrations.
   */
  async carrierHealth(): Promise<CarrierHealthStatus[]> {
    const response = await this.http.get<{ data: CarrierHealthStatus[] }>('/carrier-health');
    return response.data;
  }
}
