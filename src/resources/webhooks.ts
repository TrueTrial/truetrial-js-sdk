import type { HttpClient } from '../http.js';
import type {
  WebhookSubscription,
  CreateWebhookParams,
} from '../types/webhook-subscription.js';

export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all webhook subscriptions.
   */
  async list(): Promise<WebhookSubscription[]> {
    const response = await this.http.get<{ data: WebhookSubscription[] }>('/webhooks');
    return response.data;
  }

  /**
   * Create a new webhook subscription.
   */
  async create(data: CreateWebhookParams): Promise<WebhookSubscription> {
    const response = await this.http.post<{ data: WebhookSubscription }>(
      '/webhooks',
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }

  /**
   * Delete a webhook subscription by ID.
   */
  async remove(id: string): Promise<void> {
    await this.http.delete<void>(`/webhooks/${id}`);
  }
}
