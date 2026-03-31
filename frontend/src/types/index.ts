export type Role = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  rollNumber?: string;
  avatar?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  endDate?: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  banner?: string;
  tags: string[];
  active: boolean;
  cancelled: boolean;
  cancelReason?: string;
  registrationDeadline?: string;
}

export interface Registration {
  _id: string;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: string;
  checkedInAt?: string;
  event: EventItem;
  student?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: unknown;
}

export interface PaginatedEvents {
  events: EventItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
