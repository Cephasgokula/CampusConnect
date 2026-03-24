import type { NextFunction, Request, Response } from 'express';

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return;
  }

  next();
};

export const studentOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Student access required' });
    return;
  }

  next();
};
