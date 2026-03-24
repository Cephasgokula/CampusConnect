import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import type { NextFunction, Request, Response } from 'express';
import User from '../models/User.js';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500);
    throw new Error('JWT secret not configured');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Token invalid or expired');
  }
});
