import type { HttpClient } from '../http.js';
import type { Order, CreateOrderParams, ListOrdersParams } from '../types/order.js';
import type { OrderStatus } from '../types/enums.js';
import type { PaginatedResponse } from '../types/pagination.js';

export class OrdersResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * List orders with optional filters and pagination.
   */
  async list(params?: ListOrdersParams): Promise<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>(
      '/orders',
      params as Record<string, unknown> | undefined,
    );
  }

  /**
   * Create a new order.
   */
  async create(data: CreateOrderParams): Promise<Order> {
    const response = await this.http.post<{ data: Order }>(
      '/orders',
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  }

  /**
   * Get a single order by ID.
   */
  async get(id: string): Promise<Order> {
    const response = await this.http.get<{ data: Order }>(`/orders/${id}`);
    return response.data;
  }

  /**
   * Get the current status of an order.
   */
  async status(id: string): Promise<{ status: OrderStatus }> {
    return this.http.get<{ status: OrderStatus }>(`/orders/${id}/status`);
  }
}
