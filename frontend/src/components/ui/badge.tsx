import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'live' | 'error' | 'success' | 'secondary';

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-primary-fixed text-primary-container',
  live: 'bg-secondary-fixed text-secondary',
  error: 'bg-error-container text-error',
  success: 'bg-green-50 text-success',
  secondary: 'bg-surface-container-low text-on-surface-variant',
};

export const Badge = ({
  className,
  children,
  variant = 'default',
}: {
  className?: string;
  children: ReactNode;
  variant?: BadgeVariant;
}) => (
  <span
    className={cn(
      'inline-flex rounded-full px-3 py-1 text-label-sm font-semibold uppercase tracking-wider',
      badgeVariants[variant],
      className
    )}
  >
    {children}
  </span>
);
