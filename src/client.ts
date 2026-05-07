import { HttpClient } from './http.js';
import { OrdersResource } from './resources/orders.js';
import { ShipmentsResource } from './resources/shipments.js';
import { DigitalDeliveryResource } from './resources/digital-delivery.js';
import { TemporalResource } from './resources/temporal.js';
import { CancellationsResource } from './resources/cancellations.js';
import { WebhooksResource } from './resources/webhooks.js';
import { SystemResource } from './resources/system.js';

const DEFAULT_BASE_URL = 'https://truetrial.test/api/v1';

export interface TrueTrialConfig {
  apiKey: string;
  baseUrl?: string;
}

export class TrueTrialClient {
  public readonly orders: OrdersResource;
  public readonly shipments: ShipmentsResource;
  public readonly digitalDelivery: DigitalDeliveryResource;
  public readonly temporal: TemporalResource;
  public readonly cancellations: CancellationsResource;
  public readonly webhooks: WebhooksResource;
  public readonly system: SystemResource;

  constructor(config: TrueTrialConfig) {
    if (!config.apiKey) {
      throw new Error('An API key is required to create a TrueTrialClient');
    }

    const http = new HttpClient(config.apiKey, config.baseUrl ?? DEFAULT_BASE_URL);

    this.orders = new OrdersResource(http);
    this.shipments = new ShipmentsResource(http);
    this.digitalDelivery = new DigitalDeliveryResource(http);
    this.temporal = new TemporalResource(http);
    this.cancellations = new CancellationsResource(http);
    this.webhooks = new WebhooksResource(http);
    this.system = new SystemResource(http);
  }
}
