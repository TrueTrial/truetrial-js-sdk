import type { OrderStatus, ProductType, TemporalType, DurationUnit } from './enums.js';
import type { Consumer, ConsumerParams } from './consumer.js';
import type { TemporalElement } from './temporal-element.js';
import type { Shipment } from './shipment.js';

export interface Order {
  id: string;
  externalId: string | null;
  consumer: Consumer;
  status: OrderStatus;
  productName: string;
  productType: ProductType;
  priceCents: number;
  currency: string;
  temporalType: TemporalType;
  durationValue: number;
  durationUnit: DurationUnit;
  temporalElement: TemporalElement | null;
  shipments: Shipment[];
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderParams {
  externalId?: string;
  consumer: ConsumerParams;
  productName: string;
  productType?: ProductType;
  priceCents: number;
  currency?: string;
  temporalType: TemporalType;
  durationValue: number;
  durationUnit: DurationUnit;
  metadata?: Record<string, unknown>;
}

export interface ListOrdersParams {
  page?: number;
  perPage?: number;
  status?: OrderStatus;
  temporalType?: TemporalType;
  consumerEmail?: string;
  externalId?: string;
  createdAfter?: string;
  createdBefore?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}
