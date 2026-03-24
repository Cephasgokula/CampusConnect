import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ok, fail } from '../utils/apiResponse.js';
import { uploadImageBuffer } from '../utils/uploadToCloudinary.js';

const toAuthPayload = (user: any) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  rollNumber: user.rollNumber,
  avatar: user.avatar
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, rollNumber, department } = req.body;

  if (!name || !email || !password) {
    return fail(res, 'Name, email and password are required', 400);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return fail(res, 'User already exists', 409);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'student',
    rollNumber,
    department
  });

  const token = generateToken(user._id.toString(), user.role);
  return ok(res, { token, user: toAuthPayload(user) }, 'Registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return fail(res, 'Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return fail(res, 'Invalid credentials', 401);
  }

  const matched = await user.matchPassword(password);
  if (!matched) {
    return fail(res, 'Invalid credentials', 401);
  }

  const token = generateToken(user._id.toString(), user.role);
  return ok(res, { token, user: toAuthPayload(user) }, 'Logged in successfully');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  return ok(res, req.user, 'Fetched profile');
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return fail(res, 'Not authorized', 401);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return fail(res, 'User not found', 404);
  }

  const { name, department } = req.body;
  if (name) user.name = name;
  if (department) user.department = department;

  const avatarFile = (req as any).file as Express.Multer.File | undefined;
  if (avatarFile) {
    user.avatar = await uploadImageBuffer(avatarFile.buffer, 'cems/avatars');
  }

  await user.save();
  return ok(res, toAuthPayload(user), 'Profile updated');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return fail(res, 'Not authorized', 401);
  }

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return fail(res, 'oldPassword and newPassword are required', 400);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return fail(res, 'User not found', 404);
  }

  const matched = await user.matchPassword(oldPassword);
  if (!matched) {
    return fail(res, 'Old password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  return ok(res, null, 'Password changed successfully');
});

export const promoteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return fail(res, 'User not found', 404);
  }

  user.role = 'admin';
  await user.save();

  return ok(res, toAuthPayload(user), 'User promoted to admin');
});
