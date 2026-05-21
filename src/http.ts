import {
  TrueTrialError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  ServerError,
} from './errors.js';

/**
 * Convert a camelCase string to snake_case.
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert a snake_case string to camelCase.
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * Deeply convert all object keys from camelCase to snake_case.
 * Arrays are traversed; primitives are returned as-is.
 */
export function toSnakeCase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T;
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      converted[camelToSnake(key)] = toSnakeCase(value);
    }
    return converted as T;
  }

  return obj;
}

/**
 * Deeply convert all object keys from snake_case to camelCase.
 * Arrays are traversed; primitives are returned as-is.
 */
export function toCamelCase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      converted[snakeToCamel(key)] = toCamelCase(value);
    }
    return converted as T;
  }

  return obj;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, query);
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path);
    const options: RequestInit = { method: 'POST' };

    if (data !== undefined) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(toSnakeCase(data));
    }

    return this.request<T>(url, options);
  }

  async delete<T>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>(url, { method: 'DELETE' });
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      const snaked = toSnakeCase(query) as Record<string, unknown>;
      for (const [key, value] of Object.entries(snaked)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Api-Key': this.apiKey,
      ...(options.headers as Record<string, string> | undefined),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const body = await response.json();
    return toCamelCase(body) as T;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      // Response body may not be JSON
    }

    const message = this.extractMessage(body) || response.statusText;

    switch (response.status) {
      case 401:
        throw new AuthenticationError(message, body);

      case 404:
        throw new NotFoundError(message, body);

      case 422: {
        const errors = this.extractValidationErrors(body);
        throw new ValidationError(message, errors, body);
      }

      case 429: {
        const retryAfter = this.extractRetryAfter(response);
        throw new RateLimitError(message, retryAfter, body);
      }

      default:
        if (response.status >= 500) {
          throw new ServerError(message, response.status, body);
        }
        throw new TrueTrialError(message, response.status, body);
    }
  }

  private extractMessage(body: unknown): string {
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as Record<string, unknown>).message);
    }
    return '';
  }

  private extractValidationErrors(body: unknown): Record<string, string[]> {
    if (body && typeof body === 'object' && 'errors' in body) {
      return (body as Record<string, Record<string, string[]>>).errors;
    }
    return {};
  }

  private extractRetryAfter(response: Response): number | null {
    const header = response.headers.get('Retry-After');
    if (header) {
      const seconds = parseInt(header, 10);
      return isNaN(seconds) ? null : seconds;
    }
    return null;
  }
}
