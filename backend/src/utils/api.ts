// Helpers de reponses API uniformes.

import type { Response } from 'express';
import type { ApiError, ApiErrorCode, ApiSuccess } from '@robomow/shared';

export function ok<T>(res: Response, data: T, status = 200): Response<ApiSuccess<T>> {
  return res.status(status).json({ success: true, data });
}

export function fail(
  res: Response,
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
): Response<ApiError> {
  return res.status(status).json({
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  });
}

/** Erreur applicative serializable, leve par les services. */
export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status: number;
  public readonly details: unknown;

  constructor(code: ApiErrorCode, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
