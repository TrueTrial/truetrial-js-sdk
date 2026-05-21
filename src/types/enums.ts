export const OrderStatus = {
  Received: 'received',
  Shipped: 'shipped',
  InTransit: 'in_transit',
  Delivered: 'delivered',
  DeliveryFailed: 'delivery_failed',
  TrialActive: 'trial_active',
  Converted: 'converted',
  Returned: 'returned',
  Expired: 'expired',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const TemporalType = {
  Trial: 'trial',
  Evaluation: 'evaluation',
  Subscription: 'subscription',
  Warranty: 'warranty',
  Guarantee: 'guarantee',
} as const;

export type TemporalType = (typeof TemporalType)[keyof typeof TemporalType];

export const TemporalStatus = {
  Pending: 'pending',
  Active: 'active',
  Expiring: 'expiring',
  Expired: 'expired',
  Converted: 'converted',
  Cancelled: 'cancelled',
  Suspended: 'suspended',
  Renewed: 'renewed',
  Claimed: 'claimed',
  ClaimApproved: 'claim_approved',
  ClaimDenied: 'claim_denied',
} as const;

export type TemporalStatus = (typeof TemporalStatus)[keyof typeof TemporalStatus];

export const ShipmentStatus = {
  Pending: 'pending',
  InTransit: 'in_transit',
  OutForDelivery: 'out_for_delivery',
  Delivered: 'delivered',
  Failed: 'failed',
  ReturnedToSender: 'returned_to_sender',
} as const;

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export const ProductType = {
  Physical: 'physical',
  Digital: 'digital',
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export const Carrier = {
  Ups: 'ups',
  Fedex: 'fedex',
  Usps: 'usps',
  Dhl: 'dhl',
  Shippo: 'shippo',
  Aftership: 'aftership',
} as const;

export type Carrier = (typeof Carrier)[keyof typeof Carrier];

export const DurationUnit = {
  Days: 'days',
  Weeks: 'weeks',
  Months: 'months',
  Years: 'years',
} as const;

export type DurationUnit = (typeof DurationUnit)[keyof typeof DurationUnit];

export const DeliverySource = {
  Webhook: 'webhook',
  Poll: 'poll',
  Manual: 'manual',
  FallbackCarrier: 'fallback_carrier',
} as const;

export type DeliverySource = (typeof DeliverySource)[keyof typeof DeliverySource];

export const DigitalDeliveryMethod = {
  LinkClick: 'link_click',
  Installation: 'installation',
  FirstLogin: 'first_login',
  FirstExecution: 'first_execution',
  LicenseKey: 'license_key',
} as const;

export type DigitalDeliveryMethod = (typeof DigitalDeliveryMethod)[keyof typeof DigitalDeliveryMethod];

export const WebhookEvent = {
  OrderCreated: 'order.created',
  OrderDelivered: 'order.delivered',
  DeliveryFailed: 'delivery.failed',
  TrialStarted: 'trial.started',
  TrialExpiring: 'trial.expiring',
  TrialExpired: 'trial.expired',
  TrialConverted: 'trial.converted',
  CancellationInitiated: 'cancellation.initiated',
  RiskScoreChanged: 'risk_score.changed',
  SubscriptionRenewed: 'subscription.renewed',
  WarrantyClaimed: 'warranty.claimed',
  TemporalExtended: 'temporal.extended',
  TemporalAdjusted: 'temporal.adjusted',
  WarrantyClaimResolved: 'warranty.claim_resolved',
  PaymentSucceeded: 'payment.succeeded',
  PaymentFailed: 'payment.failed',
  DisputeCreated: 'dispute.created',
  DisputeWon: 'dispute.won',
  DisputeLost: 'dispute.lost',
} as const;

export type WebhookEvent = (typeof WebhookEvent)[keyof typeof WebhookEvent];
