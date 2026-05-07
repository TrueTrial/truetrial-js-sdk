import type { Carrier, ShipmentStatus } from './enums.js';

export interface Shipment {
  id: string;
  orderId: string;
  carrier: Carrier;
  trackingNumber: string;
  status: ShipmentStatus;
  estimatedDeliveryAt: string | null;
  deliveredAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShipmentParams {
  carrier: Carrier;
  trackingNumber: string;
  estimatedDeliveryAt?: string;
  metadata?: Record<string, unknown>;
}
