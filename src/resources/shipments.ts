import type { HttpClient } from '../http.js';
import type { Shipment, CreateShipmentParams } from '../types/shipment.js';

export class ShipmentsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a shipment for an order.
   */
  async create(orderId: string, data: CreateShipmentParams): Promise<Shipment> {
    const response = await this.http.post<{ data: Shipment }>(
      `/orders/${orderId}/shipments`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }

  /**
   * List all shipments for an order.
   */
  async list(orderId: string): Promise<Shipment[]> {
    const response = await this.http.get<{ data: Shipment[] }>(
      `/orders/${orderId}/shipments`,
    );
    return response.data;
  }
}
