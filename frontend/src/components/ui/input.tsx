import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-[8px] bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface outline-none ghost-border placeholder:text-on-surface-variant/50 focus-visible:ring-2 focus-visible:ring-secondary-fixed-dim',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
