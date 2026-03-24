import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import { stringify } from 'csv-stringify/sync';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { ok, fail } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';

export const registerForEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return fail(res, 'Not authorized', 401);

  const event = await Event.findById(req.params.eventId);
  if (!event || !event.isActive) return fail(res, 'Event not found', 404);

  if (event.isCancelled) return fail(res, 'Event is cancelled', 400);

  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return fail(res, 'Registration deadline has passed', 400);
  }

  if (event.registeredCount >= event.capacity) {
    return fail(res, 'Event is full', 400);
  }

  const existing = await Registration.findOne({ student: req.user._id, event: event._id });
  if (existing && existing.status !== 'cancelled') {
    return fail(res, 'Already registered', 409);
  }

  let registration;
  if (existing && existing.status === 'cancelled') {
    existing.status = 'registered';
    existing.registeredAt = new Date();
    existing.checkedInAt = undefined;
    registration = await existing.save();
  } else {
    registration = await Registration.create({
      student: req.user._id,
      event: event._id,
      status: 'registered'
    });
  }

  event.registeredCount += 1;
  await event.save();

  await sendEmail({
    to: req.user.email,
    subject: `Registration Confirmed: ${event.title}`,
    text: `You have successfully registered for ${event.title} on ${event.date.toISOString()}.`
  });

  return ok(res, registration, 'Registered successfully', 201);
});

export const cancelOwnRegistration = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return fail(res, 'Not authorized', 401);

  const registration = await Registration.findOne({
    student: req.user._id,
    event: req.params.eventId,
    status: { $in: ['registered', 'attended'] }
  });

  if (!registration) return fail(res, 'Registration not found', 404);

  registration.status = 'cancelled';
  await registration.save();

  await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } });
  return ok(res, null, 'Registration cancelled');
});

export const getMyRegistrations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return fail(res, 'Not authorized', 401);

  const rows = await Registration.find({ student: req.user._id, status: { $ne: 'cancelled' } })
    .populate('event')
    .sort({ registeredAt: -1 });

  return ok(res, rows);
});

export const getEventRegistrants = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Registration.find({ event: req.params.eventId, status: { $ne: 'cancelled' } })
    .populate('student', 'name email rollNumber department')
    .sort({ registeredAt: -1 });

  return ok(res, rows);
});

export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) return fail(res, 'Registration not found', 404);

  registration.status = 'attended';
  registration.checkedInAt = new Date();
  await registration.save();

  return ok(res, registration, 'Attendance marked');
});

export const exportParticipantsCsv = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Registration.find({ event: req.params.eventId, status: { $ne: 'cancelled' } })
    .populate('student', 'name email rollNumber department')
    .populate('event', 'title date venue');

  const data = rows.map((row: any) => ({
    name: row.student?.name || '-',
    email: row.student?.email || '-',
    rollNumber: row.student?.rollNumber || '-',
    department: row.student?.department || '-',
    status: row.status,
    registeredAt: row.registeredAt,
    checkedInAt: row.checkedInAt || ''
  }));

  const csv = stringify(data, { header: true });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="participants.csv"');
  res.send(csv);
});
