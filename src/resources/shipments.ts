import type { HttpClient } from '../http.js';
import type { Shipment, CreateShipmentParams } from '../types/shipment.js';
import type { Order } from '../types/order.js';

export interface ConfirmManuallyParams {
  delivered_at: string;
  reason: string;
  confirmed_by_email?: string;
}

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

  /**
   * Manually confirm delivery of an order — for the edge case where the carrier
   * lost the package update but the consumer confirmed receipt. Records
   * delivery_source = manual and starts the trial timer.
   */
  async confirmManually(orderId: string, params: ConfirmManuallyParams): Promise<Order> {
    const response = await this.http.post<{ data: Order }>(
      `/orders/${orderId}/confirm-delivery`,
      params as unknown as Record<string, unknown>,
    );
    return response.data;
  }
}
