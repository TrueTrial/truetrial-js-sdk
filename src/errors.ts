export class TrueTrialError extends Error {
  public readonly statusCode: number;
  public readonly responseBody: unknown;

  constructor(message: string, statusCode: number, responseBody: unknown = null) {
    super(message);
    this.name = 'TrueTrialError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export class AuthenticationError extends TrueTrialError {
  constructor(message = 'Invalid or missing API key', responseBody: unknown = null) {
    super(message, 401, responseBody);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends TrueTrialError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string,
    errors: Record<string, string[]>,
    responseBody: unknown = null,
  ) {
    super(message, 422, responseBody);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends TrueTrialError {
  constructor(message = 'Resource not found', responseBody: unknown = null) {
    super(message, 404, responseBody);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends TrueTrialError {
  public readonly retryAfter: number | null;

  constructor(
    message = 'Rate limit exceeded',
    retryAfter: number | null = null,
    responseBody: unknown = null,
  ) {
    super(message, 429, responseBody);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends TrueTrialError {
  constructor(message = 'Internal server error', statusCode = 500, responseBody: unknown = null) {
    super(message, statusCode, responseBody);
    this.name = 'ServerError';
  }
}
