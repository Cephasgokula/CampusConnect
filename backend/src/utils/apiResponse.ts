import type { Response } from 'express';

export const ok = (res: Response, data: unknown, message = 'Action completed successfully', status = 200): Response =>
  res.status(status).json({ success: true, data, message });

export const fail = (res: Response, message: string, status = 400, errors?: unknown): Response =>
  res.status(status).json({ success: false, message, errors });
