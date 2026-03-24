import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { ok, fail } from '../utils/apiResponse.js';
import { uploadImageBuffer } from '../utils/uploadToCloudinary.js';

const buildDateRange = (range?: string): { $gte: Date; $lte: Date } | null => {
  if (!range) return null;

  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  if (range === 'this-week') {
    const day = now.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    start.setDate(now.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  if (range === 'this-month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  return null;
};

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, date } = req.query;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    isActive: true
  };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: String(search) };
  }

  const dateRange = buildDateRange(String(date || ''));
  if (dateRange) {
    query.date = dateRange;
  }

  const [events, total] = await Promise.all([
    Event.find(query).sort({ date: 1 }).skip(skip).limit(limit),
    Event.countDocuments(query)
  ]);

  return ok(res, {
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');

  if (!event || !event.isActive) {
    return fail(res, 'Event not found', 404);
  }

  return ok(res, event);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return fail(res, 'Not authorized', 401);

  const payload = {
    ...req.body,
    organizer: req.user._id
  } as any;

  payload.tags = payload.tags
    ? Array.isArray(payload.tags)
      ? payload.tags
      : String(payload.tags)
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
    : [];

  const bannerFile = (req as any).file as Express.Multer.File | undefined;
  if (bannerFile) {
    payload.banner = await uploadImageBuffer(bannerFile.buffer, 'cems/events');
  }

  const event = await Event.create(payload);
  return ok(res, event, 'Event created successfully', 201);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) return fail(res, 'Event not found', 404);

  Object.assign(event, req.body);

  if (req.body.tags) {
    event.tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : String(req.body.tags)
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean);
  }

  const bannerFile = (req as any).file as Express.Multer.File | undefined;
  if (bannerFile) {
    event.banner = await uploadImageBuffer(bannerFile.buffer, 'cems/events');
  }

  await event.save();
  return ok(res, event, 'Event updated successfully');
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) return fail(res, 'Event not found', 404);

  event.isActive = false;
  await event.save();

  await Registration.updateMany({ event: event._id, status: 'registered' }, { status: 'cancelled' });
  return ok(res, null, 'Event deactivated successfully');
});

export const cancelEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) return fail(res, 'Event not found', 404);

  event.isCancelled = true;
  event.cancelReason = req.body.reason || 'No reason provided';
  await event.save();

  return ok(res, event, 'Event cancelled successfully');
});

export const getAdminEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await Event.find().sort({ createdAt: -1 });
  return ok(res, events);
});

export const getAdminEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) return fail(res, 'Event not found', 404);
  return ok(res, event);
});
