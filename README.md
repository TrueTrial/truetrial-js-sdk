# TrueTrial JavaScript/TypeScript SDK

Official JavaScript/TypeScript SDK for the [TrueTrial](https://truetrial.com) API. Manage trial periods, subscriptions, warranties, and compliance-first temporal elements from your Node.js application.

## Requirements

- Node.js 18.0.0 or later (uses native `fetch`)
- TypeScript 5.0+ (optional, but recommended)

## Installation

```bash
npm install @truetrial/sdk
```

## Quick Start

```typescript
import { TrueTrialClient, TemporalType, DurationUnit } from '@truetrial/sdk';

const client = new TrueTrialClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-tenant.truetrial.com/api/v1', // optional
});

// Create an order with a 30-day trial
const order = await client.orders.create({
  consumer: {
    email: 'customer@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  productName: 'Premium Widget',
  priceCents: 4999,
  temporalType: TemporalType.Trial,
  durationValue: 30,
  durationUnit: DurationUnit.Days,
});

console.log(order.id);
```

## Case Convention

The SDK automatically converts between JavaScript's camelCase and the API's snake_case:

- **Request parameters**: Write `consumerEmail`, `priceCents`, `durationUnit` -- the SDK converts them to `consumer_email`, `price_cents`, `duration_unit` before sending.
- **Response data**: The API returns `created_at`, `temporal_element`, `risk_score` -- the SDK converts them to `createdAt`, `temporalElement`, `riskScore` for you.

You never need to think about snake_case when using this SDK.

## API Reference

### Orders

```typescript
// List orders with filters
const orders = await client.orders.list({
  status: OrderStatus.TrialActive,
  consumerEmail: 'customer@example.com',
  page: 1,
  perPage: 25,
});

// Create an order
const order = await client.orders.create({
  consumer: { email: 'customer@example.com', firstName: 'Jane' },
  productName: 'Widget',
  priceCents: 4999,
  temporalType: TemporalType.Trial,
  durationValue: 30,
  durationUnit: DurationUnit.Days,
});

// Get a single order
const order = await client.orders.get('order-id');

// Get order status
const { status } = await client.orders.status('order-id');
```

### Shipments

```typescript
// Create a shipment
const shipment = await client.shipments.create('order-id', {
  carrier: Carrier.Ups,
  trackingNumber: '1Z999AA10123456784',
});

// List shipments for an order
const shipments = await client.shipments.list('order-id');
```

### Digital Delivery

```typescript
import { DigitalDeliveryMethod } from '@truetrial/sdk';

// Confirm digital delivery
const confirmation = await client.digitalDelivery.confirm('order-id', {
  method: DigitalDeliveryMethod.LinkClick,
});
```

### Temporal Elements

```typescript
// Get temporal element for an order
const temporal = await client.temporal.get('order-id');

// Extend a trial by 7 days
const extended = await client.temporal.extend('order-id', {
  durationValue: 7,
  durationUnit: DurationUnit.Days,
  reason: 'Customer requested extension',
});

// Adjust the expiration date
const adjusted = await client.temporal.adjust('order-id', {
  newExpiresAt: '2025-04-01T00:00:00Z',
  reason: 'Manual adjustment',
});

// Submit a warranty claim
const claimed = await client.temporal.claim('order-id', {
  description: 'Product arrived damaged',
});

// Resolve a claim
const resolved = await client.temporal.resolveClaim('order-id', {
  resolution: 'approved',
  reason: 'Damage confirmed by photos',
});
```

### Cancellations

```typescript
// Initiate a cancellation
const cancellation = await client.cancellations.create('order-id', {
  reason: 'Customer requested cancellation',
});

// Get cancellation details
const cancellation = await client.cancellations.get('order-id');
```

### Webhooks

```typescript
import { WebhookEvent } from '@truetrial/sdk';

// List webhook subscriptions
const webhooks = await client.webhooks.list();

// Create a webhook subscription
const webhook = await client.webhooks.create({
  url: 'https://example.com/webhooks/truetrial',
  events: [WebhookEvent.OrderDelivered, WebhookEvent.TrialExpiring],
});

// Delete a webhook subscription
await client.webhooks.remove('webhook-id');
```

### System

```typescript
// Check carrier integration health
const health = await client.system.carrierHealth();
```

## Error Handling

The SDK throws typed errors for different failure scenarios:

```typescript
import {
  TrueTrialError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  ServerError,
} from '@truetrial/sdk';

try {
  await client.orders.get('nonexistent-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Order not found:', error.message);
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.errors);
    // error.errors is Record<string, string[]>
  } else if (error instanceof RateLimitError) {
    console.log('Rate limited. Retry after:', error.retryAfter, 'seconds');
  } else if (error instanceof ServerError) {
    console.log('Server error:', error.statusCode, error.message);
  } else if (error instanceof TrueTrialError) {
    console.log('API error:', error.statusCode, error.message);
  }
}
```

All error classes extend `TrueTrialError`, which provides:

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `statusCode` | `number` | HTTP status code |
| `responseBody` | `unknown` | Raw response body from the API |

## Webhook Verification

Verify incoming webhooks to ensure they originate from TrueTrial:

```typescript
import { verifyWebhook, parseWebhook } from '@truetrial/sdk';

const secret = 'your-webhook-signing-secret';

// Option 1: Verify only (returns boolean)
const rawBody = req.body; // raw JSON string
const signature = req.headers['x-truetrial-signature'];

const isValid = verifyWebhook(rawBody, signature, secret);

// Option 2: Verify and parse in one step (throws on invalid)
try {
  const event = parseWebhook(rawBody, signature, secret);
  console.log(event.event);     // e.g. 'order.delivered'
  console.log(event.timestamp); // ISO 8601 string
  console.log(event.data);      // event-specific payload
} catch (error) {
  console.log('Invalid webhook signature');
}
```

The default timestamp tolerance is 300 seconds (5 minutes). Pass a custom value as the fourth argument, or `0` to disable timestamp checking:

```typescript
verifyWebhook(body, signature, secret, 600);  // 10-minute tolerance
verifyWebhook(body, signature, secret, 0);    // no timestamp check
```

## TypeScript Support

The SDK is written in TypeScript and ships with full type declarations. All types are exported from the main entry point:

```typescript
import type {
  Order,
  CreateOrderParams,
  ListOrdersParams,
  Consumer,
  Shipment,
  TemporalElement,
  Cancellation,
  WebhookSubscription,
  PaginatedResponse,
  WebhookPayload,
} from '@truetrial/sdk';
```

### Enums

Enums are exported as both const objects and union types. Use the object for runtime values and the type for type annotations:

```typescript
import { OrderStatus, TemporalType } from '@truetrial/sdk';

// Runtime value
const status = OrderStatus.TrialActive; // 'trial_active'

// Type annotation
function handleStatus(s: OrderStatus): void {
  // ...
}
```

## License

MIT
