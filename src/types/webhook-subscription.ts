import type { WebhookEvent } from './enums.js';

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookParams {
  url: string;
  events: WebhookEvent[];
  secret?: string;
}
