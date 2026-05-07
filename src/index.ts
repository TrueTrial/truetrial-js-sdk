// Client
export { TrueTrialClient } from './client.js';
export type { TrueTrialConfig } from './client.js';

// HTTP utilities
export { toSnakeCase, toCamelCase } from './http.js';

// Errors
export {
  TrueTrialError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  ServerError,
} from './errors.js';

// Webhook utilities
export { verifyWebhook, parseWebhook } from './webhook.js';
export type { WebhookPayload } from './webhook.js';

// Types - Enums
export {
  OrderStatus,
  TemporalType,
  TemporalStatus,
  ShipmentStatus,
  ProductType,
  Carrier,
  DurationUnit,
  DeliverySource,
  DigitalDeliveryMethod,
  WebhookEvent,
} from './types/enums.js';

// Types - Models
export type { Order, CreateOrderParams, ListOrdersParams } from './types/order.js';
export type { Consumer, ConsumerParams } from './types/consumer.js';
export type { Shipment, CreateShipmentParams } from './types/shipment.js';
export type {
  TemporalElement,
  ExtendTemporalParams,
  AdjustTemporalParams,
  ClaimParams,
  ResolveClaimParams,
} from './types/temporal-element.js';
export type { Cancellation, CreateCancellationParams } from './types/cancellation.js';
export type {
  WebhookSubscription,
  CreateWebhookParams,
} from './types/webhook-subscription.js';
export type { PaginatedResponse } from './types/pagination.js';

// Types - Resources
export type {
  ConfirmDigitalDeliveryParams,
  DigitalDeliveryConfirmation,
} from './resources/digital-delivery.js';
export type { CarrierHealthStatus } from './resources/system.js';
